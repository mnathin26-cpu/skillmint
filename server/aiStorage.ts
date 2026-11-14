import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT_DIR, "data");
export const STORAGE_FILE_PATH = path.join(
  DATA_DIR,
  "skillmint_knowledge_store.json"
);

export type LearnerMode = "Student" | "Individual" | "Organization";

export interface SkillHistoryPoint {
  date: string;
  label: string;
  points: number;
  brainScore: number;
}

export interface SkillRadarMetrics {
  foundations: number;
  brainLogic: number;
  practicalLabs: number;
  quizAccuracy: number;
  consistency: number;
}

export interface StoredUser {
  id: string;
  name: string;
  age: number;
  dob: string;
  mode: LearnerMode;
  email?: string;
  mobile?: string;
  authProvider: "google" | "email" | "mobile";
  avatarUrl?: string;
  skills: string;
  projects: string;
  target_role: string;
  details: string;
  points: number;
  brainScore: number;
  quizzesPassed: number;
  completedExercisesCount: number;
  dailyStreak: number;
  lastDailyUpdate: string;
  skillHistory: SkillHistoryPoint[];
  radarMetrics: SkillRadarMetrics;
  joinedAt: string;
}

export interface LearnedQaEntry {
  id: string;
  question: string;
  normalizedKey: string;
  answer: string;
  mode: LearnerMode;
  language: string;
  topic: string;
  askedAt: string;
}

export interface ModeGuideEntry {
  focus: string;
  brainFocus: string;
  dailyTargetPoints: number;
  corePillars: string[];
  questionPrompts: Array<{
    topic: string;
    question: string;
    hint: string;
    sample_key_points: string[];
  }>;
}

export interface SkillMintKnowledgeStore {
  version: number;
  brandName: string;
  lastUpdated: string;
  modeGuidance: Record<LearnerMode, ModeGuideEntry>;
  users: StoredUser[];
  learnedQa: LearnedQaEntry[];
}

function getTodayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildDefaultHistory(basePoints: number, baseBrain: number): SkillHistoryPoint[] {
  const days = 7;
  const result: SkillHistoryPoint[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const progressRatio = (days - 1 - i) / (days - 1);
    const pts = Math.max(
      200,
      Math.round(basePoints - 140 * (1 - progressRatio))
    );
    const brain = Math.max(
      55,
      Math.round(baseBrain - 14 * (1 - progressRatio))
    );
    result.push({
      date: iso,
      label,
      points: pts,
      brainScore: brain,
    });
  }
  return result;
}

function createInitialStore(): SkillMintKnowledgeStore {
  const today = getTodayIso();
  return {
    version: 1,
    brandName: "SkillMint",
    lastUpdated: today,
    modeGuidance: {
      Student: {
        focus:
          "Build rock-solid CS, math, and engineering fundamentals, campus lab projects, and internship interview readiness.",
        brainFocus:
          "Algorithmic logic, structured decomposition, memory recall, and step-by-step debugging.",
        dailyTargetPoints: 60,
        corePillars: [
          "Data Structures & Problem Decomposition",
          "Clean Code & Debugging Habits",
          "Coursework & Portfolio Projects",
          "Daily Brain & Logic Puzzles",
        ],
        questionPrompts: [
          {
            topic: "Algorithmic Thinking",
            question:
              "When solving a tough programming problem in an exam or internship interview, how do you break it down before writing code?",
            hint: "Think about input constraints, brute-force baseline, data structure choice, and edge cases.",
            sample_key_points: [
              "Clarify inputs, outputs, and constraints",
              "Start with a simple working approach first",
              "Optimize time/space with the right data structure",
              "Test boundary and empty cases",
            ],
          },
          {
            topic: "Database & SQL Design",
            question:
              "A campus app slows down when 5,000 students search courses at once. What 2 changes would you apply first?",
            hint: "Consider database indexes and avoiding repeated unnecessary queries.",
            sample_key_points: [
              "Add indexes on searched columns",
              "Paginate results and cache frequent queries",
            ],
          },
          {
            topic: "Debugging Under Pressure",
            question:
              "Your project crashes 30 minutes before a lab submission with an unexpected null error. Walk through your fastest debugging steps.",
            hint: "Isolate the failing input, print/inspect the state right before the crash, and verify a minimal test case.",
            sample_key_points: [
              "Reproduce with the smallest failing input",
              "Inspect data shape before the failing line",
              "Add a guard check and re-run tests",
            ],
          },
          {
            topic: "API & Async Flow",
            question:
              "How do you prevent a student web app from freezing or losing user data when a backend request is slow?",
            hint: "Think loading states, timeout handling, optimistic/local fallback, and non-blocking UI.",
            sample_key_points: [
              "Show immediate responsive feedback",
              "Handle timeouts gracefully with local fallback",
              "Avoid blocking user controls unnecessarily",
            ],
          },
        ],
      },
      Individual: {
        focus:
          "Accelerate independent career mastery, ship polished real-world portfolio products, and sharpen system design skills.",
        brainFocus:
          "Product trade-off reasoning, architectural clarity, deep focus sprints, and client communication.",
        dailyTargetPoints: 75,
        corePillars: [
          "Full-Stack Product Execution",
          "System Architecture & Scalability",
          "Applied AI Workflow Integration",
          "Independent Delivery & Storytelling",
        ],
        questionPrompts: [
          {
            topic: "System & Product Design",
            question:
              "You are building a solo SaaS tool and pages start loading slowly under traffic. How do you diagnose and fix the bottleneck fastest?",
            hint: "Measure client bundle vs API latency vs database query time before rewriting.",
            sample_key_points: [
              "Measure timing on API and database queries first",
              "Add caching or batching on hot paths",
              "Lazy-load non-critical frontend modules",
            ],
          },
          {
            topic: "Career Portfolio Strategy",
            question:
              "How would you explain a technical trade-off you made on your personal project to a hiring manager in 60 seconds?",
            hint: "State the constraint, two options considered, why you picked yours, and the measurable result.",
            sample_key_points: [
              "Context and constraint",
              "Options compared",
              "Measurable impact",
            ],
          },
          {
            topic: "Cognitive Focus & AI Workflow",
            question:
              "When integrating an AI feature into a personal app, how do you guarantee fast answers even when external networks fluctuate?",
            hint: "Combine response caching, short timeouts, and a reliable domain fallback.",
            sample_key_points: [
              "Cache common questions locally",
              "Set strict request timeouts",
              "Provide deterministic fallback answers",
            ],
          },
          {
            topic: "Client Problem Solving",
            question:
              "A freelance client reports a critical bug 2 hours before their product demo. What is your calm step-by-step triage plan?",
            hint: "Stabilize the demo path first, apply a safe fix or rollback, then test end-to-end.",
            sample_key_points: [
              "Reproduce and protect the demo flow immediately",
              "Deploy minimal verified patch or rollback",
              "Confirm with client after testing",
            ],
          },
        ],
      },
      Organization: {
        focus:
          "Elevate enterprise engineering velocity, cloud governance, security compliance, and measurable team KPIs.",
        brainFocus:
          "Risk-based architecture decisions, root-cause incident analysis, cost governance, and cross-team alignment.",
        dailyTargetPoints: 90,
        corePillars: [
          "Cloud Governance & Cost Efficiency",
          "Zero-Trust Security & SOC2 Readiness",
          "CI/CD & Production Reliability",
          "AI Automation & Team KPIs",
        ],
        questionPrompts: [
          {
            topic: "Enterprise Reliability",
            question:
              "A production microservice shows rising p99 latency right after a Friday deployment. Walk through your incident response steps.",
            hint: "Prioritize customer impact mitigation (rollback/feature flag) before deep root-cause debugging.",
            sample_key_points: [
              "Contain impact via rollback or traffic shift",
              "Inspect structured logs, error budgets, and traces",
              "Document blameless postmortem with automated guardrails",
            ],
          },
          {
            topic: "Company AI Governance",
            question:
              "Before rolling out an internal AI assistant to 200 company employees, what 3 governance checks must pass?",
            hint: "Think about data privacy, access controls, audit logging, and response accuracy.",
            sample_key_points: [
              "Role-based access and PII protection",
              "Latency/cost budgets and fallback handling",
              "Audit logging and quality evaluation",
            ],
          },
          {
            topic: "Team Scaling & KPIs",
            question:
              "Deployment frequency dropped across 4 company squads due to flaky tests. How do you fix engineering velocity within 2 weeks?",
            hint: "Quarantine flaky specs, parallelize CI, and track change-failure rate.",
            sample_key_points: [
              "Isolate and fix top flaky tests immediately",
              "Split fast smoke checks from heavy integration suites",
              "Track lead time and failure rate weekly",
            ],
          },
          {
            topic: "Zero-Trust Security",
            question:
              "An engineer notices elevated unauthorized API calls from a staging token. What critical containment steps do you execute first?",
            hint: "Revoke/rotate credentials, inspect audit logs, and isolate affected endpoints.",
            sample_key_points: [
              "Revoke and rotate exposed credentials immediately",
              "Audit access logs for blast radius",
              "Enforce least-privilege secrets scanning in CI",
            ],
          },
        ],
      },
    },
    users: [
      {
        id: "user-arjun-corp",
        name: "Arjun Krishnan",
        age: 29,
        dob: "1997-04-18",
        mode: "Organization",
        email: "arjun.k@nexustech.io",
        authProvider: "google",
        avatarUrl: "/src/assets/images/avatar_company_executive_1794640301074.jpg",
        skills:
          "Enterprise Cloud Governance, Kubernetes, Microservices CI/CD, SOC2 Compliance, Terraform",
        projects: "Zero-Trust Internal Developer Platform, Multi-Region Failover",
        target_role: "Principal Cloud Platform Architect",
        details:
          "Company engineering lead upskilling platform squads on enterprise-grade resilience and cost KPIs.",
        points: 940,
        brainScore: 91,
        quizzesPassed: 7,
        completedExercisesCount: 4,
        dailyStreak: 9,
        lastDailyUpdate: today,
        skillHistory: buildDefaultHistory(940, 91),
        radarMetrics: {
          foundations: 90,
          brainLogic: 91,
          practicalLabs: 88,
          quizAccuracy: 92,
          consistency: 89,
        },
        joinedAt: "2026-10-04",
      },
      {
        id: "user-priya-ind",
        name: "Priya Natarajan",
        age: 25,
        dob: "2001-02-09",
        mode: "Individual",
        mobile: "+91 98401 22410",
        authProvider: "mobile",
        avatarUrl: "/src/assets/images/avatar_individual_creator_1794640300172.jpg",
        skills: "UI/UX Design Systems, React, Tailwind CSS, Freelance Client Delivery",
        projects: "SaaS Analytics Redesign, E-Commerce Accessibility Audit",
        target_role: "Senior Product Engineer",
        details:
          "Independent designer transitioning into full-stack product engineering with personal portfolio projects.",
        points: 860,
        brainScore: 86,
        quizzesPassed: 6,
        completedExercisesCount: 4,
        dailyStreak: 7,
        lastDailyUpdate: today,
        skillHistory: buildDefaultHistory(860, 86),
        radarMetrics: {
          foundations: 85,
          brainLogic: 86,
          practicalLabs: 88,
          quizAccuracy: 84,
          consistency: 85,
        },
        joinedAt: "2026-10-12",
      },
      {
        id: "user-maya-student",
        name: "Maya Chen",
        age: 20,
        dob: "2006-08-14",
        mode: "Student",
        email: "maya.chen@university.edu",
        authProvider: "email",
        avatarUrl: "/src/assets/images/avatar_learner_profile_1794635815463.jpg",
        skills: "Python, TypeScript, React, Data Structures, SQL Fundamentals",
        projects: "Campus Study Planner App, REST API Coursework",
        target_role: "Full-Stack Cloud Engineer",
        details:
          "Junior Computer Science undergraduate preparing for summer software engineering internships.",
        points: 780,
        brainScore: 82,
        quizzesPassed: 5,
        completedExercisesCount: 3,
        dailyStreak: 5,
        lastDailyUpdate: today,
        skillHistory: buildDefaultHistory(780, 82),
        radarMetrics: {
          foundations: 84,
          brainLogic: 82,
          practicalLabs: 76,
          quizAccuracy: 85,
          consistency: 79,
        },
        joinedAt: "2026-10-19",
      },
      {
        id: "user-elena-corp",
        name: "Elena Rostova",
        age: 32,
        dob: "1994-06-21",
        mode: "Organization",
        email: "elena.r@enterprise-ops.com",
        authProvider: "email",
        avatarUrl: "/src/assets/images/avatar_company_executive_1794640301074.jpg",
        skills: "AI Workflow Automation, Data Governance, Python, Team KPI Modeling",
        projects: "Enterprise Support Triage Pipeline, QA Automation Matrix",
        target_role: "Director of AI Operations",
        details:
          "Leading corporate model adoption across 35 product analysts and operations specialists.",
        points: 720,
        brainScore: 80,
        quizzesPassed: 5,
        completedExercisesCount: 3,
        dailyStreak: 6,
        lastDailyUpdate: today,
        skillHistory: buildDefaultHistory(720, 80),
        radarMetrics: {
          foundations: 79,
          brainLogic: 80,
          practicalLabs: 77,
          quizAccuracy: 82,
          consistency: 81,
        },
        joinedAt: "2026-11-01",
      },
      {
        id: "user-karthik-student",
        name: "Karthik Sundaram",
        age: 19,
        dob: "2007-11-03",
        mode: "Student",
        email: "karthik.s@college.edu",
        authProvider: "google",
        avatarUrl: "/src/assets/images/avatar_student_scholar_1794640299900.jpg",
        skills: "C++, Java, Algorithms, Git, Basic Linux",
        projects: "College Library CLI, Campus Hackathon Prototype",
        target_role: "Backend Systems Intern",
        details:
          "Second-year engineering student focused on competitive programming and backend API foundations.",
        points: 650,
        brainScore: 78,
        quizzesPassed: 4,
        completedExercisesCount: 2,
        dailyStreak: 4,
        lastDailyUpdate: today,
        skillHistory: buildDefaultHistory(650, 78),
        radarMetrics: {
          foundations: 78,
          brainLogic: 80,
          practicalLabs: 70,
          quizAccuracy: 76,
          consistency: 74,
        },
        joinedAt: "2026-10-28",
      },
      {
        id: "user-jordan-ind",
        name: "Jordan Patel",
        age: 27,
        dob: "1999-09-12",
        mode: "Individual",
        email: "jordan.patel@mail.com",
        authProvider: "email",
        avatarUrl: "/src/assets/images/avatar_individual_creator_1794640300172.jpg",
        skills: "SQL Analytics, Python Pandas, Tableau, Business Storytelling",
        projects: "Retail Sales Cohort Dashboard",
        target_role: "Applied AI & BI Analyst",
        details:
          "Self-paced learner building applied machine learning and analytics skills for career advancement.",
        points: 590,
        brainScore: 74,
        quizzesPassed: 3,
        completedExercisesCount: 2,
        dailyStreak: 3,
        lastDailyUpdate: today,
        skillHistory: buildDefaultHistory(590, 74),
        radarMetrics: {
          foundations: 74,
          brainLogic: 74,
          practicalLabs: 68,
          quizAccuracy: 75,
          consistency: 71,
        },
        joinedAt: "2026-11-05",
      },
    ],
    learnedQa: [
      {
        id: "seed-rank-1",
        question: "How do I reach Rank #1 faster?",
        normalizedKey: "reach rank 1 faster points",
        answer:
          "1. Complete daily brain & skill quizzes (67%+ awards +60 skill pts).\n2. Mark weekly roadmap exercises complete (+40 skill pts each).\n3. Claim your daily check-in & answer AI diagnostic questions (+25 to +35 pts daily) to build your streak and climb the leaderboard.",
        mode: "Student",
        language: "en",
        topic: "Rank & Skill Points",
        askedAt: today,
      },
    ],
  };
}

let cachedStore: SkillMintKnowledgeStore | null = null;

function ensureDirExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function loadKnowledgeStore(): SkillMintKnowledgeStore {
  if (cachedStore) return cachedStore;
  try {
    ensureDirExists();
    if (fs.existsSync(STORAGE_FILE_PATH)) {
      const raw = fs.readFileSync(STORAGE_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw) as SkillMintKnowledgeStore;
      if (parsed && Array.isArray(parsed.users) && parsed.modeGuidance) {
        cachedStore = parsed;
        return cachedStore;
      }
    }
  } catch {
    // Re-initialize cleanly if file is missing or unreadable
  }
  const initial = createInitialStore();
  saveKnowledgeStore(initial);
  return initial;
}

export function saveKnowledgeStore(store: SkillMintKnowledgeStore): void {
  store.lastUpdated = getTodayIso();
  cachedStore = store;
  try {
    ensureDirExists();
    fs.writeFileSync(STORAGE_FILE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch {
    // Non-fatal in read-only edge cases; in-memory cache remains current
  }
}

export function normalizeQuestionKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 8)
    .join(" ");
}

export function findCachedAnswer(
  question: string,
  mode: LearnerMode,
  language: string
): LearnedQaEntry | null {
  const store = loadKnowledgeStore();
  const qNorm = normalizeQuestionKey(question);
  if (!qNorm) return null;
  const qWords = new Set(qNorm.split(" "));

  let best: LearnedQaEntry | null = null;
  let bestOverlap = 0;

  for (const entry of store.learnedQa) {
    if (entry.language !== language) continue;
    if (entry.mode !== mode && entry.topic !== "Rank & Skill Points") continue;
    const eWords = entry.normalizedKey.split(" ").filter(Boolean);
    if (eWords.length === 0) continue;
    const overlap = eWords.filter((w) => qWords.has(w)).length;
    const ratio = overlap / Math.max(eWords.length, qWords.size);
    if (ratio >= 0.72 && ratio > bestOverlap) {
      bestOverlap = ratio;
      best = entry;
    }
  }
  return best;
}

export function recordLearnedQa(
  question: string,
  answer: string,
  mode: LearnerMode,
  language: string,
  topic = "General Guidance"
): void {
  if (!question.trim() || !answer.trim()) return;
  const store = loadKnowledgeStore();
  const normalizedKey = normalizeQuestionKey(question);
  const existingIdx = store.learnedQa.findIndex(
    (item) =>
      item.normalizedKey === normalizedKey &&
      item.mode === mode &&
      item.language === language
  );

  const entry: LearnedQaEntry = {
    id: `qa-${Date.now()}`,
    question: question.trim(),
    normalizedKey,
    answer: answer.trim(),
    mode,
    language,
    topic,
    askedAt: getTodayIso(),
  };

  if (existingIdx >= 0) {
    store.learnedQa[existingIdx] = entry;
  } else {
    store.learnedQa.unshift(entry);
    if (store.learnedQa.length > 60) {
      store.learnedQa = store.learnedQa.slice(0, 60);
    }
  }
  saveKnowledgeStore(store);
}

export function getRankedUsersFromStore() {
  const store = loadKnowledgeStore();
  const sorted = [...store.users].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.brainScore !== a.brainScore) return b.brainScore - a.brainScore;
    return a.name.localeCompare(b.name);
  });
  return sorted.map((u, idx) => ({
    ...u,
    rank: idx + 1,
  }));
}

export function applyDailyUpdateForUser(userId: string, manualBoost = false) {
  const store = loadKnowledgeStore();
  const today = getTodayIso();
  const userIdx = store.users.findIndex((u) => u.id === userId);
  if (userIdx === -1) return { updated: false, user: null, users: getRankedUsersFromStore() };

  const user = store.users[userIdx];
  const alreadyUpdatedToday = user.lastDailyUpdate === today;
  if (alreadyUpdatedToday && !manualBoost) {
    const ranked = getRankedUsersFromStore();
    return {
      updated: false,
      user: ranked.find((u) => u.id === userId) ?? null,
      users: ranked,
    };
  }

  const pointsAdded = alreadyUpdatedToday ? 15 : 25;
  const brainAdded = alreadyUpdatedToday ? 1 : 2;
  const nextPoints = user.points + pointsAdded;
  const nextBrain = Math.min(100, user.brainScore + brainAdded);
  const nextStreak = alreadyUpdatedToday ? user.dailyStreak : user.dailyStreak + 1;

  const label = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const history = [...(user.skillHistory || [])];
  const lastIdx = history.findIndex((h) => h.date === today);
  if (lastIdx >= 0) {
    history[lastIdx] = { date: today, label, points: nextPoints, brainScore: nextBrain };
  } else {
    history.push({ date: today, label, points: nextPoints, brainScore: nextBrain });
  }

  store.users[userIdx] = {
    ...user,
    points: nextPoints,
    brainScore: nextBrain,
    dailyStreak: nextStreak,
    lastDailyUpdate: today,
    skillHistory: history.slice(-7),
    radarMetrics: {
      ...user.radarMetrics,
      brainLogic: Math.min(100, (user.radarMetrics?.brainLogic ?? 75) + brainAdded),
      consistency: Math.min(100, (user.radarMetrics?.consistency ?? 75) + 2),
    },
  };

  saveKnowledgeStore(store);
  const ranked = getRankedUsersFromStore();
  return {
    updated: true,
    pointsAdded,
    user: ranked.find((u) => u.id === userId) ?? null,
    users: ranked,
  };
}

export function updateHistoryAndRadarForScore(
  userId: string,
  pointsDelta: number,
  quizzesDelta: number,
  exercisesDelta: number,
  brainDelta = 0
) {
  const store = loadKnowledgeStore();
  const today = getTodayIso();
  const idx = store.users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;

  const existing = store.users[idx];
  const nextPoints = Math.max(0, existing.points + pointsDelta);
  const nextBrain = Math.min(100, Math.max(40, existing.brainScore + brainDelta));
  const label = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const history = [...(existing.skillHistory || [])];
  const lastIdx = history.findIndex((h) => h.date === today);
  if (lastIdx >= 0) {
    history[lastIdx] = { date: today, label, points: nextPoints, brainScore: nextBrain };
  } else {
    history.push({ date: today, label, points: nextPoints, brainScore: nextBrain });
  }

  const radar = existing.radarMetrics ?? {
    foundations: 75,
    brainLogic: 75,
    practicalLabs: 75,
    quizAccuracy: 75,
    consistency: 75,
  };

  store.users[idx] = {
    ...existing,
    points: nextPoints,
    brainScore: nextBrain,
    quizzesPassed: Math.max(0, existing.quizzesPassed + quizzesDelta),
    completedExercisesCount: Math.max(
      0,
      existing.completedExercisesCount + exercisesDelta
    ),
    lastDailyUpdate: today,
    skillHistory: history.slice(-7),
    radarMetrics: {
      foundations: Math.min(100, radar.foundations + (quizzesDelta > 0 ? 3 : 1)),
      brainLogic: Math.min(100, radar.brainLogic + Math.max(1, brainDelta)),
      practicalLabs: Math.min(100, radar.practicalLabs + (exercisesDelta > 0 ? 5 : 1)),
      quizAccuracy: Math.min(100, radar.quizAccuracy + (quizzesDelta > 0 ? 4 : 0)),
      consistency: Math.min(100, radar.consistency + 2),
    },
  };

  saveKnowledgeStore(store);
  const ranked = getRankedUsersFromStore();
  return {
    user: ranked.find((u) => u.id === userId) ?? null,
    users: ranked,
  };
}

// --- Instant Zero-Error Fallback Engines ---

export function buildInstantAgentAnswer(params: {
  question: string;
  mode: LearnerMode;
  name: string;
  skills: string;
  target_role: string;
  currentPage: string;
  criticalSituation?: boolean;
}): string {
  const store = loadKnowledgeStore();
  const guide = store.modeGuidance[params.mode] ?? store.modeGuidance.Student;
  const qLower = params.question.toLowerCase();

  const isCritical =
    params.criticalSituation ||
    /urgent|critical|emergency|help|exam|deadline|crash|error|bug|stuck|interview|production|down|fail/.test(
      qLower
    );

  if (isCritical) {
    if (params.mode === "Organization") {
      return `Calm Critical Situation Action Plan for ${params.name} (Company Track):\n1. Stabilize First: Pause new changes, roll back or toggle off the failing change, and verify live service health.\n2. Isolate Root Cause: Check the most recent config, credential, or data-shape change in logs.\n3. Verify & Communicate: Run a fast smoke check, confirm team KPIs are green, and ask me to review any exact snippet or architecture trade-off!`;
    }
    if (params.mode === "Individual") {
      return `Calm Critical Situation Action Plan for ${params.name} (Individual Track):\n1. Protect What Works: Save a clean checkpoint right now so nothing breaks further.\n2. Narrow to One Small Test: Reproduce the blocker on the smallest possible input or single component.\n3. Unblock Fast: Paste the exact problem or question here and I will walk you through the simplest step-by-step solution right away.`;
    }
    return `You've got this, ${params.name}! Here is your Calm Critical Study & Deadline Rescue Plan:\n1. Focus on High-Impact Core: Review the top 2 concepts for ${params.target_role} (${params.skills || guide.corePillars[0]}) instead of trying to read everything at once.\n2. Active 10-Minute Check: Write one working example from memory, check edge cases (empty, zero, invalid inputs), and explain why it works in 2 sentences.\n3. Test Immediately: Try one quick round in Quiz & Brain Lab or ask me your exact exam/assignment question right now!`;
  }

  const cached = findCachedAnswer(params.question, params.mode, "en");
  if (cached) {
    return cached.answer;
  }

  if (qLower.includes("rank") || qLower.includes("point") || qLower.includes("score")) {
    return `Here is the fastest way for ${params.name} (${params.mode} track) to climb Rank & Skill Points:\n• Complete a Quiz or Brain Trainer round (+60 pts on 67%+ score).\n• Answer an AI Diagnostic Question in the Quiz & Brain Lab (+35 pts per answer).\n• Complete weekly practical labs (+40 pts) and claim your Daily Skill Check-in (+25 pts/day).\n\nFocus Pillar: ${guide.corePillars[0]}.`;
  }

  return `SkillMint ${params.mode} Guide for "${params.question}":\n• Core Focus (${params.target_role}): ${guide.focus}\n• Brain & Logic Approach: ${guide.brainFocus}\n• Next Friendly Step on ${params.currentPage}: Break the task into 15-minute steps using ${params.skills || guide.corePillars.join(", ")}, test one clear example, and verify in Quiz & Brain Lab.`;
}

interface RawQuizItem {
  question: string;
  options: string[];
  answer_index: number;
  explanation: string;
}

function shuffleQuizOptions(item: RawQuizItem, rngSeed: number): RawQuizItem {
  const indexed = item.options.map((text, idx) => ({
    text,
    isCorrect: idx === item.answer_index,
    sortKey: Math.sin(rngSeed * (idx + 1) * 9301 + idx * 49297),
  }));
  indexed.sort((a, b) => a.sortKey - b.sortKey);
  return {
    question: item.question,
    options: indexed.map((o) => o.text),
    answer_index: indexed.findIndex((o) => o.isCorrect),
    explanation: item.explanation,
  };
}

export function buildInstantQuiz(
  skill: string,
  mode: LearnerMode,
  previousQuestions: string[] = [],
  variationSeed = Date.now()
) {
  const cleanSkill = skill.trim() || "Problem Solving";

  const orgBank: RawQuizItem[] = [
    {
      question: `When deploying ${cleanSkill} across a company team, what ensures the highest reliability?`,
      options: [
        "Automated validation gates, rollback triggers, and clear KPI ownership",
        "Manual ad-hoc production updates without review",
        "Disabling monitoring to save server memory",
        "Single-person undocumented credentials",
      ],
      answer_index: 0,
      explanation:
        "Enterprise reliability requires automated quality checks, fast rollback safety, and observable KPIs.",
    },
    {
      question: `Which metric best proves team mastery and ROI in ${cleanSkill}?`,
      options: [
        "Lower incident rate, faster delivery cycle time, and SLA compliance",
        "Total lines of code written per week",
        "Number of internal meetings scheduled",
        "Count of unused cloud instances",
      ],
      answer_index: 0,
      explanation:
        "Company-grade engineering measures reliability (SLA compliance), speed, and defect reduction.",
    },
    {
      question: `During an architecture review on ${cleanSkill}, what should teams evaluate first?`,
      options: [
        "Security boundaries, failure modes, and measurable cost limits",
        "Choosing the newest experimental library regardless of support",
        "Skipping documentation to ship 1 hour earlier",
        "Hardcoding environment secrets in source control",
      ],
      answer_index: 0,
      explanation:
        "Security boundaries, graceful failure modes, and cost guardrails protect enterprise systems.",
    },
    {
      question: `In a critical production incident involving ${cleanSkill}, what should an enterprise lead prioritize first?`,
      options: [
        "Mitigate customer impact via safe rollback or traffic shift before deep root-cause tuning",
        "Wait 24 hours before alerting stakeholders",
        "Delete historical logs to clean disk space",
        "Deploy an untested rewrite straight to 100% traffic",
      ],
      answer_index: 0,
      explanation:
        "Containing user impact rapidly through rollback or isolation protects SLAs before permanent remediation.",
    },
    {
      question: `How does cross-team governance improve ${cleanSkill} delivery on corporate laptops and cloud pipelines?`,
      options: [
        "Standardized templates, peer code review, and automated security checks catch risks early",
        "Letting every squad invent conflicting secret formats",
        "Removing staging environments completely",
        "Sharing admin passwords in chat",
      ],
      answer_index: 0,
      explanation:
        "Shared templates and automated security gates allow squads to move fast safely.",
    },
    {
      question: `What is the smartest way to optimize cloud spend while scaling ${cleanSkill}?`,
      options: [
        "Measure real utilization, right-size workloads, and set budget alerts per service",
        "Turn off backups on weekends",
        "Over-provision peak hardware 24/7 with no autoscaling",
        "Avoid tagging resources by team",
      ],
      answer_index: 0,
      explanation:
        "Telemetry-driven right-sizing and per-service cost visibility keep enterprise budgets healthy.",
    },
    {
      question: `Why are blameless postmortems essential after a ${cleanSkill} outage?`,
      options: [
        "They uncover systemic gaps and automate guardrails so the failure cannot repeat",
        "They assign personal blame without changing the workflow",
        "They hide technical root causes from engineering teams",
        "They replace monitoring alerts",
      ],
      answer_index: 0,
      explanation:
        "Blameless postmortems turn incidents into stronger processes, tests, and automated safeguards.",
    },
    {
      question: `When onboarding a new company engineer onto ${cleanSkill}, what accelerates safe productivity fastest?`,
      options: [
        "Clear architecture runbooks, automated local setup, and a mentored starter task",
        "Giving production root access on day one with zero documentation",
        "Having them read 500 pages of slides without touching code",
        "Skipping code reviews during the first month",
      ],
      answer_index: 0,
      explanation:
        "Reproducible setups and clear runbooks cut ramp-up time while keeping standards high.",
    },
    {
      question: `Which API design habit keeps ${cleanSkill} integrations resilient across enterprise departments?`,
      options: [
        "Versioned contracts, strict input validation, timeouts, and graceful fallbacks",
        "Breaking payload fields silently without notice",
        "Allowing unbounded request sizes without rate limits",
        "Returning raw stack traces to external clients",
      ],
      answer_index: 0,
      explanation:
        "Stable contracts, validation, and bounded timeouts prevent cascading failures across teams.",
    },
  ];

  const individualBank: RawQuizItem[] = [
    {
      question: `What makes a personal portfolio project in ${cleanSkill} stand out to senior reviewers?`,
      options: [
        "Solving a real problem end-to-end with clean tests and clear trade-off notes",
        "Copying a tutorial without changing or explaining anything",
        "Hiding all error states from the UI",
        "Adding unnecessary complexity with no measurable user benefit",
      ],
      answer_index: 0,
      explanation:
        "End-to-end execution, resilient edge-case handling, and clear engineering trade-offs demonstrate true ownership.",
    },
    {
      question: `When sharpening your brain logic in ${cleanSkill}, what 20-minute habit builds fastest retention?`,
      options: [
        "Building a small working prototype from memory, then verifying edge cases",
        "Passively watching videos for 4 hours without coding",
        "Memorizing syntax without testing real inputs",
        "Skipping debugging when something breaks",
      ],
      answer_index: 0,
      explanation:
        "Active recall combined with immediate testing builds deep mental models faster than passive reading.",
    },
    {
      question: `How should an independent builder handle performance bottlenecks in ${cleanSkill}?`,
      options: [
        "Profile and measure the slowest step first, then optimize systematically",
        "Guess randomly and rewrite unrelated modules",
        "Remove input validation entirely",
        "Ignore user latency metrics",
      ],
      answer_index: 0,
      explanation:
        "Measuring bottlenecks first prevents wasted effort and leads to clean, verified speedups.",
    },
    {
      question: `If an AI-assisted workflow in ${cleanSkill} encounters a network delay, what UX pattern protects the user?`,
      options: [
        "Instant cached or deterministic fallback guidance so the user never hits a dead end",
        "Showing a blank white screen indefinitely",
        "Exposing raw server exception dumps to the user",
        "Discarding everything the user typed",
      ],
      answer_index: 0,
      explanation:
        "Fast timeouts paired with graceful fallback keep AI tools responsive and user-friendly.",
    },
    {
      question: `How do you validate that a new ${cleanSkill} feature actually helps real users before launching?`,
      options: [
        "Test the core user flow end-to-end on real inputs and measure task completion",
        "Assume it works because it compiled once",
        "Only test the happy path with hardcoded strings",
        "Skip mobile and dark-mode checks",
      ],
      answer_index: 0,
      explanation:
        "Testing realistic user journeys catches UX friction and edge-case bugs prior to launch.",
    },
    {
      question: `When feeling overwhelmed by a large ${cleanSkill} project goal, what mental strategy restores momentum?`,
      options: [
        "Slice one 30-minute deliverable milestone, finish and verify it, then iterate",
        "Refactor every file simultaneously without committing",
        "Switch frameworks mid-build every two days",
        "Wait for perfect conditions before writing a single test",
      ],
      answer_index: 0,
      explanation:
        "Small verified milestones create steady dopamine, clarity, and reliable shipping cadence.",
    },
    {
      question: `Which code organization habit keeps a solo ${cleanSkill} codebase maintainable 6 months later?`,
      options: [
        "Focused modular functions, clear TypeScript types, and concise README decisions",
        "Putting 3,000 lines into a single file with single-letter variables",
        "Duplicating identical logic across 10 components",
        "Never deleting dead experimental code",
      ],
      answer_index: 0,
      explanation:
        "Clear module boundaries and strong types dramatically speed up future debugging and upgrades.",
    },
    {
      question: `In a technical interview discussion about ${cleanSkill}, what impresses hiring leads most?`,
      options: [
        "Articulating why you chose an approach, its trade-offs, and how you tested failures",
        "Listing tool names without explaining how they interact",
        "Claiming your solution has zero limitations",
        "Reading memorized definitions word-for-word",
      ],
      answer_index: 0,
      explanation:
        "Trade-off awareness and real failure testing signal senior-level engineering judgment.",
    },
    {
      question: `How can daily brain-control exercises improve your mastery of ${cleanSkill}?`,
      options: [
        "Training structured decomposition and pattern recognition reduces debugging time under pressure",
        "Avoiding unfamiliar problems keeps knowledge static",
        "Multitasking across 5 noisy apps boosts deep focus",
        "Skipping sleep helps memory consolidation",
      ],
      answer_index: 0,
      explanation:
        "Deliberate decomposition drills train calm, accurate reasoning when solving novel problems.",
    },
  ];

  const studentBank: RawQuizItem[] = [
    {
      question: `When learning ${cleanSkill} for coursework or internships, what is the strongest brain-building strategy?`,
      options: [
        "Solve small problems step-by-step on paper or whiteboard, then test edge cases in code",
        "Memorize final answers without understanding why they work",
        "Skip foundational exercises and only read summaries",
        "Ignore compiler or test errors",
      ],
      answer_index: 0,
      explanation:
        "Active problem decomposition plus edge-case testing builds lasting mastery for exams and technical interviews.",
    },
    {
      question: `Which habit prevents the most common bugs when practicing ${cleanSkill}?`,
      options: [
        "Checking boundary values (empty, zero, max limits) and reading error messages carefully",
        "Writing the entire program in one giant block without testing",
        "Never using version control checkpoints",
        "Assuming user inputs are always valid",
      ],
      answer_index: 0,
      explanation:
        "Boundary checks and incremental verification catch bugs early while reinforcing logical reasoning.",
    },
    {
      question: `How can a student turn ${cleanSkill} coursework into an internship-ready showcase?`,
      options: [
        "Document the problem, architecture diagram, and verified demo results clearly",
        "Leave variables unnamed and delete the README",
        "Submit code that only runs on one hardcoded path",
        "Avoid explaining your design choices",
      ],
      answer_index: 0,
      explanation:
        "Clear documentation and verified outcomes show recruiters you can communicate and ship quality work.",
    },
    {
      question: `During a timed coding exam on ${cleanSkill}, what is the best way to handle a question that feels stuck?`,
      options: [
        "Trace a concrete 3-element example by hand to spot the pattern before writing code",
        "Erase everything and rewrite randomly without tracing",
        "Skip reading the constraints",
        "Spend the whole time staring at a blank screen without writing small steps",
      ],
      answer_index: 0,
      explanation:
        "Tracing a tiny concrete example reveals invariants and unlocks the algorithm calmly.",
    },
    {
      question: `Why should students trace time and space complexity when practicing ${cleanSkill}?`,
      options: [
        "It predicts whether your solution will stay fast when input sizes grow 1,000x",
        "It changes the font color in the editor",
        "It eliminates the need to test edge cases",
        "It only matters after graduation",
      ],
      answer_index: 0,
      explanation:
        "Understanding growth rates prevents timeouts on large datasets in exams and interviews.",
    },
    {
      question: `Which study loop creates the highest memory retention for ${cleanSkill}?`,
      options: [
        "25-minute focused practice followed by closing notes and explaining the concept aloud",
        "Highlighting every sentence in a textbook without practicing",
        "Cramming for 6 hours straight without breaks or self-testing",
        "Only reading solved solutions",
      ],
      answer_index: 0,
      explanation:
        "Spaced active recall forces your brain to reconstruct concepts, strengthening long-term neural recall.",
    },
    {
      question: `When collaborating on a university team project in ${cleanSkill}, how do you avoid merge conflicts and broken demos?`,
      options: [
        "Split clear module responsibilities, use small branches, and test integrations early",
        "Email zipped folders back and forth 10 minutes before grading",
        "Have everyone edit the exact same function simultaneously without Git",
        "Skip running the app after merging",
      ],
      answer_index: 0,
      explanation:
        "Small modular commits and early integration keep group projects smooth and reliable.",
    },
    {
      question: `How do you debug a subtle logic error in ${cleanSkill} when syntax compiles cleanly?`,
      options: [
        "Compare expected vs actual intermediate values step-by-step on a small test case",
        "Randomly add sleep delays",
        "Reinstall the operating system",
        "Ignore wrong outputs and hope the grading input skips that branch",
      ],
      answer_index: 0,
      explanation:
        "Comparing actual intermediate state against expected state pinpoints the exact diverging step.",
    },
    {
      question: `What makes a ${cleanSkill} answer stand out in a student campus interview?`,
      options: [
        "Explaining your thought process aloud, starting clean, and optimizing step-by-step",
        "Typing silently for 15 minutes without communicating assumptions",
        "Skipping clarification of edge cases",
        "Refusing hints from the interviewer",
      ],
      answer_index: 0,
      explanation:
        "Clear communication and iterative problem solving show strong teamwork and technical maturity.",
    },
  ];

  const pool =
    mode === "Organization"
      ? orgBank
      : mode === "Individual"
      ? individualBank
      : studentBank;

  const prevSet = new Set(
    previousQuestions.map((q) => q.trim().toLowerCase().slice(0, 64))
  );

  let candidates = pool.filter(
    (item) => !prevSet.has(item.question.trim().toLowerCase().slice(0, 64))
  );

  // If user cycled through all 9+ bank questions, reset pool cleanly while still shuffling order!
  if (candidates.length < 3) {
    candidates = [...pool];
  }

  // Deterministic-free rotating shuffle using runtime seed + time
  const rotated = [...candidates]
    .map((item, idx) => ({
      item,
      weight: Math.sin((variationSeed + idx * 1733) * 0.00123) + Math.random(),
    }))
    .sort((a, b) => a.weight - b.weight)
    .slice(0, 3)
    .map((entry, idx) =>
      shuffleQuizOptions(entry.item, variationSeed + idx * 97 + Math.random() * 100)
    );

  return { questions: rotated };
}

export function buildInstantBrainQuestion(
  mode: LearnerMode,
  topic?: string,
  previousQuestions: string[] = []
) {
  const store = loadKnowledgeStore();
  const guide = store.modeGuidance[mode] ?? store.modeGuidance.Student;
  const prompts = guide.questionPrompts;

  const prevSet = new Set(
    previousQuestions.map((q) => q.trim().toLowerCase().slice(0, 64))
  );
  const unseen = prompts.filter(
    (p) => !prevSet.has(p.question.trim().toLowerCase().slice(0, 64))
  );
  const pool = unseen.length > 0 ? unseen : prompts;
  const chosen = pool[Math.floor(Math.random() * pool.length)] ?? prompts[0];

  return {
    id: `bq-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    mode,
    topic: topic?.trim() || chosen.topic,
    question: chosen.question,
    hint: chosen.hint,
    sample_key_points: chosen.sample_key_points,
  };
}

export function buildInstantCoachBlueprint(params: {
  mode: LearnerMode;
  target_role: string;
  focus_skill: string;
}) {
  const store = loadKnowledgeStore();
  const guide = store.modeGuidance[params.mode] ?? store.modeGuidance.Student;
  const focus = params.focus_skill || guide.corePillars[0];

  return {
    focus_summary: `Blueprint for ${params.mode} track targeting ${params.target_role}: Focus on ${focus}. ${guide.focus} Pair technical drills with daily brain reasoning (${guide.brainFocus}).`,
    daily_drills: [
      `20-min Active Recall: Sketch the core workflow of ${focus} without notes, then verify gaps.`,
      `20-min Practical Lab: Build and test one edge-case scenario in ${focus}.`,
      `15-min Brain Logic Sprint: Explain why your design works and identify 2 potential bottlenecks.`,
      `10-min Quiz & Storage Sync: Take a 3-question check in Quiz & Brain Lab to log daily points.`,
    ],
    mode_project_challenge:
      params.mode === "Organization"
        ? `Design a governed, monitored mini-service for ${focus} with rollback safety and clear team KPIs.`
        : params.mode === "Individual"
        ? `Ship a polished portfolio module showcasing ${focus} with measurable latency, clean UX, and README trade-offs.`
        : `Build a tested campus/internship mini-project applying ${focus} with clean edge-case coverage.`,
    next_milestone: `Earn +${guide.dailyTargetPoints} daily skill points over the next 7 days and raise your Brain Score by +6 points on ${focus}.`,
    recommended_skills_to_add: guide.corePillars.slice(0, 3),
  };
}
