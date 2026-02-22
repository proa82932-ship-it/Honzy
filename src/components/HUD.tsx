import { Heart, Shield, Zap, Crosshair, Map as MapIcon, Menu, Car, Plane, User, RotateCcw } from 'lucide-react';
import { useGameStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';

export const HUD = () => {
  const { health, ammo, maxAmmo, money, currentMission, viewMode, setViewMode, isReloading } = useGameStore();

  const cycleView = () => {
    if (viewMode === 'FPP') setViewMode('TPP');
    else if (viewMode === 'TPP') setViewMode('TOP');
    else setViewMode('FPP');
  };

  return (
    <div className="fixed inset-0 pointer-events-none font-display text-white">
      {/* Reloading Indicator */}
      <AnimatePresence>
        {isReloading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-12 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/20"
          >
            <span className="text-emerald-500 font-bold tracking-[0.2em] animate-pulse">RELOADING...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats moved to bottom center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 hud-bottom-gradient p-6 rounded-t-3xl border-t border-white/10">
        <div className="bg-black/50 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center gap-3">
          <Heart className="text-red-500 fill-red-500" size={20} />
          <div className="w-32 h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-red-500" 
              initial={{ width: '100%' }}
              animate={{ width: `${health}%` }}
            />
          </div>
          <span className="text-sm font-bold">{health}</span>
        </div>
        <div className="bg-black/50 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center gap-3">
          <span className="text-emerald-400 font-bold text-xl">${money}</span>
        </div>
      </div>

      {/* Mission Info */}
      {currentMission && (
        <div className="absolute top-6 left-6 max-w-[200px] sm:max-w-xs">
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-black/50 backdrop-blur-md border-l-4 border-emerald-500 p-2 sm:p-4 rounded-r-xl"
          >
            <h3 className="text-emerald-500 text-[8px] sm:text-xs font-bold uppercase tracking-widest mb-1">Current Objective</h3>
            <p className="font-bold text-sm sm:text-lg leading-tight">{currentMission.title}</p>
          </motion.div>
        </div>
      )}

      {/* Crosshair */}
      {viewMode === 'FPP' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute w-1 h-1 bg-white rounded-full" />
            <div className="absolute -top-4 left-0 w-0.5 h-3 bg-white/50" />
            <div className="absolute top-2 left-0 w-0.5 h-3 bg-white/50" />
            <div className="absolute top-0 -left-4 w-3 h-0.5 bg-white/50" />
            <div className="absolute top-0 left-2 w-3 h-0.5 bg-white/50" />
          </div>
        </div>
      )}

      {/* Bottom Right - Ammo - Hidden on mobile */}
      <div className="hidden sm:flex absolute bottom-6 right-6 flex flex-col items-end gap-4">
        <div className="bg-black/50 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-end gap-2">
          <div className="flex flex-col items-end">
            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Ammo</span>
            <span className="text-4xl font-bold leading-none">{ammo}</span>
          </div>
          <span className="text-xl text-white/40 font-bold mb-1">/ {maxAmmo}</span>
          <Zap className="text-yellow-400 fill-yellow-400 mb-1" size={24} />
        </div>
      </div>

      {/* Bottom Left - Minimap & Controls - Hidden on mobile */}
      <div className="hidden sm:flex absolute bottom-6 left-6 items-end gap-6">
        <div className="w-48 h-48 bg-black/50 backdrop-blur-md border-2 border-white/20 rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
          <div className="absolute top-4 right-4 text-[10px] font-bold text-white/40 uppercase">Sector 7G</div>
        </div>

        <div className="flex flex-col gap-2 pointer-events-auto">
          <button 
            onClick={cycleView}
            title="Toggle View (V)"
            className="p-3 bg-black/50 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-xl transition-colors group"
          >
            <Crosshair className="text-white/60 group-hover:text-white" size={20} />
          </button>
          <button 
            onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ShiftLeft' }))}
            onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ShiftLeft' }))}
            title="Sprint (Shift)"
            className="p-3 bg-black/50 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-xl transition-colors group"
          >
            <Zap className="text-white/60 group-hover:text-white" size={20} />
          </button>
          <button 
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyR' }))}
            title="Reload (R)"
            className="p-3 bg-black/50 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-xl transition-colors group"
          >
            <RotateCcw className="text-white/60 group-hover:text-white" size={20} />
          </button>
          <button className="p-3 bg-black/50 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-xl transition-colors group">
            <MapIcon className="text-white/60 group-hover:text-white" size={20} />
          </button>
          <button className="p-3 bg-black/50 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-xl transition-colors group">
            <Menu className="text-white/60 group-hover:text-white" size={20} />
          </button>
        </div>
      </div>

      {/* Interaction Prompt */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-emerald-500 text-black px-6 py-2 rounded-full font-bold flex items-center gap-3 shadow-lg shadow-emerald-500/20"
        >
          <span className="bg-black text-white px-2 py-0.5 rounded text-xs">E</span>
          Enter Vehicle
        </motion.div>
      </div>
    </div>
  );
};
