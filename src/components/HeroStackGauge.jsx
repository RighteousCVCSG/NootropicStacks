import React, { useEffect, useState } from 'react';

// A static, scripted demo of "Stack Score" assembly. We don't run the
// real calculateStackScore here — the numbers are hand-picked to tell
// the story (build → boost → cap) in 7 seconds.
const DEMO_STEPS = [
  { score: 51, label: 'Caffeine',                                 hint: 'Wakes you up but spikes anxiety' },
  { score: 67, label: '+ L-Theanine',                             hint: 'Smooths the caffeine; Synergy ↑' },
  { score: 78, label: "+ Lion's Mane",                            hint: 'Adds memory + focus' },
  { score: 84, label: '+ Bacopa Monnieri',                        hint: 'Long-term cognition' },
  { score: 89, label: '+ Magnesium Glycinate',                    hint: 'Sleep recovery → next-day Energy ↑' },
];

const STEP_DURATION_MS = 1700;

export function HeroStackGauge() {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setStep((s) => (s + 1) % DEMO_STEPS.length);
    }, STEP_DURATION_MS);
    return () => clearInterval(t);
  }, [paused]);

  const { score, label, hint } = DEMO_STEPS[step];
  // 100 = full ring; 9.5 internal scale (matches the real headline scoring)
  // For the demo we'll just use score/100 as the fraction since this is
  // illustrative — real scores top out at 9.5/dimension in headlineScores.
  const ringPct = Math.min(100, score);
  // SVG: viewBox 0 0 36 36, r=15.5 → circumference = 2π·15.5 ≈ 97.39
  const fullArc = 97.39;
  const dash = (ringPct / 100) * fullArc;

  // Color tier — same thresholds the real widget uses (Strong / Moderate / Low).
  const ringColor =
    score >= 80
      ? 'var(--color-accent-500)'   // strong = cyan
      : score >= 60
      ? 'var(--color-primary-500)'  // moderate = primary navy
      : 'var(--color-ink-400)';     // low = muted

  return (
    <div
      className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto select-none cursor-pointer"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="img"
      aria-label={`Stack Score demo at ${score} out of 100, current ingredient: ${label}`}
      tabIndex={0}
    >
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        {/* Track */}
        <circle
          cx="18" cy="18" r="15.5"
          fill="none"
          style={{ stroke: 'var(--color-ink-200)' }}
          strokeWidth="2"
        />
        {/* Score arc */}
        <circle
          cx="18" cy="18" r="15.5"
          fill="none"
          style={{ stroke: ringColor, transition: 'stroke-dasharray 1.4s cubic-bezier(0.2, 0, 0, 1), stroke 1.4s' }}
          strokeWidth="2.5"
          strokeDasharray={`${dash} ${fullArc}`}
          strokeLinecap="round"
        />
      </svg>

      {/* Center content (counter-rotates so text stays upright) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
        <div
          className="text-4xl sm:text-5xl font-semibold text-ink-900 tabular-nums"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {score}
        </div>
        <div className="text-[10px] uppercase tracking-widest text-ink-500 font-semibold">
          Stack Score
        </div>
      </div>

      {/* Caption (under gauge) */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center w-56">
        <div className="text-sm font-semibold text-ink-900 truncate" key={label}>
          {label}
        </div>
        <div className="text-xs text-ink-500 truncate">{hint}</div>
      </div>
    </div>
  );
}
