import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadingManager } from './loadingManager.js';
import { scene } from './renderer.js';

export default class setupLoader {

	constructor() {

		const loader = new GLTFLoader(loadingManager);

		Promise.all([
			loader.loadAsync('src/assets/models/lightStreet.glb'),
			loader.loadAsync('src/assets/models/signStreet.glb'),
			loader.loadAsync('src/assets/models/buildings.glb')
		]).then((models) => {
			// get what you need from the models array
			const neon = models[0].scene;
			const sign = models[1].scene;
			const building = models[2].scene;

			neon.traverse(function (child) {
				this.child.layers.enable(1);
				this.child.castShadow = true;
				this.child.receiveShadow = true;
			});

			sign.traverse(function (child) {
				this.child.layers.enable(0);
				this.child.castShadow = true;
				this.child.receiveShadow = true;
			});

			building.traverse(function (child) {
				this.child.layers.enable(0);
				this.child.castShadow = true;
				this.child.receiveShadow = true;
			});

			// add both models to the scene
			this.scene.add(neon);
			this.scene.add(sign);
			this.scene.add(building);
		});
	}
}