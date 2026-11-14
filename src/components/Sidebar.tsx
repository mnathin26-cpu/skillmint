import {
  BookOpen,
  CheckSquare,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import type { TranslationDictionary } from "../i18n/translations";
import { MODE_THEMES } from "../theme/modeTheme";
import type { LearnerProfile, RankedUser, WorkspaceTab } from "../types";

interface SidebarProps {
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  profile: LearnerProfile;
  currentUser: RankedUser | null;
  overallProgress: number;
  t: TranslationDictionary;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onResetDemo: () => void;
  onSignOut: () => void;
}

const DEFAULT_AVATAR =
  "/src/assets/images/avatar_learner_profile_1794635815463.jpg";

export function Sidebar({
  activeTab,
  onSelectTab,
  profile,
  currentUser,
  overallProgress,
  t,
  mobileOpen,
  onCloseMobile,
  onResetDemo,
  onSignOut,
}: SidebarProps) {
  const [imgError, setImgError] = useState(false);
  const theme = MODE_THEMES[profile.mode];
  const avatarSrc =
    profile.avatarUrl || currentUser?.avatarUrl || DEFAULT_AVATAR;

  const navItems: Array<{
    id: WorkspaceTab;
    label: string;
    icon: typeof LayoutDashboard;
  }> = [
    { id: "overview", label: t.nav.overview, icon: LayoutDashboard },
    { id: "roadmap", label: t.nav.roadmap, icon: BookOpen },
    { id: "coach", label: t.nav.coach, icon: Sparkles },
    { id: "quiz", label: t.nav.quiz, icon: CheckSquare },
    { id: "rankings", label: t.nav.rankings, icon: Trophy },
    { id: "profile", label: t.nav.profile, icon: User },
    { id: "planner", label: t.nav.planner, icon: PlusCircle },
  ];

  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const handleNavClick = (tab: WorkspaceTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const sidebarContent = (
    <div
      className={`flex h-full flex-col justify-between ${theme.sidebarBg} border-r border-slate-200 dark:border-slate-800 px-4 py-5 overflow-y-auto transition-colors`}
    >
      <div>
        <div className="flex items-center justify-between px-2 pb-6">
          <button
            type="button"
            onClick={() => handleNavClick("overview")}
            className={`flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 rounded-md ${theme.ringFocus}`}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-white font-display font-bold text-sm shrink-0 ${theme.brandBadgeBg}`}
            >
              SM
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0">
              {t.brandName}
            </span>
          </button>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="lg:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Primary" className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 ${theme.ringFocus} ${
                  isActive
                    ? theme.navActive
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive
                      ? theme.navActiveIcon
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 px-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {t.overview.kpis.roadmapProgress}
            </span>
            <span className="font-mono tabular-nums font-medium text-slate-900 dark:text-slate-100">
              {overallProgress}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-[width] duration-300 ${theme.progressFill}`}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 truncate">
            {t.modes[profile.mode]} · {theme.themeName}
          </p>
        </div>
      </div>

      {/* User Profile + Rank & Skill Points Displayed Right Below Profile */}
      <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
        <button
          type="button"
          onClick={() => handleNavClick("profile")}
          className="w-full flex flex-col gap-2.5 px-2.5 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/70 text-left transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            {!imgError ? (
              <img
                src={avatarSrc}
                alt={profile.name}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shrink-0">
                {initials || "SM"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                {profile.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {t.modes[profile.mode]} · {profile.target_role}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs font-mono tabular-nums">
            <div>
              <span className="block text-[10px] font-sans text-slate-400 dark:text-slate-500">
                Rank
              </span>
              <span className={`font-bold ${theme.accentText}`}>
                #{currentUser?.rank ?? 1}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-sans text-slate-400 dark:text-slate-500">
                Skill Pts
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {currentUser?.points ?? 500}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-sans text-slate-400 dark:text-slate-500">
                Daily
              </span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {currentUser?.dailyStreak ?? 1}d
              </span>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={onSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <LogOut className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{t.actions.signOut}</span>
        </button>

        <button
          type="button"
          onClick={onResetDemo}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{t.actions.resetProgress}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[82vw] h-full z-10">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
