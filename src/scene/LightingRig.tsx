import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '../animation/scrollStore';

const LightingRig = () => {
  const bottomGlowLightRef = useRef<THREE.PointLight>(null);
  const sunLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    const progress = useScrollStore.getState().progress;

    if (bottomGlowLightRef.current) {
      // Start much sooner (progress > 0.2 instead of 0.4)
      const proximity = Math.max(0, (progress - 0.2) / 0.8);
      // Smoother, earlier ease (power 2 instead of 3)
      const eased = Math.pow(proximity, 2);
      bottomGlowLightRef.current.intensity = eased * 40.0;
      bottomGlowLightRef.current.position.set(0, -6, 2); 
    }

    if (sunLightRef.current) {
      sunLightRef.current.position.x = 5 + Math.sin(progress * Math.PI) * 2;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.05} color="#0b1026" />

      <directionalLight
        ref={sunLightRef}
        position={[10, 8, 5]}
        color="#fff5e6"
        intensity={4.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      <directionalLight
        position={[-10, -5, -5]}
        color="#3a5a80"
        intensity={0.6}
      />

      <pointLight
        ref={bottomGlowLightRef}
        position={[0, -6, 2]}
        color="#ffcc88"
        intensity={0}
        distance={20}
        decay={2.5}
      />
    </group>
  );
};

export default LightingRig;
