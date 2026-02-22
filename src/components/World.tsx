import { usePlane, useBox } from '@react-three/cannon';
import { Sky, Stars, Cloud } from '@react-three/drei';
import { useGameStore } from '../store';
import { NPC } from './NPC';
import { Vehicle } from './Vehicle';
import { Bird, Fish } from './Animals';

const Ground = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  return (
    <mesh ref={ref as any} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="#222" />
    </mesh>
  );
};

const Building = ({ position, size, color = 'gray' }: { position: [number, number, number], size: [number, number, number], color?: string }) => {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: size,
  }));

  return (
    <mesh ref={ref as any} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export const World = () => {
  const weather = useGameStore((state) => state.weather);
  const timeOfDay = useGameStore((state) => state.timeOfDay);

  return (
    <>
      <Sky sunPosition={[100, 10, 100]} />
      {timeOfDay > 18 || timeOfDay < 6 ? <Stars /> : null}
      <Cloud position={[-10, 10, -10]} speed={0.2} opacity={weather === 'RAIN' ? 0.8 : 0.4} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} castShadow />
      
      <Ground />
      
      {/* NPCs */}
      <NPC position={[5, 1, 5]} type="CIVILIAN" />
      <NPC position={[15, 1, 10]} type="POLICE" />
      <NPC position={[-40, 1, 40]} type="MILITARY" />
      
      {/* Vehicles */}
      <Vehicle position={[0, 2, 10]} type="SEDAN" />
      <Vehicle position={[20, 2, -20]} type="POLICE" />
      <Vehicle position={[-30, 2, 20]} type="TRUCK" />
      <Vehicle position={[40, 2, 0]} type="SEDAN" />
      <Vehicle position={[-10, 2, -40]} type="POLICE" />

      {/* Animals */}
      <Bird position={[0, 10, 0]} />
      <Bird position={[10, 15, 10]} />
      <Bird position={[-10, 12, -5]} />
      
      {/* City Blocks */}
      <Building position={[10, 5, 10]} size={[5, 10, 5]} color="#444" />
      <Building position={[-10, 8, 15]} size={[6, 16, 6]} color="#333" />
      <Building position={[20, 4, -10]} size={[8, 8, 8]} color="#555" />
      <Building position={[-20, 3, -20]} size={[10, 6, 10]} color="#444" />
      
      {/* Village Houses */}
      <Building position={[40, 1.5, 40]} size={[3, 3, 3]} color="brown" />
      <Building position={[45, 1.5, 35]} size={[3, 3, 3]} color="brown" />
      <Building position={[35, 1.5, 45]} size={[3, 3, 3]} color="brown" />
      
      {/* Military Base */}
      <Building position={[-50, 2, 50]} size={[20, 4, 20]} color="#1a2421" />
      <Building position={[-50, 6, 50]} size={[5, 8, 5]} color="#2a3431" />

      {/* Pond and Fish */}
      <mesh position={[60, 0.01, 60]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[10, 32]} />
        <meshStandardMaterial color="#0077be" transparent opacity={0.6} />
      </mesh>
      <Fish position={[60, 0.2, 60]} />
      <Fish position={[62, 0.2, 58]} />
      <Fish position={[58, 0.2, 62]} />
    </>
  );
};
