import React from 'react';
import { useTheme } from '../App';

interface GaugeChartProps {
  value: number;
  max: number;
  label: string;
  color: 'red' | 'orange' | 'green' | 'blue' | 'purple' | 'yellow';
  unit: string;
}

const colorMap = {
  red: { stroke: '#ef4444', glow: 'drop-shadow(0 0 8px #ef4444)' },
  orange: { stroke: '#f97316', glow: 'drop-shadow(0 0 8px #f97316)' },
  green: { stroke: '#22c55e', glow: 'drop-shadow(0 0 8px #22c55e)' },
  blue: { stroke: '#3b82f6', glow: 'drop-shadow(0 0 8px #3b82f6)' },
  purple: { stroke: '#a855f7', glow: 'drop-shadow(0 0 8px #a855f7)' },
  yellow: { stroke: '#eab308', glow: 'drop-shadow(0 0 8px #eab308)' }
};

const GaugeChart: React.FC<GaugeChartProps> = ({ value, max, label, color, unit }) => {
  const { isDark } = useTheme();
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDasharray = `${percentage * 2.51} 251`;
  
  return (
    <div className="relative">
      <svg width="120" height="120" className="mx-auto">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="40"
          fill="none"
          stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
          strokeWidth="8"
          strokeDasharray="251 251"
          transform="rotate(-90 60 60)"
        />
        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r="40"
          fill="none"
          stroke={colorMap[color].stroke}
          strokeWidth="8"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ 
            filter: colorMap[color].glow,
            transition: 'stroke-dasharray 0.5s ease-in-out'
          }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
          {Math.round(value)}
        </div>
        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {unit}
        </div>
      </div>
    </div>
  );
};

export default GaugeChart;