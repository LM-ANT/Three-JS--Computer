<script>
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { FontLoader } from 'three/addons/loaders/FontLoader.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

	onMount(() => {
		//RENDERER
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);

		const scene = new THREE.Scene();

		//CAMERA
		const camera = new THREE.PerspectiveCamera(
			40,
			window.innerWidth / window.innerHeight,
			0.1,
			100
		);
		camera.position.set(1, 0.5, 0);
		camera.lookAt(0, 0, 0);

		//CAMERA CONTROLS
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.minDistance = 0.5;
		controls.maxPolarAngle = Math.PI / 2;
		controls.maxDistance = 3;

		//LOADING MANAGER
		const loadingManager = new THREE.LoadingManager();
		const progressBarContainer = document.querySelector('.progress-bar-container');
		const progressBar = document.getElementById('progress-bar');
		loadingManager.onProgress = function (url, loaded, total) {
			progressBar.value = (loaded / total) * 100;
			if (progressBar.value === 100) {
				progressBarContainer.style.display = 'none';
			}
		};

		//add ambient light
		const ambientLight = new THREE.AmbientLight(0xffffff, 1);
		scene.add(ambientLight);

		//add directional light
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(0, 1, 0);
		scene.add(directionalLight);

		//add point light
		const pointLight = new THREE.PointLight(0xffffff, 1);
		pointLight.position.set(0, 0, 0);
		scene.add(pointLight);

		//POST PROCESSING
		const renderScene = new RenderPass(scene, camera);

		const listener = new THREE.AudioListener();
		camera.add(listener);
		const sound = new THREE.Audio(listener);
		const audioLoader = new THREE.AudioLoader();
		audioLoader.load('src/assets/sounds/type.wav', function (buffer) {
			sound.setBuffer(buffer);
			sound.setLoop(false);
			sound.setVolume(0.5);
		});

		const loader = new GLTFLoader(loadingManager);
		let keyboard = [];
		Promise.all([
			loader.loadAsync('src/assets/models/a.glb'),
			loader.loadAsync('src/assets/models/accent.glb'),
			loader.loadAsync('src/assets/models/arobase.glb'),
			loader.loadAsync('src/assets/models/ashtag.glb'),
			loader.loadAsync('src/assets/models/b.glb'),
			loader.loadAsync('src/assets/models/backslash.glb'),
			loader.loadAsync('src/assets/models/backspace.glb'),
			loader.loadAsync('src/assets/models/blue.glb'),
			loader.loadAsync('src/assets/models/body.glb'),
			loader.loadAsync('src/assets/models/brackets.glb'),
			loader.loadAsync('src/assets/models/c.glb'),
			loader.loadAsync('src/assets/models/capsLock.glb'),
			loader.loadAsync('src/assets/models/colon.glb'),
			loader.loadAsync('src/assets/models/cinq.glb'),
			loader.loadAsync('src/assets/models/ctrlLeft.glb'),
			loader.loadAsync('src/assets/models/d.glb'),
			loader.loadAsync('src/assets/models/del.glb'),
			loader.loadAsync('src/assets/models/deux.glb'),
			loader.loadAsync('src/assets/models/dollar.glb'),
			loader.loadAsync('src/assets/models/e.glb'),
			loader.loadAsync('src/assets/models/enter.glb'),
			loader.loadAsync('src/assets/models/erase.glb'),
			loader.loadAsync('src/assets/models/esc.glb'),
			loader.loadAsync('src/assets/models/et.glb'),
			loader.loadAsync('src/assets/models/exclamation.glb'),
			loader.loadAsync('src/assets/models/f.glb'),
			loader.loadAsync('src/assets/models/f1.glb'),
			loader.loadAsync('src/assets/models/f2.glb'),
			loader.loadAsync('src/assets/models/f3.glb'),
			loader.loadAsync('src/assets/models/f4.glb'),
			loader.loadAsync('src/assets/models/f5.glb'),
			loader.loadAsync('src/assets/models/fois.glb'),
			loader.loadAsync('src/assets/models/g.glb'),
			loader.loadAsync('src/assets/models/h.glb'),
			loader.loadAsync('src/assets/models/huit.glb'),
			loader.loadAsync('src/assets/models/i.glb'),
			loader.loadAsync('src/assets/models/j.glb'),
			loader.loadAsync('src/assets/models/k.glb'),
			loader.loadAsync('src/assets/models/l.glb'),
			loader.loadAsync('src/assets/models/lineFeed.glb'),
			loader.loadAsync('src/assets/models/m.glb'),
			loader.loadAsync('src/assets/models/min.glb'),
			loader.loadAsync('src/assets/models/moins.glb'),
			loader.loadAsync('src/assets/models/n.glb'),
			loader.loadAsync('src/assets/models/neuf.glb'),
			loader.loadAsync('src/assets/models/o.glb'),
			loader.loadAsync('src/assets/models/offline.glb'),
			loader.loadAsync('src/assets/models/p.glb'),
			loader.loadAsync('src/assets/models/parenFsh.glb'),
			loader.loadAsync('src/assets/models/parenSrt.glb'),
			loader.loadAsync('src/assets/models/plus.glb'),
			loader.loadAsync('src/assets/models/point.glb'),
			loader.loadAsync('src/assets/models/pourcent.glb'),
			loader.loadAsync('src/assets/models/q.glb'),
			loader.loadAsync('src/assets/models/quatre.glb'),
			loader.loadAsync('src/assets/models/questionMark.glb'),
			loader.loadAsync('src/assets/models/quot.glb'),
			loader.loadAsync('src/assets/models/r.glb'),
			loader.loadAsync('src/assets/models/red.glb'),
			loader.loadAsync('src/assets/models/replace.glb'),
			loader.loadAsync('src/assets/models/reset.glb'),
			loader.loadAsync('src/assets/models/return.glb'),
			loader.loadAsync('src/assets/models/s.glb'),
			loader.loadAsync('src/assets/models/screen.glb'),
			loader.loadAsync('src/assets/models/shiftLeft.glb'),
			loader.loadAsync('src/assets/models/shiftRight.glb'),
			loader.loadAsync('src/assets/models/sept.glb'),
			loader.loadAsync('src/assets/models/six.glb'),
			loader.loadAsync('src/assets/models/space.glb'),
			loader.loadAsync('src/assets/models/supp.glb'),
			loader.loadAsync('src/assets/models/t.glb'),
			loader.loadAsync('src/assets/models/tab.glb'),
			loader.loadAsync('src/assets/models/trois.glb'),
			loader.loadAsync('src/assets/models/tild.glb'),
			loader.loadAsync('src/assets/models/u.glb'),
			loader.loadAsync('src/assets/models/un.glb'),
			loader.loadAsync('src/assets/models/v.glb'),
			loader.loadAsync('src/assets/models/w.glb'),
			loader.loadAsync('src/assets/models/white.glb'),
			loader.loadAsync('src/assets/models/x.glb'),
			loader.loadAsync('src/assets/models/y.glb'),
			loader.loadAsync('src/assets/models/z.glb'),
			loader.loadAsync('src/assets/models/zero.glb')
		]).then((models) => {
			//foreach model in models import it in the scene
			models.forEach((model) => {
				const object = model.scene;
				keyboard.push(object);
				scene.add(object);
			});
			keyboard[63].traverse((child) => {
				if (child.isMesh) {
					child.material.transparent = true;
					child.material.opacity = 0.8;
				}
			}); 
		});

		//transparency of the keyboard[60]
		//traverse

		//keypressed
		document.addEventListener('keydown', (event) => {
			const keyName = event.key;
			console.log(keyName);
			switch (keyName) {
				case 'a':
					keyboard[0].position.y = -0.01;
					sound.play();
					break;
				case '-':
					keyboard[1].position.y = -0.01;
					sound.play();
					break;
				case 'é':
					keyboard[2].position.y = -0.01;
					sound.play();
					break;
				case '"':
					keyboard[3].position.y = -0.01;
					sound.play();
					break;
				case 'b':
					keyboard[4].position.y = -0.01;
					sound.play();
					break;
				case '\\':
					keyboard[5].position.y = -0.01;
					sound.play();
					break;
				case '-':
					keyboard[6].position.y = -0.01;
					sound.play();
					break;
				case 'è':
					keyboard[7].position.y = -0.01;
					sound.play();
					break;
				case 'ç':
					keyboard[9].position.y = -0.01;
					sound.play();
					break;
				case 'à':
					keyboard[10].position.y = -0.01;
					sound.play();
					break;
			}
		});

		//keyreleased
		document.addEventListener('keyup', (event) => {
			const keyName = event.key;
			console.log(keyName);
			switch (keyName) {
				case 'a':
					keyboard[0].position.y = 0;
					break;
				case '-':
					keyboard[1].position.y = 0;
					break;
				case 'é':
					keyboard[2].position.y = 0;
					break;
				case '"':
					keyboard[3].position.y = 0;
					break;
				case 'b':
					keyboard[4].position.y = 0;
					break;
				case '\\':
					keyboard[5].position.y = 0;
					break;
			}
		});

		render();
		window.addEventListener('resize', onWindowResize);

		//RENDER
		function render() {
			requestAnimationFrame(render);
			renderer.render(scene, camera);
		}

		//RESIZE
		function onWindowResize() {
			const width = window.innerWidth;
			const height = window.innerHeight;

			camera.aspect = width / height;
			camera.updateProjectionMatrix();

			renderer.setSize(width, height);
		}
	});
</script>

<body>
	<div class="progress-bar-container">
		<progress id="progress-bar" max="100" value="0" />
	</div>
</body>

<style>
	:global(*) {
		margin: 0;
	}

	.progress-bar-container {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: rgb(20, 20, 20);
	}
	/* progess-bar white white round border*/

	#progress-bar {
		-webkit-appearance: none;
		appearance: none;
		width: 30%;
		height: 1.5%;
		margin-top: 0.5%;
	}
	::-webkit-progress-bar {
		background-color: rgb(67, 67, 70);
		border-radius: 50px;
		outline: 8px solid rgb(67, 67, 70);
		box-shadow: inset 0 0 10px rgb(20, 20, 20);
	}
	::-webkit-progress-value {
		background: linear-gradient(90deg, rgba(255, 181, 17, 1) 0%, rgba(180, 114, 0, 1) 100%);
		border-radius: 50px;
	}
</style>
