import React, { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  const mouse = useRef({ x: 0, y: 0, active: false });
  const { camera, gl } = useThree();
  const particleCount = 1200;
  
  // Reusable vectors to avoid garbage collection
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const intersectPoint = useMemo(() => new THREE.Vector3(), []);
  const localPoint = useMemo(() => new THREE.Vector3(), []);
  const mouseVec2 = useMemo(() => new THREE.Vector2(), []);

  // Set up mouse tracking
  useEffect(() => {
    const canvas = gl.domElement;
    
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.current.active = true;
    };

    const handleMouseLeave = () => {
      mouse.current.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [gl]);
  
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
    
    const { clock } = state;
    const time = clock.getElapsedTime();
    
    // Rotate the particle system
    ref.current.rotation.y = time * 0.05;
    ref.current.rotation.x = Math.sin(time * 0.1) * 0.1;

    const geometry = ref.current.geometry;
    if (!geometry) return;
    
    const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute;
    if (!positionAttribute) return;

    const positionsArray = positionAttribute.array as Float32Array;
    
    // Calculate mouse position in local particle space
    let localMouseX = 0;
    let localMouseY = 0;
    let localMouseZ = 0;
    let hasValidMouse = false;
    
    if (mouse.current.active) {
      // Cast ray from camera through mouse position
      mouseVec2.set(mouse.current.x, mouse.current.y);
      raycaster.setFromCamera(mouseVec2, camera);
      
      // Find intersection with z=0 plane
      const intersects = raycaster.ray.intersectPlane(plane, intersectPoint);
      
      if (intersects) {
        // Transform world point to local space of the rotating particles
        ref.current.updateMatrixWorld();
        localPoint.copy(intersectPoint);
        ref.current.worldToLocal(localPoint);
        
        localMouseX = localPoint.x;
        localMouseY = localPoint.y;
        localMouseZ = localPoint.z;
        hasValidMouse = true;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      const ox = originalPositions[ix];
      const oy = originalPositions[iy];
      const oz = originalPositions[iz];

      const waveX = Math.sin(time * 0.5 + oy * 0.5) * 0.2;
      const waveY = Math.cos(time * 0.3 + ox * 0.5) * 0.2;
      
      let forceX = 0;
      let forceY = 0;
      let forceZ = 0;
      
      if (hasValidMouse) {
        // Calculate 3D distance from mouse in LOCAL space
        const dx = positionsArray[ix] - localMouseX;
        const dy = positionsArray[iy] - localMouseY;
        const dz = positionsArray[iz] - localMouseZ;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Repulsion force
        const strength = Math.max(0, 3 - dist) * 0.5;
        
        if (dist > 0.001 && strength > 0) {
          const invDist = 1 / dist;
          forceX = dx * invDist * strength;
          forceY = dy * invDist * strength;
          forceZ = dz * invDist * strength;
        }
      }
      
      const targetX = ox + waveX + forceX;
      const targetY = oy + waveY + forceY;
      const targetZ = oz + forceZ;

      // Smooth interpolation
      positionsArray[ix] += (targetX - positionsArray[ix]) * 0.08;
      positionsArray[iy] += (targetY - positionsArray[iy]) * 0.08;
      positionsArray[iz] += (targetZ - positionsArray[iz]) * 0.08;
    }
    
    positionAttribute.needsUpdate = true;
  });

  return (
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
  );
}

// Fallback component when WebGL fails or is loading
const HeroFallback: React.FC = () => (
  <div className="absolute inset-0 bg-gradient-to-b from-brand-dark to-slate-900" />
);

const ThreeHero: React.FC = () => {
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
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
