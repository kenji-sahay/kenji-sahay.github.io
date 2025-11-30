import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  const particleCount = 1200;
  
  const [positions, originalPositions] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const orig = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 5 + Math.random() * 2;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      
      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;
    }
    return [pos, orig];
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    
    const { pointer, clock } = state;
    const time = clock.getElapsedTime();
    
    ref.current.rotation.y = time * 0.05;
    ref.current.rotation.x = Math.sin(time * 0.1) * 0.1;

    const geometry = ref.current.geometry;
    if (!geometry) return;
    
    const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute;
    if (!positionAttribute) return;

    const positionsArray = positionAttribute.array as Float32Array;
    
    const mouseX = pointer.x * 6;
    const mouseY = pointer.y * 6;

    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      const ox = originalPositions[ix];
      const oy = originalPositions[iy];
      const oz = originalPositions[iz];

      const waveX = Math.sin(time * 0.5 + oy * 0.5) * 0.2;
      const waveY = Math.cos(time * 0.3 + ox * 0.5) * 0.2;
      
      const dx = positionsArray[ix] - mouseX;
      const dy = positionsArray[iy] - mouseY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      const force = Math.max(0, 2 - dist);
      const angle = Math.atan2(dy, dx);
      
      const targetX = ox + waveX + (Math.cos(angle) * force * 0.5);
      const targetY = oy + waveY + (Math.sin(angle) * force * 0.5);
      const targetZ = oz;

      positionsArray[ix] += (targetX - positionsArray[ix]) * 0.1;
      positionsArray[iy] += (targetY - positionsArray[iy]) * 0.1;
      positionsArray[iz] += (targetZ - positionsArray[iz]) * 0.1;
    }
    
    positionAttribute.needsUpdate = true;
  });

  return (
    <group rotation={[0, 0, 0]}>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          transparent
          color="#3b82f6"
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.8}
        />
      </points>
    </group>
  );
}

// Fallback component when WebGL fails or is loading
const HeroFallback: React.FC = () => (
  <div className="absolute inset-0 bg-gradient-to-b from-brand-dark to-slate-900" />
);

const ThreeHero: React.FC = () => {
  const [webGLSupported, setWebGLSupported] = React.useState(true);

  React.useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
      }
    } catch (e) {
      setWebGLSupported(false);
    }
  }, []);

  return (
    <div className="h-[60vh] w-full bg-gradient-to-b from-brand-dark to-slate-900 relative overflow-hidden">
      {webGLSupported && (
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<HeroFallback />}>
            <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
              <ambientLight intensity={0.5} />
              <ParticleField />
            </Canvas>
          </Suspense>
        </div>
      )}
      
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="bg-black/20 backdrop-blur-sm p-8 rounded-3xl border border-white/5 shadow-2xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-brand-glow via-brand-primary to-brand-accent">
            En Garde Data
          </h1>
          <p className="text-blue-200 text-lg md:text-xl max-w-2xl text-center px-4 font-mono tracking-wide">
            &lt; Internship_Journal /&gt; &bull; &lt; Tech_Blog /&gt; &bull; &lt; Portfolio /&gt;
          </p>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-0 w-full flex justify-center z-20 pointer-events-none">
        <div className="animate-float text-brand-primary/70 flex flex-col items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest">Scroll to Explore</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ThreeHero;
