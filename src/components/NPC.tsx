import { useBox } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

interface NPCProps {
  position: [number, number, number];
  type: 'CIVILIAN' | 'POLICE' | 'MILITARY';
}

export const NPC = ({ position, type }: NPCProps) => {
  const [health, setHealth] = useState(100);
  const [ref, api] = useBox(() => ({
    mass: 1,
    position,
    args: [0.6, 1.8, 0.6],
    onCollide: (e) => {
      // Handle collision with bullets
    }
  }));

  const color = type === 'POLICE' ? 'blue' : type === 'MILITARY' ? 'darkgreen' : 'beige';
  
  // Simple AI movement
  const target = useRef(new THREE.Vector3(position[0], position[1], position[2]));
  const lastUpdate = useRef(0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (time - lastUpdate.current > 5) {
      target.current.set(
        position[0] + (Math.random() - 0.5) * 10,
        position[1],
        position[2] + (Math.random() - 0.5) * 10
      );
      lastUpdate.current = time;
    }

    // Move towards target
    // api.velocity.set(...)
  });

  return (
    <mesh ref={ref as any} castShadow>
      <boxGeometry args={[0.6, 1.8, 0.6]} />
      <meshStandardMaterial color={color} />
      {/* Head */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.25]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
    </mesh>
  );
};
