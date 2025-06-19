import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeftCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // or your routing method

const Accident = () => {
  const navigate = useNavigate(); // use callback if not using react-router

  const handleBack = () => {
    navigate(-1); // or call props.onBack() if passed as a callback
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-tr from-red-900 via-red-600 to-red-900 text-white p-6"
    >
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={handleBack}
        className="absolute top-5 left-5 flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl p-2 hover:bg-white/20 transition-colors"
      >
        <ArrowLeftCircle className="w-5 h-5 text-white" />
        <span className="text-white font-semibold">Back</span>
      </motion.button>

      {/* Icon + Heading */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="text-center"
      >
        <AlertTriangle className="w-20 h-20 text-yellow-400 animate-pulse" />
        <h1 className="text-4xl mt-4 font-bold tracking-wide">Accident Detected</h1>
        <p className="text-lg mt-2 opacity-80">Emergency protocols activated</p>
      </motion.div>

      {/* Pulse Ring Animation */}
      <motion.div
        className="relative mt-10"
        initial={{ scale: 0.8 }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.3, 0.6] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: 'easeInOut',
        }}
      >
        <div className="w-64 h-64 rounded-full bg-red-600 blur-2xl opacity-60"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 bg-red-500 rounded-full flex items-center justify-center shadow-xl border-4 border-red-300 animate-ping-slow">
            <span className="text-white font-bold text-xl">Sending Alert</span>
          </div>
        </div>
      </motion.div>

      {/* Footer message */}
      <motion.p
        className="mt-10 text-sm text-red-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        Please remain calm. Help is on the way.
      </motion.p>
    </motion.div>
  );
};

export default Accident;
