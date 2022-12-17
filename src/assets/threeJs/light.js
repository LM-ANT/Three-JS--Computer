import * as THREE from 'three';
import { scene } from './renderer.js';

export default class setupLight {

    constructor() {

        this.light = new THREE.AmbientLight(0x000E38); // soft white light
        this.light.castShadow = true;
        this.light.receiveShadow = true;
        this.scene.add(light);
    }
}