import React from 'react';
import { motion } from 'framer-motion';

const InteractiveLogo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center cursor-pointer group">
      <motion.svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial="idle"
        whileHover="hover"
      >
        {/* Bottle Outline */}
        <motion.path
          d="M30 30 L30 85 Q30 95 50 95 Q70 95 70 85 L70 30 Z"
          stroke="#D4AF37"
          strokeWidth="2"
          variants={{
            idle: { pathLength: 1, strokeOpacity: 0.8 },
            hover: { pathLength: 1.1, strokeOpacity: 1, strokeWidth: 3 }
          }}
          transition={{ duration: 0.8 }}
        />
        
        {/* Bottle Neck */}
        <motion.rect
          x="40" y="15" width="20" height="15"
          stroke="#D4AF37"
          strokeWidth="2"
        />
        
        {/* Liquid Inside */}
        <motion.path
          d="M32 85 Q32 93 50 93 Q68 93 68 85 L68 50 Q50 60 32 50 Z"
          fill="url(#goldGradient)"
          variants={{
            idle: { d: "M32 85 Q32 93 50 93 Q68 93 68 85 L68 50 Q50 55 32 50 Z" },
            hover: { 
              d: [
                "M32 85 Q32 93 50 93 Q68 93 68 85 L68 40 Q50 30 32 40 Z",
                "M32 85 Q32 93 50 93 Q68 93 68 85 L68 45 Q50 55 32 45 Z",
                "M32 85 Q32 93 50 93 Q68 93 68 85 L68 40 Q50 30 32 40 Z"
              ],
              transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
            }
          }}
        />

        {/* Vapor / Scent particles */}
        <motion.circle cx="50" cy="10" r="2" fill="#D4AF37"
            variants={{
                idle: { opacity: 0, y: 0 },
                hover: { opacity: [0, 1, 0], y: -20, transition: { repeat: Infinity, duration: 1.5, delay: 0.1 } }
            }}
        />
        <motion.circle cx="45" cy="12" r="1.5" fill="#D4AF37"
            variants={{
                idle: { opacity: 0, y: 0 },
                hover: { opacity: [0, 1, 0], y: -15, transition: { repeat: Infinity, duration: 1.8, delay: 0.5 } }
            }}
        />
        <motion.circle cx="55" cy="8" r="1.5" fill="#D4AF37"
             variants={{
                idle: { opacity: 0, y: 0 },
                hover: { opacity: [0, 1, 0], y: -25, transition: { repeat: Infinity, duration: 1.2, delay: 0.3 } }
            }}
        />

        <defs>
          <linearGradient id="goldGradient" x1="30" y1="30" x2="70" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D4AF37" />
            <stop offset="1" stopColor="#8A6E2F" />
          </linearGradient>
        </defs>
      </motion.svg>
      <motion.div 
        className="mt-2 text-2xl tracking-[0.2em] font-bold text-[#D4AF37] brand-font"
        initial={{ opacity: 0.8 }}
        whileHover={{ opacity: 1, letterSpacing: "0.3em" }}
      >
        L'ESSENCE
      </motion.div>
    </div>
  );
};

export default InteractiveLogo;
