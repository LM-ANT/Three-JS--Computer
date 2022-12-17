<script>
	//import setupLight from '/src/assets/threeJs/light.js';

	import { onMount } from 'svelte';

	import gsap from 'gsap';

	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
	import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
	import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
	import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

	onMount(() => {
		let camera, scene, bloomComposer, renderer;
		const bloomParams = {
			exposure: 1,
			bloomStrength: 3,
			bloomThreshold: 0,
			bloomRadius: 1
		};

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.toneMapping = THREE.ReinhardToneMapping;
		renderer.toneMappingExposure = Math.pow(bloomParams.exposure, 4.0);
		//renderer.outputEncoding = THREE.sRGBEncoding;
		renderer.autoClear = false;

		document.body.appendChild(renderer.domElement);

		//SCENE
		scene = new THREE.Scene();

		//CAMERA

		camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
		camera.position.set(15, 3, 2);
		camera.lookAt(0, 0, 0);
		scene.add(camera);

		const controls = new OrbitControls(camera, renderer.domElement);
		controls.maxPolarAngle = Math.PI / 2;
		controls.disableRotate;

		/* window.addEventListener('mousedown', function () {
			console.log('Scrolling...');
			gsap.to(camera.position, {
				x: -0.33,
				duration: 1.5
			});
		});
 */
		//LIGHT
		const light = new THREE.AmbientLight(0x000e38);
		light.castShadow = true;
		light.receiveShadow = true;
		scene.add(light);

		//CONTROL
		//const controls = new OrbitControls(camera, renderer.domElement);
		//controls.minDistance = 10;
		//controls.maxDistance = 1000;

		//BLOOM
		const renderPass = new RenderPass(scene, camera);

		const bloomPass = new UnrealBloomPass(
			new THREE.Vector2(window.innerWidth, window.innerHeight),
			bloomParams.bloomStrength,
			bloomParams.bloomRadius,
			bloomParams.bloomThreshold,
		);

		bloomComposer = new EffectComposer(renderer);
		bloomComposer.addPass(renderPass);
		bloomComposer.addPass(bloomPass);

		//LOADER
		const loader = new GLTFLoader();

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
				child.layers.enable(1);
				child.castShadow = true;
				child.receiveShadow = true;
			});

			sign.traverse(function (child) {
				child.layers.enable(0);
				child.castShadow = true;
				child.receiveShadow = true;
			});

			building.traverse(function (child) {
				child.layers.enable(0);
				child.castShadow = true;
				child.receiveShadow = true;
			});

			// add both models to the scene
			scene.add(neon);
			scene.add(sign);
			scene.add(building);
		});

		window.addEventListener('resize', onWindowResize);
		animate();

		//RESIZE
		function onWindowResize() {
			const width = window.innerWidth;
			const height = window.innerHeight;

			camera.aspect = width / height;
			camera.updateProjectionMatrix();

			renderer.setSize(width, height);
			bloomComposer.setSize(width, height);
		}

		function animate() {
			requestAnimationFrame(animate);
			
	
			renderer.clear();
			camera.layers.set(1);
			bloomComposer.render();

			renderer.clearDepth();
			camera.layers.set(0);
			renderer.render(scene, camera);
		}
	});
</script>

<style>
	:global(*) {
		margin: 0;
	}
</style>
