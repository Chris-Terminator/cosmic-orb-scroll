import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '../animation/scrollStore';

const Platform = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uOpacity: { value: 0 },
      uColor: { value: new THREE.Color("#ffcc88") }
    }),
    []
  );

  useFrame(() => {
    if (materialRef.current) {
      const progress = useScrollStore.getState().progress;
      // Start fade-in sooner to match the light
      const proximity = Math.max(0, (progress - 0.2) / 0.8);
      const eased = Math.pow(proximity, 1.5);
      uniforms.uOpacity.value = eased * 0.7;
    }
  });

  return (
    <group position={[0, -4.5, 2]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <shaderMaterial
          ref={materialRef}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uOpacity;
            uniform vec3 uColor;
            varying vec2 vUv;

            void main() {
              vec2 uvCentered = vUv - vec2(0.5);
              uvCentered.y *= 1.5;
              float distSquished = length(uvCentered);
              float falloff = smoothstep(0.5, 0.0, distSquished);
              float finalGlow = pow(falloff, 2.0);
              gl_FragColor = vec4(uColor, finalGlow * uOpacity);
            }
          `}
        />
      </mesh>
    </group>
  );
};

export default Platform;
