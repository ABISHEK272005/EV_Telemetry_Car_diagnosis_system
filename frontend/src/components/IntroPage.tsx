import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Activity, Shield, Moon, Sun, Settings } from 'lucide-react';
import { useTheme } from '../App';

interface IntroPageProps {
  onEnter: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onEnter }) => {
  const { isDark, toggleTheme, udpId, setUdpId } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [tempUdpId, setTempUdpId] = useState(udpId);

  const handleSaveSettings = () => {
    setUdpId(tempUdpId);
    setShowSettings(false);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-black via-gray-900 to-black' 
        : 'bg-gradient-to-br from-gray-100 via-white to-gray-200'
    }`}>
      {/* Rolls Royce Background */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`
          }}
        />
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-r from-black/80 via-black/60 to-black/80' 
            : 'bg-gradient-to-r from-white/80 via-white/60 to-white/80'
        }`} />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              isDark ? 'bg-yellow-400/30' : 'bg-gray-600/30'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Top Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 right-6 flex items-center gap-4 z-20"
      >
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-3 rounded-lg border transition-all duration-300 ${
            isDark 
              ? 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white' 
              : 'bg-black/10 backdrop-blur-sm border-black/20 hover:bg-black/20 text-black'
          }`}
        >
          <Settings className="w-5 h-5" />
        </button>
        
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-lg border transition-all duration-300 ${
            isDark 
              ? 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white' 
              : 'bg-black/10 backdrop-blur-sm border-black/20 hover:bg-black/20 text-black'
          }`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </motion.div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="absolute top-20 right-6 z-30"
        >
          <div className={`p-6 rounded-xl border backdrop-blur-sm ${
            isDark 
              ? 'bg-black/80 border-white/20 text-white' 
              : 'bg-white/80 border-black/20 text-black'
          }`}>
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  UDP ID
                </label>
                <input
                  type="text"
                  value={tempUdpId}
                  onChange={(e) => setTempUdpId(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    isDark 
                      ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' 
                      : 'bg-black/10 border-black/20 text-black placeholder-gray-600'
                  }`}
                  placeholder="Enter UDP ID"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    isDark 
                      ? 'border-white/20 text-white hover:bg-white/10' 
                      : 'border-black/20 text-black hover:bg-black/10'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="relative z-10 min-h-screen flex items-center justify-center px-8 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-12"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              >
                <Zap className="w-12 h-12 text-black" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 bg-clip-text text-transparent"
              >
                EV
              </motion.h1>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className={`text-4xl lg:text-6xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-black'
              }`}
            >
              Telemetry & Diagnosis
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="block text-yellow-400"
              >
                System
              </motion.span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className={`text-xl lg:text-2xl leading-relaxed mb-8 max-w-3xl mx-auto ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Advanced electric vehicle monitoring system providing real-time diagnostics, 
              telemetry data analysis, and comprehensive vehicle health insights with 
              professional-grade precision.
            </motion.p>

            {/* UDP ID Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 ${
                isDark 
                  ? 'bg-white/10 border-white/20 text-white' 
                  : 'bg-black/10 border-black/20 text-black'
              }`}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-mono text-sm">UDP ID: {udpId}</span>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            {[
              { icon: Activity, title: "Real-time Monitoring", desc: "Live sensor data and vehicle metrics" },
              { icon: Shield, title: "Advanced Diagnostics", desc: "Comprehensive system analysis" },
              { icon: Zap, title: "Performance Tracking", desc: "Detailed performance insights" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 + index * 0.2, duration: 0.8 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                  isDark 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                    : 'bg-black/5 border-black/10 hover:bg-black/10'
                }`}
              >
                <feature.icon className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Enter Button */}
          <motion.button
            onClick={onEnter}
            className="group relative px-12 py-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full font-bold text-black text-xl shadow-2xl shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.8 }}
          >
            <motion.span 
              className="flex items-center gap-4"
              whileHover={{ x: 5 }}
            >
              Enter Dashboard
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </motion.span>
          </motion.button>
        </div>
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-20 grid-rows-12 h-full w-full">
          {Array.from({ length: 240 }).map((_, i) => (
            <motion.div
              key={i}
              className={`border ${isDark ? 'border-white/10' : 'border-black/10'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.02,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntroPage;