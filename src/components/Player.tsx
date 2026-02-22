import { useSphere } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useKeyboard } from '../hooks/useKeyboard';
import { useGameStore } from '../store';

const JUMP_FORCE = 4;
const SPEED = 5;
const SPRINT_MULTIPLIER = 1.8;

export const Player = () => {
  const { moveForward, moveBackward, moveLeft, moveRight, jump, sprint, shoot, reload, clothesColor } = useKeyboard();
  const { camera } = useThree();
  const viewMode = useGameStore((state) => state.viewMode);
  const updateAmmo = useGameStore((state) => state.updateAmmo);
  const ammo = useGameStore((state) => state.ammo);
  const isReloading = useGameStore((state) => state.isReloading);
  const setReloading = useGameStore((state) => state.setReloading);

  const gunRef = useRef<THREE.Group>(null);

  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 1, 0],
    args: [0.6],
  }));

  const velocity = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity]);

  const pos = useRef([0, 0, 0]);
  useEffect(() => api.position.subscribe((p) => (pos.current = p)), [api.position]);

  const lastShootTime = useRef(0);

  // Handle reload logic
  useEffect(() => {
    if ((reload || ammo === 0) && !isReloading && ammo < 30) {
      setReloading(true);
      const timer = setTimeout(() => {
        updateAmmo(30 - ammo);
        setReloading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [reload, ammo, isReloading, setReloading, updateAmmo]);

  useFrame((state) => {
    if (viewMode === 'FPP') {
      camera.position.copy(new THREE.Vector3(pos.current[0], pos.current[1] + 0.75, pos.current[2]));
    } else if (viewMode === 'TPP') {
      const offset = new THREE.Vector3(0, 2, 5).applyEuler(camera.rotation);
      camera.position.set(
        pos.current[0] + offset.x,
        pos.current[1] + offset.y,
        pos.current[2] + offset.z
      );
      camera.lookAt(pos.current[0], pos.current[1] + 0.5, pos.current[2]);
    } else if (viewMode === 'TOP') {
      camera.position.set(pos.current[0], pos.current[1] + 20, pos.current[2]);
      camera.lookAt(pos.current[0], pos.current[1], pos.current[2]);
      camera.rotation.z = 0; // Keep orientation consistent
    }

    const direction = new THREE.Vector3();
    
    // Combine keyboard and mobile inputs
    const { mobileX, mobileY } = useKeyboard();
    const moveZ = (Number(moveBackward) - Number(moveForward)) || -mobileY;
    const moveX = (Number(moveLeft) - Number(moveRight)) || -mobileX;

    const frontVector = new THREE.Vector3(0, 0, moveZ);
    const sideVector = new THREE.Vector3(moveX, 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED * (sprint ? SPRINT_MULTIPLIER : 1))
      .applyEuler(camera.rotation);

    api.velocity.set(direction.x, velocity.current[1], direction.z);

    if (jump && Math.abs(velocity.current[1]) < 0.05) {
      api.velocity.set(velocity.current[0], JUMP_FORCE, velocity.current[2]);
    }

    // Gun animation
    if (gunRef.current) {
      if (isReloading) {
        gunRef.current.position.y = THREE.MathUtils.lerp(gunRef.current.position.y, -0.6, 0.1);
        gunRef.current.rotation.x = THREE.MathUtils.lerp(gunRef.current.rotation.x, Math.PI / 4, 0.1);
      } else {
        gunRef.current.position.y = THREE.MathUtils.lerp(gunRef.current.position.y, -0.2, 0.1);
        gunRef.current.rotation.x = THREE.MathUtils.lerp(gunRef.current.rotation.x, 0, 0.1);
      }
    }

    if (shoot && ammo > 0 && !isReloading) {
      const now = Date.now();
      if (now - lastShootTime.current > 100) { // 10 rounds per second
        updateAmmo(-1);
        lastShootTime.current = now;
        
        // Visual feedback or raycasting would go here
      }
    }
  });

  return (
    <>
      <mesh ref={ref as any}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color={clothesColor || 'blue'} transparent opacity={viewMode === 'FPP' ? 0 : 1} />
      </mesh>
      {/* Gun model placeholder */}
      {viewMode === 'FPP' && (
        <group ref={gunRef} position={[0.3, -0.2, -0.5]}>
          <mesh>
            <boxGeometry args={[0.1, 0.1, 0.5]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </group>
      )}
    </>
  );
};
