import { useState } from "react";
import { MODE_THEMES } from "../theme/modeTheme";
import type { LearnerMode } from "../types";

interface ModeVisualBannerProps {
  mode: LearnerMode;
  eyebrow?: string;
  title: string;
  subtitle: string;
  rightSlot?: React.ReactNode;
}

export function ModeVisualBanner({
  mode,
  eyebrow,
  title,
  subtitle,
  rightSlot,
}: ModeVisualBannerProps) {
  const [imgError, setImgError] = useState(false);
  const theme = MODE_THEMES[mode];

  return (
    <section className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900">
      {!imgError ? (
        <img
          src={theme.heroImage}
          alt={theme.heroAlt}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950"
          aria-hidden="true"
        />
      )}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${theme.heroScrim}`}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 sm:px-7 sm:py-6">
        <div className="max-w-2xl space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-blue-100/90">
            <span>{theme.themeName}</span>
            <span aria-hidden="true">·</span>
            <span>{eyebrow || theme.visualTagline}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-white text-balance">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
      </div>
    </section>
  );
}
