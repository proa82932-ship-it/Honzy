import { useEffect } from 'react';
import { useGameStore } from '../store';

export const WeatherController = () => {
  const setWeather = useGameStore((state) => state.setWeather);
  const advanceTime = useGameStore((state) => state.advanceTime);

  useEffect(() => {
    const weatherInterval = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.7) setWeather('CLEAR');
      else if (rand < 0.9) setWeather('RAIN');
      else setWeather('STORM');
    }, 60000); // Change weather every minute

    const timeInterval = setInterval(() => {
      advanceTime(0.01); // Advance time slowly
    }, 1000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(timeInterval);
    };
  }, [setWeather, advanceTime]);

  return null;
};
