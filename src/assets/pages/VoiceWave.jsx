import React, { useEffect, useRef } from 'react';

export const VoiceWave = () => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const wavePoints = useRef(Array(100).fill(0));
  const isActive = useRef(false);

  const drawWave = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height);
    
    // Set wave style based on activity and theme
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    
    // Start drawing wave
    ctx.beginPath();
    
    // Calculate wave points
    const segmentWidth = width / (wavePoints.current.length - 1);
    const baseHeight = height / 2;
    
    // Move to first point
    ctx.moveTo(0, baseHeight + wavePoints.current[0]);
    
    // Draw wave through points
    for (let i = 1; i < wavePoints.current.length; i++) {
      const x = i * segmentWidth;
      const y = baseHeight + wavePoints.current[i];
      
      // Create smooth curve between points
      const xc = (x + (i - 1) * segmentWidth) / 2;
      const yc = (y + (baseHeight + wavePoints.current[i - 1])) / 2;
      ctx.quadraticCurveTo(x - segmentWidth, baseHeight + wavePoints.current[i - 1], xc, yc);
    }
    
    ctx.stroke();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Update wave points
    wavePoints.current = wavePoints.current.map(() => {
      if (isActive.current) {
        return (Math.random() - 0.5) * 40; // Slightly reduced amplitude for better aesthetics
      }
      return (Math.random() - 0.5) * 8;  // Smaller idle amplitude
    });
    
    drawWave(ctx, canvas.width, canvas.height);
    animationFrameId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    animate();
    
    const simulateVoiceActivity = () => {
      isActive.current = !isActive.current;
      setTimeout(simulateVoiceActivity, Math.random() * 2000 + 1000);
    };
    simulateVoiceActivity();
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
}; 