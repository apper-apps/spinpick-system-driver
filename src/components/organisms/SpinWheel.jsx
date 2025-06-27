import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { motion } from "framer-motion";

const SpinWheel = forwardRef(({ 
  entries = [], 
  onSpinComplete, 
  spinDuration = 3000,
  selectedTheme,
  onSpinStart
}, ref) => {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  // Default colors if no theme selected
  const defaultColors = ['#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#06B6D4'];
  const colors = selectedTheme?.colors || defaultColors;

  useEffect(() => {
    drawWheel();
  }, [entries, colors, rotation]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas || entries.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw wheel segments
    const anglePerSegment = (2 * Math.PI) / entries.length;
    
    entries.forEach((entry, index) => {
      const startAngle = index * anglePerSegment + (rotation * Math.PI / 180);
      const endAngle = startAngle + anglePerSegment;
      const color = colors[index % colors.length];
      
      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + anglePerSegment / 2);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px Plus Jakarta Sans';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 2;
      
      const text = entry.text.length > 12 ? entry.text.substring(0, 12) + '...' : entry.text;
      ctx.fillText(text, radius * 0.3, 0);
      ctx.restore();
    });
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#374151';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(centerX + radius + 10, centerY);
    ctx.lineTo(centerX + radius - 20, centerY - 15);
    ctx.lineTo(centerX + radius - 20, centerY + 15);
    ctx.closePath();
    ctx.fillStyle = '#374151';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();
  };

const handleSpin = () => {
    if (entries.length < 2 || isSpinning) return;
    
    setIsSpinning(true);
    onSpinStart?.();
    
    // Calculate random final rotation (multiple full rotations + random offset)
    const spins = 4 + Math.random() * 4; // 4-8 full rotations
    const finalRotation = rotation + (spins * 360) + Math.random() * 360;
    
    // Animate rotation
    const startTime = Date.now();
    const startRotation = rotation;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      // Easing function for natural deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + (finalRotation - startRotation) * easeOut;
      
      setRotation(currentRotation);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Calculate winner
        const normalizedRotation = (360 - (currentRotation % 360)) % 360;
        const anglePerSegment = 360 / entries.length;
        const winnerIndex = Math.floor(normalizedRotation / anglePerSegment);
        const selectedEntry = entries[winnerIndex];
        
        setWinner(selectedEntry);
        setIsSpinning(false);
        onSpinComplete?.(selectedEntry);
      }
    };
    
    requestAnimationFrame(animate);
  };

// Expose spin method to parent component
  useImperativeHandle(ref, () => ({
    spin: handleSpin,
    isSpinning
  }));

  return (
    <div className="flex items-center justify-center">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative cursor-pointer"
        onClick={handleSpin}
      >
<canvas
          ref={canvasRef}
          width={window.innerWidth < 768 ? Math.min(300, window.innerWidth - 40) : Math.min(400, window.innerWidth - 100)}
          height={window.innerWidth < 768 ? Math.min(300, window.innerWidth - 40) : Math.min(400, window.innerWidth - 100)}
          className="drop-shadow-2xl rounded-full max-w-full h-auto"
        />
        {entries.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-surface-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-surface-700 mb-2">
                Ready to Spin?
              </h3>
              <p className="text-surface-500">
                Add some entries to get started
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
});

SpinWheel.displayName = 'SpinWheel';

export default SpinWheel;