import { create } from 'zustand';

export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';
export type ViewMode = 'FPP' | 'TPP' | 'TOP';

interface Mission {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface GameStore {
  gameState: GameState;
  viewMode: ViewMode;
  health: number;
  ammo: number;
  maxAmmo: number;
  money: number;
  currentMission: Mission | null;
  weather: 'CLEAR' | 'RAIN' | 'STORM';
  timeOfDay: number; // 0 to 24
  isReloading: boolean;
  
  setGameState: (state: GameState) => void;
  setViewMode: (mode: ViewMode) => void;
  updateHealth: (amount: number) => void;
  updateAmmo: (amount: number) => void;
  setReloading: (isReloading: boolean) => void;
  addMoney: (amount: number) => void;
  setWeather: (weather: 'CLEAR' | 'RAIN' | 'STORM') => void;
  advanceTime: (delta: number) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'MENU',
  viewMode: 'FPP',
  health: 100,
  ammo: 30,
  maxAmmo: 120,
  money: 500,
  currentMission: {
    id: '1',
    title: 'Welcome to the Frontier',
    description: 'Explore the city and find the military outpost.',
    completed: false,
  },
  weather: 'CLEAR',
  timeOfDay: 12,
  isReloading: false,

  setGameState: (gameState) => set({ gameState }),
  setViewMode: (viewMode) => set({ viewMode }),
  updateHealth: (amount) => set((state) => ({ health: Math.max(0, Math.min(100, state.health + amount)) })),
  updateAmmo: (amount) => set((state) => ({ ammo: state.ammo + amount })),
  setReloading: (isReloading) => set({ isReloading }),
  addMoney: (amount) => set((state) => ({ money: state.money + amount })),
  setWeather: (weather) => set({ weather }),
  advanceTime: (delta) => set((state) => ({ timeOfDay: (state.timeOfDay + delta) % 24 })),
}));
