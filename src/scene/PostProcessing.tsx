import React from 'react';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { useScrollStore } from '../animation/scrollStore';

const PostProcessing = () => {
  return (
    <EffectComposer>
      <Bloom 
        luminanceThreshold={0.5} 
        luminanceSmoothing={0.9} 
        intensity={1.5} 
        mipmapBlur 
      />
      <Noise opacity={0.03} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
};

export default PostProcessing;