import { Brain, TrendingUp } from "lucide-react";
import { useState } from "react";
import { MODE_THEMES } from "../theme/modeTheme";
import type {
  LearnerMode,
  SkillHistoryPoint,
  SkillRadarMetrics,
} from "../types";

interface SkillDevelopmentChartProps {
  mode: LearnerMode;
  history: SkillHistoryPoint[];
  radar: SkillRadarMetrics;
  brainScore: number;
  points: number;
  dailyStreak: number;
  compact?: boolean;
}

const DEFAULT_HISTORY: SkillHistoryPoint[] = [
  { date: "2026-11-07", label: "Nov 7", points: 620, brainScore: 68 },
  { date: "2026-11-08", label: "Nov 8", points: 650, brainScore: 70 },
  { date: "2026-11-09", label: "Nov 9", points: 685, brainScore: 73 },
  { date: "2026-11-10", label: "Nov 10", points: 710, brainScore: 75 },
  { date: "2026-11-11", label: "Nov 11", points: 735, brainScore: 78 },
  { date: "2026-11-12", label: "Nov 12", points: 760, brainScore: 80 },
  { date: "2026-11-13", label: "Nov 13", points: 780, brainScore: 82 },
];

export function SkillDevelopmentChart({
  mode,
  history,
  radar,
  brainScore,
  points,
  dailyStreak,
  compact = false,
}: SkillDevelopmentChartProps) {
  const theme = MODE_THEMES[mode];
  const series = history && history.length >= 2 ? history : DEFAULT_HISTORY;
  const [hoveredIdx, setHoveredIdx] = useState<number>(series.length - 1);

  // Line Chart SVG coordinates
  const width = 520;
  const height = 190;
  const padX = 28;
  const padY = 24;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;

  const minPts = Math.min(...series.map((s) => s.points)) - 40;
  const maxPts = Math.max(...series.map((s) => s.points)) + 40;
  const ptsSpan = Math.max(maxPts - minPts, 60);

  const coords = series.map((item, idx) => {
    const x =
      padX + (series.length > 1 ? (idx / (series.length - 1)) * plotW : plotW / 2);
    const y = padY + plotH - ((item.points - minPts) / ptsSpan) * plotH;
    const brainY = padY + plotH - (Math.min(100, Math.max(0, item.brainScore)) / 100) * plotH;
    return { ...item, x, y, brainY };
  });

  const linePath = coords
    .map((c, idx) => `${idx === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${(
    padY + plotH
  ).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(padY + plotH).toFixed(1)} Z`;

  const brainPath = coords
    .map((c, idx) => `${idx === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.brainY.toFixed(1)}`)
    .join(" ");

  const activePoint = coords[Math.min(hoveredIdx, coords.length - 1)] ?? coords[coords.length - 1];

  // 5-Axis Radar SVG coordinates
  const radarDims = [
    { key: "Foundations", value: radar.foundations },
    { key: "Brain Logic", value: radar.brainLogic },
    { key: "Practical Labs", value: radar.practicalLabs },
    { key: "Quiz Accuracy", value: radar.quizAccuracy },
    { key: "Consistency", value: radar.consistency },
  ];

  const cx = 120;
  const cy = 112;
  const maxR = 76;

  const polarToXY = (angleIdx: number, pct: number) => {
    const angle = (-Math.PI / 2) + (angleIdx * 2 * Math.PI) / radarDims.length;
    const r = (pct / 100) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const radarPolyPoints = radarDims
    .map((dim, idx) => {
      const p = polarToXY(idx, Math.min(100, Math.max(20, dim.value)));
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <section
      className={`${theme.surfaceBg} border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5 transition-colors`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className={`h-4 w-4 shrink-0 ${theme.accentText}`} />
            <h2 className="text-base sm:text-lg font-display font-semibold text-slate-900 dark:text-slate-100">
              Skill &amp; Brain Development Diagram
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Live 7-day growth curve &amp; 5-axis skill competency radar ({theme.themeName})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono tabular-nums">
          <div className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-xs shrink-0"
              style={{ backgroundColor: theme.accentHex }}
            />
            <span className="text-slate-600 dark:text-slate-300">
              {points} pts
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Brain className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-slate-600 dark:text-slate-300">
              Brain {brainScore}/100
            </span>
          </div>
          <span className="text-slate-500 dark:text-slate-400">
            {dailyStreak}d streak
          </span>
        </div>
      </div>

      <div
        className={`grid grid-cols-1 ${
          compact ? "lg:grid-cols-1" : "lg:grid-cols-12"
        } gap-6 items-center`}
      >
        {/* Left: 7-Day Growth Trajectory Chart */}
        <div className={`${compact ? "" : "lg:col-span-7"} space-y-3`}>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Daily Skill Points &amp; Brain Score</span>
            <span className="font-mono tabular-nums font-medium text-slate-800 dark:text-slate-200">
              {activePoint.label}: {activePoint.points} pts · Brain{" "}
              {activePoint.brainScore}
            </span>
          </div>

          <div className="w-full overflow-hidden rounded-lg bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 p-2">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto block"
              role="img"
              aria-label="7-day skill and brain growth chart"
            >
              <defs>
                <linearGradient id={`skillArea-${mode}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.accentHex} stopOpacity="0.26" />
                  <stop offset="100%" stopColor={theme.accentHex} stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {[0.25, 0.5, 0.75, 1].map((frac) => {
                const gy = padY + plotH * frac;
                return (
                  <line
                    key={frac}
                    x1={padX}
                    y1={gy}
                    x2={width - padX}
                    y2={gy}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                );
              })}

              <path d={areaPath} fill={`url(#skillArea-${mode})`} />
              <path
                d={linePath}
                fill="none"
                stroke={theme.accentHex}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={brainPath}
                fill="none"
                stroke={theme.secondaryHex}
                strokeWidth="2"
                strokeDasharray="5 4"
                strokeLinecap="round"
              />

              {coords.map((c, idx) => {
                const isSelected = idx === hoveredIdx;
                return (
                  <g
                    key={c.date}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onClick={() => setHoveredIdx(idx)}
                  >
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r={isSelected ? 5.5 : 3.8}
                      fill={theme.accentHex}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={c.x}
                      y={height - 4}
                      textAnchor="middle"
                      className="fill-slate-500 dark:fill-slate-400 text-[10px] font-mono"
                    >
                      {c.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right: 5-Axis Competency Radar Diagram */}
        <div
          className={`${
            compact ? "" : "lg:col-span-5"
          } flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-4`}
        >
          <svg
            viewBox="0 0 240 224"
            className="w-48 h-44 shrink-0"
            role="img"
            aria-label="5-axis competency radar diagram"
          >
            {[25, 50, 75, 100].map((ring) => {
              const pts = radarDims
                .map((_, idx) => {
                  const p = polarToXY(idx, ring);
                  return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
                })
                .join(" ");
              return (
                <polygon
                  key={ring}
                  points={pts}
                  fill="none"
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-700"
                  strokeWidth="1"
                />
              );
            })}

            {radarDims.map((dim, idx) => {
              const outer = polarToXY(idx, 100);
              const labelPos = polarToXY(idx, 120);
              return (
                <g key={dim.key}>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={outer.x}
                    y2={outer.y}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-700"
                    strokeWidth="1"
                  />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-slate-600 dark:fill-slate-300 text-[9px] font-medium"
                  >
                    {dim.key.split(" ")[0]}
                  </text>
                </g>
              );
            })}

            <polygon
              points={radarPolyPoints}
              fill={theme.accentHex}
              fillOpacity="0.22"
              stroke={theme.accentHex}
              strokeWidth="2"
            />
          </svg>

          <div className="w-full space-y-2">
            {radarDims.map((dim) => (
              <div key={dim.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300">
                    {dim.key}
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                    {dim.value}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-[width] duration-300 ${theme.progressFill}`}
                    style={{ width: `${dim.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
