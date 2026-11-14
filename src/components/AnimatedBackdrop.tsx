import { motion, useReducedMotion } from "motion/react";
import { MODE_THEMES } from "../theme/modeTheme";
import type { LearnerMode } from "../types";

interface AnimatedBackdropProps {
  mode: LearnerMode;
}

export function AnimatedBackdrop({ mode }: AnimatedBackdropProps) {
  const prefersReducedMotion = useReducedMotion();
  const theme = MODE_THEMES[mode];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Ambient Orbital Layer 1 */}
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: [0, 36, -24, 0],
                y: [0, -28, 22, 0],
                scale: [1, 1.07, 0.96, 1],
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-28 -left-24 w-[440px] h-[440px] rounded-full opacity-[0.16] dark:opacity-[0.22] blur-3xl will-change-transform"
        style={{ backgroundColor: theme.accentHex }}
      />

      {/* Ambient Orbital Layer 2 */}
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: [0, -40, 26, 0],
                y: [0, 32, -20, 0],
                scale: [1, 0.95, 1.08, 1],
              }
        }
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 -right-28 w-[480px] h-[480px] rounded-full opacity-[0.14] dark:opacity-[0.19] blur-3xl will-change-transform"
        style={{ backgroundColor: theme.secondaryHex }}
      />

      {/* Ambient Orbital Layer 3 */}
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: [0, 28, -32, 0],
                y: [0, -24, 18, 0],
                scale: [1, 1.05, 0.98, 1],
              }
        }
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-32 left-1/3 w-[420px] h-[420px] rounded-full opacity-[0.12] dark:opacity-[0.17] blur-3xl will-change-transform"
        style={{ backgroundColor: theme.accentHex }}
      />

      {/* Subtle Mode-Themed Geometric SVG Motion Lattice */}
      <motion.svg
        viewBox="0 0 1200 800"
        className="absolute inset-0 w-full h-full opacity-[0.14] dark:opacity-[0.18] will-change-transform"
        animate={
          prefersReducedMotion
            ? undefined
            : {
                rotate: [0, 2.5, -2.5, 0],
                scale: [1, 1.02, 1],
              }
        }
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <defs>
          <radialGradient id={`mesh-${mode}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={theme.accentHex} stopOpacity="0.45" />
            <stop offset="100%" stopColor={theme.secondaryHex} stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="180" r="140" fill={`url(#mesh-${mode})`} />
        <circle cx="980" cy="600" r="170" fill={`url(#mesh-${mode})`} />

        {mode === "Student" && (
          <g fill="none" stroke={theme.accentHex} strokeWidth="1.2" strokeOpacity="0.35">
            <circle cx="960" cy="170" r="90" strokeDasharray="6 8" />
            <circle cx="960" cy="170" r="130" strokeOpacity="0.2" />
            <polygon points="180,620 240,520 300,620" strokeOpacity="0.3" />
            <rect x="860" y="540" width="84" height="84" rx="14" strokeOpacity="0.22" />
          </g>
        )}

        {mode === "Individual" && (
          <g fill="none" stroke={theme.accentHex} strokeWidth="1.3" strokeOpacity="0.35">
            <path d="M 140 240 Q 420 120 740 280 T 1120 220" strokeDasharray="8 6" />
            <path d="M 120 560 Q 480 420 820 580 T 1100 500" strokeOpacity="0.25" />
            <circle cx="420" cy="195" r="7" fill={theme.secondaryHex} fillOpacity="0.4" />
            <circle cx="740" cy="280" r="9" fill={theme.accentHex} fillOpacity="0.35" />
            <circle cx="820" cy="580" r="7" fill={theme.secondaryHex} fillOpacity="0.4" />
          </g>
        )}

        {mode === "Organization" && (
          <g fill="none" stroke={theme.accentHex} strokeWidth="1.2" strokeOpacity="0.3">
            <rect x="820" y="110" width="210" height="130" rx="18" />
            <rect x="850" y="140" width="150" height="70" rx="10" strokeDasharray="5 5" />
            <rect x="130" y="500" width="190" height="120" rx="16" strokeOpacity="0.25" />
            <line x1="320" y1="560" x2="820" y2="175" strokeDasharray="6 10" strokeOpacity="0.2" />
          </g>
        )}
      </motion.svg>
    </div>
  );
}
