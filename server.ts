import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
import {
  applyDailyUpdateForUser,
  buildInstantAgentAnswer,
  buildInstantBrainQuestion,
  buildInstantCoachBlueprint,
  buildInstantQuiz,
  findCachedAnswer,
  getRankedUsersFromStore,
  loadKnowledgeStore,
  recordLearnedQa,
  saveKnowledgeStore,
  STORAGE_FILE_PATH,
  updateHistoryAndRadarForScore,
  type LearnerMode,
  type StoredUser,
} from "./server/aiStorage.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  ta: "Tamil",
  es: "Spanish",
  fr: "French",
  de: "German",
  hi: "Hindi",
  ja: "Japanese",
};

interface OtpRecord {
  code: string;
  expiresAt: number;
}

const otpStore = new Map<string, OtpRecord>();

function getOptionalGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function runWithFastTimeout<T>(promise: Promise<T>, timeoutMs = 8000): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("AI_TIMEOUT")), timeoutMs)
    ),
  ]);
}

function getModeInstruction(mode: string): string {
  if (mode === "Organization") {
    return "Focus strictly on Company-Based Enterprise Model Skills: scalable architecture, team KPIs, security compliance, cloud governance, cross-team workflows, and production reliability.";
  }
  if (mode === "Individual") {
    return "Focus strictly on Independent Personal & Career Growth Skills: self-directed portfolio building, practical mastery, technical depth, freelancing/consulting readiness, and career transition.";
  }
  return "Focus strictly on School & College Student Skills & Brain Development: strong academic computer science fundamentals, logical decomposition, coursework labs, and internship readiness.";
}

function normalizeMode(raw: unknown): LearnerMode {
  if (raw === "Organization" || raw === "Individual") return raw;
  return "Student";
}

async function startServer() {
  // Initialize separate persistent storage file immediately on startup
  loadKnowledgeStore();

  const app = express();
  app.use(express.json({ limit: "6mb" }));

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ ok: true, brand: "SkillMint" });
  });

  // --- Separate Storage File AI Knowledge Guide Summary ---
  app.get("/api/storage-guide", (_req: Request, res: Response) => {
    const store = loadKnowledgeStore();
    const modeGuidance = {
      Student: {
        focus: store.modeGuidance.Student.focus,
        brainFocus: store.modeGuidance.Student.brainFocus,
        dailyTargetPoints: store.modeGuidance.Student.dailyTargetPoints,
        corePillars: store.modeGuidance.Student.corePillars,
      },
      Individual: {
        focus: store.modeGuidance.Individual.focus,
        brainFocus: store.modeGuidance.Individual.brainFocus,
        dailyTargetPoints: store.modeGuidance.Individual.dailyTargetPoints,
        corePillars: store.modeGuidance.Individual.corePillars,
      },
      Organization: {
        focus: store.modeGuidance.Organization.focus,
        brainFocus: store.modeGuidance.Organization.brainFocus,
        dailyTargetPoints: store.modeGuidance.Organization.dailyTargetPoints,
        corePillars: store.modeGuidance.Organization.corePillars,
      },
    };

    res.json({
      storageFile: path.basename(STORAGE_FILE_PATH),
      lastUpdated: store.lastUpdated,
      totalLearnedQuestions: store.learnedQa.length,
      modeGuidance,
      recentLearnedTopics: store.learnedQa.slice(0, 5).map((q) => ({
        topic: q.topic,
        mode: q.mode,
        askedAt: q.askedAt,
      })),
    });
  });

  // --- Auth & OTP Endpoints ---
  app.post("/api/auth/send-otp", (req: Request, res: Response) => {
    const { channel, target } = req.body ?? {};
    const cleanTarget = String(target || "").trim();
    if (!cleanTarget || (channel !== "email" && channel !== "mobile")) {
      res.status(400).json({ detail: "Valid email or mobile number is required." });
      return;
    }

    if (channel === "email" && !cleanTarget.includes("@")) {
      res.status(400).json({ detail: "Please enter a valid email address." });
      return;
    }

    if (channel === "mobile" && cleanTarget.replace(/\D/g, "").length < 7) {
      res.status(400).json({ detail: "Please enter a valid mobile number." });
      return;
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const key = `${channel}:${cleanTarget.toLowerCase()}`;
    otpStore.set(key, {
      code,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    res.json({
      ok: true,
      channel,
      target: cleanTarget,
      expiresInSeconds: 300,
      previewOtp: code,
    });
  });

  app.post("/api/auth/verify-otp", (req: Request, res: Response) => {
    const { channel, target, otp } = req.body ?? {};
    const cleanTarget = String(target || "").trim();
    const cleanOtp = String(otp || "").trim();
    const key = `${channel}:${cleanTarget.toLowerCase()}`;
    const record = otpStore.get(key);

    if (!record) {
      res.status(400).json({ detail: "No active OTP found. Please request a new code." });
      return;
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(key);
      res.status(400).json({ detail: "OTP has expired. Please request a new code." });
      return;
    }

    if (record.code !== cleanOtp) {
      res.status(400).json({ detail: "Invalid OTP code. Please check and try again." });
      return;
    }

    otpStore.delete(key);

    const ranked = getRankedUsersFromStore();
    const existingUser = ranked.find(
      (u) =>
        (channel === "email" && u.email?.toLowerCase() === cleanTarget.toLowerCase()) ||
        (channel === "mobile" && u.mobile?.replace(/\D/g, "") === cleanTarget.replace(/\D/g, ""))
    );

    res.json({
      ok: true,
      verified: true,
      existingUser: existingUser ?? null,
    });
  });

  // --- Multi-User Profile, Avatar & Ranking Leaderboard Endpoints ---
  app.get("/api/users", (_req: Request, res: Response) => {
    res.json({ users: getRankedUsersFromStore() });
  });

  app.post("/api/users", (req: Request, res: Response) => {
    const body = req.body ?? {};
    const name = String(body.name || "").trim();
    if (!name) {
      res.status(400).json({ detail: "User name is required." });
      return;
    }

    const store = loadKnowledgeStore();
    const id =
      body.id && String(body.id).trim()
        ? String(body.id).trim()
        : `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    const existingIdx = store.users.findIndex((u) => u.id === id);
    const existing = existingIdx >= 0 ? store.users[existingIdx] : undefined;
    const mode = normalizeMode(body.mode);
    const today = new Date().toISOString().slice(0, 10);

    const defaultAvatarByMode: Record<LearnerMode, string> = {
      Student: "/src/assets/images/avatar_student_scholar_1794640299900.jpg",
      Individual: "/src/assets/images/avatar_individual_creator_1794640300172.jpg",
      Organization: "/src/assets/images/avatar_company_executive_1794640301074.jpg",
    };

    const nextPoints =
      typeof body.points === "number"
        ? Math.max(0, body.points)
        : existing?.points ?? 500;
    const nextBrain =
      typeof body.brainScore === "number"
        ? Math.min(100, Math.max(40, body.brainScore))
        : existing?.brainScore ?? 76;

    const nextUser: StoredUser = {
      id,
      name,
      age: Number(body.age) > 0 ? Number(body.age) : existing?.age ?? 21,
      dob: String(body.dob || existing?.dob || "2005-01-15"),
      mode,
      email: body.email ? String(body.email).trim() : existing?.email,
      mobile: body.mobile ? String(body.mobile).trim() : existing?.mobile,
      authProvider:
        body.authProvider === "google" ||
        body.authProvider === "mobile" ||
        body.authProvider === "email"
          ? body.authProvider
          : existing?.authProvider ?? "email",
      avatarUrl:
        typeof body.avatarUrl === "string" && body.avatarUrl.trim()
          ? body.avatarUrl.trim()
          : existing?.avatarUrl || defaultAvatarByMode[mode],
      skills: String(body.skills ?? existing?.skills ?? "Foundational Problem Solving"),
      projects: String(body.projects ?? existing?.projects ?? ""),
      target_role: String(body.target_role ?? existing?.target_role ?? "Software Engineer"),
      details: String(body.details ?? existing?.details ?? ""),
      points: nextPoints,
      brainScore: nextBrain,
      quizzesPassed:
        typeof body.quizzesPassed === "number"
          ? Math.max(0, body.quizzesPassed)
          : existing?.quizzesPassed ?? 0,
      completedExercisesCount:
        typeof body.completedExercisesCount === "number"
          ? Math.max(0, body.completedExercisesCount)
          : existing?.completedExercisesCount ?? 0,
      dailyStreak: existing?.dailyStreak ?? 1,
      lastDailyUpdate: existing?.lastDailyUpdate ?? today,
      skillHistory: existing?.skillHistory?.length
        ? existing.skillHistory
        : [
            {
              date: today,
              label: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              points: nextPoints,
              brainScore: nextBrain,
            },
          ],
      radarMetrics: existing?.radarMetrics ?? {
        foundations: 74,
        brainLogic: nextBrain,
        practicalLabs: 70,
        quizAccuracy: 75,
        consistency: 72,
      },
      joinedAt: existing?.joinedAt ?? today,
    };

    if (existingIdx >= 0) {
      store.users[existingIdx] = nextUser;
    } else {
      store.users.push(nextUser);
    }
    saveKnowledgeStore(store);

    const ranked = getRankedUsersFromStore();
    const saved = ranked.find((u) => u.id === id);
    res.json({ user: saved, users: ranked });
  });

  app.post("/api/users/:id/avatar", (req: Request, res: Response) => {
    const id = String(req.params.id || "");
    const { avatarUrl } = req.body ?? {};
    if (!avatarUrl || typeof avatarUrl !== "string") {
      res.status(400).json({ detail: "Valid avatarUrl is required." });
      return;
    }

    const store = loadKnowledgeStore();
    const idx = store.users.findIndex((u) => u.id === id);
    if (idx === -1) {
      res.status(404).json({ detail: "User not found." });
      return;
    }

    store.users[idx] = {
      ...store.users[idx],
      avatarUrl: avatarUrl.trim(),
    };
    saveKnowledgeStore(store);

    const ranked = getRankedUsersFromStore();
    const user = ranked.find((u) => u.id === id);
    res.json({ user, users: ranked });
  });

  app.post("/api/users/:id/daily-update", (req: Request, res: Response) => {
    const id = String(req.params.id || "");
    const manualBoost = Boolean(req.body?.manualBoost);
    const result = applyDailyUpdateForUser(id, manualBoost);
    res.json(result);
  });

  app.post("/api/users/:id/score", (req: Request, res: Response) => {
    const id = String(req.params.id || "");
    const {
      pointsDelta = 0,
      quizzesDelta = 0,
      exercisesDelta = 0,
      brainDelta = 0,
    } = req.body ?? {};

    const result = updateHistoryAndRadarForScore(
      id,
      Number(pointsDelta || 0),
      Number(quizzesDelta || 0),
      Number(exercisesDelta || 0),
      Number(brainDelta || 0)
    );

    if (!result) {
      res.status(404).json({ detail: "User not found." });
      return;
    }
    res.json(result);
  });

  // --- AI Multi-Agent Plan Generator (Fast + Zero-Error Fallback) ---
  app.post("/api/generate-plan", async (req: Request, res: Response) => {
    const {
      mode: rawMode = "Student",
      name = "Learner",
      skills = "Problem Solving",
      projects = "",
      target_role = "Software Engineer",
      mentor_note = "",
      language = "en",
    } = req.body ?? {};

    const mode = normalizeMode(rawMode);
    const targetLanguage = LANGUAGE_NAMES[String(language)] || "English";
    const ai = getOptionalGeminiClient();

    if (ai) {
      try {
        const prompt = `
You are a multi-agent AI Learning System operating in '${mode}' mode.
Write all output fields naturally in ${targetLanguage}.
Mode Focus Rule: ${getModeInstruction(mode)}

Learner Profile:
- Name: ${name}
- Current Skills: ${skills}
- Projects: ${projects || "None listed yet"}
- Target Goal: ${target_role}

Return:
1. analysis (strengths, missing_skills, match_percentage, summary, recommended_projects)
2. roadmap (4 weeks, each with week, skill, title, courses_and_tutorials, practical_exercise)
Mentor Note: ${mentor_note || "Standard progression."}
`;

        const response = await runWithFastTimeout(
          ai.models.generateContent({
            model: "gemini-4-hydrogen",
            contents: prompt,
            config: {
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  analysis: {
                    type: Type.OBJECT,
                    properties: {
                      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                      missing_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                      match_percentage: { type: Type.INTEGER },
                      summary: { type: Type.STRING },
                      recommended_projects: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: [
                      "strengths",
                      "missing_skills",
                      "match_percentage",
                      "summary",
                      "recommended_projects",
                    ],
                  },
                  roadmap: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        week: { type: Type.INTEGER },
                        skill: { type: Type.STRING },
                        title: { type: Type.STRING },
                        courses_and_tutorials: { type: Type.ARRAY, items: { type: Type.STRING } },
                        practical_exercise: { type: Type.STRING },
                      },
                      required: [
                        "week",
                        "skill",
                        "title",
                        "courses_and_tutorials",
                        "practical_exercise",
                      ],
                    },
                  },
                },
                required: ["analysis", "roadmap"],
              },
            },
          }),
          9000
        );

        const parsed = JSON.parse((response.text ?? "{}").trim());
        if (parsed?.analysis && Array.isArray(parsed?.roadmap)) {
          res.json(parsed);
          return;
        }
      } catch {
        // Fallback smoothly below — never surface raw errors to users
      }
    }

    const store = loadKnowledgeStore();
    const pillars = store.modeGuidance[mode].corePillars;
    res.json({
      analysis: {
        strengths: [
          `Existing foundation in ${String(skills).split(",")[0]?.trim() || "core concepts"}`,
          `Clear focus toward ${target_role} in ${mode} mode`,
        ],
        missing_skills: [pillars[1], pillars[2], pillars[3]],
        match_percentage: 72,
        summary: `${name} has strong momentum toward ${target_role}. Follow this 4-week ${mode} blueprint to raise technical depth, brain logic, and project proof.`,
        recommended_projects: [
          `${target_role} Capstone Lab (${mode} Track)`,
          `Automated Testing & Performance Benchmark Module`,
        ],
      },
      roadmap: pillars.map((pillar, idx) => ({
        week: idx + 1,
        skill: pillar,
        title: `${pillar} Mastery`,
        courses_and_tutorials: [
          `${pillar} Core Concepts & Patterns`,
          `Applied ${pillar} Case Study`,
        ],
        practical_exercise: `Complete a 30-minute hands-on lab applying ${pillar} to ${target_role}.`,
      })),
    });
  });

  // --- AI Quiz & Brain Assessment Generator (Non-Repeating + Fast Zero-Error Fallback) ---
  app.post("/api/generate-quiz", async (req: Request, res: Response) => {
    const {
      skill = "Problem Solving",
      mode: rawMode = "Student",
      language = "en",
      quizKind = "skill",
      previousQuestions = [],
      variationSeed = Date.now(),
    } = req.body ?? {};

    const mode = normalizeMode(rawMode);
    const targetLanguage = LANGUAGE_NAMES[String(language)] || "English";
    const seenList: string[] = Array.isArray(previousQuestions)
      ? previousQuestions.map((q) => String(q)).slice(-18)
      : [];
    const seenNormSet = new Set(
      seenList.map((q) => q.trim().toLowerCase().slice(0, 64))
    );
    const ai = getOptionalGeminiClient();

    if (ai) {
      try {
        const avoidBlock =
          seenList.length > 0
            ? `\nIMPORTANT NON-REPEAT RULE: Do NOT repeat, re-use, or closely paraphrase any of these previously asked questions:\n- ${seenList.slice(-10).join("\n- ")}\nCreate 3 brand-new scenarios and vary the question angles (variation seed: ${variationSeed}).`
            : `\nVariation seed: ${variationSeed}. Make every question practical and distinct.`;

        const prompt =
          quizKind === "brain"
            ? `Generate 3 crisp, engaging, freshly worded Brain & Cognitive Logic questions tailored for ${mode} learners under the heading '${skill}'. Focus on pattern reasoning, debugging logic, trade-offs, and mental sharpness. Write everything in ${targetLanguage}. Provide 4 options per question, 0-based answer_index (mix up which index is correct), and a concise 1-2 sentence explanation.${avoidBlock}`
            : `As an AI Assessment Agent for ${mode} learners, generate a 3-question practical multiple-choice assessment under the heading '${skill}'. Mode Focus Rule: ${getModeInstruction(mode)} Write all questions, options, and explanations clearly in ${targetLanguage}. Provide 4 concise options, 0-based answer_index (vary the correct answer index), and a 1-2 sentence explanation.${avoidBlock}`;

        const response = await runWithFastTimeout(
          ai.models.generateContent({
            model: "gemini-4-hydrogen",
            contents: prompt,
            config: {
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  questions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        question: { type: Type.STRING },
                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                        answer_index: { type: Type.INTEGER },
                        explanation: { type: Type.STRING },
                      },
                      required: ["question", "options", "answer_index", "explanation"],
                    },
                  },
                },
                required: ["questions"],
              },
            },
          }),
          7500
        );

        const parsed = JSON.parse((response.text ?? '{"questions":[]}').trim());
        if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          const fresh = parsed.questions.filter(
            (q: { question?: string }) =>
              q?.question &&
              !seenNormSet.has(q.question.trim().toLowerCase().slice(0, 64))
          );
          if (fresh.length >= 3) {
            res.json({ questions: fresh.slice(0, 3) });
            return;
          }
          const fallbackPack = buildInstantQuiz(
            String(skill),
            mode,
            [...seenList, ...fresh.map((q: { question: string }) => q.question)],
            Number(variationSeed) || Date.now()
          );
          res.json({
            questions: [...fresh, ...fallbackPack.questions].slice(0, 3),
          });
          return;
        }
      } catch {
        // Use instant non-repeating local storage fallback seamlessly
      }
    }

    res.json(
      buildInstantQuiz(
        String(skill),
        mode,
        seenList,
        Number(variationSeed) || Date.now()
      )
    );
  });

  // --- AI Asks Questions to Student / Individual / Company Users (Non-Repeating) ---
  app.post("/api/brain-question", async (req: Request, res: Response) => {
    const {
      mode: rawMode = "Student",
      topic = "",
      skills = "",
      target_role = "",
      language = "en",
      previousQuestions = [],
    } = req.body ?? {};

    const mode = normalizeMode(rawMode);
    const targetLanguage = LANGUAGE_NAMES[String(language)] || "English";
    const seenList: string[] = Array.isArray(previousQuestions)
      ? previousQuestions.map((q) => String(q)).slice(-12)
      : [];
    const seenNormSet = new Set(
      seenList.map((q) => q.trim().toLowerCase().slice(0, 64))
    );
    const ai = getOptionalGeminiClient();

    if (ai) {
      try {
        const avoidNote =
          seenList.length > 0
            ? ` Do NOT repeat these questions:\n- ${seenList.slice(-8).join("\n- ")}`
            : "";

        const response = await runWithFastTimeout(
          ai.models.generateContent({
            model: "gemini-4-hydrogen",
            contents: `Ask ONE brand-new, realistic diagnostic question to a ${mode} learner (skills: ${skills}, target: ${target_role}, topic focus: ${topic || "Core Mastery & Brain Logic"}) to develop their brain and practical thinking. Write in ${targetLanguage}.${avoidNote}`,
            config: {
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  question: { type: Type.STRING },
                  hint: { type: Type.STRING },
                  sample_key_points: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["topic", "question", "hint", "sample_key_points"],
              },
            },
          }),
          6500
        );

        const parsed = JSON.parse((response.text ?? "{}").trim());
        if (
          parsed?.question &&
          !seenNormSet.has(String(parsed.question).trim().toLowerCase().slice(0, 64))
        ) {
          res.json({
            id: `bq-${Date.now()}`,
            mode,
            ...parsed,
          });
          return;
        }
      } catch {
        // Fallback seamlessly
      }
    }

    res.json(buildInstantBrainQuestion(mode, String(topic), seenList));
  });

  // --- Evaluate User's Answer to AI Question & Award Points Immediately ---
  app.post("/api/evaluate-answer", async (req: Request, res: Response) => {
    const {
      userId = "",
      mode: rawMode = "Student",
      topic = "Problem Solving",
      question = "",
      userAnswer = "",
      language = "en",
      previousQuestions = [],
    } = req.body ?? {};

    const mode = normalizeMode(rawMode);
    const targetLanguage = LANGUAGE_NAMES[String(language)] || "English";
    const cleanAnswer = String(userAnswer || "").trim();
    const seenList: string[] = Array.isArray(previousQuestions)
      ? [...previousQuestions.map((q) => String(q)), String(question)].slice(-14)
      : [String(question)];

    let score = cleanAnswer.length > 40 ? 90 : cleanAnswer.length > 15 ? 78 : 65;
    let feedback =
      "Great structured reasoning! Keep connecting your answer to concrete examples, constraints, and measurable outcomes.";
    let idealAnswer =
      "State the core constraint first, explain the chosen approach with one trade-off, and include how you would verify correctness.";

    const ai = getOptionalGeminiClient();
    if (ai && cleanAnswer) {
      try {
        const evalRes = await runWithFastTimeout(
          ai.models.generateContent({
            model: "gemini-4-hydrogen",
            contents: `Mode: ${mode}. Topic: ${topic}. Question asked to user: "${question}". User's answer: "${cleanAnswer}". Evaluate kindly and constructively in ${targetLanguage} with a score (60-100), short actionable feedback (2 sentences), and a concise ideal_answer.`,
            config: {
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.INTEGER },
                  feedback: { type: Type.STRING },
                  ideal_answer: { type: Type.STRING },
                },
                required: ["score", "feedback", "ideal_answer"],
              },
            },
          }),
          6500
        );

        const parsed = JSON.parse((evalRes.text ?? "{}").trim());
        if (typeof parsed.score === "number" && parsed.feedback) {
          score = Math.min(100, Math.max(55, parsed.score));
          feedback = parsed.feedback;
          idealAnswer = parsed.ideal_answer || idealAnswer;
        }
      } catch {
        // Instant deterministic evaluation already set
      }
    }

    const pointsEarned = score >= 85 ? 35 : 25;
    const brainGain = score >= 85 ? 3 : 2;

    if (cleanAnswer) {
      recordLearnedQa(question, idealAnswer, mode, String(language), String(topic));
    }

    let updatedUsers = getRankedUsersFromStore();
    if (userId) {
      const updated = updateHistoryAndRadarForScore(
        String(userId),
        pointsEarned,
        0,
        0,
        brainGain
      );
      if (updated) {
        updatedUsers = updated.users;
      }
    }

    res.json({
      score,
      pointsEarned,
      feedback,
      ideal_answer: idealAnswer,
      next_question: buildInstantBrainQuestion(mode, String(topic), seenList),
      users: updatedUsers,
    });
  });

  // --- AI Skill Coach & Improvement Lab Blueprint (Fast + Zero-Error Fallback) ---
  app.post("/api/skill-coach", async (req: Request, res: Response) => {
    const {
      name = "Learner",
      age = 20,
      mode: rawMode = "Student",
      skills = "",
      target_role = "Software Engineer",
      details = "",
      focus_skill = "",
      language = "en",
    } = req.body ?? {};

    const mode = normalizeMode(rawMode);
    const targetLanguage = LANGUAGE_NAMES[String(language)] || "English";
    const store = loadKnowledgeStore();
    const guide = store.modeGuidance[mode];
    const ai = getOptionalGeminiClient();

    if (ai) {
      try {
        const prompt = `
You are SkillMint's AI Skill Coach & Improvement Lab creating an actionable skill & brain improvement blueprint in ${targetLanguage}.
Storage Guide Focus for ${mode}: ${guide.focus}
Brain Focus: ${guide.brainFocus}

Learner Profile:
- Name: ${name}, Age: ${age}, Mode: ${mode}
- Current Skills: ${skills}
- Target Role: ${target_role}
- Additional Background: ${details || "None"}
- Focus Skill: ${focus_skill || guide.corePillars[0]}

Return JSON with:
- focus_summary (2-3 crisp sentences)
- daily_drills (4 specific 15-20 minute drills)
- mode_project_challenge (1 concrete mini-project for ${mode})
- next_milestone (measurable 7-day rank & skill milestone)
- recommended_skills_to_add (3 specific skills)
`;

        const response = await runWithFastTimeout(
          ai.models.generateContent({
            model: "gemini-4-hydrogen",
            contents: prompt,
            config: {
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  focus_summary: { type: Type.STRING },
                  daily_drills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  mode_project_challenge: { type: Type.STRING },
                  next_milestone: { type: Type.STRING },
                  recommended_skills_to_add: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: [
                  "focus_summary",
                  "daily_drills",
                  "mode_project_challenge",
                  "next_milestone",
                  "recommended_skills_to_add",
                ],
              },
            },
          }),
          8000
        );

        const parsed = JSON.parse((response.text ?? "{}").trim());
        if (parsed?.focus_summary && Array.isArray(parsed?.daily_drills)) {
          res.json(parsed);
          return;
        }
      } catch {
        // Fallback seamlessly using our persistent storage guide
      }
    }

    res.json(
      buildInstantCoachBlueprint({
        mode,
        target_role: String(target_role),
        focus_skill: String(focus_skill),
      })
    );
  });

  // --- Interactive AI Mentor Chat (Fast + Zero-Error Fallback) ---
  app.post("/api/mentor-chat", async (req: Request, res: Response) => {
    const {
      message = "",
      mode: rawMode = "Student",
      skills = "",
      target_role = "",
      language = "en",
    } = req.body ?? {};

    if (!String(message).trim()) {
      res.json({
        reply: "Ask any question about your skills, daily drills, or target role and I will guide you right away!",
      });
      return;
    }

    const mode = normalizeMode(rawMode);
    const targetLanguage = LANGUAGE_NAMES[String(language)] || "English";
    const cached = findCachedAnswer(String(message), mode, String(language));
    if (cached) {
      res.json({ reply: cached.answer, cached: true });
      return;
    }

    const ai = getOptionalGeminiClient();
    if (ai) {
      try {
        const response = await runWithFastTimeout(
          ai.models.generateContent({
            model: "gemini-4-hydrogen",
            contents: `Learner (${mode} track, skills: ${skills}, target: ${target_role}) asks: ${message}`,
            config: {
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
              systemInstruction: `You are SkillMint AI Coach Mentor. Respond fast, clearly, and practically in ${targetLanguage}. ${getModeInstruction(mode)} Keep your answer concise with actionable steps.`,
            },
          }),
          7000
        );

        const reply = (response.text ?? "").trim();
        if (reply) {
          recordLearnedQa(String(message), reply, mode, String(language), "Skill Coach");
          res.json({ reply });
          return;
        }
      } catch {
        // Fall through cleanly to storage fallback
      }
    }

    const fallbackReply = buildInstantAgentAnswer({
      question: String(message),
      mode,
      name: "Learner",
      skills: String(skills),
      target_role: String(target_role),
      currentPage: "coach",
    });
    res.json({ reply: fallbackReply });
  });

  // --- Always-Available Universal AI Agent Assistant (Immediate, Friendly, Critical Situation Help) ---
  app.post("/api/ai-agent", async (req: Request, res: Response) => {
    const {
      message = "",
      history = [],
      mode: rawMode = "Student",
      name = "Learner",
      skills = "",
      target_role = "",
      currentPage = "overview",
      language = "en",
      criticalSituation = false,
    } = req.body ?? {};

    const cleanMessage = String(message).trim();
    if (!cleanMessage) {
      res.json({
        reply: "Hi! I am always here to help—ask me anything, or tap Critical Situation Help if you need calm step-by-step rescue right now.",
      });
      return;
    }

    const mode = normalizeMode(rawMode);
    const targetLanguage = LANGUAGE_NAMES[String(language)] || "English";
    const isCritical = Boolean(criticalSituation);

    // Check learned Q&A storage file first when not a live critical emergency
    if (!isCritical) {
      const cached = findCachedAnswer(cleanMessage, mode, String(language));
      if (cached) {
        res.json({ reply: cached.answer, cached: true });
        return;
      }
    }

    const ai = getOptionalGeminiClient();
    if (ai) {
      try {
        const store = loadKnowledgeStore();
        const guide = store.modeGuidance[mode];
        const recentHistory = Array.isArray(history)
          ? history
              .slice(-4)
              .map((h: { role?: string; content?: string }) =>
                `${h.role === "assistant" ? "AI Agent" : "User"}: ${h.content ?? ""}`
              )
              .join("\n")
          : "";

        const prompt = `${
          recentHistory ? `Recent Conversation:\n${recentHistory}\n\n` : ""
        }User Request: ${cleanMessage}`;

        const response = await runWithFastTimeout(
          ai.models.generateContent({
            model: "gemini-4-hydrogen",
            contents: prompt,
            config: {
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
              systemInstruction: `You are SkillMint AI Agent — always warm, user-friendly, encouraging, fast, and reliable for ${name} (${mode} mode on '${currentPage}', skills: ${skills}, goal: ${target_role}).
Knowledge Guide Focus: ${guide.focus}
Brain Focus: ${guide.brainFocus}
${isCritical ? "CRITICAL SITUATION MODE ACTIVE: Give calm, immediate, numbered 1-2-3 action steps first so the user feels supported and unblocked right away." : ""}
Respond clearly and concisely in ${targetLanguage}. Never output technical jargon or error codes.`,
            },
          }),
          7000
        );

        const reply = (response.text ?? "").trim();
        if (reply) {
          recordLearnedQa(cleanMessage, reply, mode, String(language), String(currentPage));
          res.json({ reply });
          return;
        }
      } catch {
        // Graceful fallback below — never return error status to the user
      }
    }

    const instantReply = buildInstantAgentAnswer({
      question: cleanMessage,
      mode,
      name: String(name),
      skills: String(skills),
      target_role: String(target_role),
      currentPage: String(currentPage),
      criticalSituation: isCritical,
    });
    recordLearnedQa(cleanMessage, instantReply, mode, String(language), String(currentPage));
    res.json({ reply: instantReply });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("/{*path}", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SkillMint server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
