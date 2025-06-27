import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const SpinControls = ({ 
  onSpin, 
  isSpinning, 
  spinDuration, 
  onDurationChange, 
  disabled = false,
  entriesCount = 0,
  isFullscreen = false,
  onToggleFullscreen
}) => {
return (
    <motion.div 
      className="bg-surface-50 rounded-xl p-6 shadow-lg border border-surface-200 glass-effect"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-4">
        <motion.div
          className={`inline-block ${isSpinning ? 'animate-pulse-glow' : ''}`}
          whileHover={!isSpinning ? { scale: 1.05 } : {}}
          whileTap={!isSpinning ? { scale: 0.95 } : {}}
        >
          <Button
            variant="accent"
            size="xl"
            onClick={onSpin}
            disabled={disabled || isSpinning || entriesCount < 2}
            className={`w-32 h-32 rounded-full text-2xl font-bold shadow-2xl transition-all duration-300 ${
              entriesCount >= 2 && !isSpinning 
                ? 'hover:shadow-3xl animate-float' 
                : entriesCount < 2 
                ? 'animate-shake opacity-50' 
                : ''
            }`}
          >
            {isSpinning ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <ApperIcon name="RotateCw" size={32} />
              </motion.div>
            ) : (
              <motion.span
                animate={entriesCount >= 2 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                SPIN
              </motion.span>
            )}
          </Button>
        </motion.div>
<AnimatePresence>
          {entriesCount < 2 && (
            <motion.p 
              className="text-sm text-surface-500"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              Add at least 2 entries to spin
            </motion.p>
          )}
</AnimatePresence>

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.label 
            className={`block text-sm font-medium ${isFullscreen ? 'text-white' : 'text-surface-700'}`}
            animate={{ 
              color: isSpinning ? '#9CA3AF' : isFullscreen ? '#ffffff' : '#374151' 
            }}
            transition={{ duration: 0.3 }}
          >
            Spin Duration: {(spinDuration / 1000).toFixed(1)}s
          </motion.label>
          <motion.input
            type="range"
            min="2000"
            max="8000"
            step="500"
            value={spinDuration}
            onChange={(e) => onDurationChange(parseInt(e.target.value))}
            disabled={isSpinning}
            className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer slider transition-all duration-200"
            whileFocus={{ scale: 1.02 }}
          />
          <div className={`flex justify-between text-xs ${isFullscreen ? 'text-gray-300' : 'text-surface-500'}`}>
            <span>2s</span>
            <span>8s</span>
          </div>
</motion.div>

        {onToggleFullscreen && (
          <motion.div 
            className="pt-4 border-t border-surface-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFullscreen}
                className={`w-full transition-all duration-200 ${
                  isFullscreen 
                    ? 'text-white hover:bg-gray-800 shadow-lg' 
                    : 'hover:shadow-md'
                }`}
              >
                <motion.div
                  animate={{ rotate: isFullscreen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="mr-2"
                >
                  <ApperIcon 
                    name={isFullscreen ? "Minimize2" : "Maximize2"} 
                    size={16} 
                  />
                </motion.div>
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}
              </Button>
            </motion.div>
          </motion.div>
)}
      </div>
    </motion.div>
  );
};

export default SpinControls;