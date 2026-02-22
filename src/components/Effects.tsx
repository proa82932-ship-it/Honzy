import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

export const BloodParticles = ({ position }: { position: [number, number, number] }) => {
  const count = 20;
  const mesh = useRef<THREE.InstancedMesh>(null!);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        t: 0,
        speed: 0.1 + Math.random() * 0.2,
        direction: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          Math.random() * 2,
          (Math.random() - 0.5) * 2
        )
      });
    }
    return temp;
  }, []);

  const dummy = new THREE.Object3D();

  useFrame(() => {
    particles.forEach((p, i) => {
      p.t += 0.01;
      const pos = p.direction.clone().multiplyScalar(p.t * p.speed);
      dummy.position.set(position[0] + pos.x, position[1] + pos.y, position[2] + pos.z);
      dummy.scale.setScalar(Math.max(0, 1 - p.t));
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.05]} />
      <meshStandardMaterial color="red" />
    </instancedMesh>
  );
};
