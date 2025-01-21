import { Controller } from "@hotwired/stimulus";
import * as THREE from "three";
import WebGL from 'three/addons/capabilities/WebGL.js';

// Connects to data-controller="threejs"
export default class extends Controller {
  static targets = ["canvas"];

  connect() {
    console.log("Stimulus: ", this.element);
    console.log("Canvas target found: ", this.canvasTarget);
    console.log("Canvas size: ", this.canvasTarget.clientWidth, this.canvasTarget.clientHeight);

    // Create scene, camera, renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000 
    );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.canvasTarget.clientWidth, this.canvasTarget.clientHeight);
    this.renderer.setClearColor(0xff0000, 1);
    this.canvasTarget.appendChild(this.renderer.domElement);

    this.geometry = new THREE.BoxGeometry();
    this.material = new THREE.MeshBasicMaterial({ color: 0x00FF00, wireframe: true });

    this.originCube = this.createCube(0, 0, 0);
    this.scene.add(this.originCube);

    this.camera.position.z = 5;

    console.log("Cube created:", this.originCube);
    console.log("Camera position: ", this.camera.position);
    console.log("Canvas size: ", this.canvasTarget.clientWidth, this.canvasTarget.clientHeight);

    if (WebGL.isWebGL2Available()) {
      // Start animation loop
      this.animate();
      this.resizeCanvas(); // Adjust canvas size initially
      window.addEventListener("resize", this.resizeCanvas.bind(this)); // Listen for window resize
    } else {
      const warning = WebGL.getWebGL2ErrorMessage();
      document.getElementById('container').appendChild(warning);
    }
  }

  createCube(x, y, z) {
    const cube = new THREE.Mesh(this.geometry, this.material);
    cube.position.set(x, y, z);
    return cube;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // Rotate cube
    this.originCube.rotation.x += 0.04;
    this.originCube.rotation.y += 0.04;

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
