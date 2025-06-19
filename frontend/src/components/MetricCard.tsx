import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { useTheme } from '../App';

interface MetricCardProps {
  label: string;
  value: string;
  unit: string;
  color: 'red' | 'orange' | 'green' | 'blue' | 'purple' | 'yellow' | 'pink' | 'cyan';
  icon: LucideIcon;
}

const colorMap = {
  red: 'text-red-400',
  orange: 'text-orange-400',
  green: 'text-green-400',
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  yellow: 'text-yellow-400',
  pink: 'text-pink-400',
  cyan: 'text-cyan-400'
};

const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, color, icon: Icon }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`text-center p-3 rounded-lg border transition-colors ${
      isDark 
        ? 'bg-white/5 border-white/10' 
        : 'bg-black/5 border-black/10'
    }`}>
      <Icon className={`w-5 h-5 ${colorMap[color]} mx-auto mb-2`} />
      <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>
        {value}
      </div>
      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {label}
      </div>
      <div className={`text-xs ${colorMap[color]} font-medium`}>
        {unit}
      </div>
    </div>
  );
};

export default MetricCard;