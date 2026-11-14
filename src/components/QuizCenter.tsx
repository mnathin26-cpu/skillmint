import {
  ArrowRight,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  HelpCircle,
  Lightbulb,
  MessageSquareText,
  RotateCw,
  Send,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { MODE_SEPARATED_SKILLS } from "../data/defaultWorkspace";
import type { TranslationDictionary } from "../i18n/translations";
import { MODE_THEMES } from "../theme/modeTheme";
import type {
  AiAnswerEvaluation,
  AiAskedQuestion,
  LanguageCode,
  LearnerMode,
  QuizAttempt,
  QuizOutput,
  RankedUser,
  RoadmapStep,
} from "../types";
import { ModeVisualBanner } from "./ModeVisualBanner";

const SEEN_QUESTIONS_KEY = "skillmint_seen_questions_v1";

function loadSeenQuestions(bucketKey: string): string[] {
  try {
    const raw = localStorage.getItem(SEEN_QUESTIONS_KEY);
    if (!raw) return [];
    const map = JSON.parse(raw) as Record<string, string[]>;
    return Array.isArray(map[bucketKey]) ? map[bucketKey] : [];
  } catch {
    return [];
  }
}

function appendSeenQuestions(bucketKey: string, questions: string[]): string[] {
  try {
    const raw = localStorage.getItem(SEEN_QUESTIONS_KEY);
    const map: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    const existing = Array.isArray(map[bucketKey]) ? map[bucketKey] : [];
    const merged = Array.from(
      new Set([...existing, ...questions.filter(Boolean)])
    ).slice(-24);
    map[bucketKey] = merged;
    localStorage.setItem(SEEN_QUESTIONS_KEY, JSON.stringify(map));
    return merged;
  } catch {
    return questions;
  }
}

interface QuizCenterProps {
  initialSkill: string;
  defaultMode: LearnerMode;
  language: LanguageCode;
  roadmap: RoadmapStep[];
  currentUserId: string | null;
  userSkills: string;
  userTargetRole: string;
  onRecordAttempt: (attempt: QuizAttempt) => void;
  onUsersUpdated: (users: RankedUser[]) => void;
  onBackToRoadmap: () => void;
  t: TranslationDictionary;
}

const MODES: LearnerMode[] = ["Student", "Individual", "Organization"];
type LabMode = "skill" | "brain" | "ai-asks";

export function QuizCenter({
  initialSkill,
  defaultMode,
  language,
  roadmap,
  currentUserId,
  userSkills,
  userTargetRole,
  onRecordAttempt,
  onUsersUpdated,
  onBackToRoadmap,
  t,
}: QuizCenterProps) {
  const [labMode, setLabMode] = useState<LabMode>("skill");
  const [skill, setSkill] = useState(
    initialSkill || roadmap[0]?.skill || MODE_SEPARATED_SKILLS[defaultMode][0]
  );
  const [mode, setMode] = useState<LearnerMode>(defaultMode);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizOutput | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  // "AI Asks You" interactive brain & skill questioning state
  const [askedQuestion, setAskedQuestion] = useState<AiAskedQuestion | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [userResponse, setUserResponse] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<AiAnswerEvaluation | null>(null);

  const theme = MODE_THEMES[mode];

  useEffect(() => {
    if (initialSkill) {
      setSkill(initialSkill);
    }
  }, [initialSkill]);

  const combinedQuickTopics = Array.from(
    new Set([
      ...roadmap.map((r) => r.skill),
      ...MODE_SEPARATED_SKILLS[mode].slice(0, 4),
    ])
  );

  const handleGenerateQuiz = async (
    targetSkill?: string,
    kind: "skill" | "brain" = labMode === "brain" ? "brain" : "skill"
  ) => {
    const topicToUse = (targetSkill ?? skill).trim() || MODE_SEPARATED_SKILLS[mode][0];
    const bucketKey = `${mode}:${kind}:${topicToUse.toLowerCase()}`;
    const previouslySeen = loadSeenQuestions(bucketKey);
    const variationSeed = Date.now() + Math.floor(Math.random() * 100000);

    setLoading(true);
    setValidationMsg(null);
    setQuiz(null);
    setAnswers({});
    setSubmitted(false);

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skill: topicToUse,
          mode,
          language,
          quizKind: kind,
          previousQuestions: previouslySeen,
          variationSeed,
        }),
      });
      const data = await response.json();
      if (Array.isArray(data.questions) && data.questions.length > 0) {
        const received = data as QuizOutput;
        appendSeenQuestions(
          bucketKey,
          received.questions.map((q) => q.question)
        );
        setQuiz(received);
        return;
      }
    } catch {
      // Seamless local fallback below
    } finally {
      setLoading(false);
    }

    const fallbackPool = [
      {
        question: `What is the clearest first step when applying ${topicToUse} in ${mode} mode?`,
        options: [
          "Define inputs and constraints, build a small baseline, and verify edge cases",
          "Skip verification and deploy directly without testing",
          "Copy random snippets without checking requirements",
          "Ignore error logs",
        ],
        answer_index: 0,
        explanation:
          "Structured problem framing plus incremental edge-case verification builds real skill mastery.",
      },
      {
        question: `Which habit strengthens brain retention and reasoning in ${topicToUse}?`,
        options: [
          "Active recall from memory followed by hands-on testing",
          "Passive skimming without practice",
          "Avoiding challenging questions",
          "Never reviewing mistakes",
        ],
        answer_index: 0,
        explanation:
          "Active recall combined with immediate validation builds durable neural patterns.",
      },
      {
        question: `How do you prove real readiness in ${topicToUse}?`,
        options: [
          "Demonstrate a tested solution with clear trade-offs and measurable results",
          "List buzzwords without practical examples",
          "Skip documentation",
          "Avoid peer feedback",
        ],
        answer_index: 0,
        explanation:
          "Tested outcomes and clear trade-off explanations show true mastery.",
      },
      {
        question: `Under a tight deadline on ${topicToUse}, what debugging check resolves blockers fastest?`,
        options: [
          "Isolate the smallest failing input and inspect state right before failure",
          "Rewrite every file simultaneously",
          "Delete unit tests",
          "Guess blindly without checking inputs",
        ],
        answer_index: 0,
        explanation:
          "Minimal reproduction narrows down the defect rapidly and prevents regression.",
      },
    ];
    const freshFallback = fallbackPool
      .filter((q) => !previouslySeen.includes(q.question))
      .slice(0, 3);
    const chosen = freshFallback.length === 3 ? freshFallback : fallbackPool.slice(0, 3);
    appendSeenQuestions(
      bucketKey,
      chosen.map((q) => q.question)
    );
    setQuiz({ questions: chosen });
  };

  const handleAskUserQuestion = async (topicOverride?: string) => {
    const topicToUse = (topicOverride ?? skill).trim() || "Problem Solving";
    const bucketKey = `${mode}:ai-asks:${topicToUse.toLowerCase()}`;
    const previouslySeen = loadSeenQuestions(bucketKey);

    setLoadingQuestion(true);
    setEvaluation(null);
    setUserResponse("");
    setShowHint(false);
    try {
      const res = await fetch("/api/brain-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          topic: topicToUse,
          skills: userSkills,
          target_role: userTargetRole,
          language,
          previousQuestions: previouslySeen,
        }),
      });
      const data = await res.json();
      if (data?.question) {
        appendSeenQuestions(bucketKey, [data.question]);
        setAskedQuestion(data as AiAskedQuestion);
        return;
      }
    } catch {
      const fallbackQ = `As a ${mode} learner targeting ${userTargetRole}, how would you solve a real performance or logic bottleneck in ${topicToUse}?`;
      appendSeenQuestions(bucketKey, [fallbackQ]);
      setAskedQuestion({
        id: `local-${Date.now()}`,
        mode,
        topic: topicToUse,
        question: fallbackQ,
        hint: "Break the workflow into inputs, bottleneck measurement, one clean fix, and verification.",
        sample_key_points: [
          "Identify the constraint or bottleneck first",
          "Apply one targeted improvement",
          "Verify with a measurable check",
        ],
      });
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleSubmitUserAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!askedQuestion || !userResponse.trim() || evaluating) return;
    setEvaluating(true);
    const bucketKey = `${mode}:ai-asks:${askedQuestion.topic.toLowerCase()}`;
    const previouslySeen = loadSeenQuestions(bucketKey);

    try {
      const res = await fetch("/api/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          mode,
          topic: askedQuestion.topic,
          question: askedQuestion.question,
          userAnswer: userResponse.trim(),
          language,
          previousQuestions: previouslySeen,
        }),
      });
      const data = await res.json();
      if (data?.feedback) {
        if (data.next_question?.question) {
          appendSeenQuestions(bucketKey, [data.next_question.question]);
        }
        setEvaluation(data as AiAnswerEvaluation);
        if (Array.isArray(data.users)) {
          onUsersUpdated(data.users as RankedUser[]);
        }
        return;
      }
    } catch {
      // Immediate fallback below
    } finally {
      setEvaluating(false);
    }
  };

  useEffect(() => {
    if (labMode === "ai-asks" && !askedQuestion && !loadingQuestion) {
      handleAskUserQuestion();
    }
  }, [labMode]);

  const handleSelectOption = (qIndex: number, optionIndex: number) => {
    if (submitted) return;
    setValidationMsg(null);
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleSubmitAnswers = () => {
    if (!quiz) return;
    if (Object.keys(answers).length < quiz.questions.length) {
      setValidationMsg(t.quiz.selectAllPrompt);
      return;
    }

    const total = quiz.questions.length;
    const score = quiz.questions.reduce(
      (sum, q, idx) => sum + (answers[idx] === q.answer_index ? 1 : 0),
      0
    );
    const percentage = Math.round((score / total) * 100);

    setSubmitted(true);
    onRecordAttempt({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      skill: `${labMode === "brain" ? "Brain: " : ""}${skill.trim()}`,
      mode,
      score,
      total,
      percentage,
      completedAt: new Date().toISOString().slice(0, 10),
    });
  };

  const scoreCount = quiz
    ? quiz.questions.reduce(
        (sum, q, idx) => sum + (answers[idx] === q.answer_index ? 1 : 0),
        0
      )
    : 0;
  const totalCount = quiz?.questions.length ?? 0;
  const scorePercentage =
    totalCount > 0 ? Math.round((scoreCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 max-w-4xl">
      <ModeVisualBanner
        mode={mode}
        title="Quiz & Brain Development Lab"
        subtitle="Fresh, non-repeating questions under every heading—even after page refreshes. Train your brain logic, verify skill mastery, and answer live AI questions."
      />

      <section
        className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 transition-colors`}
      >

        {/* Lab Mode Selector: Skill Quiz | Brain Trainer | AI Asks You */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
          <button
            type="button"
            onClick={() => setLabMode("skill")}
            className={`inline-flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              labMode === "skill"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <ClipboardCheck className="h-4 w-4 shrink-0" />
            <span>Skill Quiz (+60 pts)</span>
          </button>

          <button
            type="button"
            onClick={() => setLabMode("brain")}
            className={`inline-flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              labMode === "brain"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Brain className="h-4 w-4 shrink-0" />
            <span>Brain &amp; Logic Trainer</span>
          </button>

          <button
            type="button"
            onClick={() => setLabMode("ai-asks")}
            className={`inline-flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              labMode === "ai-asks"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <MessageSquareText className="h-4 w-4 shrink-0" />
            <span>AI Asks You (+35 pts)</span>
          </button>
        </div>

        {/* Topic & Track Mode Selector */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="md:col-span-7 space-y-2">
            <label
              htmlFor="quiz-skill-input"
              className="block text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              {t.quiz.topicLabel}
            </label>
            <input
              id="quiz-skill-input"
              type="text"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder={t.quiz.topicPlaceholder}
              className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="md:col-span-5 space-y-2">
            <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">
              {t.quiz.modeLabel}
            </span>
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {MODES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`flex-1 px-2.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    mode === m
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {t.modes[m]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t.quiz.quickTopicsLabel} ({t.modeTracks[mode]})
          </p>
          <div className="flex flex-wrap gap-2">
            {combinedQuickTopics.map((topic) => {
              const isSelected = skill.toLowerCase() === topic.toLowerCase();
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setSkill(topic)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                    isSelected
                      ? `${theme.accentSoftBg} ${theme.accentBorder} ${theme.accentText}`
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {labMode === "ai-asks" ? (
            <button
              type="button"
              disabled={loadingQuestion}
              onClick={() => handleAskUserQuestion(skill)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shrink-0 ${theme.primaryBtn}`}
            >
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>
                {loadingQuestion
                  ? "Preparing Question..."
                  : `Ask ${t.modes[mode]} Question`}
              </span>
            </button>
          ) : (
            <button
              type="button"
              disabled={loading || !skill.trim()}
              onClick={() =>
                handleGenerateQuiz(skill, labMode === "brain" ? "brain" : "skill")
              }
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors whitespace-nowrap shrink-0 ${theme.primaryBtn}`}
            >
              {labMode === "brain" ? (
                <Brain className="h-4 w-4 shrink-0" />
              ) : (
                <ClipboardCheck className="h-4 w-4 shrink-0" />
              )}
              <span>
                {loading
                  ? t.actions.generatingQuiz
                  : labMode === "brain"
                  ? "Start 3-Question Brain Drill"
                  : t.actions.generateQuiz}
              </span>
            </button>
          )}
        </div>
      </section>

      {/* AI Asks You Interactive Mode */}
      {labMode === "ai-asks" && (
        <section
          className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-5 transition-colors`}
        >
          {loadingQuestion ? (
            <div className="space-y-3 py-4">
              <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ) : askedQuestion ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className={theme.accentText}>
                    AI Question for {t.modes[askedQuestion.mode]}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{askedQuestion.topic}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHint((h) => !h)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline whitespace-nowrap"
                >
                  <Lightbulb className="h-3.5 w-3.5 shrink-0" />
                  <span>{showHint ? "Hide Hint" : "Need a Hint?"}</span>
                </button>
              </div>

              <h2 className="text-lg font-display font-semibold text-slate-900 dark:text-white leading-snug">
                {askedQuestion.question}
              </h2>

              {showHint && (
                <div className="p-3.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                  <strong>Hint:</strong> {askedQuestion.hint}
                </div>
              )}

              <form onSubmit={handleSubmitUserAnswer} className="space-y-3">
                <textarea
                  rows={3}
                  required
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder="Type your reasoning or solution here — AI will score your thinking immediately and award Skill & Brain Points..."
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleAskUserQuestion(skill)}
                    className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    Try a different question →
                  </button>
                  <button
                    type="submit"
                    disabled={evaluating || !userResponse.trim()}
                    className={`inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors whitespace-nowrap ${theme.primaryBtn}`}
                  >
                    <Send className="h-4 w-4 shrink-0" />
                    <span>
                      {evaluating ? "Evaluating..." : "Submit Answer & Earn Points"}
                    </span>
                  </button>
                </div>
              </form>

              {evaluation && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>
                        Brain &amp; Skill Score: {evaluation.score}/100 · +
                        {evaluation.pointsEarned} Skill Points Added!
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAskedQuestion(evaluation.next_question);
                        setEvaluation(null);
                        setUserResponse("");
                        setShowHint(false);
                      }}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap ${theme.secondaryBtn}`}
                    >
                      Next Question →
                    </button>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {evaluation.feedback}
                  </p>
                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">
                      Model Approach:{" "}
                    </strong>
                    {evaluation.ideal_answer}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </section>
      )}

      {/* Multiple-Choice Skill / Brain Quiz View */}
      {labMode !== "ai-asks" && (
        <>
          {loading && (
            <div className="space-y-4" aria-busy="true">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4`}
                >
                  <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="h-11 bg-slate-100 dark:bg-slate-800/70 rounded-lg" />
                    <div className="h-11 bg-slate-100 dark:bg-slate-800/70 rounded-lg" />
                    <div className="h-11 bg-slate-100 dark:bg-slate-800/70 rounded-lg" />
                    <div className="h-11 bg-slate-100 dark:bg-slate-800/70 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !quiz && (
            <section
              className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center`}
            >
              <HelpCircle className="h-9 w-9 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                {labMode === "brain"
                  ? "Ready for a Brain & Logic Workout?"
                  : t.quiz.emptyTitle}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {t.quiz.emptyDesc}
              </p>
            </section>
          )}

          {!loading && quiz && (
            <div className="space-y-5">
              {submitted && (
                <section
                  className={`rounded-xl border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    scorePercentage >= 67
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900"
                      : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {t.quiz.scoreSummaryTitle}:{" "}
                        <span className="font-mono tabular-nums">
                          {scoreCount}/{totalCount} ({scorePercentage}%)
                        </span>
                      </h2>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {scorePercentage >= 67
                        ? t.quiz.passedMessage
                        : t.quiz.reviewMessage}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        handleGenerateQuiz(
                          skill,
                          labMode === "brain" ? "brain" : "skill"
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
                    >
                      <RotateCw className="h-3.5 w-3.5 shrink-0" />
                      <span>{t.actions.retakeQuiz}</span>
                    </button>
                    <button
                      type="button"
                      onClick={onBackToRoadmap}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${theme.primaryBtn}`}
                    >
                      <span>{t.actions.backToRoadmap}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                    </button>
                  </div>
                </section>
              )}

              {quiz.questions.map((q, qIdx) => {
                const selectedOption = answers[qIdx];
                const isCorrect = selectedOption === q.answer_index;

                return (
                  <article
                    key={qIdx}
                    className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                        {t.quiz.questionPrefix} {qIdx + 1} {t.quiz.ofLabel}{" "}
                        {quiz.questions.length}
                      </span>

                      {submitted && (
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                            isCorrect
                              ? "text-emerald-700 dark:text-emerald-400"
                              : "text-red-700 dark:text-red-400"
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 shrink-0" />
                              {t.quiz.correctLabel}
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 shrink-0" />
                              {t.quiz.reviewLabel}
                            </>
                          )}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
                      {q.question}
                    </h3>

                    <div className="grid grid-cols-1 gap-2.5 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isPicked = selectedOption === optIdx;
                        const isRightAnswer = optIdx === q.answer_index;

                        let optionStyle =
                          "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60";

                        if (!submitted && isPicked) {
                          optionStyle = `${theme.accentSoftBg} ${theme.cardAccentBorder} text-slate-950 dark:text-white font-medium`;
                        } else if (submitted) {
                          if (isRightAnswer) {
                            optionStyle =
                              "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-medium";
                          } else if (isPicked && !isRightAnswer) {
                            optionStyle =
                              "bg-red-50 dark:bg-red-950/50 border-red-400 text-red-950 dark:text-red-200";
                          } else {
                            optionStyle =
                              "bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-500";
                          }
                        }

                        const letter = String.fromCharCode(65 + optIdx);

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={submitted}
                            onClick={() => handleSelectOption(qIdx, optIdx)}
                            className={`w-full min-h-[44px] flex items-center gap-3 px-4 py-3 text-left text-sm rounded-lg border transition-colors ${optionStyle}`}
                          >
                            <span className="font-mono text-xs font-semibold w-5 shrink-0">
                              {letter}.
                            </span>
                            <span className="flex-1 leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {submitted && q.explanation && (
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {t.quiz.explanationLabel}:{" "}
                        </span>
                        {q.explanation}
                      </div>
                    )}
                  </article>
                );
              })}

              {!submitted && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  {validationMsg ? (
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                      {validationMsg}
                    </p>
                  ) : (
                    <span />
                  )}

                  <button
                    type="button"
                    onClick={handleSubmitAnswers}
                    className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${theme.primaryBtn}`}
                  >
                    {t.actions.submitQuiz}
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
