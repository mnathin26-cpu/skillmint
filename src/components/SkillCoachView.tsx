import {
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Database,
  Download,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";
import { MODE_SEPARATED_SKILLS } from "../data/defaultWorkspace";
import type { TranslationDictionary } from "../i18n/translations";
import { MODE_THEMES } from "../theme/modeTheme";
import type {
  LanguageCode,
  LearnerProfile,
  MentorMessage,
  RankedUser,
  SkillCoachPlan,
  StorageGuideSummary,
} from "../types";
import { ModeVisualBanner } from "./ModeVisualBanner";
import { SkillDevelopmentChart } from "./SkillDevelopmentChart";

interface SkillCoachViewProps {
  profile: LearnerProfile;
  currentUser: RankedUser | null;
  coachPlan: SkillCoachPlan | null;
  mentorMessages: MentorMessage[];
  language: LanguageCode;
  onSaveCoachPlan: (plan: SkillCoachPlan) => void;
  onAddMentorMessage: (msg: MentorMessage) => void;
  onAddSkillToProfile: (newSkill: string) => void;
  t: TranslationDictionary;
}

export function SkillCoachView({
  profile,
  currentUser,
  coachPlan,
  mentorMessages,
  language,
  onSaveCoachPlan,
  onAddMentorMessage,
  onAddSkillToProfile,
  t,
}: SkillCoachViewProps) {
  const [focusSkill, setFocusSkill] = useState(
    MODE_SEPARATED_SKILLS[profile.mode][0] || ""
  );
  const [loadingCoach, setLoadingCoach] = useState(false);
  const [completedDrills, setCompletedDrills] = useState<number[]>([]);
  const [storageGuide, setStorageGuide] = useState<StorageGuideSummary | null>(
    null
  );

  const [chatInput, setChatInput] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);

  const modeSkills = MODE_SEPARATED_SKILLS[profile.mode];
  const theme = MODE_THEMES[profile.mode];

  useEffect(() => {
    fetch("/api/storage-guide")
      .then((res) => res.json())
      .then((data) => {
        if (data?.modeGuidance) {
          setStorageGuide(data as StorageGuideSummary);
        }
      })
      .catch(() => {
        // Non-blocking storage guide fetch
      });
  }, [profile.mode, mentorMessages.length]);

  const handleGenerateCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingCoach(true);
    setCompletedDrills([]);

    try {
      const response = await fetch("/api/skill-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          age: profile.age,
          mode: profile.mode,
          skills: profile.skills,
          target_role: profile.target_role,
          details: profile.details,
          focus_skill: focusSkill.trim(),
          language,
        }),
      });
      const data = await response.json();
      if (data?.focus_summary) {
        onSaveCoachPlan(data as SkillCoachPlan);
        return;
      }
    } catch {
      // Seamless local blueprint fallback below
    } finally {
      setLoadingCoach(false);
    }

    onSaveCoachPlan({
      focus_summary: `Blueprint for ${profile.mode} track targeting ${profile.target_role}: Master ${focusSkill || modeSkills[0]} through daily structured drills and measurable proof.`,
      daily_drills: [
        `20-min Active Recall: Sketch core architecture for ${focusSkill || modeSkills[0]} without notes.`,
        `20-min Practical Lab: Implement one clean edge-case test scenario.`,
        `15-min Brain Logic Check: Explain key trade-offs clearly.`,
        `10-min Quiz Review: Log daily skill points in Quiz & Brain Lab.`,
      ],
      mode_project_challenge: `Build a focused mini-project applying ${focusSkill || modeSkills[0]} toward ${profile.target_role}.`,
      next_milestone: `Complete 4 daily drills and pass 1 skill quiz within 7 days.`,
      recommended_skills_to_add: modeSkills.slice(0, 3),
    });
  };

  const handleExportBlueprint = () => {
    if (!coachPlan) return;
    const content = [
      `# SkillMint AI Blueprint — ${profile.name} (${profile.mode} · ${theme.themeName})`,
      `Target Role: ${profile.target_role}`,
      `Focus Skill: ${focusSkill}`,
      "",
      `## Summary`,
      coachPlan.focus_summary,
      "",
      `## 20-Minute Daily Drills`,
      ...coachPlan.daily_drills.map((d, idx) => `${idx + 1}. ${d}`),
      "",
      `## Hands-On Challenge`,
      coachPlan.mode_project_challenge,
      "",
      `## 7-Day Milestone`,
      coachPlan.next_milestone,
      "",
      `## Recommended Next Skills`,
      ...coachPlan.recommended_skills_to_add.map((s) => `- ${s}`),
    ].join("\n");

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `skillmint-blueprint-${profile.mode.toLowerCase()}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleSendMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    const promptText = chatInput.trim();
    if (!promptText || loadingChat) return;

    const userMsg: MentorMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    onAddMentorMessage(userMsg);
    setChatInput("");
    setLoadingChat(true);

    try {
      const response = await fetch("/api/mentor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptText,
          mode: profile.mode,
          skills: profile.skills,
          target_role: profile.target_role,
          language,
        }),
      });
      const data = await response.json();
      onAddMentorMessage({
        id: `ai-${Date.now()}`,
        role: "assistant",
        content:
          data?.reply ||
          `For ${profile.mode} (${profile.target_role}), break "${promptText}" into one 20-minute drill and verify your understanding with a short quiz.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } catch {
      onAddMentorMessage({
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: `Quick Lab Tip (${profile.mode}): Practice "${promptText}" with one small real example, write down 2 edge cases, and test yourself in the Quiz & Brain Lab.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } finally {
      setLoadingChat(false);
    }
  };

  const toggleDrill = (idx: number) => {
    setCompletedDrills((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const currentModeGuide = storageGuide?.modeGuidance?.[profile.mode];

  return (
    <div className="space-y-6">
      <ModeVisualBanner
        mode={profile.mode}
        title={t.coach.title}
        subtitle={t.coach.subtitle}
      />

      {/* Live Graphic Skill & Brain Development Diagram */}
      <SkillDevelopmentChart
        mode={profile.mode}
        history={currentUser?.skillHistory ?? []}
        radar={
          currentUser?.radarMetrics ?? {
            foundations: 80,
            brainLogic: 82,
            practicalLabs: 75,
            quizAccuracy: 84,
            consistency: 79,
          }
        }
        brainScore={currentUser?.brainScore ?? 82}
        points={currentUser?.points ?? 780}
        dailyStreak={currentUser?.dailyStreak ?? 5}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-7 space-y-6">
          <form
            onSubmit={handleGenerateCoach}
            className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4`}
          >
            <div className="space-y-1.5">
              <label
                htmlFor="coach-focus-skill"
                className="block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                {t.coach.focusSkillLabel}
              </label>
              <input
                id="coach-focus-skill"
                type="text"
                value={focusSkill}
                onChange={(e) => setFocusSkill(e.target.value)}
                placeholder={t.coach.focusSkillPlaceholder}
                className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {modeSkills.map((sk) => (
                <button
                  key={sk}
                  type="button"
                  onClick={() => setFocusSkill(sk)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                    focusSkill === sk
                      ? `${theme.accentSoftBg} ${theme.accentBorder} ${theme.accentText}`
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {sk}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loadingCoach}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap ${theme.primaryBtn}`}
            >
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>
                {loadingCoach
                  ? t.coach.generatingCoachBtn
                  : t.coach.generateCoachBtn}
              </span>
            </button>
          </form>

          {coachPlan && (
            <section
              className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="space-y-1.5">
                  <h2 className="text-lg font-display font-semibold text-slate-900 dark:text-white">
                    {t.coach.blueprintTitle}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {coachPlan.focus_summary}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportBlueprint}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <Download className="h-3.5 w-3.5 shrink-0" />
                  <span>Export Blueprint</span>
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {t.coach.dailyDrillsTitle}
                </h3>
                <div className="space-y-2">
                  {coachPlan.daily_drills.map((drill, idx) => {
                    const checked = completedDrills.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleDrill(idx)}
                        className={`w-full flex items-start gap-3 p-3 text-left rounded-lg border transition-colors ${
                          checked
                            ? "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-slate-500 dark:text-slate-400"
                            : "bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded border shrink-0 ${
                            checked
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                          }`}
                        >
                          {checked && <Check className="h-3.5 w-3.5" />}
                        </span>
                        <span
                          className={`text-sm leading-snug ${
                            checked ? "line-through" : ""
                          }`}
                        >
                          {drill}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Target className={`h-4 w-4 shrink-0 ${theme.accentText}`} />
                    <span>{t.coach.challengeTitle}</span>
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {coachPlan.mode_project_challenge}
                  </p>
                </div>

                <div className="space-y-1.5 md:border-l md:border-slate-200 dark:md:border-slate-800 md:pl-6">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{t.coach.milestoneTitle}</span>
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {coachPlan.next_milestone}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {t.coach.suggestedSkillsTitle}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {coachPlan.recommended_skills_to_add.map((sk) => (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => onAddSkillToProfile(sk)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${theme.secondaryBtn}`}
                    >
                      <Plus className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        {sk} · {t.coach.addSkillBtn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Persistent AI Storage Guide Card */}
          {storageGuide && currentModeGuide && (
            <section
              className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Database className={`h-4 w-4 shrink-0 ${theme.accentText}`} />
                  <h2 className="text-sm font-display font-semibold text-slate-900 dark:text-white">
                    AI Knowledge Store Guide ({storageGuide.storageFile})
                  </h2>
                </div>
                <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  {storageGuide.totalLearnedQuestions} learned Q&amp;A
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-white">
                  {t.modes[profile.mode]} Brain Focus:
                </strong>{" "}
                {currentModeGuide.brainFocus}
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                {currentModeGuide.corePillars.map((pillar) => (
                  <span
                    key={pillar}
                    className="px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    {pillar}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right: Interactive AI Mentor Chat */}
        <section
          className={`xl:col-span-5 ${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col h-[560px]`}
        >
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <Bot className={`h-5 w-5 shrink-0 ${theme.accentText}`} />
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                {t.coach.mentorTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.coach.mentorSubtitle}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {mentorMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <MessageSquare className="h-8 w-8 text-slate-300 dark:text-slate-700 mb-3" />
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {t.modes[profile.mode]} · {profile.target_role}
                </p>
                <div className="mt-4 space-y-2 w-full max-w-xs">
                  {[
                    `How can I improve ${modeSkills[0]}?`,
                    `Give me a practice task for ${profile.target_role}`,
                  ].map((promptSample) => (
                    <button
                      key={promptSample}
                      type="button"
                      onClick={() => setChatInput(promptSample)}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors flex items-center justify-between gap-2"
                    >
                      <span className="truncate">{promptSample}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              mentorMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? theme.primaryBtn
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="mt-1 text-[11px] font-mono text-slate-400 dark:text-slate-500">
                    {msg.timestamp}
                  </span>
                </div>
              ))
            )}
            {loadingChat && (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {t.common.loading}
              </div>
            )}
          </div>

          <form
            onSubmit={handleSendMentor}
            className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={t.coach.mentorPlaceholder}
              className="flex-1 min-w-0 px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900"
            />
            <button
              type="submit"
              disabled={loadingChat || !chatInput.trim()}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shrink-0 ${theme.primaryBtn}`}
            >
              <Send className="h-3.5 w-3.5 shrink-0" />
              <span>{t.coach.sendMessage}</span>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
