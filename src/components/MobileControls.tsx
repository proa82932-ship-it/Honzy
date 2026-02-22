import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import { useGameStore } from '../store';

interface JoystickProps {
  onMove: (x: number, y: number) => void;
  onEnd: () => void;
}

const Joystick = ({ onMove, onEnd }: JoystickProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const joystickRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!joystickRef.current) return;
    const touch = e.touches[0];
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = rect.width / 2;
    
    if (distance > maxDistance) {
      dx *= maxDistance / distance;
      dy *= maxDistance / distance;
    }
    
    setPosition({ x: dx, y: dy });
    onMove(dx / maxDistance, -dy / maxDistance);
  };

  const handleTouchEnd = () => {
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
    onEnd();
  };

  return (
    <div 
      ref={joystickRef}
      className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full border-2 border-white/20 relative touch-none"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchStart={() => setIsDragging(true)}
    >
      <motion.div 
        className="w-12 h-12 bg-emerald-500 rounded-full absolute top-1/2 left-1/2 -ml-6 -mt-6 shadow-lg shadow-emerald-500/50"
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      />
    </div>
  );
};

export const MobileControls = () => {
  const [isMobile, setIsMobile] = useState(false);
  const setViewMode = useGameStore((state) => state.setViewMode);
  const viewMode = useGameStore((state) => state.viewMode);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
  }, []);

  const cycleView = () => {
    if (viewMode === 'FPP') setViewMode('TPP');
    else if (viewMode === 'TPP') setViewMode('TOP');
    else setViewMode('FPP');
  };

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Movement Joystick */}
      <div className="absolute bottom-12 left-12 pointer-events-auto">
        <Joystick 
          onMove={(x, y) => {
            // We'll need to sync this with the player movement
            window.dispatchEvent(new CustomEvent('mobile-move', { detail: { x, y } }));
          }}
          onEnd={() => {
            window.dispatchEvent(new CustomEvent('mobile-move', { detail: { x: 0, y: 0 } }));
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-12 right-12 flex flex-col gap-4 pointer-events-auto">
        <div className="flex gap-4">
          <button 
            className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full border-2 border-white/20 flex items-center justify-center active:scale-90 transition-transform"
            onTouchStart={() => window.dispatchEvent(new CustomEvent('mobile-action', { detail: { action: 'jump', value: true } }))}
            onTouchEnd={() => window.dispatchEvent(new CustomEvent('mobile-action', { detail: { action: 'jump', value: false } }))}
          >
            <span className="font-bold text-xs">JUMP</span>
          </button>
          <button 
            className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full border-2 border-white/20 flex items-center justify-center active:scale-90 transition-transform"
            onTouchStart={() => window.dispatchEvent(new CustomEvent('mobile-action', { detail: { action: 'sprint', value: true } }))}
            onTouchEnd={() => window.dispatchEvent(new CustomEvent('mobile-action', { detail: { action: 'sprint', value: false } }))}
          >
            <span className="font-bold text-xs">RUN</span>
          </button>
          <button 
            className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full border-2 border-white/20 flex items-center justify-center active:scale-90 transition-transform"
            onTouchStart={() => window.dispatchEvent(new CustomEvent('mobile-action', { detail: { action: 'reload', value: true } }))}
            onTouchEnd={() => window.dispatchEvent(new CustomEvent('mobile-action', { detail: { action: 'reload', value: false } }))}
          >
            <span className="font-bold text-xs">RELOAD</span>
          </button>
        </div>
        
        <button 
          className="w-24 h-24 bg-red-500/20 backdrop-blur-md rounded-full border-4 border-red-500/50 flex flex-col items-center justify-center active:scale-90 transition-transform shadow-lg shadow-red-500/20"
          onTouchStart={() => window.dispatchEvent(new CustomEvent('mobile-action', { detail: { action: 'shoot', value: true } }))}
          onTouchEnd={() => window.dispatchEvent(new CustomEvent('mobile-action', { detail: { action: 'shoot', value: false } }))}
        >
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <Zap size={24} className="text-white fill-white" />
          </div>
          <span className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-widest">Fire</span>
        </button>
      </div>

      {/* View Switcher for Mobile */}
      <div className="absolute top-6 right-6 pointer-events-auto">
        <button 
          onClick={cycleView}
          className="px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest text-white"
        >
          {viewMode}
        </button>
        <button 
          onClick={() => {
            const colors = ['blue', 'red', 'green', 'yellow', 'purple'];
            const nextColor = colors[Math.floor(Math.random() * colors.length)];
            window.dispatchEvent(new CustomEvent('mobile-action', { detail: { action: 'changeClothes', value: nextColor } }));
          }}
          className="px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest text-white"
        >
          Clothes
        </button>
      </div>
    </div>
  );
};
