/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence, motion } from "motion/react";
import { Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AnimatedBackdrop } from "./components/AnimatedBackdrop";
import { FloatingAiAgent } from "./components/FloatingAiAgent";
import { LoginPage } from "./components/LoginPage";
import { OverviewDashboard } from "./components/OverviewDashboard";
import { PlanGeneratorView } from "./components/PlanGeneratorView";
import { ProfileView } from "./components/ProfileView";
import { QuizCenter } from "./components/QuizCenter";
import { RankCelebrationBlast } from "./components/RankCelebrationBlast";
import { RankingsView } from "./components/RankingsView";
import { RoadmapView } from "./components/RoadmapView";
import { Sidebar } from "./components/Sidebar";
import { SkillCoachView } from "./components/SkillCoachView";
import { TopBar } from "./components/TopBar";
import { DEFAULT_PROGRESS_STATE } from "./data/defaultWorkspace";
import { TRANSLATIONS } from "./i18n/translations";
import { MODE_THEMES } from "./theme/modeTheme";
import type {
  FullPipelineOutput,
  LanguageCode,
  LearnerProfile,
  MentorMessage,
  QuizAttempt,
  RankedUser,
  SkillCoachPlan,
  StudentProgressState,
  WorkspaceTab,
} from "./types";

const STORAGE_KEY = "skillforge_student_progress_v2";
const LANG_STORAGE_KEY = "skillforge_language_v2";
const THEME_STORAGE_KEY = "skillforge_theme_v1";

function loadInitialState(): StudentProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS_STATE;
    const parsed = JSON.parse(raw) as StudentProgressState;
    if (parsed && parsed.profile && parsed.plan?.roadmap) {
      return {
        ...DEFAULT_PROGRESS_STATE,
        ...parsed,
      };
    }
  } catch {
    // Fallback to default state
  }
  return DEFAULT_PROGRESS_STATE;
}

function loadInitialLanguage(): LanguageCode {
  try {
    const raw = localStorage.getItem(LANG_STORAGE_KEY) as LanguageCode | null;
    if (raw && raw in TRANSLATIONS) return raw;
  } catch {
    // Ignore storage read errors
  }
  return "en";
}

function loadInitialDark(): boolean {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark") return true;
    if (stored === "light") return false;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return true;
    }
  } catch {
    // Ignore storage errors
  }
  return false;
}

export default function App() {
  const [state, setState] = useState<StudentProgressState>(loadInitialState);
  const [language, setLanguage] = useState<LanguageCode>(loadInitialLanguage);
  const [isDark, setIsDark] = useState<boolean>(loadInitialDark);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("overview");
  const [selectedWeek, setSelectedWeek] = useState<number | "all">("all");
  const [quizSkill, setQuizSkill] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rankedUsers, setRankedUsers] = useState<RankedUser[]>([]);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [loginBlastKey, setLoginBlastKey] = useState(0);
  const [loginBlastRank, setLoginBlastRank] = useState<1 | 2 | 3 | "all">(
    "all"
  );

  const t = TRANSLATIONS[language];
  const theme = MODE_THEMES[state.profile.mode];

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.users)) {
          setRankedUsers(data.users as RankedUser[]);
        }
      })
      .catch(() => {
        // Ignore transient initial fetch errors
      });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, language);
      document.documentElement.lang = language;
    } catch {
      // Ignore storage errors
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
    } catch {
      // Ignore storage errors
    }
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    if (!justLoggedIn) return;
    const timer = window.setTimeout(() => setJustLoggedIn(false), 5500);
    return () => window.clearTimeout(timer);
  }, [justLoggedIn]);

  const currentUser = useMemo(() => {
    return (
      rankedUsers.find((u) => u.id === state.currentUserId) ??
      rankedUsers[0] ??
      null
    );
  }, [rankedUsers, state.currentUserId]);

  // Automatic daily skill & streak check-in once per day when signed in
  useEffect(() => {
    if (!state.isAuthenticated || !state.currentUserId) return;
    const today = new Date().toISOString().slice(0, 10);
    const guardKey = `skillmint_daily_ping_${state.currentUserId}_${today}`;
    try {
      if (sessionStorage.getItem(guardKey)) return;
      sessionStorage.setItem(guardKey, "1");
    } catch {
      // Proceed even if sessionStorage is unavailable
    }

    fetch(`/api/users/${state.currentUserId}/daily-update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ manualBoost: false }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.users)) {
          setRankedUsers(data.users as RankedUser[]);
        }
        if (data.user?.avatarUrl) {
          setState((prev) => ({
            ...prev,
            profile: {
              ...prev.profile,
              avatarUrl: prev.profile.avatarUrl || data.user.avatarUrl,
            },
          }));
        }
      })
      .catch(() => {
        // Non-blocking daily check-in
      });
  }, [state.isAuthenticated, state.currentUserId]);

  const { overallProgress, totalCompletedItems, totalItems } = useMemo(() => {
    const roadmap = state.plan.roadmap;
    const coursesTotal = roadmap.reduce(
      (sum, step) => sum + step.courses_and_tutorials.length,
      0
    );
    const exercisesTotal = roadmap.length;
    const total = Math.max(coursesTotal + exercisesTotal, 1);

    const validCourseKeys = new Set<string>();
    roadmap.forEach((step) => {
      step.courses_and_tutorials.forEach((_, idx) => {
        validCourseKeys.add(`${step.week}-${idx}`);
      });
    });

    const completedCourseCount = state.completedCourses.filter((k) =>
      validCourseKeys.has(k)
    ).length;
    const completedExerciseCount = state.completedExercises.filter((w) =>
      roadmap.some((step) => step.week === w)
    ).length;

    const done = completedCourseCount + completedExerciseCount;
    return {
      overallProgress: Math.round((done / total) * 100),
      totalCompletedItems: done,
      totalItems: total,
    };
  }, [state]);

  const syncUserScore = async (
    pointsDelta: number,
    quizzesDelta = 0,
    exercisesDelta = 0,
    brainDelta = 0
  ) => {
    if (!state.currentUserId) return;
    try {
      const res = await fetch(`/api/users/${state.currentUserId}/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pointsDelta,
          quizzesDelta,
          exercisesDelta,
          brainDelta,
        }),
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.users)) {
        setRankedUsers(data.users as RankedUser[]);
      }
    } catch {
      // Non-blocking leaderboard sync
    }
  };

  const triggerPostLoginExperience = (rankValue?: number) => {
    setJustLoggedIn(true);
    if (rankValue === 1 || rankValue === 2 || rankValue === 3) {
      setLoginBlastRank(rankValue);
      setLoginBlastKey((k) => k + 1);
    }
  };

  const handleAuthComplete = (user: RankedUser, _isNewUser: boolean) => {
    setRankedUsers((prev) => {
      const exists = prev.some((u) => u.id === user.id);
      const updated = exists
        ? prev.map((u) => (u.id === user.id ? user : u))
        : [...prev, user].sort((a, b) => b.points - a.points);
      const matched = updated.find((u) => u.id === user.id);
      triggerPostLoginExperience(matched?.rank ?? user.rank);
      return updated;
    });

    setState((prev) => ({
      ...prev,
      currentUserId: user.id,
      isAuthenticated: true,
      authProvider: user.authProvider,
      profile: {
        ...prev.profile,
        mode: user.mode,
        name: user.name,
        age: user.age,
        dob: user.dob,
        email: user.email,
        mobile: user.mobile,
        skills: user.skills,
        projects: user.projects,
        target_role: user.target_role,
        details: user.details,
        avatarUrl: user.avatarUrl || prev.profile.avatarUrl,
      },
      lastUpdated: new Date().toISOString().slice(0, 10),
    }));
    setActiveTab("overview");
  };

  const handleDemoEnter = () => {
    const targetId = state.currentUserId || "user-maya-student";
    const matched = rankedUsers.find((u) => u.id === targetId);
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      currentUserId: targetId,
      profile: {
        ...prev.profile,
        avatarUrl: matched?.avatarUrl || prev.profile.avatarUrl,
      },
    }));
    setActiveTab("overview");
    triggerPostLoginExperience(matched?.rank);
  };

  const handleSignOut = () => {
    setJustLoggedIn(false);
    setState((prev) => ({
      ...prev,
      isAuthenticated: false,
    }));
    setMobileMenuOpen(false);
  };

  const handleToggleCourse = (courseKey: string) => {
    setState((prev) => {
      const exists = prev.completedCourses.includes(courseKey);
      return {
        ...prev,
        completedCourses: exists
          ? prev.completedCourses.filter((k) => k !== courseKey)
          : [...prev.completedCourses, courseKey],
        lastUpdated: new Date().toISOString().slice(0, 10),
      };
    });
  };

  const handleToggleExercise = (week: number) => {
    const alreadyDone = state.completedExercises.includes(week);
    setState((prev) => ({
      ...prev,
      completedExercises: alreadyDone
        ? prev.completedExercises.filter((w) => w !== week)
        : [...prev.completedExercises, week],
      lastUpdated: new Date().toISOString().slice(0, 10),
    }));
    if (!alreadyDone) {
      syncUserScore(40, 0, 1, 2);
    }
  };

  const handleRecordQuizAttempt = (attempt: QuizAttempt) => {
    setState((prev) => ({
      ...prev,
      quizAttempts: [attempt, ...prev.quizAttempts],
      lastUpdated: new Date().toISOString().slice(0, 10),
    }));
    if (attempt.percentage >= 67) {
      syncUserScore(60, 1, 0, 2);
    } else {
      syncUserScore(15, 0, 0, 1);
    }
  };

  const handlePlanGenerated = async (
    profile: LearnerProfile,
    output: FullPipelineOutput
  ) => {
    setState((prev) => ({
      ...prev,
      profile,
      plan: output,
      completedCourses: [],
      completedExercises: [],
      lastUpdated: new Date().toISOString().slice(0, 10),
    }));

    if (state.currentUserId) {
      try {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: state.currentUserId,
            ...profile,
          }),
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.users)) {
          setRankedUsers(data.users as RankedUser[]);
        }
      } catch {
        // Non-blocking sync
      }
    }

    setSelectedWeek("all");
    setActiveTab("roadmap");
  };

  const handleSaveProfile = async (updated: LearnerProfile) => {
    setState((prev) => ({
      ...prev,
      profile: updated,
      lastUpdated: new Date().toISOString().slice(0, 10),
    }));

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: state.currentUserId,
          ...updated,
          authProvider: state.authProvider,
        }),
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.users)) {
        setRankedUsers(data.users as RankedUser[]);
        if (data.user?.id) {
          setState((prev) => ({ ...prev, currentUserId: data.user.id }));
        }
      }
    } catch {
      // Local profile remains saved seamlessly
    }
  };

  const handleChangeAvatar = async (avatarUrl: string) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        avatarUrl,
      },
      lastUpdated: new Date().toISOString().slice(0, 10),
    }));

    if (!state.currentUserId) return;
    try {
      const res = await fetch(`/api/users/${state.currentUserId}/avatar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl }),
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.users)) {
        setRankedUsers(data.users as RankedUser[]);
      }
    } catch {
      // Local avatar already updated
    }
  };

  const handleDailyCheckIn = async () => {
    if (!state.currentUserId) return;
    try {
      const res = await fetch(`/api/users/${state.currentUserId}/daily-update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manualBoost: true }),
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.users)) {
        setRankedUsers(data.users as RankedUser[]);
      }
    } catch {
      // Non-blocking daily check-in
    }
  };

  const handleAddSkillToProfile = (newSkill: string) => {
    const existingList = state.profile.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (
      existingList.some((s) => s.toLowerCase() === newSkill.toLowerCase())
    ) {
      return;
    }
    const updatedSkills = [...existingList, newSkill].join(", ");
    handleSaveProfile({ ...state.profile, skills: updatedSkills });
  };

  const handleStartQuizForSkill = (skill: string) => {
    setQuizSkill(skill);
    setActiveTab("quiz");
  };

  const handleFocusWeek = (week: number) => {
    setSelectedWeek(week);
    setActiveTab("roadmap");
  };

  const handleResetDemo = () => {
    setState({ ...DEFAULT_PROGRESS_STATE, isAuthenticated: true });
    setSelectedWeek("all");
    setActiveTab("overview");
  };

  if (!state.isAuthenticated) {
    return (
      <LoginPage
        language={language}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        onChangeLanguage={setLanguage}
        onAuthComplete={handleAuthComplete}
        onDemoEnter={handleDemoEnter}
        t={t}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`relative min-h-screen flex ${theme.pageCanvas} text-slate-900 dark:text-slate-100 transition-colors`}
    >
      <AnimatedBackdrop mode={state.profile.mode} />

      <RankCelebrationBlast
        triggerKey={loginBlastKey}
        rankFocus={loginBlastRank}
      />

      <div className="relative z-10 flex w-full min-w-0">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        profile={state.profile}
        currentUser={currentUser}
        overallProgress={overallProgress}
        t={t}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onResetDemo={handleResetDemo}
        onSignOut={handleSignOut}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar
          activeTab={activeTab}
          mode={state.profile.mode}
          language={language}
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
          onChangeLanguage={setLanguage}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNewPlan={() => setActiveTab("planner")}
          t={t}
        />

        <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <AnimatePresence>
            {justLoggedIn && (
              <motion.div
                initial={{ opacity: 0, y: -14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={`mb-6 rounded-xl border p-4 flex items-center justify-between gap-4 ${theme.surfaceBg} ${theme.accentBorder}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 ${theme.brandBadgeBg}`}
                  >
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-display font-semibold text-slate-900 dark:text-slate-100 truncate">
                      Welcome back, {state.profile.name} · {theme.themeName}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                      {t.modes[state.profile.mode]} workspace ready · Target:{" "}
                      {state.profile.target_role}
                      {currentUser && currentUser.rank <= 3
                        ? ` · Top #${currentUser.rank} Rank Champion!`
                        : ""}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setJustLoggedIn(false)}
                  aria-label="Dismiss welcome banner"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {activeTab === "overview" && (
              <OverviewDashboard
                state={state}
                currentUser={currentUser}
                totalRankedUsers={rankedUsers.length || 1}
                overallProgress={overallProgress}
                totalCompletedItems={totalCompletedItems}
                totalItems={totalItems}
                onNavigate={setActiveTab}
                onStartQuizForSkill={handleStartQuizForSkill}
                onFocusWeek={handleFocusWeek}
                t={t}
              />
            )}

            {activeTab === "roadmap" && (
              <RoadmapView
                state={state}
                selectedWeek={selectedWeek}
                onSelectWeek={setSelectedWeek}
                onToggleCourse={handleToggleCourse}
                onToggleExercise={handleToggleExercise}
                onStartQuizForSkill={handleStartQuizForSkill}
                t={t}
              />
            )}

            {activeTab === "coach" && (
              <SkillCoachView
                profile={state.profile}
                currentUser={currentUser}
                coachPlan={state.coachPlan}
                mentorMessages={state.mentorMessages}
                language={language}
                onSaveCoachPlan={(coachPlan: SkillCoachPlan) =>
                  setState((prev) => ({ ...prev, coachPlan }))
                }
                onAddMentorMessage={(msg: MentorMessage) =>
                  setState((prev) => ({
                    ...prev,
                    mentorMessages: [...prev.mentorMessages, msg],
                  }))
                }
                onAddSkillToProfile={handleAddSkillToProfile}
                t={t}
              />
            )}

            {activeTab === "quiz" && (
              <QuizCenter
                initialSkill={quizSkill}
                defaultMode={state.profile.mode}
                language={language}
                roadmap={state.plan.roadmap}
                currentUserId={state.currentUserId}
                userSkills={state.profile.skills}
                userTargetRole={state.profile.target_role}
                onRecordAttempt={handleRecordQuizAttempt}
                onUsersUpdated={(users) => setRankedUsers(users)}
                onBackToRoadmap={() => setActiveTab("roadmap")}
                t={t}
              />
            )}

            {activeTab === "rankings" && (
              <RankingsView
                users={rankedUsers}
                currentUserId={state.currentUserId}
                mode={state.profile.mode}
                onUserAdded={(_addedUser, updatedUsers) =>
                  setRankedUsers(updatedUsers)
                }
                t={t}
              />
            )}

            {activeTab === "profile" && (
              <ProfileView
                profile={state.profile}
                currentUser={currentUser}
                onSaveProfile={handleSaveProfile}
                onChangeAvatar={handleChangeAvatar}
                onDailyCheckIn={handleDailyCheckIn}
                t={t}
              />
            )}

            {activeTab === "planner" && (
              <PlanGeneratorView
                currentProfile={state.profile}
                language={language}
                onPlanGenerated={handlePlanGenerated}
                t={t}
              />
            )}
          </motion.div>
        </main>
      </div>

      <FloatingAiAgent
        profile={state.profile}
        language={language}
        activeTab={activeTab}
      />
      </div>
    </motion.div>
  );
}
