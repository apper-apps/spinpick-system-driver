import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';
import soundService from '@/services/soundService';
const WinnerModal = ({ winner, isOpen, onClose, onSpinAgain }) => {
useEffect(() => {
    if (isOpen && winner) {
      // Play winner sound effect
      soundService.playWinnerSound();
      
      // Trigger confetti animation
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      
      const randomInRange = (min, max) => Math.random() * (max - min) + min;
      
      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        
        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.1, 0.3),
            y: Math.random() - 0.2
          },
          colors: ['#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6']
        });
        
        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.7, 0.9),
            y: Math.random() - 0.2
          },
          colors: ['#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6']
        });
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [isOpen, winner]);

  return (
    <AnimatePresence>
      {isOpen && winner && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 15 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: winner.color }}
              >
                <ApperIcon name="Trophy" size={40} className="text-white" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Text variant="display" size="2xl" weight="bold" className="mb-2">
                  🎉 Winner! 🎉
                </Text>
                
                <Text variant="heading" size="xl" weight="semibold" className="mb-6">
{winner.text}
                </Text>
                
                <div className="flex flex-col gap-3">
                  <Button
                    variant="primary"
                    onClick={onSpinAgain}
                    className="flex-1"
                  >
                    <ApperIcon name="RotateCcw" size={16} className="mr-2" />
                    Spin Again
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WinnerModal;