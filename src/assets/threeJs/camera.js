import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { renderer } from './renderer.js';


export default class setupCamera {

    constructor() {
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 200);
    
        this.camera.position.set(15, 3, 2);
        this.camera.lookAt(0, 0, 0);

        this.controls = new OrbitControls(camera, renderer.domElement);
        this.controls.minDistance = 1;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.maxDistance = 100;
    }

}