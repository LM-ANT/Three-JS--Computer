import * as THREE from 'three';
import { renderer, scene } from './renderer.js';
import { bloomComposer, finalComposer } from './postProcessing.js';


export default class setupRender {

    constructor() {
        this.BLOOM_SCENE = 1;

        this.bloomLayer = new THREE.Layers();
        this.bloomLayer.set(BLOOM_SCENE);

        this.darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
        this.materials = {};

        render();

        function render() {
            this.requestAnimationFrame(render);
            this.renderBloom();
            this.finalComposer.render();
        }


        function renderBloom() {
            this.scene.traverse(darkenNonBloomed);
            this.bloomComposer.render();
            this.scene.traverse(restoreMaterial);
        }

        function darkenNonBloomed(obj) {
            if (obj.isMesh && this.bloomLayer.test(obj.layers) === false) {
                this.materials[obj.uuid] = obj.material;
                obj.material = this.darkMaterial;
            }
        }

        function restoreMaterial(obj) {
            if (this.materials[obj.uuid]) {
                obj.material = this.materials[obj.uuid];
                delete this.materials[obj.uuid];
            }
        }
    }
}