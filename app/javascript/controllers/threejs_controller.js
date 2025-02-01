import { Controller } from "@hotwired/stimulus";
import * as THREE from "three";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader.js";
import { Font } from 'three/examples/jsm/loaders/FontLoader.js'; // Corrected the import path
import axios from "axios";


export default class extends Controller {
  static targets = ["canvas"];

  connect() {
    // console.log("Three.js Canvas Connected!");
    this.radiusValue = 30;
    this.keywordObjects = [];
    this.isMouseOverText = false;
    this.initThree();
    this.animate();
  }

  initThree() {
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupControls();
    this.addEventListeners();
    this.loadKeywords();
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#342056");

        // // Create wireframe sphere
        // const geometry = new THREE.SphereGeometry(this.radiusValue / 4, 32, 32);
        // const material = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true });
        // const wireframe = new THREE.Mesh(geometry, material);
        // this.scene.add(wireframe);
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 55);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.canvasTarget.clientWidth, this.canvasTarget.clientHeight);
    this.canvasTarget.appendChild(this.renderer.domElement);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.enablePan = false;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 1.0;
  }

  addEventListeners() {
    this.hoveredMesh = null;
    this.canvasTarget.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvasTarget.addEventListener('click', this.onMouseClick.bind(this));
    window.addEventListener("resize", this.resizeCanvas.bind(this));
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    this.controls.update();
    this.updateTextOpacity();
    this.updateHoverColor();
    this.renderer.render(this.scene, this.camera);
  }

  updateTextOpacity() {
    const cameraDirection = new THREE.Vector3();
    this.camera.getWorldDirection(cameraDirection);
    this.scene.traverse((object) => {
      if (object.isMesh && object.geometry.type === "TextGeometry") {
        object.quaternion.copy(this.camera.quaternion);
        const dotProduct = cameraDirection.dot(object.position.clone().normalize());
        object.material.opacity = THREE.MathUtils.clamp(1 - Math.max(0, dotProduct), 0.1, 1.0);
      }
    });
  }

  loadKeywords() {
    axios.get('/keywords')
      .then((response) => { this.createCloud(response.data); })
      .catch((error) => { console.error("Error fetching keywords: ", error); });
  }

  createCloud(keywords) {
    const group = new THREE.Group();
    this.keywordObjects = [];
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
        this.keywordObjects.push({ mesh: wordMesh, phi, theta });
      });
      this.scene.add(group);
      this.group = group;
    });
  }

  createWord(text, position, font) {
    const geometry = new TextGeometry(text.word, {
        font: font,
        size: 3,
        depth: 0.05,
    });

    // Compute bounding box for the text geometry
    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox;

    // Create main text mesh
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        toneMapped: false,
        transparent: true,
        opacity: 1.0,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.userData.text = text.word;

    // Create invisible hover plane
    const size = new THREE.Vector3();
    bbox.getSize(size);
    
    const hoverGeometry = new THREE.PlaneGeometry(size.x, size.y);
    const hoverMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false
    });

    const hoverPlane = new THREE.Mesh(hoverGeometry, hoverMaterial);
    hoverPlane.userData.isHoverPlane = true;
    
    // Position the hover plane at the center of the text
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    hoverPlane.position.copy(center);
    
    // Align with text mesh rotation
    hoverPlane.quaternion.copy(mesh.quaternion);
    
    mesh.add(hoverPlane);

    return mesh;
}

// Add this new method to handle common intersection logic
getIntersection(event) {
  const rect = this.canvasTarget.getBoundingClientRect();
  const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, this.camera);

  const intersects = raycaster.intersectObjects(this.scene.children, true);
  
  if (intersects.length === 0) return null;

  const firstIntersect = intersects[0].object;
  return firstIntersect.userData.isHoverPlane ? firstIntersect.parent : firstIntersect;
}

// Updated mouse handlers
onMouseMove(event) {
  const hoveredObject = this.getIntersection(event);
  
  if (hoveredObject) {
      if (this.hoveredMesh !== hoveredObject) {
          this.hoveredMesh = hoveredObject;
          this.canvasTarget.style.cursor = 'pointer';
          this.isMouseOverText = true;
          this.controls.autoRotate = false;
      }
  } else {
      this.hoveredMesh = null;
      this.canvasTarget.style.cursor = 'default';
      this.isMouseOverText = false;
      this.controls.autoRotate = true;
  }
}

onMouseClick(event) {
  const clickedObject = this.getIntersection(event);
  
  if (clickedObject?.isMesh && clickedObject.geometry.type === "TextGeometry") {
      const url = `/posts_by_keyword?keyword=${encodeURIComponent(clickedObject.userData.text)}`;
      window.location.href = url;
      console.log("Navigating to:", url);
  }
}

  updateHoverColor() {
    if (this.hoveredMesh) {
      this.hoveredMesh.material.color.lerp(new THREE.Color(0xd52a47), 0.1);
    }

    this.scene.traverse((object) => {
      if (object.isMesh && object !== this.hoveredMesh) {
        object.material.color.lerp(new THREE.Color(0xffffff), 0.1);
      }
    });
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

  // Cleanup
  disconnect() {
    cancelAnimationFrame(this.animationFrameId);
    this.renderer.dispose();
    this.controls.dispose();
    super.disconnect();
  }
}
