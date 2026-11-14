import { AlertCircle, ArrowRight, Bot, Layers, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { EXAMPLE_PROFILES } from "../data/defaultWorkspace";
import type { TranslationDictionary } from "../i18n/translations";
import { MODE_THEMES } from "../theme/modeTheme";
import type {
  FullPipelineOutput,
  LanguageCode,
  LearnerMode,
  LearnerProfile,
} from "../types";
import { ModeVisualBanner } from "./ModeVisualBanner";

interface PlanGeneratorViewProps {
  currentProfile: LearnerProfile;
  language: LanguageCode;
  onPlanGenerated: (
    profile: LearnerProfile,
    output: FullPipelineOutput
  ) => void;
  t: TranslationDictionary;
}

const MODES: LearnerMode[] = ["Student", "Individual", "Organization"];

export function PlanGeneratorView({
  currentProfile,
  language,
  onPlanGenerated,
  t,
}: PlanGeneratorViewProps) {
  const [form, setForm] = useState<LearnerProfile>(currentProfile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentLogs, setAgentLogs] = useState<string[]>([
    "System ready. Select a track mode and run the multi-agent pipeline.",
  ]);

  useEffect(() => {
    setForm(currentProfile);
  }, [currentProfile]);

  const theme = MODE_THEMES[form.mode];
  const inputClass = `w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 ${theme.ringFocus} transition-colors`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.skills.trim() || !form.target_role.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setAgentLogs([
      `Skill Profiler Agent: Benchmarking ${form.mode} profile for ${form.target_role}...`,
      `Curriculum Architect Agent: Structuring 4-week modules and practical lab exercises...`,
    ]);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Failed to generate learning plan.");
      }

      setAgentLogs((prev) => [
        ...prev,
        "Pipeline complete: Personalized roadmap and skill gap analysis ready.",
      ]);

      onPlanGenerated(form, data as FullPipelineOutput);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to generate learning plan.";
      setError(message);
      setAgentLogs((prev) => [...prev, `Agent error: ${message}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ModeVisualBanner
        mode={form.mode}
        title={t.planner.title}
        subtitle={t.planner.subtitle}
      />

      {/* Quick-Start Presets */}
      <section className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition-colors`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-sm font-display font-semibold text-slate-900 dark:text-slate-100">
              {t.planner.presetsTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.planner.presetsSubtitle}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROFILES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setForm(preset.profile)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form
          onSubmit={handleSubmit}
          className={`lg:col-span-7 ${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5 transition-colors`}
        >
          <div className="space-y-2">
            <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">
              {t.planner.form.modeLabel}
            </span>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {MODES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, mode: m }))}
                  className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    form.mode === m
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  {t.modes[m]}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <span className={`font-medium ${theme.accentText}`}>
                {theme.themeName}
              </span>{" "}
              · {t.modeTracks[form.mode]} — {t.modeDescriptions[form.mode]}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="planner-name"
                className="block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                {t.planner.form.nameLabel}
              </label>
              <input
                id="planner-name"
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder={t.planner.form.namePlaceholder}
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="planner-role"
                className="block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                {t.planner.form.targetRoleLabel}
              </label>
              <input
                id="planner-role"
                type="text"
                required
                value={form.target_role}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, target_role: e.target.value }))
                }
                placeholder={t.planner.form.targetRolePlaceholder}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="planner-skills"
              className="block text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              {t.planner.form.skillsLabel}
            </label>
            <textarea
              id="planner-skills"
              rows={2}
              required
              value={form.skills}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, skills: e.target.value }))
              }
              placeholder={t.planner.form.skillsPlaceholder}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="planner-projects"
              className="block text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              {t.planner.form.projectsLabel}
            </label>
            <textarea
              id="planner-projects"
              rows={2}
              value={form.projects}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, projects: e.target.value }))
              }
              placeholder={t.planner.form.projectsPlaceholder}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="planner-note"
              className="block text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              {t.planner.form.mentorNoteLabel}
            </label>
            <input
              id="planner-note"
              type="text"
              value={form.mentor_note}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, mentor_note: e.target.value }))
              }
              placeholder={t.planner.form.mentorNotePlaceholder}
              className={inputClass}
            />
          </div>

          {error && (
            <div
              role="alert"
              className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg p-3.5 flex items-start gap-2.5 text-sm text-red-800 dark:text-red-300"
            >
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${theme.primaryBtn} ${theme.ringFocus}`}
            >
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>
                {loading
                  ? t.actions.generatingPlan
                  : t.actions.generatePlan}
              </span>
              {!loading && <ArrowRight className="h-4 w-4 shrink-0" />}
            </button>
          </div>
        </form>

        {/* Right: Multi-Agent Pipeline & Real Collaboration Log */}
        <aside className="lg:col-span-5 space-y-6">
          <div className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5 transition-colors`}>
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200 dark:border-slate-800">
              <Layers className={`h-5 w-5 shrink-0 ${theme.accentText}`} />
              <h2 className="text-base font-display font-semibold text-slate-900 dark:text-slate-100">
                {t.planner.howItWorksTitle}
              </h2>
            </div>

            <div className="space-y-4 divide-y divide-slate-200 dark:divide-slate-800">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  01. {t.planner.agent1Title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.planner.agent1Desc}
                </p>
              </div>

              <div className="pt-4 space-y-1">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  02. {t.planner.agent2Title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.planner.agent2Desc}
                </p>
              </div>

              <div className="pt-4 space-y-1">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  03. {t.planner.agent3Title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.planner.agent3Desc}
                </p>
              </div>
            </div>
          </div>

          <div className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3 transition-colors`}>
            <div className="flex items-center gap-2">
              <Bot className={`h-4 w-4 shrink-0 ${theme.accentText}`} />
              <h2 className="text-sm font-display font-semibold text-slate-900 dark:text-slate-100">
                {t.planner.agentFeedTitle}
              </h2>
            </div>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {agentLogs.map((log, i) => (
                <div
                  key={i}
                  className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg leading-relaxed"
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
