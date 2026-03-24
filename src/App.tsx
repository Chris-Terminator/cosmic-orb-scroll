import React from 'react';
import CosmicOrbSection from './sections/CosmicOrbSection';

const App = () => {
  return (
    <div className="w-full relative">
      <div className="h-screen flex items-center justify-center bg-black/50 text-neutral-400">
        <p>Scroll down to begin sequence</p>
      </div>
      
      <CosmicOrbSection />
      
      <div className="h-screen flex items-center justify-center bg-black/50 text-neutral-400">
        <p>Sequence complete</p>
      </div>
    </div>
  );
};

export default App;