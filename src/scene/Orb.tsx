import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SurfaceShader } from '../shaders/orbSurface';
import { AtmosphereShader } from '../shaders/orbAtmosphere';
import { useScrollStore } from '../animation/scrollStore';

const Orb = () => {
  const groupRef = useRef<THREE.Group>(null);
  const surfaceMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const atmosphereMaterialRef = useRef<THREE.ShaderMaterial>(null);
  
  const surfaceUniforms = useMemo(() => THREE.UniformsUtils.clone(SurfaceShader.uniforms), []);
  const atmosphereUniforms = useMemo(() => THREE.UniformsUtils.clone(AtmosphereShader.uniforms), []);

  // Create a cinematic curve path
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-8, 5, -20),   // Start: deep left, high
      new THREE.Vector3(6, 2, -10),    // Mid 1: sweep right
      new THREE.Vector3(0, 0, -5),     // Mid 2: center, coming forward
      new THREE.Vector3(0, -1.8, 2)    // End: center down, landed on platform
    ]);
  }, []);

  useFrame((state) => {
    if (surfaceMaterialRef.current) {
      surfaceMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (atmosphereMaterialRef.current) {
      atmosphereMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }

    if (groupRef.current) {
      const progress = useScrollStore.getState().progress;
      
      // Get point on curve based on scroll progress
      // Add a slight easing so it feels heavy
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
      const position = curve.getPoint(easeProgress);
      
      // Lerp current position to target for smooth interpolation
      // ScrollTrigger already scrubs, but this adds a tiny bit of momentum lag
      groupRef.current.position.lerp(position, 0.1);
      
      // Rotate the orb
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1 + progress * Math.PI * 2;
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.05;
      
      // Pulse atmosphere based on progress (glows more on landing)
      if (atmosphereMaterialRef.current) {
        atmosphereMaterialRef.current.uniforms.uGlowIntensity.value = 2.0 + progress * 3.0;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Core Orb */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.5, 64, 64]} />
        <shaderMaterial
          ref={surfaceMaterialRef}
          vertexShader={SurfaceShader.vertexShader}
          fragmentShader={SurfaceShader.fragmentShader}
          uniforms={surfaceUniforms}
        />
      </mesh>
      
      {/* Atmosphere shell */}
      <mesh>
        <sphereGeometry args={[1.7, 64, 64]} />
        <shaderMaterial
          ref={atmosphereMaterialRef}
          vertexShader={AtmosphereShader.vertexShader}
          fragmentShader={AtmosphereShader.fragmentShader}
          uniforms={atmosphereUniforms}
          transparent={true}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export default Orb;