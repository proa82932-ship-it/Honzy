import { useSphere } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export const Bird = ({ position }: { position: [number, number, number] }) => {
  const [ref, api] = useSphere(() => ({
    mass: 0.1,
    position,
    args: [0.2],
  }));

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    api.position.set(
      position[0] + Math.sin(t) * 5,
      position[1] + Math.cos(t * 0.5) * 2,
      position[2] + Math.cos(t) * 5
    );
  });

  return (
    <mesh ref={ref as any}>
      <coneGeometry args={[0.1, 0.4, 4]} />
      <meshStandardMaterial color="black" />
      {/* Wings */}
      <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.4, 0.05, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-0.2, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.4, 0.05, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </mesh>
  );
};

export const Fish = ({ position }: { position: [number, number, number] }) => {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.position.x = position[0] + Math.sin(t) * 3;
    mesh.current.position.z = position[2] + Math.cos(t) * 3;
    mesh.current.rotation.y = -t;
  });

  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[0.4, 0.1, 0.2]} />
      <meshStandardMaterial color="orange" />
      {/* Tail */}
      <mesh position={[-0.25, 0, 0]}>
        <boxGeometry args={[0.1, 0.2, 0.1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </mesh>
  );
};
