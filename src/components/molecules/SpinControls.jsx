import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

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
    <div className="bg-surface-50 rounded-xl p-6 shadow-lg border border-surface-200">
      <div className="text-center space-y-4">
        <motion.div
          className={`inline-block ${isSpinning ? 'animate-pulse-glow' : ''}`}
        >
          <Button
            variant="accent"
            size="xl"
            onClick={onSpin}
            disabled={disabled || isSpinning || entriesCount < 2}
            className="w-32 h-32 rounded-full text-2xl font-bold shadow-2xl"
          >
            {isSpinning ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <ApperIcon name="RotateCw" size={32} />
              </motion.div>
            ) : (
              <span>SPIN</span>
            )}
          </Button>
        </motion.div>

        {entriesCount < 2 && (
          <p className="text-sm text-surface-500">
            Add at least 2 entries to spin
          </p>
        )}

<div className="space-y-2">
          <label className={`block text-sm font-medium ${isFullscreen ? 'text-white' : 'text-surface-700'}`}>
            Spin Duration: {(spinDuration / 1000).toFixed(1)}s
          </label>
          <input
            type="range"
            min="2000"
            max="8000"
            step="500"
            value={spinDuration}
            onChange={(e) => onDurationChange(parseInt(e.target.value))}
            disabled={isSpinning}
            className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className={`flex justify-between text-xs ${isFullscreen ? 'text-gray-300' : 'text-surface-500'}`}>
            <span>2s</span>
            <span>8s</span>
          </div>
        </div>

        {onToggleFullscreen && (
          <div className="pt-4 border-t border-surface-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFullscreen}
              className={`w-full ${isFullscreen ? 'text-white hover:bg-gray-800' : ''}`}
            >
              <ApperIcon 
                name={isFullscreen ? "Minimize2" : "Maximize2"} 
                size={16} 
                className="mr-2" 
              />
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpinControls;