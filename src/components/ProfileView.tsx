import {
  Award,
  Brain,
  CalendarCheck,
  Camera,
  CheckCircle2,
  Plus,
  Save,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MODE_SEPARATED_SKILLS } from "../data/defaultWorkspace";
import type { TranslationDictionary } from "../i18n/translations";
import { AVATAR_PRESETS, MODE_THEMES } from "../theme/modeTheme";
import type { LearnerMode, LearnerProfile, RankedUser } from "../types";
import { ModeVisualBanner } from "./ModeVisualBanner";
import { SkillDevelopmentChart } from "./SkillDevelopmentChart";

interface ProfileViewProps {
  profile: LearnerProfile;
  currentUser: RankedUser | null;
  onSaveProfile: (updated: LearnerProfile) => Promise<void>;
  onChangeAvatar: (avatarUrl: string) => Promise<void>;
  onDailyCheckIn: () => Promise<void>;
  t: TranslationDictionary;
}

export function ProfileView({
  profile,
  currentUser,
  onSaveProfile,
  onChangeAvatar,
  onDailyCheckIn,
  t,
}: ProfileViewProps) {
  const [form, setForm] = useState<LearnerProfile>(profile);
  const [saving, setSaving] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);
  const [dailyChecking, setDailyChecking] = useState(false);
  const [dailyNotice, setDailyNotice] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setForm(profile);
    setImgError(false);
  }, [profile]);

  const theme = MODE_THEMES[form.mode];
  const currentAvatar =
    form.avatarUrl || currentUser?.avatarUrl || AVATAR_PRESETS[0].url;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedBanner(false);
    try {
      await onSaveProfile(form);
      setSavedBanner(true);
    } finally {
      setSaving(false);
    }
  };

  const handleSelectPresetAvatar = async (url: string) => {
    setImgError(false);
    setForm((prev) => ({ ...prev, avatarUrl: url }));
    await onChangeAvatar(url);
  };

  const handleUploadAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        setImgError(false);
        setForm((prev) => ({ ...prev, avatarUrl: reader.result as string }));
        await onChangeAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDailyUpdateClick = async () => {
    setDailyChecking(true);
    setDailyNotice(null);
    try {
      await onDailyCheckIn();
      setDailyNotice(
        "Daily skill update applied! Skill points, brain score, and streak updated."
      );
    } finally {
      setDailyChecking(false);
    }
  };

  const handleAddCatalogSkill = (skillName: string) => {
    const existingList = form.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (
      existingList.some((s) => s.toLowerCase() === skillName.toLowerCase())
    ) {
      return;
    }
    setForm((prev) => ({
      ...prev,
      skills: [...existingList, skillName].join(", "),
    }));
  };

  const inputClass = `w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 ${theme.ringFocus} transition-colors`;

  return (
    <div className="space-y-6">
      <ModeVisualBanner
        mode={form.mode}
        title={t.profilePage.title}
        subtitle={t.profilePage.subtitle}
      />

      {/* Top Row: Profile Avatar & Editable Form + Down/Below Rank & Daily Skill Points */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          {/* Profile Image Switcher + Personal Details Card */}
          <form
            onSubmit={handleSubmit}
            className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5 transition-colors`}
          >
            {/* Profile Avatar Header & Upload/Preset Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                {!imgError ? (
                  <img
                    src={currentAvatar}
                    alt={form.name}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="h-16 w-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shrink-0"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-lg font-bold text-slate-700 dark:text-slate-200 shrink-0">
                    {form.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-base font-display font-semibold text-slate-900 dark:text-slate-100">
                    {form.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.modes[form.mode]} · {form.target_role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadAvatarFile}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Upload className="h-3.5 w-3.5 shrink-0" />
                  <span>Upload Photo</span>
                </button>
              </div>
            </div>

            {/* Studio Avatar Presets */}
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                <Camera className="h-3.5 w-3.5 shrink-0" />
                <span>Choose Profile Image</span>
              </span>
              <div className="flex flex-wrap gap-2.5">
                {AVATAR_PRESETS.map((preset) => {
                  const isActive = currentAvatar === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPresetAvatar(preset.url)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
                        isActive
                          ? `${theme.accentSoftBg} ${theme.cardAccentBorder} ${theme.accentText}`
                          : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        referrerPolicy="no-referrer"
                        className="h-6 w-6 rounded-full object-cover shrink-0"
                      />
                      <span>{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {savedBanner && (
              <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3.5 flex items-center gap-2 text-sm text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t.profilePage.savedNotice}</span>
              </div>
            )}

            {/* Track Mode */}
            <div className="space-y-2">
              <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                {t.profilePage.fields.mode}
              </span>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                {(["Student", "Individual", "Organization"] as LearnerMode[]).map(
                  (m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, mode: m }))}
                      className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                        form.mode === m
                          ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      {t.modes[m]}
                    </button>
                  )
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <span className={`font-medium ${theme.accentText}`}>
                  {MODE_THEMES[form.mode].themeName}
                </span>{" "}
                · {t.modeTracks[form.mode]} — {t.modeDescriptions[form.mode]}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                  {t.profilePage.fields.name}
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                  {t.profilePage.fields.age}
                </label>
                <input
                  type="number"
                  min={10}
                  max={99}
                  required
                  value={form.age}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      age: Number(e.target.value) || 18,
                    }))
                  }
                  className={`${inputClass} font-mono tabular-nums`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                  {t.profilePage.fields.dob}
                </label>
                <input
                  type="date"
                  required
                  value={form.dob}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, dob: e.target.value }))
                  }
                  className={`${inputClass} font-mono tabular-nums`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                  {t.profilePage.fields.email}
                </label>
                <input
                  type="email"
                  value={form.email ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                  {t.profilePage.fields.mobile}
                </label>
                <input
                  type="tel"
                  value={form.mobile ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, mobile: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                {t.profilePage.fields.targetRole}
              </label>
              <input
                type="text"
                required
                value={form.target_role}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, target_role: e.target.value }))
                }
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                {t.profilePage.fields.skills}
              </label>
              <textarea
                rows={2}
                required
                value={form.skills}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, skills: e.target.value }))
                }
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                {t.profilePage.fields.projects}
              </label>
              <input
                type="text"
                value={form.projects}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, projects: e.target.value }))
                }
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                {t.profilePage.fields.details}
              </label>
              <textarea
                rows={3}
                value={form.details}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, details: e.target.value }))
                }
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg disabled:opacity-60 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${theme.primaryBtn} ${theme.ringFocus}`}
            >
              <Save className="h-4 w-4 shrink-0" />
              <span>{t.actions.saveProfile}</span>
            </button>
          </form>

          {/* Directly Below Profile Form: Rank, Skill Points & Daily Auto-Update */}
          <section
            className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4 transition-colors`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Award className={`h-5 w-5 shrink-0 ${theme.accentText}`} />
                <div>
                  <h2 className="text-base font-display font-semibold text-slate-900 dark:text-slate-100">
                    {t.profilePage.rankCardTitle} · Daily Skill Points
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Updates automatically every day · Last updated{" "}
                    <span className="font-mono tabular-nums">
                      {currentUser?.lastDailyUpdate ?? new Date().toISOString().slice(0, 10)}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={dailyChecking}
                onClick={handleDailyUpdateClick}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${theme.secondaryBtn}`}
              >
                <CalendarCheck className="h-4 w-4 shrink-0" />
                <span>
                  {dailyChecking ? "Updating..." : "Daily Skill Check-in (+15 pts)"}
                </span>
              </button>
            </div>

            {dailyNotice && (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 text-xs text-emerald-800 dark:text-emerald-300">
                {dailyNotice}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.rankings.tableHeaders.rank}
                </p>
                <p className="mt-1 text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                  #{currentUser?.rank ?? 1}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.profilePage.pointsLabel}
                </p>
                <p
                  className={`mt-1 text-2xl font-bold font-mono tabular-nums ${theme.accentText}`}
                >
                  {currentUser?.points ?? 500}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Brain Score
                </p>
                <p className="mt-1 text-2xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <Brain className="h-5 w-5 shrink-0" />
                  <span>{currentUser?.brainScore ?? 80}</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Daily Streak
                </p>
                <p className="mt-1 text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                  {currentUser?.dailyStreak ?? 1}d
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right: Mode-Separated Skills Catalog + Graphic Skill Diagram */}
        <div className="lg:col-span-5 space-y-6">
          <section
            className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4 transition-colors`}
          >
            <div>
              <h2 className="text-base font-display font-semibold text-slate-900 dark:text-slate-100">
                {t.modes[form.mode]} · {t.profilePage.modeSkillsTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.profilePage.modeSkillsDesc}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              {MODE_SEPARATED_SKILLS[form.mode].map((sk) => (
                <button
                  key={sk}
                  type="button"
                  onClick={() => handleAddCatalogSkill(sk)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                >
                  <Plus className={`h-3.5 w-3.5 shrink-0 ${theme.accentText}`} />
                  <span>{sk}</span>
                </button>
              ))}
            </div>
          </section>

          <SkillDevelopmentChart
            mode={form.mode}
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
            compact
          />
        </div>
      </div>
    </div>
  );
}
