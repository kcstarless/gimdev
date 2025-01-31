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
    this.scene.background = new THREE.Color(0x202025);
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
    this.controls = new TrackballControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 2.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
  }

  addEventListeners() {
    this.hoveredMesh = null;
    this.canvasTarget.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvasTarget.addEventListener('click', this.onMouseClick.bind(this));
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.updateTextOpacity();
    this.updateHoverColor();
    if (this.keywordObjects.length > 0 && !this.isMouseOverText) {
      this.rotateKeywords();
    }
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
        this.isMouseOverText = true;
      }
    } else {
      this.hoveredMesh = null;
      this.canvasTarget.style.cursor = 'default';
      this.isMouseOverText = false;
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
        window.location.href = "/posts";
      }
    }
  }

  rotateKeywords() {
    const rotationSpeed = 0.005;
    const spherical = new THREE.Spherical();
    this.keywordObjects.forEach((keywordObj) => {
      keywordObj.theta += rotationSpeed;
      const pos = new THREE.Vector3().setFromSpherical(spherical.set(this.radiusValue , keywordObj.phi, keywordObj.theta));
      keywordObj.mesh.position.copy(pos);
      keywordObj.mesh.quaternion.copy(this.camera.quaternion);
    });
  }
}
