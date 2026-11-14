import { motion } from "motion/react";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Globe,
  GraduationCap,
  KeyRound,
  Mail,
  Moon,
  Smartphone,
  Sun,
  UserCheck,
} from "lucide-react";
import { useState } from "react";
import { MODE_SEPARATED_SKILLS } from "../data/defaultWorkspace";
import {
  SUPPORTED_LANGUAGES,
  type TranslationDictionary,
} from "../i18n/translations";
import { MODE_THEMES } from "../theme/modeTheme";
import type {
  AuthProviderType,
  LanguageCode,
  LearnerMode,
  RankedUser,
} from "../types";
import { AnimatedBackdrop } from "./AnimatedBackdrop";

interface LoginPageProps {
  language: LanguageCode;
  isDark: boolean;
  onToggleTheme: () => void;
  onChangeLanguage: (lang: LanguageCode) => void;
  onAuthComplete: (user: RankedUser, isNewUser: boolean) => void;
  onDemoEnter: () => void;
  t: TranslationDictionary;
}

export function LoginPage({
  language,
  isDark,
  onToggleTheme,
  onChangeLanguage,
  onAuthComplete,
  onDemoEnter,
  t,
}: LoginPageProps) {
  const [authTab, setAuthTab] = useState<AuthProviderType>("email");
  const [step, setStep] = useState<"auth" | "profile">("auth");

  const [emailInput, setEmailInput] = useState("");
  const [mobileInput, setMobileInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [previewOtp, setPreviewOtp] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState("");

  const [googleName, setGoogleName] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");

  const [verifiedProvider, setVerifiedProvider] =
    useState<AuthProviderType>("email");
  const [name, setName] = useState("");
  const [age, setAge] = useState("21");
  const [dob, setDob] = useState("2005-05-14");
  const [mode, setMode] = useState<LearnerMode>("Student");
  const [targetRole, setTargetRole] = useState("Full-Stack Cloud Engineer");
  const [skills, setSkills] = useState(
    MODE_SEPARATED_SKILLS.Student.slice(0, 3).join(", ")
  );
  const [details, setDetails] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme = MODE_THEMES[mode];

  const handleSelectModeCard = (selectedMode: LearnerMode) => {
    setMode(selectedMode);
    setSkills(MODE_SEPARATED_SKILLS[selectedMode].slice(0, 3).join(", "));
  };

  const handleTabSwitch = (nextTab: AuthProviderType) => {
    setAuthTab(nextTab);
    setOtpSent(false);
    setPreviewOtp(null);
    setOtpInput("");
    setError(null);
  };

  const handleSendOtp = async () => {
    const target = authTab === "email" ? emailInput.trim() : mobileInput.trim();
    if (!target) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: authTab, target }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Could not send OTP.");
      }
      setOtpSent(true);
      setPreviewOtp(data.previewOtp);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = authTab === "email" ? emailInput.trim() : mobileInput.trim();
    if (!target || !otpInput.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: authTab,
          target,
          otp: otpInput.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Invalid OTP code.");
      }

      if (data.existingUser) {
        onAuthComplete(data.existingUser as RankedUser, false);
        return;
      }

      setVerifiedProvider(authTab);
      if (authTab === "email" && !name) {
        const guessed = target.split("@")[0]?.replace(/[._-]/g, " ") || "";
        setName(guessed.replace(/\b\w/g, (c) => c.toUpperCase()));
      }
      setStep("profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim() || !googleName.trim()) {
      setError("Please enter your Google name and email.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      const existing = (data.users as RankedUser[] | undefined)?.find(
        (u) => u.email?.toLowerCase() === googleEmail.trim().toLowerCase()
      );
      if (existing) {
        onAuthComplete(existing, false);
        return;
      }
      setVerifiedProvider("google");
      setName(googleName.trim());
      setEmailInput(googleEmail.trim());
      setStep("profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          age: Number(age) || 21,
          dob,
          mode,
          email:
            verifiedProvider === "email" || verifiedProvider === "google"
              ? emailInput.trim() || googleEmail.trim()
              : undefined,
          mobile:
            verifiedProvider === "mobile" ? mobileInput.trim() : undefined,
          authProvider: verifiedProvider,
          skills: skills.trim(),
          target_role: targetRole.trim(),
          details: details.trim(),
          points: 500,
          quizzesPassed: 0,
          completedExercisesCount: 0,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Could not create profile.");
      }
      onAuthComplete(data.user as RankedUser, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative min-h-screen ${theme.pageCanvas} text-slate-900 dark:text-slate-100 flex flex-col transition-colors`}
    >
      <AnimatedBackdrop mode={mode} />

      {/* Top Bar */}
      <header className="relative z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-white font-display font-bold text-sm shrink-0 ${theme.brandBadgeBg}`}
            >
              SM
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0">
              {t.brandName}
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="relative flex items-center">
              <Globe
                className="h-4 w-4 text-slate-400 dark:text-slate-500 absolute left-3 pointer-events-none"
                aria-hidden="true"
              />
              <select
                aria-label={t.common.languageLabel}
                value={language}
                onChange={(e) =>
                  onChangeLanguage(e.target.value as LanguageCode)
                }
                className="pl-9 pr-7 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
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
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </button>

            <button
              type="button"
              onClick={onDemoEnter}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              {t.auth.demoBypass}
            </button>
          </div>
        </div>
      </header>

      {/* Main Split Content */}
      <main className="relative z-10 flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="space-y-3">
            <p className={`text-xs font-semibold tracking-wide ${theme.accentText}`}>
              {t.auth.heroBadge} · {theme.themeName}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white text-balance leading-tight">
              {t.auth.heroTitle}
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {t.auth.heroSubtitle}
            </p>
          </div>

          {/* Dynamic Visual Preview Card for Selected Mode (Education / Brain AI / Company Laptop) */}
          <div className="relative h-44 sm:h-52 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900">
            <img
              key={theme.heroImage}
              src={theme.heroImage}
              alt={theme.heroAlt}
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t ${theme.heroScrim}`}
              aria-hidden="true"
            />
            <div className="relative z-10 h-full flex flex-col justify-end p-5">
              <p className="text-xs font-medium text-blue-100/90">
                {t.modes[mode]} · {theme.themeName}
              </p>
              <p className="text-sm sm:text-base font-display font-semibold text-white">
                {theme.visualTagline}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(
              [
                {
                  id: "Student" as LearnerMode,
                  icon: GraduationCap,
                },
                {
                  id: "Individual" as LearnerMode,
                  icon: UserCheck,
                },
                {
                  id: "Organization" as LearnerMode,
                  icon: Building2,
                },
              ] as const
            ).map((track) => {
              const Icon = track.icon;
              const selected = mode === track.id;
              const trackTheme = MODE_THEMES[track.id];
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelectModeCard(track.id)}
                  className={`text-left p-5 rounded-xl border transition-colors ${
                    selected
                      ? `${trackTheme.accentSoftBg} ${trackTheme.cardAccentBorder}`
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 mb-3 ${
                      selected
                        ? trackTheme.accentText
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  />
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {t.modes[track.id]}
                  </h2>
                  <p className={`text-xs font-medium mt-0.5 ${trackTheme.accentText}`}>
                    {t.modeTracks[track.id]}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {t.modeDescriptions[track.id]}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t.modes[mode]} · {t.modeTracks[mode]}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {MODE_SEPARATED_SKILLS[mode].length} skills
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              {MODE_SEPARATED_SKILLS[mode].map((skillItem) => (
                <div
                  key={skillItem}
                  className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{skillItem}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className={`lg:col-span-5 ${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8`}
        >
          {step === "auth" ? (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t.auth.signInTitle}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t.auth.signInSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => handleTabSwitch("email")}
                  className={`flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    authTab === "email"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span>{t.auth.tabs.email}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTabSwitch("mobile")}
                  className={`flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    authTab === "mobile"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5 shrink-0" />
                  <span>{t.auth.tabs.mobile}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTabSwitch("google")}
                  className={`flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    authTab === "google"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <KeyRound className="h-3.5 w-3.5 shrink-0" />
                  <span>{t.auth.tabs.google}</span>
                </button>
              </div>

              {error && (
                <div
                  role="alert"
                  className="bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 rounded-lg p-3 flex items-start gap-2 text-xs sm:text-sm text-red-800 dark:text-red-200"
                >
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {(authTab === "email" || authTab === "mobile") && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="auth-target-input"
                      className="block text-sm font-medium text-slate-800 dark:text-slate-200"
                    >
                      {authTab === "email"
                        ? t.auth.emailLabel
                        : t.auth.mobileLabel}
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="auth-target-input"
                        type={authTab === "email" ? "email" : "tel"}
                        required
                        value={authTab === "email" ? emailInput : mobileInput}
                        onChange={(e) =>
                          authTab === "email"
                            ? setEmailInput(e.target.value)
                            : setMobileInput(e.target.value)
                        }
                        placeholder={
                          authTab === "email"
                            ? t.auth.emailPlaceholder
                            : t.auth.mobilePlaceholder
                        }
                        className="flex-1 min-w-0 px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <button
                        type="button"
                        disabled={loading}
                        onClick={handleSendOtp}
                        className={`px-4 py-2.5 text-xs sm:text-sm font-medium border rounded-lg transition-colors whitespace-nowrap shrink-0 ${theme.secondaryBtn} ${theme.accentBorder}`}
                      >
                        {loading
                          ? t.auth.sendingOtp
                          : otpSent
                            ? t.auth.resendOtp
                            : t.auth.sendOtp}
                      </button>
                    </div>
                  </div>

                  {otpSent && (
                    <>
                      {previewOtp && (
                        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 rounded-lg p-3 flex items-center justify-between gap-2 text-xs text-emerald-900 dark:text-emerald-200">
                          <span>
                            {t.auth.otpSentBanner}{" "}
                            <strong className="font-mono text-sm">
                              {previewOtp}
                            </strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => setOtpInput(previewOtp)}
                            className="font-semibold text-emerald-800 dark:text-emerald-300 underline hover:no-underline whitespace-nowrap shrink-0"
                          >
                            {t.auth.autofillOtp}
                          </button>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label
                          htmlFor="auth-otp-input"
                          className="block text-sm font-medium text-slate-800 dark:text-slate-200"
                        >
                          {t.auth.otpLabel}
                        </label>
                        <input
                          id="auth-otp-input"
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          required
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                          placeholder={t.auth.otpPlaceholder}
                          className="w-full px-3.5 py-2.5 text-sm font-mono tracking-widest bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${theme.primaryBtn}`}
                      >
                        <span>
                          {loading ? t.auth.verifyingOtp : t.auth.verifyOtp}
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0" />
                      </button>
                    </>
                  )}
                </form>
              )}

              {authTab === "google" && (
                <form onSubmit={handleGoogleContinue} className="space-y-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.auth.googleHint}
                  </p>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="google-name"
                      className="block text-sm font-medium text-slate-800 dark:text-slate-200"
                    >
                      {t.auth.googleNameLabel}
                    </label>
                    <input
                      id="google-name"
                      type="text"
                      required
                      value={googleName}
                      onChange={(e) => setGoogleName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="google-email"
                      className="block text-sm font-medium text-slate-800 dark:text-slate-200"
                    >
                      {t.auth.googleEmailLabel}
                    </label>
                    <input
                      id="google-email"
                      type="email"
                      required
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      placeholder="alex.rivera@gmail.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg transition-colors"
                  >
                    <span className="font-bold text-blue-700 dark:text-blue-400">
                      G
                    </span>
                    <span>{t.auth.googleButton}</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            <form onSubmit={handleCompleteProfile} className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t.auth.completeProfileTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {t.auth.completeProfileSubtitle}
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 rounded-lg p-3 text-xs text-red-800 dark:text-red-200"
                >
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  {t.profilePage.fields.mode}
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  {(["Student", "Individual", "Organization"] as LearnerMode[]).map(
                    (m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleSelectModeCard(m)}
                        className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                          mode === m
                            ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {t.modes[m]}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="onboard-name"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  {t.profilePage.fields.name}
                </label>
                <input
                  id="onboard-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="onboard-age"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {t.profilePage.fields.age}
                  </label>
                  <input
                    id="onboard-age"
                    type="number"
                    min={10}
                    max={99}
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="onboard-dob"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {t.profilePage.fields.dob}
                  </label>
                  <input
                    id="onboard-dob"
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="onboard-role"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  {t.profilePage.fields.targetRole}
                </label>
                <input
                  id="onboard-role"
                  type="text"
                  required
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="onboard-skills"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  {t.profilePage.fields.skills}
                </label>
                <textarea
                  id="onboard-skills"
                  rows={2}
                  required
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="onboard-details"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  {t.profilePage.fields.details}
                </label>
                <input
                  id="onboard-details"
                  type="text"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="School, company team, or personal focus..."
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${theme.primaryBtn}`}
              >
                <span>{t.auth.finishSetup}</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            </form>
          )}
        </motion.section>
      </main>
    </div>
  );
}
