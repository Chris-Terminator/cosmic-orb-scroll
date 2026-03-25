import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollStore } from '../animation/scrollStore';

const EARTH_TEXTURES = {
  albedo: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
  normal: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
  clouds: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
};

const Orb = () => {
  const groupRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-8, -2, -20),
      new THREE.Vector3(6, 2, -10),
      new THREE.Vector3(0, 0, -5),
      new THREE.Vector3(0, -1.8, 2),
    ]);
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const progress = useScrollStore.getState().progress;

    if (earthRef.current) {
      earthRef.current.rotation.y = time * 0.05;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y = time * 0.06;
    }

    if (groupRef.current) {
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const position = curve.getPoint(easeProgress);
      groupRef.current.position.lerp(position, 0.1);

      groupRef.current.rotation.y = progress * Math.PI;
      groupRef.current.rotation.x = time * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <EarthSurface earthRef={earthRef} />
      <EarthClouds cloudRef={cloudRef} />
    </group>
  );
};

const EarthSurface = ({ earthRef }: { earthRef: React.RefObject<THREE.Mesh | null> }) => {
  const [albedo, normal] = useTexture([
    EARTH_TEXTURES.albedo,
    EARTH_TEXTURES.normal
  ]);

  const uniforms = useMemo(() => ({
    uBounceIntensity: { value: 0 },
    uBounceColor: { value: new THREE.Color("#ffcc88") }
  }), []);

  useFrame(() => {
    const progress = useScrollStore.getState().progress;
    // Bring the underside bounce in sooner
    const proximity = Math.max(0, (progress - 0.2) / 0.8);
    uniforms.uBounceIntensity.value = Math.pow(proximity, 2.0) * 0.25;
  });

  const onBeforeCompile = useMemo(() => (shader: THREE.WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uBounceIntensity = uniforms.uBounceIntensity;
    shader.uniforms.uBounceColor = uniforms.uBounceColor;
    
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
      #include <common>
      varying vec3 vWorldNormal;
      `
    );
    
    shader.vertexShader = shader.vertexShader.replace(
      '#include <worldpos_vertex>',
      `
      #include <worldpos_vertex>
      vWorldNormal = normalize((modelMatrix * vec4(objectNormal, 0.0)).xyz);
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform float uBounceIntensity;
      uniform vec3 uBounceColor;
      varying vec3 vWorldNormal;
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `
      #include <dithering_fragment>
      float bottomDot = max(0.0, dot(vWorldNormal, vec3(0.0, -1.0, 0.0)));
      vec3 bounceGlow = uBounceColor * pow(bottomDot, 2.0) * uBounceIntensity;
      gl_FragColor = vec4(gl_FragColor.rgb + bounceGlow, gl_FragColor.a);
      `
    );
  }, [uniforms]);

  return (
    <mesh ref={earthRef} castShadow receiveShadow>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial
        map={albedo}
        normalMap={normal}
        roughness={0.7}
        metalness={0.1}
        normalScale={new THREE.Vector2(1.5, 1.5)}
        onBeforeCompile={onBeforeCompile}
      />
    </mesh>
  );
};

const EarthClouds = ({ cloudRef }: { cloudRef: React.RefObject<THREE.Mesh | null> }) => {
  const clouds = useTexture(EARTH_TEXTURES.clouds);

  const uniforms = useMemo(() => ({
    uBounceIntensity: { value: 0 },
    uBounceColor: { value: new THREE.Color("#ffcc88") }
  }), []);

  useFrame(() => {
    const progress = useScrollStore.getState().progress;
    // Bring the cloud bounce in sooner
    const proximity = Math.max(0, (progress - 0.2) / 0.8);
    uniforms.uBounceIntensity.value = Math.pow(proximity, 2.0) * 0.15;
  });

  const onBeforeCompile = useMemo(() => (shader: THREE.WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uBounceIntensity = uniforms.uBounceIntensity;
    shader.uniforms.uBounceColor = uniforms.uBounceColor;
    
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
      #include <common>
      varying vec3 vWorldNormal;
      `
    );
    
    shader.vertexShader = shader.vertexShader.replace(
      '#include <worldpos_vertex>',
      `
      #include <worldpos_vertex>
      vWorldNormal = normalize((modelMatrix * vec4(objectNormal, 0.0)).xyz);
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform float uBounceIntensity;
      uniform vec3 uBounceColor;
      varying vec3 vWorldNormal;
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `
      #include <dithering_fragment>
      float bottomDot = max(0.0, dot(vWorldNormal, vec3(0.0, -1.0, 0.0)));
      vec3 bounceGlow = uBounceColor * pow(bottomDot, 2.0) * uBounceIntensity;
      gl_FragColor = vec4(gl_FragColor.rgb + bounceGlow, gl_FragColor.a);
      `
    );
  }, [uniforms]);

  return (
    <mesh ref={cloudRef}>
      <sphereGeometry args={[1.52, 64, 64]} />
      <meshStandardMaterial
        map={clouds}
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        onBeforeCompile={onBeforeCompile}
      />
    </mesh>
  );
};

export default Orb;
