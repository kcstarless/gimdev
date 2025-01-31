import { Controller } from "@hotwired/stimulus";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import axios from "axios";

// Connects to data-controller="threejs"
export default class extends Controller {
  static targets = ["canvas"];

  connect() {
    console.log("Three.js Canvas Connected!");
    this.radiusValue = 10;
    this.initThree();
    this.animate();
  }

  initThree() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x202025);

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 35;

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.canvasTarget.clientWidth, this.canvasTarget.clientHeight);
    this.canvasTarget.appendChild(this.renderer.domElement);

    // Trackball controls
    this.controls = new TrackballControls(this.camera, this.renderer.domElement);
    this.controls.update();

    // Load keywords from API
    this.loadKeywords();
  }

  // Create cloud of keywords
  createCloud(keywords) {
    const count = keywords.length;
    const group = new THREE.Group();
    const spherical = new THREE.Spherical();
    const phiSpan = Math.PI / (count + 1);
    const thetaSpan = (Math.PI * 2) / count;

    keywords.forEach((keyword, index) => {
      const phi = phiSpan * (index + 1);
      const theta = thetaSpan * index;
      const pos = new THREE.Vector3().setFromSpherical(spherical.set(this.radiusValue, phi, theta));

      // Create a word and add it to the group
      const word = this.createWord(keyword, pos);
      group.add(word);
    });

    // After the group is populated, add it to the scene
    this.scene.add(group);
    console.log("Group added to scene");
  }

  // Create 2D word sprite
  createWord(text, position) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set canvas size based on text length
    const fontSize = 32;
    const padding = 10;
    context.font = `${fontSize}px Arial`;
    const textWidth = context.measureText(text.word).width;
    canvas.width = textWidth + padding * 2;
    canvas.height = fontSize + padding * 2;

    // Redraw text on canvas
    context.font = `${fontSize}px Arial`;
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text.word, canvas.width / 2, canvas.height / 2);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter; // Ensure text is sharp

    // Create sprite material
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });

    // Create sprite
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(position); // Set the word's position
    sprite.scale.set(canvas.width / 7, canvas.height / 7, 1); // Scale sprite

    // Store original text data for later use
    sprite.userData = { text: text, hovered: false };

    // Optional: Add interactions
    sprite.onPointerOver = () => {
      sprite.userData.hovered = true;
      document.body.style.cursor = 'pointer';
    };

    sprite.onPointerOut = () => {
      sprite.userData.hovered = false;
      document.body.style.cursor = 'auto';
    };

    sprite.onClick = () => {
      console.log('clicked:', text);
    };

    return sprite;
  }

  // Fetch keywords from API
  loadKeywords() {
    axios.get('/keywords')
      .then((response) => {
        console.log("API Response:", response.data);
        this.createCloud(response.data);
      })
      .catch((error) => {
        console.error("Error fetching keywords: ", error);
        return [];
      });
  }

  // Animation loop
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // Update opacity based on word position
    this.scene.traverse((object) => {
      if (object instanceof THREE.Sprite) {
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);
        const wordDirection = object.position.clone().normalize();
        const dot = cameraDirection.dot(wordDirection);

        // Map dot product (-1 to 1) to opacity (1 to 0.3)
        const opacity = THREE.MathUtils.mapLinear(dot, -1, 1, 1.5, 0.1);
        object.material.opacity = opacity;
      }
    });

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
} 



import { Controller } from "@hotwired/stimulus";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import axios from "axios";

export default class extends Controller {
  static targets = ["canvas"];

  connect() {
    console.log("Three.js Canvas Connected!");
    this.radiusValue = 15;
    this.initThree();
    this.animate();
  }

  initThree() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x202025);

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(10, 10, 30);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.canvasTarget.clientWidth, this.canvasTarget.clientHeight);
    this.canvasTarget.appendChild(this.renderer.domElement);

    // Trackball controls
    this.controls = new TrackballControls(this.camera, this.renderer.domElement);

    // Load keywords from API and create cloud
    this.loadKeywords();
  }

  // Animation loop
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.updateTextOpacity();
    this.renderer.render(this.scene, this.camera);
  }

  // Update text opacity based on camera angle
  updateTextOpacity() {
    const cameraDirection = new THREE.Vector3();
    this.camera.getWorldDirection(cameraDirection);
    this.scene.traverse((object) => {
      if (object.isMesh && object.material.map instanceof THREE.Texture) {
        object.quaternion.copy(this.camera.quaternion);
        const dotProduct = cameraDirection.dot(object.position.clone().normalize());
        object.material.opacity = THREE.MathUtils.clamp(1 - Math.max(0, dotProduct), 0.1, 1.0);
      }
    });
  }

  // Fetch keywords from API
  loadKeywords() {
    axios.get('/keywords')
      .then((response) => { this.createCloud(response.data); })
      .catch((error) => { console.error("Error fetching keywords: ", error); });
  }

  // Create cloud of keywords
  createCloud(keywords) {
    const group = new THREE.Group();
    const spherical = new THREE.Spherical();
    const phiSpan = Math.PI / (keywords.length + 1);
    const thetaSpan = (Math.PI * 2) / keywords.length;

    keywords.forEach((keyword, index) => {
      const phi = phiSpan * (index + 1);
      const theta = thetaSpan * index;
      const pos = new THREE.Vector3().setFromSpherical(spherical.set(this.radiusValue, phi, theta));
      group.add(this.createWord(keyword.word, pos));
    });

    this.scene.add(group);
  }

  // Create 3D word texture from text
  createWord(text, position) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    // const canvasWidth = window.innerWidth * 2;
    // const canvasHeight = window.innerHeight * 2;
    // canvas.width = canvasWidth;
    // canvas.height = canvasHeight;
    
    context.font = '48px Arial';
    context.fillStyle = 'white';
    context.fillText(text, 0, 50);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";


    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1.0,
    });

    const geometry = new THREE.PlaneGeometry(canvas.width / 10, canvas.height / 10);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    return mesh;
  }
}
import { Controller } from "@hotwired/stimulus";
import * as THREE from "three";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader.js";
import { Font } from 'three/examples/jsm/loaders/FontLoader.js'; // Corrected the import path
import axios from "axios";

export default class extends Controller {
  static targets = ["canvas"];

  connect() {
    console.log("Three.js Canvas Connected!");
    this.radiusValue = 20;
    this.keywordObjects = []; // Initialize keywordObjects here
    this.isMouseOverText = false; // Initialize flag for mouse over text
    this.initThree();
    this.animate();
  }

  initThree() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x202025);

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 55);
    // this.camera.position.x -= 10;

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.canvasTarget.clientWidth, this.canvasTarget.clientHeight);
    this.canvasTarget.appendChild(this.renderer.domElement);

    // Trackball controls
    this.controls = new TrackballControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 2.0; // Increase rotation speed (default is 1.0)
    this.controls.zoomSpeed = 1.2; // Increase zoom speed (default is 1.2)
    this.controls.panSpeed = 0.8;

    // Event listeners for hover effect
    this.hoveredMesh = null;
    this.canvasTarget.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvasTarget.addEventListener('click', this.onMouseClick.bind(this));

    // Load keywords from API and create cloud
    this.loadKeywords();
  }

  // Animation loop
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.updateTextOpacity();
    this.updateHoverColor();
    if (this.keywordObjects.length > 0 && !this.isMouseOverText) { // Ensure keywordObjects is not empty and mouse is not over text
      this.rotateKeywords(); // Rotate the keywords around the sphere
    }
    this.renderer.render(this.scene, this.camera);
  }

  // Update text opacity based on camera angle
  updateTextOpacity() {
    const cameraDirection = new THREE.Vector3();
    this.camera.getWorldDirection(cameraDirection);
    this.scene.traverse((object) => {
      if (object.isMesh && object.geometry.type === "TextGeometry") {
        object.quaternion.copy(this.camera.quaternion); // Text always faces the front
        const dotProduct = cameraDirection.dot(object.position.clone().normalize());
        object.material.opacity = THREE.MathUtils.clamp(1 - Math.max(0, dotProduct), 0.1, 1.0);
      }
    });
  }

  // Fetch keywords from API
  loadKeywords() {
    axios.get('/keywords')
      .then((response) => { this.createCloud(response.data); })
      .catch((error) => { console.error("Error fetching keywords: ", error); });
  }

  // Create cloud of keywords
  createCloud(keywords) {
    const group = new THREE.Group();
    this.keywordObjects = []; // Array to store keyword meshes
    const spherical = new THREE.Spherical();
    const phiSpan = Math.PI / (keywords.length + 1);
    const thetaSpan = (Math.PI * 2) / keywords.length;

    const fontLoader = new TTFLoader();
    fontLoader.load('/Righteous-Regular.ttf', (ttf) => {
      const font = new Font(ttf);
      keywords.forEach((keyword, index) => {
        const phi = phiSpan * (index + 1);
        const theta = thetaSpan * index;
        const pos = new THREE.Vector3().setFromSpherical(spherical.set(this.radiusValue, phi, theta));
        const wordMesh = this.createWord(keyword, pos, font);
        group.add(wordMesh);
        this.keywordObjects.push({ mesh: wordMesh, phi, theta }); // Store mesh and initial spherical coordinates
      });
      this.scene.add(group);
      this.group = group; // Store the group for later use in animation
    });
  }

  // Create 3D word mesh from text
  createWord(text, position, font) {
    const geometry = new TextGeometry(text.word, {
      font: font,
      size: 5,
      depth: 0.05,
    });

    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      toneMapped: false,
      transparent: true,
      opacity: 1.0,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.userData.text = text.word;
    return mesh;
  }

  onMouseMove(event) {
    const rect = this.canvasTarget.getBoundingClientRect();
    const mouse = new THREE.Vector2(); 
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    const intersects = raycaster.intersectObjects(this.scene.children, true);
    if (intersects.length > 0) {
      if (this.hoveredMesh !== intersects[0].object) {
        this.hoveredMesh = intersects[0].object;
        this.canvasTarget.style.cursor = 'pointer';
        this.isMouseOverText = true; // Set flag to true when mouse is over text
      }
    } else {
      this.hoveredMesh = null;
      this.canvasTarget.style.cursor = 'default';
      this.isMouseOverText = false; // Set flag to false when mouse is not over text
    }
  }

  updateHoverColor() {
    if (this.hoveredMesh) {
      this.hoveredMesh.material.color.lerp(new THREE.Color(0xd52a47), 0.1); // Orange color
    }

    // Reset color of previously hovered mesh
    this.scene.traverse((object) => {
      if (object.isMesh && object !== this.hoveredMesh) {
        object.material.color.lerp(new THREE.Color(0xffffff), 0.1); // White color
      }
    });
  }

  onMouseClick(event) {
    const rect = this.canvasTarget.getBoundingClientRect();
    const mouse = new THREE.Vector2(); 
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    const intersects = raycaster.intersectObjects(this.scene.children, true);
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      if (clickedObject.isMesh && clickedObject.geometry.type === "TextGeometry") {
        console.log("Text clicked: ", clickedObject.userData.text);
        const targetPath = "/posts"; // Replace with the Rails path
        window.location.href = targetPath;
      }
    }
  }

  rotateKeywords() {
    const rotationSpeed = 0.01; // Adjust this value to change the rotation speed
    const spherical = new THREE.Spherical();
    this.keywordObjects.forEach((keywordObj) => {
      keywordObj.theta += rotationSpeed; // Increase the theta value to rotate the keyword
      const pos = new THREE.Vector3().setFromSpherical(spherical.set(this.radiusValue, keywordObj.phi, keywordObj.theta));
      keywordObj.mesh.position.copy(pos);
      keywordObj.mesh.quaternion.copy(this.camera.quaternion); // Keep the text facing the camera
    });
  }
}
