import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  Clock,
  GraduationCap,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import type { TranslationDictionary } from "../i18n/translations";
import { MODE_THEMES } from "../theme/modeTheme";
import type { RankedUser, StudentProgressState, WorkspaceTab } from "../types";
import { SkillDevelopmentChart } from "./SkillDevelopmentChart";

interface OverviewDashboardProps {
  state: StudentProgressState;
  currentUser: RankedUser | null;
  totalRankedUsers: number;
  overallProgress: number;
  totalCompletedItems: number;
  totalItems: number;
  onNavigate: (tab: WorkspaceTab) => void;
  onStartQuizForSkill: (skill: string) => void;
  onFocusWeek: (week: number) => void;
  t: TranslationDictionary;
}

const BANNER_SRC =
  "/src/assets/images/enterprise_learning_banner_1794635814274.jpg";

export function OverviewDashboard({
  state,
  currentUser,
  totalRankedUsers,
  overallProgress,
  totalCompletedItems,
  totalItems,
  onNavigate,
  onStartQuizForSkill,
  onFocusWeek,
  t,
}: OverviewDashboardProps) {
  const [bannerError, setBannerError] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  const { profile, plan, completedExercises, completedCourses, quizAttempts } =
    state;
  const theme = MODE_THEMES[profile.mode];

  const passedSkillsCount = new Set(
    quizAttempts.filter((a) => a.percentage >= 67).map((a) => a.skill)
  ).size;

  const nextIncompleteWeek =
    plan.roadmap.find((step) => !completedExercises.includes(step.week))
      ?.week ?? 1;

  return (
    <div className="space-y-6">
      {/* Mode-Themed Hero Banner (Education / Brain AI / Company Laptop) */}
      <section className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900">
        {!bannerError ? (
          <img
            src={theme.heroImage}
            alt={theme.heroAlt}
            referrerPolicy="no-referrer"
            onError={() => setBannerError(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950"
            aria-hidden="true"
          />
        )}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${theme.heroScrim}`}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 sm:p-8">
          <div className="max-w-2xl space-y-2.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-blue-200">
              <span>{theme.themeName}</span>
              <span aria-hidden="true">·</span>
              <span>{t.modes[profile.mode]}</span>
              <span aria-hidden="true">·</span>
              <span>{t.modeTracks[profile.mode]}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.name}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance">
              {profile.target_role}
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
              {plan.analysis.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onFocusWeek(nextIncompleteWeek)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <span>
                {t.actions.continueWeek} {nextIncompleteWeek}
              </span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate("coach")}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/25 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>{t.nav.coach}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4-Column Tabular KPI Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-5`}>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t.overview.kpis.roleReadiness}
          </p>
          <p className="mt-2 text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {plan.analysis.match_percentage}%
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t.overview.kpis.roleReadinessSub}
          </p>
        </div>

        <div className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-5`}>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t.overview.kpis.roadmapProgress}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {overallProgress}%
            </p>
            <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
              ({totalCompletedItems}/{totalItems})
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t.overview.kpis.roadmapProgressSub}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("quiz")}
          className={`text-left ${theme.surfaceBg} border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 rounded-xl p-5 transition-colors`}
        >
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t.overview.kpis.assessmentsPassed} &amp; Brain Score
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {currentUser?.brainScore ?? 82}
              <span className="text-base font-normal text-slate-400 dark:text-slate-500">
                /100
              </span>
            </p>
            <span className="text-xs font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
              {passedSkillsCount}/{plan.roadmap.length} quizzes
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Open Quiz &amp; Brain Lab
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("rankings")}
          className={`text-left ${theme.surfaceBg} border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 rounded-xl p-5 transition-colors`}
        >
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t.overview.kpis.globalRank}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p
              className={`text-3xl font-bold font-mono tabular-nums ${theme.accentText}`}
            >
              #{currentUser?.rank ?? 1}
            </p>
            <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
              / {totalRankedUsers} · {currentUser?.points ?? 500}{" "}
              {t.common.pts}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t.overview.kpis.globalRankSub}
          </p>
        </button>
      </section>

      {/* Graphic Skill & Brain Development Diagram */}
      <SkillDevelopmentChart
        mode={profile.mode}
        history={currentUser?.skillHistory ?? []}
        radar={
          currentUser?.radarMetrics ?? {
            foundations: 82,
            brainLogic: 82,
            practicalLabs: 76,
            quizAccuracy: 85,
            consistency: 79,
          }
        }
        brainScore={currentUser?.brainScore ?? 82}
        points={currentUser?.points ?? 780}
        dailyStreak={currentUser?.dailyStreak ?? 5}
      />

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-7 space-y-6">
          <section className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-6 py-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t.overview.weeklyProgressTitle}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t.overview.weeklyProgressDesc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("roadmap")}
                className={`inline-flex items-center gap-1.5 text-sm font-medium whitespace-nowrap shrink-0 self-start sm:self-center ${theme.accentText}`}
              >
                <BookOpen className="h-4 w-4 shrink-0" />
                <span>{t.nav.roadmap}</span>
              </button>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {plan.roadmap.map((step) => {
                const courseCount = step.courses_and_tutorials.length;
                const doneCourses = step.courses_and_tutorials.filter((_, i) =>
                  completedCourses.includes(`${step.week}-${i}`)
                ).length;
                const exerciseDone = completedExercises.includes(step.week);
                const weekTotal = courseCount + 1;
                const weekDone = doneCourses + (exerciseDone ? 1 : 0);
                const weekPct = Math.round((weekDone / weekTotal) * 100);

                return (
                  <div
                    key={step.week}
                    className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {t.common.weekShort} 0{step.week}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className={`font-medium truncate ${theme.accentText}`}>
                          {step.skill}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {step.title}
                      </p>

                      <div className="flex items-center gap-3 pt-1">
                        <div className="h-1.5 flex-1 max-w-[200px] bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-[width] duration-300 ${
                              weekPct === 100
                                ? "bg-emerald-600 dark:bg-emerald-500"
                                : theme.progressFill
                            }`}
                            style={{ width: `${weekPct}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300">
                          {weekPct}%
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
                          ({doneCourses}/{courseCount} {t.common.coursesLabel},{" "}
                          {exerciseDone ? "1/1" : "0/1"}{" "}
                          {t.common.exercisesLabel})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onFocusWeek(step.week)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
                      >
                        {t.roadmap.weekLabel} {step.week}
                      </button>
                      <button
                        type="button"
                        onClick={() => onStartQuizForSkill(step.skill)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${theme.secondaryBtn}`}
                      >
                        {t.actions.takeQuiz}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-6`}>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              {t.overview.skillGapTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{t.overview.strengthsLabel}</span>
                </h3>
                <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                  {plan.analysis.strengths.map((item, idx) => (
                    <li key={idx} className="leading-snug">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:border-l md:border-slate-200 dark:md:border-slate-800 md:pl-6">
                <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-3">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>{t.overview.focusAreasLabel}</span>
                </h3>
                <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                  {plan.analysis.missing_skills.map((item, idx) => (
                    <li key={idx} className="leading-snug">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div className="xl:col-span-5">
          <section className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden`}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t.overview.quizHistoryTitle}
              </h2>
              <button
                type="button"
                onClick={() => onNavigate("quiz")}
                className={`text-sm font-medium whitespace-nowrap shrink-0 ${theme.accentText}`}
              >
                {t.actions.takeQuiz}
              </button>
            </div>

            {quizAttempts.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Award className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t.overview.quizHistoryEmpty}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  {t.overview.quizHistoryEmptyDesc}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate("quiz")}
                  className={`mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${theme.primaryBtn}`}
                >
                  {t.actions.takeQuiz}
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <th className="py-3 px-4">{t.overview.tableHeaders.skill}</th>
                      <th className="py-3 px-3 text-right">
                        {t.overview.tableHeaders.score}
                      </th>
                      <th className="py-3 px-3">
                        {t.overview.tableHeaders.status}
                      </th>
                      <th className="py-3 px-4 text-right">
                        {t.overview.tableHeaders.action}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                    {quizAttempts.slice(0, 6).map((attempt) => {
                      const passed = attempt.percentage >= 67;
                      return (
                        <tr
                          key={attempt.id}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100 max-w-[170px]">
                            <p className="truncate">{attempt.skill}</p>
                            <p className="text-xs font-mono tabular-nums text-slate-400 dark:text-slate-500">
                              {attempt.completedAt}
                            </p>
                          </td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                            {attempt.percentage}%
                            <span className="block text-xs font-normal text-slate-400 dark:text-slate-500">
                              {attempt.score}/{attempt.total}
                            </span>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            {passed ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                                {t.overview.statusLabels.passed}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                                <CircleAlert className="h-3.5 w-3.5 shrink-0" />
                                {t.overview.statusLabels.review}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => onStartQuizForSkill(attempt.skill)}
                              className={`text-xs font-medium ${theme.accentText}`}
                            >
                              {t.actions.retakeQuiz}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>

      {showGuide && (
        <section className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-6`}>
          <div className="flex items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-2.5">
              <GraduationCap className={`h-5 w-5 shrink-0 ${theme.accentText}`} />
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                {t.overview.guideTitle}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white whitespace-nowrap shrink-0"
            >
              <X className="h-3.5 w-3.5" />
              <span>{t.actions.dismissGuide}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            {t.overview.guideSteps.map((step, index) => (
              <div key={index} className="space-y-1.5">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
