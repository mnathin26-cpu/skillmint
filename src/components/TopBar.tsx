import { Globe, Menu, Moon, Plus, Sun } from "lucide-react";
import {
  SUPPORTED_LANGUAGES,
  type TranslationDictionary,
} from "../i18n/translations";
import { MODE_THEMES } from "../theme/modeTheme";
import type { LanguageCode, LearnerMode, WorkspaceTab } from "../types";

interface TopBarProps {
  activeTab: WorkspaceTab;
  mode: LearnerMode;
  language: LanguageCode;
  isDark: boolean;
  onToggleTheme: () => void;
  onChangeLanguage: (lang: LanguageCode) => void;
  onOpenMobileMenu: () => void;
  onNewPlan: () => void;
  t: TranslationDictionary;
}

export function TopBar({
  activeTab,
  mode,
  language,
  isDark,
  onToggleTheme,
  onChangeLanguage,
  onOpenMobileMenu,
  onNewPlan,
  t,
}: TopBarProps) {
  const currentSectionLabel = t.nav[activeTab];
  const theme = MODE_THEMES[mode];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-8 h-16 max-w-[1440px] mx-auto">
        {/* Left: Mobile toggle + Breadcrumb + Active Mode Theme Indicator */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
            className={`lg:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 ${theme.ringFocus}`}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 text-sm min-w-0">
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline whitespace-nowrap shrink-0">
              {t.workspaceLabel}
            </span>
            <span
              className="text-slate-300 dark:text-slate-700 hidden sm:inline shrink-0"
              aria-hidden="true"
            >
              /
            </span>
            <span className="font-display font-semibold text-slate-900 dark:text-slate-100 truncate">
              {currentSectionLabel}
            </span>
            <span
              className="text-slate-300 dark:text-slate-700 hidden md:inline shrink-0"
              aria-hidden="true"
            >
              ·
            </span>
            <span
              className={`hidden md:inline text-xs font-medium whitespace-nowrap shrink-0 ${theme.accentText}`}
            >
              {theme.themeName}
            </span>
          </div>
        </div>

        {/* Right: Language selector + Theme Toggle + Primary CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="relative flex items-center">
            <Globe
              className="h-4 w-4 text-slate-400 dark:text-slate-500 absolute left-3 pointer-events-none"
              aria-hidden="true"
            />
            <select
              aria-label={t.common.languageLabel}
              value={language}
              onChange={(e) => onChangeLanguage(e.target.value as LanguageCode)}
              className="pl-9 pr-7 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer transition-colors"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeLabel}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light Mode" : "Dark Mode"}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          <button
            type="button"
            onClick={onNewPlan}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${theme.primaryBtn} ${theme.ringFocus}`}
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{t.actions.newPlan}</span>
            <span className="sm:hidden">{t.nav.planner}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
