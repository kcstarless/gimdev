import * as THREE from 'three';

export const addAxesHelper = (scene) =>  {
    const helper = new THREE.AxesHelper(5);
    scene.add(helper);
}