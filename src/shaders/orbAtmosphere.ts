import * as THREE from 'three';

export const AtmosphereShader = {
  uniforms: {
    uColor: { value: new THREE.Color('#7eb8f7') },
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
    uniform float uTime;

    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec3 viewDirection = normalize(-vPosition);
      float fresnel = dot(viewDirection, vNormal);
      fresnel = clamp(1.0 - fresnel, 0.0, 1.0);

      float intensity = pow(fresnel, 3.0) * 1.2;

      gl_FragColor = vec4(uColor * intensity, intensity);
    }
  `
};
