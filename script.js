document.addEventListener('DOMContentLoaded', () => {
  const loaderContainer = document.getElementById('loader-container');
  const loaderText = document.getElementById('loader-text');
  let loadProgress = 0;
  
  loaderText.textContent = "";

  const textTimeline = gsap.timeline({
    repeat: -1,
    yoyo: true,
    yoyoEase: "power2.out",
    repeatDelay: 0.5
  });

  textTimeline.to(loaderText, {
    duration: 1,
    text: {
      value: "Kinikan Bakery",
      delimiter: ""
    },
    ease: "none"
  });

  textTimeline.to(loaderText, {
    duration: 0.5,
    text: "Kinikan Bakery",
    ease: "none"
  });

  const resources = [
    "https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js",
    "https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/GLTFLoader.js",
    "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js",
    "images/pero.jpg",
    "3d-models/phone/scene.gltf",
    "3d-models/Salute.fbx",
    "3d-models/human/source/dress2.fbx"
  ];

  let loadedCount = 0;

  // Function to simulate progress in text
  function updateProgress() {
    loadedCount++;
    loadProgress = Math.min(90, (loadedCount / resources.length) * 100);
  }

  function loadResource(url) {
    return new Promise((resolve, reject) => {
      if (url.endsWith('.js')) {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
          updateProgress();
          resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
      } else if (url.endsWith('.jpg') || url.endsWith('.png')) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          updateProgress();
          resolve();
        };
        img.onerror = reject;
      } else if (url.endsWith('.gltf') || url.endsWith('.fbx')) {
        setTimeout(() => {
          updateProgress();
          resolve();
        }, 1500);
      }
    }).catch(err => {
      console.error(`Failed to load ${url}:`, err);
      updateProgress();
    });
  }

  // Preload all resources
  Promise.all(resources.map(url => loadResource(url)))
    .then(() => {
      initThreeJS();
    });

  function initThreeJS() {
    gsap.to(loaderText, {
      text: "Kinikan Bakery",
      duration: 1,
      ease: "power1.inOut",
      onComplete: () => {
        setTimeout(() => {
          gsap.to(loaderContainer, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
              loaderContainer.style.display = "none";
              textTimeline.kill();
            }
          });
        }, 1000);
      }
    });
  }
});

// The rest of your existing JavaScript follows
// Make sure to wrap your existing code in functions that can be called after loading
// For example:

//function initHeaderSection() {
//  // Your existing header section code
//}
//
//function initContactSection() {
//  // Your existing contact section code
//}

// Modify your existing DOMContentLoaded event listeners to be function declarations
// that you can call after the loader is complete

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded");
    
    const canvas = document.getElementById('header-section');
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
            
    try {
        const h = window.innerHeight/3;
        const w = window.innerWidth;
        
        if (typeof THREE === 'undefined') {
            console.error("THREE.js not loaded!");
            return;
        }
                
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
        });
        
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(w, h);
        
        const aspectRatio = w / h;
        const frustumSize = 8; 
                
        const camera = new THREE.OrthographicCamera(
            frustumSize * aspectRatio / -2, // left
            frustumSize * aspectRatio / 3,  // right
            frustumSize / 3,                // top
            frustumSize / -3,               // bottom
            0.1,                            // near
            100                             // far
        );
        camera.position.set(0, 0, 15);
                
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xfae4d0);
        
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('images/pero.jpg');
        
        const geometry = new THREE.BoxGeometry(7, 7, 7);
        const material = new THREE.MeshStandardMaterial({ 
            map: texture,
            roughness: 0.5,
            metalness: 0.25
        });
        const cube = new THREE.Mesh(geometry, material);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xfae4d0, 1.5, 50);
        pointLight.position.set(5, 5, 10);
        scene.add(pointLight);
        
        const spotLight = new THREE.SpotLight(0xf9c49a, 1.2, 30, Math.PI / 6, 0.5);
        spotLight.position.set(-5, 8, 15);
        spotLight.target = cube;
        scene.add(spotLight);
        
        cube.position.set(0, 0, 0);
        scene.add(cube);
                
        const leftEdge = -frustumSize * aspectRatio / 4 - 8.5;
        
        gsap.to(cube.position, {
            x: leftEdge,
            z: 7,
            duration: 2,
            ease: "power2.out"
        });
        
        function animate() {
            requestAnimationFrame(animate);
            cube.rotation.y += 0.0035;
            renderer.render(scene, camera);
        }
        animate();
        
        window.addEventListener('resize', () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight/3;
            const newAspectRatio = newWidth / newHeight;
            
            camera.left = frustumSize * newAspectRatio / -2;
            camera.right = frustumSize * newAspectRatio / 2;
            camera.top = frustumSize / 2;
            camera.bottom = frustumSize / -2;
            camera.updateProjectionMatrix();
            
            renderer.setSize(newWidth, newHeight);
            
            const newLeftEdge = -frustumSize * newAspectRatio / 2 - 3.5;
            
            gsap.to(cube.position, {
                x: newLeftEdge,
                duration: 1,
                ease: "power2.out"
                    });
            });
                
    } catch (error) {
        console.error("Error initializing Three.js:", error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('contact-section');

    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
        
    try {
        const h = window.innerHeight * 0.5;
        const w = window.innerWidth;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
        });
            
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(w, h);
        
        const aspectRatio = w / h;
        const frustumSize = 8; // This value controls how much of the scene is visible
                
        const camera = new THREE.OrthographicCamera(
            frustumSize * aspectRatio / -2, // left
            frustumSize * aspectRatio / 3,  // right
            frustumSize / 3,                // top
            frustumSize / -3,               // bottom
            0.1,                            // near
            100                             // far
        );
        camera.position.set(3, 0, 12);
        
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf9c49a);   
        
        let phoneModel;
        
        const loader = new THREE.GLTFLoader();
                
        loader.load(
            "3d-models/phone/scene.gltf", 
            (gltf) => {
                phoneModel = gltf.scene;
                
                phoneModel.scale.set(3, 3, 3);
        
                phoneModel.position.set(0, 0, 0);
        
                scene.add(phoneModel);
            }
        );
                
        const spotLight = new THREE.SpotLight(0xffffff, 1.5);
        spotLight.position.set(0, 10, 5);
        spotLight.angle = Math.PI / 8;
        spotLight.penumbra = 0.45;
        spotLight.decay = 2;
        spotLight.distance = 0;
        spotLight.castShadow = true;
        
        spotLight.target.position.set(-1, 0, 0);
        scene.add(spotLight.target);
        
        scene.add(spotLight);
        
        const ambientLight = new THREE.AmbientLight(0x404040, 1.6);
        scene.add(ambientLight);
        let isVibrating = false;
        let vibrationStartTime = 0;
        const vibrationDuration = 500; 
        
        function animate() {
            requestAnimationFrame(animate);
        
            const currentTime = performance.now();
        
            if (phoneModel) {
                if (isVibrating) {
                    const elapsed = currentTime - vibrationStartTime;
        
                    if (elapsed < vibrationDuration) {
                        const intensity = 0.05;
                        phoneModel.position.x = -5 + (Math.random() - 0.5) * intensity;
                        phoneModel.position.y = (Math.random() - 0.5) * intensity;
                    } else {
                        phoneModel.position.x = -5;
                        phoneModel.position.y = 0;
                        isVibrating = false;
                    }
                }
            }
        
            renderer.render(scene, camera);
        }
        animate()

        setInterval(() => {
            isVibrating = true;
            vibrationStartTime = performance.now();
        }, 4000);
        
    } catch (error) {
        console.error("Error initializing Three.js:", error);
    }
});