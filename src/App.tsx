import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { PointerLockControls, Stars } from '@react-three/drei';
import { World } from './components/World';
import { Player } from './components/Player';
import { HUD } from './components/HUD';
import { WeatherController } from './components/WeatherController';
import { MobileControls } from './components/MobileControls';
import { useGameStore } from './store';
import { motion, AnimatePresence } from 'motion/react';

const Menu = () => {
  const setGameState = useGameStore((state) => state.setGameState);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 font-display overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative text-center"
      >
        <h1 className="text-8xl font-bold tracking-tighter mb-2 italic">
          APEX<span className="text-emerald-500">FRONTIER</span>
        </h1>
        <p className="text-white/40 tracking-[0.5em] uppercase text-sm mb-12">Next-Gen Open World Warfare</p>
        
        <div className="flex flex-col gap-4 w-64 mx-auto">
          <button 
            onClick={() => setGameState('PLAYING')}
            className="group relative px-8 py-4 bg-emerald-500 text-black font-bold text-xl rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            START GAME
          </button>
          <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold text-xl rounded-xl transition-all">
            SETTINGS
          </button>
          <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold text-xl rounded-xl transition-all">
            QUIT
          </button>
        </div>
      </motion.div>

      <div className="absolute bottom-12 left-12 text-left">
        <div className="text-emerald-500 font-bold text-xs uppercase tracking-widest mb-2">System Status</div>
        <div className="text-white/40 text-[10px] font-mono leading-relaxed">
          CORE_ENGINE: V4.2.0-STABLE<br />
          RENDER_PIPELINE: HIGH_PRECISION<br />
          PHYSICS_GRID: ACTIVE<br />
          NETWORK_SYNC: LOCAL_ONLY
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const gameState = useGameStore((state) => state.gameState);

  return (
    <div className="w-full h-screen bg-black">
      <AnimatePresence>
        {gameState === 'MENU' && <Menu />}
      </AnimatePresence>

      {gameState === 'PLAYING' && (
        <>
          <WeatherController />
          <MobileControls />
          <Canvas shadows camera={{ fov: 75 }}>
            <Physics gravity={[0, -9.81, 0]}>
              <World />
              <Player />
            </Physics>
            <PointerLockControls />
          </Canvas>
          <HUD />
        </>
      )}
    </div>
  );
}
