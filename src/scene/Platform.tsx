import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '../animation/scrollStore';

const Platform = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    if (materialRef.current) {
      const progress = useScrollStore.getState().progress;
      
      // We want the platform to fade in or appear as the orb lands.
      // Progress 0.0 -> 0.6: opacity 0
      // Progress 0.6 -> 1.0: opacity 0 -> 1
      const opacity = Math.max(0, (progress - 0.6) / 0.4);
      materialRef.current.opacity = opacity;
    }
  });

  return (
    <group position={[0, -3.3, 2]}>
      <mesh ref={meshRef} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20, 64, 64]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#0a1122"
          roughness={0.2}
          metalness={0.8}
          transparent={true}
          opacity={0}
        />
      </mesh>
      
      {/* Grid overlay for a more "sci-fi" / landing pad look */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[20, 20, 20, 20]} />
        <meshBasicMaterial
          color="#4c8dff"
          wireframe={true}
          transparent={true}
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export default Platform;