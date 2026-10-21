import React from 'react';
import type { ThreatSeverity } from '../types/threat';

interface RiskGaugeProps {
  score: number;
  severity: ThreatSeverity;
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, severity, size = 180 }) => {
  // SVG calculations for radial progress
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Arc covering 260 degrees (leaving 100 degrees open at the bottom)
  const arcLength = circumference * (260 / 360);
  const strokeDashoffset = arcLength - (arcLength * Math.min(score, 100)) / 100;

  // Colors based on severity
  const getColors = () => {
    if (score >= 75 || severity === 'critical') {
      return {
        stroke: '#f43f5e', // rose-500
        glow: 'rgba(244, 63, 94, 0.4)',
        bgStroke: 'rgba(244, 63, 94, 0.15)',
        text: 'text-rose-400',
        badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        label: 'CRITICAL THREAT',
      };
    }
    if (score >= 40 || severity === 'high' || severity === 'medium') {
      return {
        stroke: '#f59e0b', // amber-500
        glow: 'rgba(245, 158, 11, 0.4)',
        bgStroke: 'rgba(245, 158, 11, 0.15)',
        text: 'text-amber-400',
        badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        label: 'ELEVATED RISK',
      };
    }
    return {
      stroke: '#10b981', // emerald-500
      glow: 'rgba(16, 185, 129, 0.4)',
      bgStroke: 'rgba(16, 185, 129, 0.15)',
      text: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      label: 'VERIFIED SAFE',
    };
  };

  const colors = getColors();

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Gauge SVG */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-[220deg]"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={colors.bgStroke}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Active indicator arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              filter: `drop-shadow(0 0 10px ${colors.glow})`,
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
            Risk Score
          </span>
          <div className="flex items-baseline">
            <span
              className={`text-4xl md:text-5xl font-extrabold font-mono tracking-tight ${colors.text}`}
              style={{ textShadow: `0 0 20px ${colors.glow}` }}
            >
              {score}
            </span>
            <span className="text-slate-500 font-mono text-sm ml-0.5">/100</span>
          </div>
          <span className={`mt-1 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full border ${colors.badgeBg}`}>
            {colors.label}
          </span>
        </div>
      </div>

      {/* Ticks / Subtext info */}
      <div className="flex items-center justify-between w-full max-w-[160px] text-[11px] font-mono text-slate-500 -mt-3">
        <span>0 SAFE</span>
        <span className="text-amber-500/70">50</span>
        <span className="text-rose-500/80">100 DANGER</span>
      </div>
    </div>
  );
};
