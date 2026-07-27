import React from 'react';

interface TrustGaugeProps {
  score: number; // 0.0 to 1.0 or 0 to 100
  confidence?: number; // 0.0 to 1.0 or 0 to 100
  size?: 'sm' | 'md' | 'lg' | number;
  showLabel?: boolean;
  label?: string;
}

export const TrustGauge: React.FC<TrustGaugeProps> = ({
  score,
  confidence,
  size = 'md',
  showLabel = true,
  label = 'Trust Score',
}) => {
  // Normalize score to 0.0 - 1.0 range
  const normalizedScore = Math.max(0, Math.min(1, score > 1 ? score / 100 : score));
  const normalizedConfidence = confidence !== undefined ? (confidence > 1 ? confidence / 100 : confidence) : undefined;

  // Compute numeric dimensions for string or number size
  let numericWidth = 80;
  let strokeWidth = 6;
  let fontSizeClass = 'text-base';

  if (typeof size === 'number') {
    numericWidth = size;
    strokeWidth = Math.max(4, Math.round(size / 15));
    fontSizeClass = size >= 120 ? 'text-2xl' : size >= 90 ? 'text-lg' : 'text-xs';
  } else {
    const sizeMap = {
      sm: { width: 48, stroke: 4, font: 'text-xs' },
      md: { width: 80, stroke: 6, font: 'text-base' },
      lg: { width: 120, stroke: 8, font: 'text-xl' },
    };
    const config = sizeMap[size] || sizeMap.md;
    numericWidth = config.width;
    strokeWidth = config.stroke;
    fontSizeClass = config.font;
  }

  const radius = Math.max(10, (numericWidth - strokeWidth * 2) / 2);
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore * circumference);

  const getScoreColor = (val: number) => {
    if (val >= 0.7) return '#10B981'; // Emerald
    if (val >= 0.5) return '#3B82F6'; // Blue
    if (val >= 0.3) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  const color = getScoreColor(normalizedScore);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center">
        <svg width={numericWidth} height={numericWidth} className="transform -rotate-90">
          <circle
            cx={numericWidth / 2}
            cy={numericWidth / 2}
            r={radius}
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={numericWidth / 2}
            cy={numericWidth / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className={`absolute font-bold font-mono text-white ${fontSizeClass}`}>
          {(normalizedScore * 100).toFixed(0)}%
        </span>
      </div>
      {showLabel && (
        <div className="mt-1.5 text-center">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">{label}</span>
          {normalizedConfidence !== undefined && (
            <span className="text-[9px] text-slate-500 font-mono">Conf: {(normalizedConfidence * 100).toFixed(0)}%</span>
          )}
        </div>
      )}
    </div>
  );
};
