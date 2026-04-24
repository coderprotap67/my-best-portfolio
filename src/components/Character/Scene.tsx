import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement | null>(null); // Nullable করা হয়েছে
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  const [character, setChar] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    // কেন এই চেক? canvasDiv.current ছাড়া Three.js রেন্ডারার বসানো সম্ভব নয়।
    if (!canvasDiv.current) return;

    const currentCanvas = canvasDiv.current;
    let rect = currentCanvas.getBoundingClientRect();
    let container = { width: rect.width, height: rect.height };
    const aspect = container.width / container.height;
    const scene = sceneRef.current;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // পারফরম্যান্স অপ্টিমাইজেশন
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    currentCanvas.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.set(0, 13.1, 24.7);
    camera.updateProjectionMatrix();

    let headBone: THREE.Object3D | null = null;
    let screenLight: any | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    const clock = new THREE.Clock();

    const light = setLighting(scene);
    let progress = setProgress((value) => setLoading(value));
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    // Resize লজিক - এখানে 'character' সরাসরি স্টেট থেকে না নিয়ে ফাংশন প্যারামিটার থেকে নেয়া নিরাপদ
    const onResize = () => {
      if (currentCanvas && character) {
        // resizeUtils এর টাইপ অনুযায়ী canvasDiv (Ref) অথবা currentCanvas (Element) পাঠান
        handleResize(renderer, camera, canvasDiv as any, character);
      }
    };

    loadCharacter().then((gltf) => {
      if (gltf) {
        const animations = setAnimations(gltf);
        if (hoverDivRef.current) {
          animations.hover(gltf, hoverDivRef.current);
        }
        
        mixer = animations.mixer;
        const loadedChar = gltf.scene;
        setChar(loadedChar);
        scene.add(loadedChar);
        
        headBone = loadedChar.getObjectByName("spine006") || null;
        screenLight = loadedChar.getObjectByName("screenlight") || null;
        
        progress.loaded().then(() => {
          setTimeout(() => {
            light.turnOnLights();
            animations.startIntro();
          }, 2500);
        });

        window.addEventListener("resize", onResize);
      }
    });

    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };

    const onMouseMoveWrapper = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => (mouse = { x, y }));
    };

    let debounceTimer: ReturnType<typeof setTimeout>;
    const onTouchStart = (event: TouchEvent) => {
      const element = event.target as HTMLElement;
      debounceTimer = setTimeout(() => {
        element?.addEventListener("touchmove", (e: TouchEvent) =>
          handleTouchMove(e, (x, y) => (mouse = { x, y }))
        );
      }, 200);
    };

    const onTouchEndWrapper = () => {
      handleTouchEnd((x, y, iX, iY) => {
        mouse = { x, y };
        interpolation = { x: iX, y: iY };
      });
    };

    document.addEventListener("mousemove", onMouseMoveWrapper);
    const landingDiv = document.getElementById("landingDiv");
    if (landingDiv) {
      landingDiv.addEventListener("touchstart", onTouchStart);
      landingDiv.addEventListener("touchend", onTouchEndWrapper);
    }

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        light.setPointLight(screenLight);
      }
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup Function - এটি মেমোরি লিক এবং হোয়াইট স্ক্রিন বন্ধ করতে সাহায্য করে
    return () => {
      clearTimeout(debounceTimer);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", onMouseMoveWrapper);
      
      if (landingDiv) {
        landingDiv.removeEventListener("touchstart", onTouchStart);
        landingDiv.removeEventListener("touchend", onTouchEndWrapper);
      }

      if (currentCanvas && renderer.domElement) {
        currentCanvas.removeChild(renderer.domElement);
      }

      scene.clear();
      renderer.dispose();
    };
  }, [character, setLoading]); // dependencies ঠিক করা হয়েছে

  return (
    <div className="character-container">
      <div className="character-model" ref={canvasDiv}>
        <div className="character-rim"></div>
        <div className="character-hover" ref={hoverDivRef}></div>
      </div>
    </div>
  );
};

export default Scene;