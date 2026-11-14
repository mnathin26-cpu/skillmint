import {
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardCheck,
  FolderGit2,
  Target,
} from "lucide-react";
import { MODE_SEPARATED_SKILLS } from "../data/defaultWorkspace";
import type { TranslationDictionary } from "../i18n/translations";
import { MODE_THEMES } from "../theme/modeTheme";
import type { StudentProgressState } from "../types";
import { ModeVisualBanner } from "./ModeVisualBanner";

interface RoadmapViewProps {
  state: StudentProgressState;
  selectedWeek: number | "all";
  onSelectWeek: (week: number | "all") => void;
  onToggleCourse: (courseKey: string) => void;
  onToggleExercise: (week: number) => void;
  onStartQuizForSkill: (skill: string) => void;
  t: TranslationDictionary;
}

export function RoadmapView({
  state,
  selectedWeek,
  onSelectWeek,
  onToggleCourse,
  onToggleExercise,
  onStartQuizForSkill,
  t,
}: RoadmapViewProps) {
  const { plan, profile, completedCourses, completedExercises } = state;
  const theme = MODE_THEMES[profile.mode];

  const visibleSteps =
    selectedWeek === "all"
      ? plan.roadmap
      : plan.roadmap.filter((step) => step.week === selectedWeek);

  const modeSkills = MODE_SEPARATED_SKILLS[profile.mode];

  return (
    <div className="space-y-6">
      <ModeVisualBanner
        mode={profile.mode}
        eyebrow={`${t.modes[profile.mode]} · ${profile.target_role}`}
        title={t.roadmap.title}
        subtitle={theme.visualTagline}
      />

      <section className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8`}>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className={theme.accentText}>{theme.themeName}</span>
              <span aria-hidden="true">·</span>
              <span>{t.modes[profile.mode]}</span>
              <span aria-hidden="true">·</span>
              <span>{t.modeTracks[profile.mode]}</span>
              <span aria-hidden="true">·</span>
              <span className={`font-semibold ${theme.accentText}`}>
                {profile.target_role}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t.roadmap.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {plan.analysis.summary}
            </p>
          </div>

          <div className="lg:w-60 shrink-0 pt-2 lg:pt-0 lg:border-l lg:border-slate-200 dark:lg:border-slate-800 lg:pl-6">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.overview.kpis.roleReadiness}
            </p>
            <p className="mt-1 text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {plan.analysis.match_percentage}%
            </p>
            <div className="mt-2.5 h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${theme.progressFill}`}
                style={{ width: `${plan.analysis.match_percentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{t.roadmap.strengths}</span>
            </h2>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {plan.analysis.strengths.map((item, idx) => (
                <li key={idx} className="leading-snug">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:border-l md:border-slate-200 dark:md:border-slate-800 md:pl-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{t.roadmap.missingSkills}</span>
            </h2>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {plan.analysis.missing_skills.map((item, idx) => (
                <li key={idx} className="leading-snug">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:border-l md:border-slate-200 dark:md:border-slate-800 md:pl-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <FolderGit2 className={`h-4 w-4 shrink-0 ${theme.accentText}`} />
              <span>{t.roadmap.recommendedProjects}</span>
            </h2>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {plan.analysis.recommended_projects.map((item, idx) => (
                <li key={idx} className="leading-snug">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Mode-Separated Track Skills Quick Launcher */}
      <section className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3`}>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          {t.roadmap.modeSkillCatalogTitle} ({t.modes[profile.mode]} ·{" "}
          {t.modeTracks[profile.mode]})
        </h2>
        <div className="flex flex-wrap gap-2">
          {modeSkills.map((sk) => (
            <button
              key={sk}
              type="button"
              onClick={() => onStartQuizForSkill(sk)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              {sk} · {t.actions.takeQuiz}
            </button>
          ))}
        </div>
      </section>

      {/* Week Filter Segmented Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filter roadmap weeks"
          className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedWeek === "all"}
            onClick={() => onSelectWeek("all")}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              selectedWeek === "all"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {t.roadmap.allWeeks}
          </button>

          {plan.roadmap.map((step) => (
            <button
              key={step.week}
              type="button"
              role="tab"
              aria-selected={selectedWeek === step.week}
              onClick={() => onSelectWeek(step.week)}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedWeek === step.week
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {t.roadmap.weekLabel} {step.week}
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Roadmap Steps */}
      <div className="space-y-4">
        {visibleSteps.map((step) => {
          const isExerciseDone = completedExercises.includes(step.week);
          const totalWeekItems = step.courses_and_tutorials.length + 1;
          const doneCoursesCount = step.courses_and_tutorials.filter((_, i) =>
            completedCourses.includes(`${step.week}-${i}`)
          ).length;
          const weekPct = Math.round(
            ((doneCoursesCount + (isExerciseDone ? 1 : 0)) / totalWeekItems) *
              100
          );

          return (
            <article
              key={step.week}
              className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden`}
            >
              <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {t.roadmap.weekLabel} 0{step.week}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className={`font-medium ${theme.accentText}`}>
                      {step.skill}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      {weekPct}% {t.roadmap.progressLabel}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {step.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => onStartQuizForSkill(step.skill)}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-center ${theme.secondaryBtn}`}
                >
                  <ClipboardCheck className="h-4 w-4 shrink-0" />
                  <span>{t.roadmap.testSkillCta}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
                <div className="lg:col-span-7 p-6 space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span>{t.roadmap.coursesTitle}</span>
                  </h3>

                  <div className="space-y-2 pt-1">
                    {step.courses_and_tutorials.map((course, idx) => {
                      const courseKey = `${step.week}-${idx}`;
                      const checked = completedCourses.includes(courseKey);
                      return (
                        <button
                          key={courseKey}
                          type="button"
                          onClick={() => onToggleCourse(courseKey)}
                          className={`w-full flex items-start gap-3 p-3 text-left rounded-lg border transition-colors ${
                            checked
                              ? "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-slate-500 dark:text-slate-400"
                              : "bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded border shrink-0 transition-colors ${
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
                            {course}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 flex flex-col justify-between gap-5 bg-slate-50/40 dark:bg-slate-950/40">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {t.roadmap.practicalExerciseTitle}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.practical_exercise}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleExercise(step.week)}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors whitespace-nowrap ${
                      isExerciseDone
                        ? "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>
                      {isExerciseDone
                        ? t.actions.completed
                        : t.actions.markComplete}
                    </span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
