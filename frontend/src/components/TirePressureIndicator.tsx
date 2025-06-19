import { motion } from 'framer-motion';
import { Gauge } from 'lucide-react';

const TirePressureIndicator = ({ position, value, isDark }) => {
    const isOptimal = value >= 30 && value <= 35;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
        className="lg:col-span-1"
      >
        <div className={`rounded-xl border backdrop-blur-sm p-6 transition-colors ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <Gauge className="w-6 h-6 text-blue-400" />
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
              {position}
            </h3>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
              {value}
            </div>
            <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>PSI</div>
            <div className={`text-xs mt-2 px-3 py-1 rounded-full ${
              isOptimal ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {isOptimal ? 'Optimal' : 'Check Required'}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };
  export default TirePressureIndicator;