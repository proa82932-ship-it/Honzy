import { useBox, useRaycastVehicle, useSphere } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useKeyboard } from '../hooks/useKeyboard';

export type VehicleType = 'SEDAN' | 'POLICE' | 'TRUCK';

interface VehicleProps {
  position: [number, number, number];
  type?: VehicleType;
}

export const Vehicle = ({ position, type = 'SEDAN' }: VehicleProps) => {
  const [health, setHealth] = useState(100);
  const [isSirenOn, setIsSirenOn] = useState(false);
  
  const chassisArgs: [number, number, number] = type === 'TRUCK' ? [2.5, 1.5, 6] : [2, 1, 4];
  const mass = type === 'TRUCK' ? 2000 : 1200;
  
  const [chassisBody, chassisApi] = useBox(() => ({
    mass,
    position,
    args: chassisArgs,
    onCollide: (e) => {
      if (e.contact.impactVelocity > 10) {
        setHealth(prev => Math.max(0, prev - (e.contact.impactVelocity - 10) * 2));
      }
    }
  }));

  const wheelRefs = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];

  const wheelInfo = {
    radius: 0.4,
    directionLocal: [0, -1, 0] as [number, number, number],
    suspensionStiffness: 30,
    suspensionRestLength: 0.3,
    maxSuspensionForce: 100000,
    maxSuspensionTravel: 0.3,
    dampingRelaxation: 2.3,
    dampingCompression: 4.4,
    axleLocal: [-1, 0, 0] as [number, number, number],
    chassisConnectionPointLocal: [1, 0, 1] as [number, number, number],
    useCustomSlidingFrictionForce: false,
    customSlidingFrictionForce: 0.6,
    frictionSlip: 2,
    sideFrictionStiffness: 1,
  };

  const wheels = [
    { ...wheelInfo, chassisConnectionPointLocal: [-1, -0.4, 1.5] as [number, number, number], isFrontWheel: true },
    { ...wheelInfo, chassisConnectionPointLocal: [1, -0.4, 1.5] as [number, number, number], isFrontWheel: true },
    { ...wheelInfo, chassisConnectionPointLocal: [-1, -0.4, -1.5] as [number, number, number], isFrontWheel: false },
    { ...wheelInfo, chassisConnectionPointLocal: [1, -0.4, -1.5] as [number, number, number], isFrontWheel: false },
  ];

  const [vehicle, vehicleApi] = useRaycastVehicle(() => ({
    chassisBody,
    wheels: wheelRefs as any,
    wheelInfos: wheels,
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1,
  }));

  const { moveForward, moveBackward, moveLeft, moveRight, jump } = useKeyboard();

  useFrame(() => {
    const engineForce = 1500;
    const brakeForce = 100;
    const steerValue = 0.5;

    // Acceleration
    const force = (Number(moveForward) - Number(moveBackward)) * engineForce;
    vehicleApi.applyEngineForce(force, 2);
    vehicleApi.applyEngineForce(force, 3);

    // Steering
    const steer = (Number(moveLeft) - Number(moveRight)) * steerValue;
    vehicleApi.setSteeringValue(steer, 0);
    vehicleApi.setSteeringValue(steer, 1);

    // Braking
    if (jump) {
      vehicleApi.setBrake(brakeForce, 0);
      vehicleApi.setBrake(brakeForce, 1);
      vehicleApi.setBrake(brakeForce, 2);
      vehicleApi.setBrake(brakeForce, 3);
    } else {
      vehicleApi.setBrake(0, 0);
      vehicleApi.setBrake(0, 1);
      vehicleApi.setBrake(0, 2);
      vehicleApi.setBrake(0, 3);
    }

    if (type === 'POLICE' && Math.random() > 0.95) {
      setIsSirenOn(prev => !prev);
    }
  });

  const getBodyColor = () => {
    if (health <= 0) return '#333';
    if (type === 'POLICE') return '#000';
    if (type === 'TRUCK') return '#2d4a22';
    return '#8b0000';
  };

  return (
    <group>
      <mesh ref={chassisBody as any} castShadow>
        <boxGeometry args={chassisArgs} />
        <meshStandardMaterial color={getBodyColor()} />
        
        {/* Cabin */}
        <mesh position={[0, chassisArgs[1] * 0.75, 0]}>
          <boxGeometry args={[chassisArgs[0] * 0.9, chassisArgs[1] * 0.8, chassisArgs[2] * 0.5]} />
          <meshStandardMaterial color={type === 'POLICE' ? 'white' : 'black'} transparent opacity={0.6} />
        </mesh>

        {/* Police Siren */}
        {type === 'POLICE' && (
          <group position={[0, chassisArgs[1] * 1.2, 0]}>
            <mesh position={[-0.4, 0, 0]}>
              <boxGeometry args={[0.4, 0.2, 0.2]} />
              <meshStandardMaterial color={isSirenOn ? 'red' : '#500'} emissive="red" emissiveIntensity={isSirenOn ? 2 : 0} />
            </mesh>
            <mesh position={[0.4, 0, 0]}>
              <boxGeometry args={[0.4, 0.2, 0.2]} />
              <meshStandardMaterial color={!isSirenOn ? 'blue' : '#005'} emissive="blue" emissiveIntensity={!isSirenOn ? 2 : 0} />
            </mesh>
          </group>
        )}

        {/* Damage Smoke */}
        {health < 50 && (
          <mesh position={[0, 1, 1.5]}>
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshStandardMaterial color="gray" transparent opacity={0.5} />
          </mesh>
        )}
      </mesh>
      
      {/* Wheels */}
      {wheelRefs.map((ref, i) => (
        <mesh key={i} ref={ref as any}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
    </group>
  );
};
