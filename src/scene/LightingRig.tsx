import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '../animation/scrollStore';

const LightingRig = () => {
  const blueLightRef = useRef<THREE.PointLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  useFrame(() => {
    const progress = useScrollStore.getState().progress;
    
    // Animate lighting based on scroll position to emphasize the "landing"
    if (spotLightRef.current) {
      // Spotlight comes from above, intensity increases as we land
      spotLightRef.current.intensity = 5 + progress * 15;
      spotLightRef.current.position.set(0, 10 - progress * 5, 2);
    }

    if (blueLightRef.current) {
      // Side rim light
      blueLightRef.current.intensity = 2 + progress * 5;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.2} color="#ffffff" />
      
      <pointLight 
        ref={blueLightRef}
        position={[-5, 2, -2]} 
        color="#4c8dff" 
        intensity={2} 
        distance={20}
      />
      
      <pointLight 
        position={[5, -2, -2]} 
        color="#ff4c8d" 
        intensity={1.5} 
        distance={20}
      />

      <spotLight
        ref={spotLightRef}
        position={[0, 10, 0]}
        angle={0.5}
        penumbra={0.5}
        color="#ffffff"
        intensity={5}
        castShadow
      />
    </group>
  );
};

export default LightingRig;