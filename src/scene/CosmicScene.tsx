import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import LightingRig from './LightingRig';
import Orb from './Orb';
import Platform from './Platform';
import StarField from './StarField';
import PostProcessing from './PostProcessing';

const CosmicScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 45 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      dpr={[1, 2]} // Cap pixel ratio for performance
    >
      <color attach="background" args={['#030305']} />
      
      <Suspense fallback={null}>
        <LightingRig />
        <StarField />
        <Orb />
        <Platform />
        <PostProcessing />
        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default CosmicScene;