import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const SpinControls = ({ 
  wheelRef,
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
{entriesCount < 2 && (
          <p className="text-sm text-surface-500 text-center">
            Add at least 2 entries to spin the wheel
          </p>
        )}
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