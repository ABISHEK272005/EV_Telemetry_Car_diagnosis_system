import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Battery, 
  Thermometer, 
  Gauge, 
  Activity,
  Wind,
  Mountain,
  Zap,
  AlertTriangle,
  TrendingUp,
  Moon,
  Sun,
  Settings
} from 'lucide-react';
import { useTheme } from '../App';
import MetricCard from './MetricCard';
import GaugeChart from './GaugeChart';
import TirePressureIndicator from './TirePressureIndicator';
import Accident from './Accident';

interface DashboardProps {
  onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onBack }) => {
  const { isDark, toggleTheme, udpId, setUdpId } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [tempUdpId, setTempUdpId] = useState(udpId);
  const [battery,setBattery] = useState(96);
  const wsRef = useRef(null);

  const handleSaveSettings = () => {
    setUdpId(tempUdpId);
    setShowSettings(false);
  };

  
  // Simulate real-time data updates
  const [data, setData] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setBattery(prev => prev - 0.01);
    }, 10000);
  
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    wsRef.current = new WebSocket("wss://ev-telemetry-car-diagnosis-system.onrender.com/ws");

    wsRef.current.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setData(parsedData);

        if (parsedData?.STM32?.ACCIDENT_DETECTED) {
          wsRef.current?.close(); // 🛑 Close WebSocket on accident detection
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    return () => wsRef.current?.close(); // Cleanup on unmount
  }, []);
  
  useEffect(() => {
    console.log(data);
  }, [data]);

  const tirePressures = [
    { position: "Front Left", value: Math.floor(Math.random() * 6) + 30 },
    { position: "Front Right", value: Math.floor(Math.random() * 6) + 30 },
    { position: "Rear Left", value: Math.floor(Math.random() * 6) + 30 },
    { position: "Rear Right", value: Math.floor(Math.random() * 6) + 30 },
  ];

  if (data?.STM32?.ACCIDENT_DETECTED) {
    return <Accident />;
  }

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-black via-gray-900 to-black' 
        : 'bg-gradient-to-br from-gray-100 via-white to-gray-200'
    }`}>
      {/* Race Car Moving Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Speed Lines */}
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute h-0.5 ${isDark ? 'bg-yellow-400/20' : 'bg-gray-600/20'}`}
            style={{
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 100}px`,
              left: '100%',
            }}
            animate={{
              x: [0, -window.innerWidth - 200],
            }}
            transition={{
              duration: 1 + Math.random() * 2,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Racing Dots */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`dot-${i}`}
            className={`absolute w-1 h-1 rounded-full ${isDark ? 'bg-red-400/30' : 'bg-gray-700/30'}`}
            style={{
              top: `${Math.random() * 100}%`,
              left: '100%',
            }}
            animate={{
              x: [0, -window.innerWidth - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.5 + Math.random() * 1,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className={`p-3 rounded-lg border backdrop-blur-sm transition-colors ${
                isDark 
                  ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white' 
                  : 'bg-black/10 border-black/20 hover:bg-black/20 text-black'
              }`}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                EV Telemetry Dashboard
              </h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Real-time vehicle diagnostics • UDP ID: {udpId}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-3 rounded-lg border backdrop-blur-sm transition-colors ${
                isDark 
                  ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white' 
                  : 'bg-black/10 border-black/20 hover:bg-black/20 text-black'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-lg border backdrop-blur-sm transition-colors ${
                isDark 
                  ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white' 
                  : 'bg-black/10 border-black/20 hover:bg-black/20 text-black'
              }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">System Online</span>
            </div>
          </div>
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

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Battery Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className={`rounded-xl border backdrop-blur-sm p-6 transition-colors ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-black/5 border-black/10'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <Battery className="w-6 h-6 text-green-400" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                  Battery Status
                </h3>
              </div>
              <GaugeChart 
                value={battery} 
                max={100} 
                label="Battery Level"
                color="green"
                unit="%"
              />
              <div className="mt-4 space-y-2">
                <div className="flex flex-col justify-between text-sm">
                  <div className='p-4'>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    State of Charge
                  </span>
                  <span className={`${isDark ? 'text-white' : 'text-black'} p-2`}>
                  {/* {telemetryData.stateOfCharge}% */}
                  </span>
                  </div>
                  <div className='p-4'>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Health of Charge
                  </span>
                  <span className={`${isDark ? 'text-white' : 'text-black'} p-2`}>
                  {/* {telemetryData.stateOfCharge}% */}
                  </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RPM Gauge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className={`rounded-xl border backdrop-blur-sm p-6 transition-colors ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-black/5 border-black/10'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <Gauge className="w-6 h-6 text-blue-400" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                  Engine RPM
                </h3>
              </div>
              <GaugeChart 
                value={data?.CH?.RPM} 
                max={6000} 
                label="RPM"
                color="blue"
                unit="RPM"
              />
            </div>
          </motion.div>

          {/* Gas Emissions */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 xl:col-span-2"
          >
            <div className={`rounded-xl border backdrop-blur-sm p-6 transition-colors ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-black/5 border-black/10'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <Wind className="w-6 h-6 text-purple-400" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                  Gas Emissions
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <MetricCard
                  label="CO"
                  value={"14"}
                  unit="ppm"
                  color="red"
                  icon={AlertTriangle}
                />
                <MetricCard
                  label="CO₂"
                  value={"15"}
                  unit="ppm"
                  color="orange"
                  icon={TrendingUp}
                />
                <MetricCard
                  label="O₂"
                  value={"23"}
                  unit="%"
                  color="green"
                  icon={Wind}
                />
              </div>
            </div>
          </motion.div>

          {/* Accelerometer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className={`rounded-xl border backdrop-blur-sm p-6 transition-colors ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-black/5 border-black/10'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-6 h-6 text-yellow-400" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                  Accelerometer
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>X-axis</span>
                  <span className={`font-mono ${isDark ? 'text-white' : 'text-black'}`}>
                    {data?.STM32?.Accel?.X} m/s²
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Y-axis</span>
                  <span className={`font-mono ${isDark ? 'text-white' : 'text-black'}`}>
                    {data?.STM32?.Accel?.Y} m/s²
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Z-axis</span>
                  <span className={`font-mono ${isDark ? 'text-white' : 'text-black'}`}>
                    {data?.STM32?.Accel?.Z} m/s²
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Gyroscope */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1"
          >
            <div className={`rounded-xl border backdrop-blur-sm p-6 transition-colors ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-black/5 border-black/10'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-6 h-6 text-cyan-400" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                  Gyroscope
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>X-axis</span>
                  <span className={`font-mono ${isDark ? 'text-white' : 'text-black'}`}>
                    {data?.STM32?.Gyro?.X} rad/s
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Y-axis</span>
                  <span className={`font-mono ${isDark ? 'text-white' : 'text-black'}`}>
                    {data?.STM32?.Gyro?.Y} rad/s
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Z-axis</span>
                  <span className={`font-mono ${isDark ? 'text-white' : 'text-black'}`}>
                    {data?.STM32?.Gyro?.Z} rad/s
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Environmental Conditions */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-1 xl:col-span-2"
          >
            <div className={`rounded-xl border backdrop-blur-sm p-6 transition-colors ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-black/5 border-black/10'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <Thermometer className="w-6 h-6 text-orange-400" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                  Environmental Conditions
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <MetricCard
                  label="Temperature"
                  value={data?.BMP180?.temp}
                  unit="°C"
                  color="orange"
                  icon={Thermometer}
                />
                <MetricCard
                  label="Pressure"
                  value={data?.BMP180?.pressure}
                  unit="hPa"
                  color="blue"
                  icon={Gauge}
                />
                <MetricCard
                  label="Altitude"
                  value={data?.BMP180?.altitude}
                  unit="m"
                  color="purple"
                  icon={Mountain}
                />
              </div>
            </div>
          </motion.div>

          {/* Tire Pressure */}
          {tirePressures.map((tire, index) => (
  <TirePressureIndicator 
    key={index}
    position={tire.position}
    value={tire.value}
    isDark={isDark}
  />
))}

          {/* Vibration Sensors */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-1"
          >
            <div className={`rounded-xl border backdrop-blur-sm p-6 transition-colors ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-black/5 border-black/10'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-6 h-6 text-pink-400" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                  Vibration
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Vibration</span>
                  <span className={`font-mono ${isDark ? 'text-white' : 'text-black'}`}>
                    {data?.CH?.VIB} Hz
                  </span>
                </div>
                
              </div>
            </div>
          </motion.div>

          {/* ECU Temperature */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="lg:col-span-1"
          >
            <div className={`rounded-xl border backdrop-blur-sm p-6 transition-colors ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-black/5 border-black/10'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-red-400" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                  ECU Temperature
                </h3>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
                  {data?.CH?.TEMP}
                </div>
                <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>°C</div>
                <div className={`text-xs mt-2 px-3 py-1 rounded-full ${
                  data?.CH?.TEMP < 80 
                    ? 'bg-green-500/20 text-green-400' 
                    :data?.CH?.TEMP < 90
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {data?.CH?.TEMP < 80 ? 'Normal' : data?.CH?.TEMP < 90 ? 'Warm' : 'Hot'}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;