// Three.js Scene Setup
class ThreeScene {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        
        // Check for WebGL support
        if (!this.isWebGLAvailable()) {
            const warning = document.createElement('div');
            warning.className = 'webgl-warning';
            warning.textContent = 'WebGL is not supported in your browser';
            this.canvas.parentNode.appendChild(warning);
            return;
        }

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        try {
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance'
            });
            
            this.init();
        } catch (e) {
            console.error('WebGL initialization failed:', e);
            return;
        }
    }

    isWebGLAvailable() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Setup camera
        this.camera.position.z = 5;
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
        
        // Start animation loop
        this.animate();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        if (!this.renderer) return;
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize scenes if WebGL is available
let landingScene, featuresScene;
try {
    landingScene = new ThreeScene('landing-canvas');
    featuresScene = new ThreeScene('features-canvas');
} catch (e) {
    console.error('Scene initialization failed:', e);
}

// Add particles to landing scene with reduced count for better performance
function createParticles(scene) {
    if (!scene || !scene.scene) return null;
    
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    // Reduced particle count for better performance
    for (let i = 0; i < 2000; i++) {
        vertices.push(
            Math.random() * 1000 - 500,
            Math.random() * 1000 - 500,
            Math.random() * 1000 - 500
        );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 2,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.scene.add(particles);
    
    return particles;
}

// Create futuristic city with optimized geometry
function createCity(scene) {
    if (!scene || !scene.scene) return null;
    
    const cityGroup = new THREE.Group();
    const buildingGeometries = [];
    const buildingMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8,
        emissive: 0x00ffff,
        emissiveIntensity: 0.2
    });
    
    // Reduced building count for better performance
    for (let i = 0; i < 30; i++) {
        const geometry = new THREE.BoxGeometry(
            Math.random() * 2 + 1,
            Math.random() * 10 + 5,
            Math.random() * 2 + 1
        );
        
        const building = new THREE.Mesh(geometry, buildingMaterial);
        building.position.set(
            Math.random() * 40 - 20,
            geometry.parameters.height / 2,
            Math.random() * 40 - 20
        );
        building.castShadow = true;
        building.receiveShadow = true;
        
        cityGroup.add(building);
        buildingGeometries.push(geometry);
    }
    
    scene.scene.add(cityGroup);
    return cityGroup;
}

// Create optimized hologram effect
function createHologram(scene) {
    if (!scene || !scene.scene) return null;
    
    const geometry = new THREE.TorusGeometry(2, 0.5, 16, 50); // Reduced segments
    const material = new THREE.MeshPhongMaterial({
        color: 0xff00ff,
        transparent: true,
        opacity: 0.6,
        emissive: 0xff00ff,
        emissiveIntensity: 0.5,
        wireframe: true
    });
    
    const hologram = new THREE.Mesh(geometry, material);
    scene.scene.add(hologram);
    
    return hologram;
}

let landingParticles, featuresParticles, city, hologram;

// Initialize 3D elements only if scenes were created successfully
if (landingScene && featuresScene) {
    landingParticles = createParticles(landingScene);
    featuresParticles = createParticles(featuresScene);
    city = createCity(landingScene);
    hologram = createHologram(featuresScene);
}

// Optimized animation function
function animateScene() {
    // Only animate if elements exist
    if (landingParticles) {
        landingParticles.rotation.y += 0.0005;
    }
    if (featuresParticles) {
        featuresParticles.rotation.y += 0.0005;
    }
    if (city) {
        city.rotation.y += 0.0005;
    }
    if (hologram) {
        hologram.rotation.x += 0.005;
        hologram.rotation.y += 0.005;
        hologram.material.opacity = 0.6 + Math.sin(Date.now() * 0.001) * 0.2;
    }
    
    requestAnimationFrame(animateScene);
}

// Add optimized mouse movement effect
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    if (landingScene && landingScene.camera) {
        landingScene.camera.position.x += (mouseX - landingScene.camera.position.x) * 0.02;
        landingScene.camera.position.y += (mouseY - landingScene.camera.position.y) * 0.02;
        landingScene.camera.lookAt(landingScene.scene.position);
    }
    
    if (featuresScene && featuresScene.camera) {
        featuresScene.camera.position.x += (mouseX - featuresScene.camera.position.x) * 0.02;
        featuresScene.camera.position.y += (mouseY - featuresScene.camera.position.y) * 0.02;
        featuresScene.camera.lookAt(featuresScene.scene.position);
    }
}, { passive: true });

// Start animation loop only if WebGL is available
if (landingScene && featuresScene) {
    animateScene();
}