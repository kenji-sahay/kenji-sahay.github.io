// three-hero.js (particle field animation)
(function(){
  const canvas = document.getElementById('hero-canvas');
  if(!canvas) return;

  // Respect reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.set(0, 0, 15);

  // Create particle field
  const particleCount = 800;
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  for(let i = 0; i < particleCount; i++){
    const i3 = i * 3;
    // Random position in a sphere
    positions[i3] = (Math.random() - 0.5) * 30;
    positions[i3 + 1] = (Math.random() - 0.5) * 30;
    positions[i3 + 2] = (Math.random() - 0.5) * 30;

    // Store velocity for animation
    velocities.push({
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
      z: (Math.random() - 0.5) * 0.02
    });
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Create material with subtle blue tint
  const material = new THREE.PointsMaterial({
    size: 0.12,
    color: 0x4a90ff,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Add subtle ambient shapes
  const geo1 = new THREE.IcosahedronGeometry(2, 0);
  const mat1 = new THREE.MeshBasicMaterial({
    color: 0x1a5cff,
    wireframe: true,
    transparent: true,
    opacity: 0.1
  });
  const shape1 = new THREE.Mesh(geo1, mat1);
  shape1.position.set(-5, 3, -5);
  scene.add(shape1);

  const shape2 = shape1.clone();
  shape2.position.set(6, -2, -3);
  scene.add(shape2);

  function sizeToHero(){
    const hero = canvas.parentElement;
    const w = hero.clientWidth || window.innerWidth;
    const h = hero.clientHeight || Math.max(240, window.innerHeight * 0.45);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  sizeToHero();

  new ResizeObserver(sizeToHero).observe(canvas.parentElement);
  window.addEventListener('resize', sizeToHero, { passive: true });

  let time = 0;
  function tick(){
    time += 0.005;

    // Animate particles
    const pos = particles.geometry.attributes.position.array;
    for(let i = 0; i < particleCount; i++){
      const i3 = i * 3;
      const vel = velocities[i];

      // Gentle flowing motion
      pos[i3] += vel.x;
      pos[i3 + 1] += vel.y + Math.sin(time + i * 0.01) * 0.01;
      pos[i3 + 2] += vel.z;

      // Wrap around bounds
      if(Math.abs(pos[i3]) > 15) pos[i3] *= -0.95;
      if(Math.abs(pos[i3 + 1]) > 15) pos[i3 + 1] *= -0.95;
      if(Math.abs(pos[i3 + 2]) > 15) pos[i3 + 2] *= -0.95;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    // Rotate particles slowly
    particles.rotation.y = time * 0.1;
    particles.rotation.x = Math.sin(time * 0.5) * 0.1;

    // Rotate shapes
    shape1.rotation.x += 0.005;
    shape1.rotation.y += 0.003;
    shape2.rotation.x -= 0.004;
    shape2.rotation.y -= 0.006;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
})();
