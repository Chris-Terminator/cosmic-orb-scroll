import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '../animation/scrollStore';

const StarField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particleCount = 2000;
  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const siz = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      // Create a cylinder/sphere-like spread
      const r = 20 + Math.random() * 30;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) - 10; // Shift back
      
      siz[i] = Math.random() * 2.0;
    }
    return { positions: pos, sizes: siz };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      // Very slow base rotation
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
      
      // Parallax effect from scroll
      const progress = useScrollStore.getState().progress;
      pointsRef.current.position.y = progress * 5; // move stars up as we "land"
      pointsRef.current.position.z = progress * 10; // parallax zoom
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default StarField;