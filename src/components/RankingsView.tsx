import { motion } from "motion/react";
import { Award, Medal, Plus, Sparkles, Trophy, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MODE_SEPARATED_SKILLS } from "../data/defaultWorkspace";
import type { TranslationDictionary } from "../i18n/translations";
import { MODE_THEMES } from "../theme/modeTheme";
import type { LearnerMode, RankedUser } from "../types";
import { ModeVisualBanner } from "./ModeVisualBanner";
import { RankCelebrationBlast } from "./RankCelebrationBlast";

interface RankingsViewProps {
  users: RankedUser[];
  currentUserId: string | null;
  mode: LearnerMode;
  onUserAdded: (user: RankedUser, users: RankedUser[]) => void;
  t: TranslationDictionary;
}

export function RankingsView({
  users,
  currentUserId,
  mode,
  onUserAdded,
  t,
}: RankingsViewProps) {
  const [filterMode, setFilterMode] = useState<LearnerMode | "all">("all");
  const [showAddForm, setShowAddForm] = useState(false);

  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("22");
  const [newDob, setNewDob] = useState("2004-06-15");
  const [newMode, setNewMode] = useState<LearnerMode>("Student");
  const [newRole, setNewRole] = useState("Full-Stack Developer");
  const [newSkills, setNewSkills] = useState(
    MODE_SEPARATED_SKILLS.Student.slice(0, 3).join(", ")
  );
  const [newDetails, setNewDetails] = useState("");
  const [newPoints, setNewPoints] = useState("700");
  const [submitting, setSubmitting] = useState(false);

  // Blast animation state for Rank 1, 2, 3 podium celebration
  const [blastKey, setBlastKey] = useState(1);
  const [blastFocus, setBlastFocus] = useState<1 | 2 | 3 | "all">("all");

  const theme = MODE_THEMES[mode];

  useEffect(() => {
    setBlastFocus("all");
    setBlastKey((k) => k + 1);
  }, []);

  const triggerBlast = (focus: 1 | 2 | 3 | "all") => {
    setBlastFocus(focus);
    setBlastKey((k) => k + 1);
  };

  const filteredUsers =
    filterMode === "all"
      ? users
      : users.filter((u) => u.mode === filterMode);

  const topThree = users.slice(0, 3);

  const handleModeChange = (m: LearnerMode) => {
    setNewMode(m);
    setNewSkills(MODE_SEPARATED_SKILLS[m].slice(0, 3).join(", "));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          age: Number(newAge) || 22,
          dob: newDob,
          mode: newMode,
          target_role: newRole.trim(),
          skills: newSkills.trim(),
          details: newDetails.trim(),
          points: Number(newPoints) || 500,
          quizzesPassed: Math.max(
            1,
            Math.floor((Number(newPoints) || 500) / 140)
          ),
        }),
      });
      const data = await response.json();
      if (response.ok && data.user && data.users) {
        onUserAdded(data.user as RankedUser, data.users as RankedUser[]);
        if (data.user.rank <= 3) {
          triggerBlast(data.user.rank as 1 | 2 | 3);
        }
        setNewName("");
        setNewDetails("");
        setShowAddForm(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const podiumStyles: Record<
    number,
    { border: string; iconColor: string; label: string }
  > = {
    1: {
      border: "border-amber-300 dark:border-amber-700",
      iconColor: "text-amber-500",
      label: "Rank #1 Champion",
    },
    2: {
      border: "border-slate-300 dark:border-slate-600",
      iconColor: "text-slate-400 dark:text-slate-300",
      label: "Rank #2 Leader",
    },
    3: {
      border: "border-orange-300 dark:border-orange-800",
      iconColor: "text-orange-600 dark:text-orange-400",
      label: "Rank #3 Achiever",
    },
  };

  return (
    <div className="space-y-6">
      <RankCelebrationBlast triggerKey={blastKey} rankFocus={blastFocus} />

      <ModeVisualBanner
        mode={mode}
        title={t.rankings.title}
        subtitle={t.rankings.subtitle}
        rightSlot={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => triggerBlast("all")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-amber-950 bg-amber-300 hover:bg-amber-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>Celebrate Top 3</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddForm((prev) => !prev)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
            >
              {showAddForm ? (
                <X className="h-4 w-4 shrink-0" />
              ) : (
                <Plus className="h-4 w-4 shrink-0" />
              )}
              <span>{t.actions.addUser}</span>
            </button>
          </div>
        }
      />

      {/* Top 3 Rank Celebration Podium */}
      {topThree.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topThree.map((leader, idx) => {
            const style = podiumStyles[leader.rank] ?? podiumStyles[3];
            const isMe = leader.id === currentUserId;
            return (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.28,
                  delay: idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() => triggerBlast(leader.rank as 1 | 2 | 3)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    triggerBlast(leader.rank as 1 | 2 | 3);
                  }
                }}
                className={`cursor-pointer ${theme.surfaceBg} border ${style.border} rounded-xl p-5 flex flex-col justify-between gap-4 hover:shadow-sm transition-shadow`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span className="font-mono">#{leader.rank}</span>
                      <span aria-hidden="true">·</span>
                      <span>{style.label}</span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {leader.name}{" "}
                      {isMe && (
                        <span className={`text-xs font-semibold ${theme.accentText}`}>
                          ({t.rankings.youBadge})
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {t.modes[leader.mode]} · {leader.target_role}
                    </p>
                  </div>
                  {leader.rank === 1 ? (
                    <Trophy className={`h-6 w-6 shrink-0 ${style.iconColor}`} />
                  ) : (
                    <Medal className={`h-6 w-6 shrink-0 ${style.iconColor}`} />
                  )}
                </div>

                <div className="flex items-baseline justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {leader.points} {t.common.pts}
                  </span>
                  <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {leader.quizzesPassed} {t.rankings.quizzesLabel}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </section>
      )}

      {/* Add Another User Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddUser}
          className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5`}
        >
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              {t.rankings.addUserTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.rankings.addUserSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                {t.profilePage.fields.name}
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Ananya Verma"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                {t.profilePage.fields.mode}
              </label>
              <select
                value={newMode}
                onChange={(e) => handleModeChange(e.target.value as LearnerMode)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Student">{t.modes.Student}</option>
                <option value="Individual">{t.modes.Individual}</option>
                <option value="Organization">{t.modes.Organization}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                {t.profilePage.fields.age}
              </label>
              <input
                type="number"
                min={10}
                max={99}
                required
                value={newAge}
                onChange={(e) => setNewAge(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                {t.profilePage.fields.dob}
              </label>
              <input
                type="date"
                required
                value={newDob}
                onChange={(e) => setNewDob(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                {t.profilePage.fields.targetRole}
              </label>
              <input
                type="text"
                required
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                {t.profilePage.fields.skills}
              </label>
              <input
                type="text"
                required
                value={newSkills}
                onChange={(e) => setNewSkills(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                {t.profilePage.pointsLabel}
              </label>
              <input
                type="number"
                min={0}
                max={5000}
                required
                value={newPoints}
                onChange={(e) => setNewPoints(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              {t.profilePage.fields.details}
            </label>
            <input
              type="text"
              value={newDetails}
              onChange={(e) => setNewDetails(e.target.value)}
              placeholder="College major, company department, or learning focus..."
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg ${theme.primaryBtn}`}
            >
              {t.actions.addUser}
            </button>
          </div>
        </form>
      )}

      {/* Track Filter Segmented Controls */}
      <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
        {(["all", "Student", "Individual", "Organization"] as const).map(
          (tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterMode(tab)}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                filterMode === tab
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab === "all" ? t.rankings.filterAll : t.modes[tab]}
            </button>
          )
        )}
      </div>

      {/* Leaderboard Table */}
      <section className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-5">{t.rankings.tableHeaders.rank}</th>
                <th className="py-3.5 px-4">{t.rankings.tableHeaders.learner}</th>
                <th className="py-3.5 px-4">{t.rankings.tableHeaders.track}</th>
                <th className="py-3.5 px-4">{t.rankings.tableHeaders.ageDob}</th>
                <th className="py-3.5 px-4">{t.rankings.tableHeaders.skills}</th>
                <th className="py-3.5 px-5 text-right">
                  {t.rankings.tableHeaders.points}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {filteredUsers.map((user) => {
                const isMe = user.id === currentUserId;
                const isTop3 = user.rank <= 3;
                return (
                  <tr
                    key={user.id}
                    onClick={
                      isTop3
                        ? () => triggerBlast(user.rank as 1 | 2 | 3)
                        : undefined
                    }
                    className={`transition-colors ${
                      isTop3 ? "cursor-pointer" : ""
                    } ${
                      isMe
                        ? theme.accentSoftBg
                        : "hover:bg-slate-50/70 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <td className="py-4 px-5 font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        {user.rank === 1 ? (
                          <Trophy className="h-4 w-4 text-amber-500 shrink-0" />
                        ) : user.rank === 2 ? (
                          <Medal className="h-4 w-4 text-slate-400 shrink-0" />
                        ) : user.rank === 3 ? (
                          <Award className="h-4 w-4 text-orange-600 shrink-0" />
                        ) : null}
                        #{user.rank}
                      </span>
                    </td>

                    <td className="py-4 px-4 min-w-[220px]">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-bold shrink-0">
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {user.name}
                            </span>
                            {isMe && (
                              <span className={`text-xs font-semibold ${theme.accentText}`}>
                                ({t.rankings.youBadge})
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[240px]">
                            {user.target_role}
                            {user.details ? ` · ${user.details}` : ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200 block">
                        {t.modes[user.mode]}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {t.modeTracks[user.mode]}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono tabular-nums text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      <span>{user.age} yrs</span>
                      <span className="block text-slate-400 dark:text-slate-500">
                        {user.dob}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-600 dark:text-slate-300 max-w-[260px]">
                      <p className="line-clamp-2">{user.skills}</p>
                    </td>

                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                        {user.points} {t.common.pts}
                      </span>
                      <span className="block text-xs font-mono tabular-nums text-slate-400 dark:text-slate-500">
                        {user.quizzesPassed} {t.rankings.quizzesLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
