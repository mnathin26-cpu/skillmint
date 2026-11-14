import type { LearnerMode } from "../types";

export interface ModeThemeTokens {
  themeName: string;
  heroImage: string;
  heroAlt: string;
  visualTagline: string;
  pageCanvas: string;
  surfaceBg: string;
  sidebarBg: string;
  brandBadgeBg: string;
  primaryBtn: string;
  secondaryBtn: string;
  navActive: string;
  navActiveIcon: string;
  accentText: string;
  accentHex: string;
  secondaryHex: string;
  accentSoftBg: string;
  accentBorder: string;
  progressFill: string;
  heroScrim: string;
  ringFocus: string;
  cardAccentBorder: string;
}

export const AVATAR_PRESETS: Array<{
  id: string;
  label: string;
  mode: LearnerMode | "All";
  url: string;
}> = [
  {
    id: "avatar-default",
    label: "Classic Studio",
    mode: "All",
    url: "/src/assets/images/avatar_learner_profile_1794635815463.jpg",
  },
  {
    id: "avatar-student",
    label: "Student Scholar",
    mode: "Student",
    url: "/src/assets/images/avatar_student_scholar_1794640299900.jpg",
  },
  {
    id: "avatar-individual",
    label: "Individual Creator",
    mode: "Individual",
    url: "/src/assets/images/avatar_individual_creator_1794640300172.jpg",
  },
  {
    id: "avatar-company",
    label: "Company Leader",
    mode: "Organization",
    url: "/src/assets/images/avatar_company_executive_1794640301074.jpg",
  },
];

export const MODE_THEMES: Record<LearnerMode, ModeThemeTokens> = {
  // Education Theme for Student Development (Soft Eye-Friendly Cobalt & Slate)
  Student: {
    themeName: "Education Theme",
    heroImage: "/src/assets/images/student_education_hero_1794641955170.jpg",
    heroAlt:
      "University textbooks, algorithm notebooks, geometric ruler, and digital tablet on a sunlit study desk",
    visualTagline: "Academic Foundations, Textbooks & Brain Logic",
    pageCanvas: "bg-[#F4F7FB] dark:bg-[#0B1220]",
    surfaceBg: "bg-white/95 dark:bg-[#111B2E]/95 backdrop-blur-xs",
    sidebarBg: "bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xs",
    brandBadgeBg: "bg-blue-700 dark:bg-blue-600",
    primaryBtn:
      "bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white",
    secondaryBtn:
      "bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:hover:bg-blue-900/70 dark:text-blue-300",
    navActive:
      "bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300",
    navActiveIcon: "text-blue-700 dark:text-blue-400",
    accentText: "text-blue-700 dark:text-blue-400",
    accentHex: "#1D4ED8",
    secondaryHex: "#10B981",
    accentSoftBg: "bg-blue-50/80 dark:bg-blue-950/40",
    accentBorder: "border-blue-200 dark:border-blue-800",
    progressFill: "bg-blue-700 dark:bg-blue-500",
    heroScrim: "from-slate-950/90 via-blue-950/75 to-slate-900/40",
    ringFocus: "focus-visible:ring-blue-600",
    cardAccentBorder: "border-blue-600 dark:border-blue-500",
  },
  // Individual Theme for Personal Development (Calming Eye-Friendly Teal-Sage)
  Individual: {
    themeName: "Individual Theme",
    heroImage: "/src/assets/images/individual_brain_ai_hero_1794641955705.jpg",
    heroAlt:
      "Cognitive brain development and AI neural pathway visualization with ascending skill growth nodes",
    visualTagline: "Brain Control AI, Cognitive Mastery & Skill Growth",
    pageCanvas: "bg-[#F3F9F9] dark:bg-[#0A1618]",
    surfaceBg: "bg-white/95 dark:bg-[#102024]/95 backdrop-blur-xs",
    sidebarBg: "bg-white/95 dark:bg-[#0D1A1E]/95 backdrop-blur-xs",
    brandBadgeBg: "bg-teal-700 dark:bg-teal-600",
    primaryBtn:
      "bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white",
    secondaryBtn:
      "bg-teal-50 hover:bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:hover:bg-teal-900/70 dark:text-teal-300",
    navActive:
      "bg-teal-50 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300",
    navActiveIcon: "text-teal-700 dark:text-teal-400",
    accentText: "text-teal-700 dark:text-teal-400",
    accentHex: "#0F766E",
    secondaryHex: "#0EA5E9",
    accentSoftBg: "bg-teal-50/80 dark:bg-teal-950/40",
    accentBorder: "border-teal-200 dark:border-teal-800",
    progressFill: "bg-teal-700 dark:bg-teal-500",
    heroScrim: "from-slate-950/90 via-teal-950/70 to-slate-900/35",
    ringFocus: "focus-visible:ring-teal-600",
    cardAccentBorder: "border-teal-600 dark:border-teal-500",
  },
  // Company Theme for Enterprise & Team Development (Balanced Stone-Indigo)
  Organization: {
    themeName: "Company Theme",
    heroImage: "/src/assets/images/company_laptop_hero_1794641956321.jpg",
    heroAlt:
      "Modern corporate glass office workspace with an open silver laptop showing live analytics dashboards",
    visualTagline: "Enterprise Laptop Workspace, Cloud Governance & Team KPIs",
    pageCanvas: "bg-[#F5F6FA] dark:bg-[#0C101B]",
    surfaceBg: "bg-white/95 dark:bg-[#141A2B]/95 backdrop-blur-xs",
    sidebarBg: "bg-white/95 dark:bg-[#101524]/95 backdrop-blur-xs",
    brandBadgeBg: "bg-indigo-700 dark:bg-indigo-600",
    primaryBtn:
      "bg-indigo-700 hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white",
    secondaryBtn:
      "bg-indigo-50 hover:bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/70 dark:text-indigo-300",
    navActive:
      "bg-indigo-50 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300",
    navActiveIcon: "text-indigo-700 dark:text-indigo-400",
    accentText: "text-indigo-700 dark:text-indigo-400",
    accentHex: "#4338CA",
    secondaryHex: "#8B5CF6",
    accentSoftBg: "bg-indigo-50/80 dark:bg-indigo-950/40",
    accentBorder: "border-indigo-200 dark:border-indigo-800",
    progressFill: "bg-indigo-700 dark:bg-indigo-500",
    heroScrim: "from-slate-950/90 via-indigo-950/75 to-slate-900/40",
    ringFocus: "focus-visible:ring-indigo-600",
    cardAccentBorder: "border-indigo-600 dark:border-indigo-500",
  },
};
