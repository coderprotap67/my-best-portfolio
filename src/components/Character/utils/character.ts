import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  // নিশ্চিত করুন public/draco ফোল্ডারে ডিকোডার ফাইলগুলো আছে
  dracoLoader.setDecoderPath("/draco/"); 
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        // ডিক্রিপ্ট করা হচ্ছে
        const decryptedBuffer = await decryptFile(
          "/models/character.enc",
          "Character3D#@"
        );
        
        const blobUrl = URL.createObjectURL(new Blob([decryptedBuffer]));

        loader.load(
          blobUrl,
          async (gltf) => {
            const character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            
            character.traverse((child: any) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.frustumCulled = true;
              }
            });

            scene.add(character); // মডেলটি সিনে অ্যাড করা হলো
            setCharTimeline(character, camera);
            setAllTimeline();

            // মেমোরি ক্লিনআপ
            URL.revokeObjectURL(blobUrl); 
            dracoLoader.dispose();
            
            resolve(gltf);
          },
          undefined,
          (error) => {
            console.error("GLTF Load Error:", error);
            reject(error);
          }
        );
      } catch (err) {
        console.error("Character loading failed:", err);
        reject(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;