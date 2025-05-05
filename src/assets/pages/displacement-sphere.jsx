import { useEffect, useRef } from 'react';
import {
  AmbientLight,
  DirectionalLight,
  LinearSRGBColorSpace,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  UniformsUtils,
  Vector2,
  WebGLRenderer,
} from 'three';
import fragmentShader from './displacement-sphere-fragment.glsl?raw';
import vertexShader from './displacement-sphere-vertex.glsl?raw';

export const DisplacementSphere = () => {
  const start = useRef(Date.now());
  const canvasRef = useRef();
  const mouse = useRef(new Vector2(0.8, 0.5));
  const renderer = useRef();
  const camera = useRef();
  const scene = useRef();
  const lights = useRef();
  const uniforms = useRef();
  const material = useRef();
  const geometry = useRef();
  const sphere = useRef();

  useEffect(() => {
    const { innerWidth, innerHeight } = window;
    
    // Initialize renderer
    renderer.current = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.current.setSize(innerWidth, innerHeight);
    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.current.outputColorSpace = LinearSRGBColorSpace;

    // Initialize camera
    camera.current = new PerspectiveCamera(54, innerWidth / innerHeight, 0.1, 100);
    camera.current.position.z = 52;

    // Initialize scene
    scene.current = new Scene();

    // Initialize material
    material.current = new MeshPhongMaterial();
    material.current.onBeforeCompile = shader => {
      uniforms.current = UniformsUtils.merge([
        shader.uniforms,
        { time: { type: 'f', value: 0 } },
      ]);

      shader.uniforms = uniforms.current;
      shader.vertexShader = vertexShader;
      shader.fragmentShader = fragmentShader;
    };

    // Initialize sphere
    geometry.current = new SphereGeometry(32, 128, 128);
    sphere.current = new Mesh(geometry.current, material.current);
    sphere.current.position.z = 0;
    sphere.current.modifier = Math.random();
    scene.current.add(sphere.current);

    // Initialize lights
    const dirLight = new DirectionalLight(0xffffff, 2.0);
    const ambientLight = new AmbientLight(0xffffff, 0.4);

    dirLight.position.z = 200;
    dirLight.position.x = 100;
    dirLight.position.y = 100;

    lights.current = [dirLight, ambientLight];
    lights.current.forEach(light => scene.current.add(light));

    // Handle resize
    const handleResize = () => {
      const { innerWidth, innerHeight } = window;
      renderer.current.setSize(innerWidth, innerHeight);
      camera.current.aspect = innerWidth / innerHeight;
      camera.current.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Handle mouse move
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (uniforms.current !== undefined) {
        uniforms.current.time.value = 0.00005 * (Date.now() - start.current);
      }

      sphere.current.rotation.z += 0.001;
      sphere.current.rotation.x = mouse.current.y * 0.5;
      sphere.current.rotation.y = mouse.current.x * 0.5;

      renderer.current.render(scene.current, camera.current);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      scene.current.remove(sphere.current);
      geometry.current.dispose();
      material.current.dispose();
      renderer.current.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
};
