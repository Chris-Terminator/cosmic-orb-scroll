import * as THREE from 'three';

export const AtmosphereShader = {
  uniforms: {
    uColor: { value: new THREE.Color('#4c8dff') },
    uGlowIntensity: { value: 2.0 },
    uTime: { value: 0.0 }
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uGlowIntensity;
    uniform float uTime;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      // Calculate fresnel effect (stronger at edges)
      vec3 viewDirection = normalize(-vPosition);
      float fresnel = dot(viewDirection, vNormal);
      fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
      
      // Power curve for sharper edge, softer inside
      float intensity = pow(fresnel, 3.0) * uGlowIntensity;
      
      // Subtle pulse based on time
      float pulse = 1.0 + sin(uTime * 2.0) * 0.1;
      
      gl_FragColor = vec4(uColor * intensity * pulse, intensity * pulse);
    }
  `
};