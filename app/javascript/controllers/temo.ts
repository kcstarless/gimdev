import { Controller } from "@hotwired/stimulus";
import * as THREE from "three";
import WebGL from 'three/addons/capabilities/WebGL.js';
import axios from "axios"
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as dat from 'dat.gui';

// Connects to data-controller="threejs"
export default class extends Controller {
  static targets = ["canvas"];

  connect() {
    // SCENE
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x202025);

    // CAMERA
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000 
    );
    this.camera.position.set(10, 10, 40);

    // RENDERER
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.canvasTarget.clientWidth, this.canvasTarget.clientHeight);
    this.canvasTarget.appendChild(this.renderer.domElement);

    // CONTROLS
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    // HELPERS
    // this.addHelpers();


    // this.addCenter();

    // Store text meshes for animation
    this.textMeshes = [];

    // Initialize dat.GUI
    this.initGUI();

    if (WebGL.isWebGL2Available()) {
      // Start animation loop
      this.animate();
      this.resizeCanvas(); // Adjust canvas size initially
      window.addEventListener("resize", this.resizeCanvas.bind(this)); // Listen for window resize
      this.loadKeywords();
    } else {
      const warning = WebGL.getWebGL2ErrorMessage();
      document.getElementById('container').appendChild(warning);
    }
  }

  addCenter() {
    console.log("HELLO");
  
    // Create a sphere geometry
    this.centerGeo = new THREE.SphereGeometry(5, 1000, 1000);
  
    // Load the texture image
    const textureLoader = new THREE.TextureLoader();
    const sunTexture = textureLoader.load('/sun.jpg'); 


    // Create a material with the texture
    this.centerMat = new THREE.MeshBasicMaterial({ map: sunTexture });
  
    // Create the mesh with geometry and the textured material
    this.center = new THREE.Mesh(this.centerGeo, this.centerMat);
  
    // Add the mesh to the scene
    this.scene.add(this.center);
  }
  
  // Helpers
  addHelpers() {
    const axesHelper = new THREE.AxesHelper(20);
    this.scene.add(axesHelper);
  }

  // Initialize dat.GUI
  initGUI() {
    this.gui = new dat.GUI();

    // Add controls for camera position
    this.gui.add(this.camera.position, 'x', -100, 100).name('Camera X');
    this.gui.add(this.camera.position, 'y', -100, 100).name('Camera Y');
    this.gui.add(this.camera.position, 'z', 0, 200).name('Camera Z');

    // Add controls for material color
    this.materialColor = { color: '#FF5733' };
    this.gui.addColor(this.materialColor, 'color').onChange((value) => {
      this.textMeshes.forEach(mesh => {
        mesh.material.color.set(value);
      });
    }).name('Font Color');
  }
  

  // Load existing keywords based on frequency
  loadKeywords() {
    axios.get('/keywords')
    .then((response) => {
      // console.log("API Response:", response.data);
      this.createWordCloud(response.data);
    })
    .catch((error) => {
      console.error("Error fetching keywords: ", error);
    });
  }

  // Method to create the word cloud from keyword data
  createWordCloud(keywords) {
    console.log("Creating word cloud with keywords:", keywords);

    const material = new THREE.MeshBasicMaterial({ color: this.materialColor.color });

    // Create a random position function
    const randomPosition = () => {
      return new THREE.Vector3(
        (Math.random() - 0.5) * 20,  // X position (within a smaller range)
        (Math.random() - 0.5) * 20,  // Y position (within a smaller range)
        (Math.random() - 0.5) * 20   // Z position (within a smaller range)
      );
    };

    // Loop through each keyword
    keywords.forEach(keyword => {
      const size = Math.max(keyword.frequency * 0.5, 1);  // Adjust size based on frequency
      console.log(`Creating word: ${keyword.word} with size: ${size}`);
      this.create3DWord(keyword.word, size, randomPosition(), material);

    });
  }

  // Method to create 3D text for a word
  create3DWord(word, size, position, material) {
    const loader = new FontLoader();
    // Load the font asynchronously
    loader.load(
      'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',  // Font URL
      (font) => {
        console.log("Font loaded successfully:", font);
        
        // Now that the font is loaded, create the TextGeometry
        try {
          const geometry = new TextGeometry(word, {
            font: font,
            size: size,
            depth: 0.1,  // Thickness of the text
            curveSegments: 12,  // Number of segments for the curves
            bevelEnabled: true,  // Bevel effect for the text
            bevelThickness: 0.2,
            bevelSize: 0.1
          });
    
          // Create the mesh using geometry and material
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(position.x, position.y, position.z);  // Set position
          this.scene.add(mesh);  // Add mesh to the scene

          // Store the mesh for animation
          this.textMeshes.push(mesh);
        } catch (error) {
          console.error("Error creating TextGeometry:", error);
        }
      },
      undefined,  // Optional progress callback
      (error) => {
        console.error("Error loading font:", error);
      }
    );
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    // this.center.rotateY(0.01);
    // Animate each text mesh
    this.textMeshes.forEach((mesh, index) => {
      // Rotate the text
      // mesh.rotation.y += 0.01;

      // Add a floating effect
      // mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.02;
    });
    
    this.renderer.render(this.scene, this.camera);
  }

  resizeCanvas() {
    // Get the current size of the canvas container
    const width = this.canvasTarget.clientWidth;
    const height = this.canvasTarget.clientHeight;

    // Resize renderer
    this.renderer.setSize(width, height);

    // Update camera aspect ratio
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
