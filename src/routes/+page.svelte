<script>
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	import { vShader } from '../assets/shaders/vertexShader.js';
	import { fShader } from '../assets/shaders/fragmentShader.js';

	import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
	import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
	import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

	onMount(() => {
		//RENDERER
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMap.enabled = true;
		document.body.appendChild(renderer.domElement);

		const labeRenderer = new CSS2DRenderer();
		labeRenderer.setSize(window.innerWidth, window.innerHeight);
		labeRenderer.domElement.style.position = 'absolute';	
		labeRenderer.domElement.style.top = 0;
		labeRenderer.domElement.style.pointerEvents = 'none';
		document.body.appendChild(labeRenderer.domElement);


		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0xffcf82);

		//CAMERA
		const camera = new THREE.PerspectiveCamera(
			40,
			window.innerWidth / window.innerHeight,
			0.1,
			100
		);
		camera.position.set(30, 10, 0);
		camera.lookAt(0, 0, 0);

		//CAMERA CONTROLS
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.minDistance = 10;
		controls.maxPolarAngle = Math.PI / 2;
		controls.maxDistance = 300;

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

		//add directional light at north est west south pointed to 0 0 0
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(0, 10, -10);
		directionalLight.target.position.set(0, 0, 0);
		directionalLight.castShadow = true;
		scene.add(directionalLight);
		scene.add(directionalLight.target);

		const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight1.position.set(10, 10, 0);
		directionalLight1.target.position.set(0, 0, 0);
		directionalLight1.castShadow = true;
		scene.add(directionalLight1);
		scene.add(directionalLight1.target);

		const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight2.position.set(-10, 10, 0);
		directionalLight2.target.position.set(0, 0, 0);
		directionalLight2.castShadow = true;
		scene.add(directionalLight2);
		scene.add(directionalLight2.target);

		const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight3.position.set(0, 10, 10);
		directionalLight3.target.position.set(0, 0, 0);
		directionalLight3.castShadow = true;
		scene.add(directionalLight3);
		scene.add(directionalLight3.target);

		const inputText = document.createElement('input');
		inputText.textContent = 'test';
		inputText.style.transform = 'preserve-3d';
		inputText.style.position = 'fixed';
		inputText.style.top = '50%';
		inputText.style.left = '50%';
		inputText.style.background ='rgba( 0, 0, 0, .6 )';
		const label = new CSS2DObject(inputText);
		label.position.set(0, 20, 0);
		label.scale.set(0.1, 0.1, 0.1);
		
		scene.add(label);


		//AUDIO
		const sound = new Audio('src/assets/sounds/type.wav');
		let isPlaying = false;

		const loader = new OBJLoader(loadingManager);
		const textureLoader = new THREE.TextureLoader(loadingManager);
		let keyboard = [];

		const normalMap = textureLoader.load('src/assets/textures/H89_Normal.png');
		const texture = textureLoader.load('src/assets/textures/H89_Light_BaseColor.png');
		const roughnessMap = textureLoader.load('src/assets/textures/H89_Roughness.png');
		const aoMap = textureLoader.load('src/assets/textures/H89_AO.png');
		const metalnessMap = textureLoader.load('src/assets/textures/H89_Metallic.png');

		const material = new THREE.MeshStandardMaterial({
			map: texture,
			normalMap: normalMap,
			roughnessMap: roughnessMap,
			aoMap: aoMap,
			metalnessMap: metalnessMap
		});

		// Create the ShaderMaterial
		const testmaterial = new THREE.RawShaderMaterial({
			uniforms: {
				time: { value: 0 },
				lineCount: { value: 200 },
				color1: { value: new THREE.Color(0x2a2b27) },
				color2: { value: new THREE.Color(0x32332d) },
				speed: { value: 5 }
			},
			vertexShader: vShader,
			fragmentShader: fShader
		});

		
		

		loader.load('src/assets/models/ordinateur.obj', function (obj) {
			var model = obj;

			model.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					child.castShadow = true;
					child.material = material;
					keyboard.push(child);
				}
			});

			document.addEventListener('keydown', (event) => {
				const keyName = event.code;
				switch (keyName) {
					case 'KeyA':
						keyboard[20].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyB':
						keyboard[11].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyC':
						keyboard[9].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyD':
						keyboard[22].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyE':
						keyboard[36].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyF':
						keyboard[23].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyG':
						keyboard[24].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyH':
						keyboard[25].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyI':
						keyboard[41].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyJ':
						keyboard[26].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyK':
						keyboard[27].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyL':
						keyboard[28].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyM':
						keyboard[13].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyN':
						keyboard[12].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyO':
						keyboard[42].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyP':
						keyboard[43].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyQ':
						keyboard[34].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyR':
						keyboard[37].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyS':
						keyboard[21].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyT':
						keyboard[38].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyU':
						keyboard[40].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyV':
						keyboard[10].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyW':
						keyboard[35].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyX':
						keyboard[8].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyY':
						keyboard[39].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'KeyZ':
						keyboard[7].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Numpad0':
						keyboard[77].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Numpad1':
						keyboard[80].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Numpad2':
						keyboard[79].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Numpad3':
						keyboard[78].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Numpad4':
						keyboard[83].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Numpad5':
						keyboard[82].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Numpad6':
						keyboard[81].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Numpad7':
						keyboard[86].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Numpad8':
						keyboard[85].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Numpad9':
						keyboard[84].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'NumpadDecimal':
						keyboard[76].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'NumpadEnter':
						keyboard[75].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Space':
						keyboard[5].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Tab':
						keyboard[33].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'F1':
						keyboard[64].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'F2':
						keyboard[65].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'F3':
						keyboard[66].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'F4':
						keyboard[67].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'F5':
						keyboard[68].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Escape':
						keyboard[48].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'ShiftLeft':
						keyboard[6].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'ShiftRight':
						keyboard[17].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'CapsLock':
						keyboard[19].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'ControlLeft':
						keyboard[3].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Backspace':
						keyboard[62].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Delete':
						keyboard[47].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Enter':
						keyboard[46].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Digit1':
						keyboard[49].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Digit2':
						keyboard[50].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Digit3':
						keyboard[51].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Digit4':
						keyboard[52].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Digit5':
						keyboard[53].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Digit6':
						keyboard[54].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Digit7':
						keyboard[55].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Digit8':
						keyboard[56].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Digit9':
						keyboard[57].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Digit0':
						keyboard[58].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Minus':
						keyboard[59].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Equal':
						keyboard[60].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Slash':
						keyboard[16].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Semicolon':
						keyboard[29].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Backslash':
						keyboard[45].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Quote':
						keyboard[30].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Comma':
						keyboard[14].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Period':
						keyboard[15].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Backquote':
						keyboard[61].position.y = -0.7;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
				}
			});
			document.addEventListener('keyup', (event) => {
				const keyName = event.code;
				isPlaying = false;
				switch (keyName) {
					case 'KeyA':
						keyboard[20].position.y = 0;
						break;
					case 'KeyB':
						keyboard[11].position.y = 0;
						break;
					case 'KeyC':
						keyboard[9].position.y = 0;
						break;
					case 'KeyD':
						keyboard[22].position.y = 0;
						break;
					case 'KeyE':
						keyboard[36].position.y = 0;
						break;
					case 'KeyF':
						keyboard[23].position.y = 0;
						break;
					case 'KeyG':
						keyboard[24].position.y = 0;
						break;
					case 'KeyH':
						keyboard[25].position.y = 0;
						break;
					case 'KeyI':
						keyboard[41].position.y = 0;
						break;
					case 'KeyJ':
						keyboard[26].position.y = 0;
						break;
					case 'KeyK':
						keyboard[27].position.y = 0;
						break;
					case 'KeyL':
						keyboard[28].position.y = 0;
						break;
					case 'KeyM':
						keyboard[13].position.y = 0;
						break;
					case 'KeyN':
						keyboard[12].position.y = 0;
						break;
					case 'KeyO':
						keyboard[42].position.y = 0;
						break;
					case 'KeyP':
						keyboard[43].position.y = 0;
						break;
					case 'KeyQ':
						keyboard[34].position.y = 0;
						break;
					case 'KeyR':
						keyboard[37].position.y = 0;
						break;
					case 'KeyS':
						keyboard[21].position.y = 0;
						break;
					case 'KeyT':
						keyboard[38].position.y = 0;
						break;
					case 'KeyU':
						keyboard[40].position.y = 0;
						break;
					case 'KeyV':
						keyboard[10].position.y = 0;
						break;
					case 'KeyW':
						keyboard[35].position.y = 0;
						break;
					case 'KeyX':
						keyboard[8].position.y = 0;
						break;
					case 'KeyY':
						keyboard[39].position.y = 0;
						break;
					case 'KeyZ':
						keyboard[7].position.y = 0;
						break;
					case 'Numpad0':
						keyboard[77].position.y = 0;
						break;
					case 'Numpad1':
						keyboard[80].position.y = 0;
						break;
					case 'Numpad2':
						keyboard[79].position.y = 0;
						break;
					case 'Numpad3':
						keyboard[78].position.y = 0;
						break;
					case 'Numpad4':
						keyboard[83].position.y = 0;
						break;
					case 'Numpad5':
						keyboard[82].position.y = 0;
						break;
					case 'Numpad6':
						keyboard[81].position.y = 0;
						break;
					case 'Numpad7':
						keyboard[86].position.y = 0;
						break;
					case 'Numpad8':
						keyboard[85].position.y = 0;
						break;
					case 'Numpad9':
						keyboard[84].position.y = 0;
						break;
					case 'NumpadDecimal':
						keyboard[76].position.y = 0;
						break;
					case 'NumpadEnter':
						keyboard[75].position.y = 0;
						break;
					case 'Space':
						keyboard[5].position.y = 0;
						break;
					case 'Tab':
						keyboard[33].position.y = 0;
						break;
					case 'F1':
						keyboard[64].position.y = 0;
						break;
					case 'F2':
						keyboard[65].position.y = 0;
						break;
					case 'F3':
						keyboard[66].position.y = 0;
						break;
					case 'F4':
						keyboard[67].position.y = 0;
						break;
					case 'F5':
						keyboard[68].position.y = 0;
						break;
					case 'Escape':
						keyboard[48].position.y = 0;
						break;
					case 'ShiftLeft':
						keyboard[6].position.y = 0;
						break;
					case 'ShiftRight':
						keyboard[17].position.y = 0;
						break;
					case 'CapsLock':
						keyboard[19].position.y = 0;
						break;
					case 'ControlLeft':
						keyboard[3].position.y = 0;
						break;
					case 'Backspace':
						keyboard[62].position.y = 0;
						break;
					case 'Delete':
						keyboard[47].position.y = 0;
						break;
					case 'Enter':
						keyboard[46].position.y = 0;
						break;
					case 'Digit1':
						keyboard[49].position.y = 0;
						break;
					case 'Digit2':
						keyboard[50].position.y = 0;
						break;
					case 'Digit3':
						keyboard[51].position.y = 0;
						break;
					case 'Digit4':
						keyboard[52].position.y = 0;
						break;
					case 'Digit5':
						keyboard[53].position.y = 0;
						break;
					case 'Digit6':
						keyboard[54].position.y = 0;
						break;
					case 'Digit7':
						keyboard[55].position.y = 0;
						if (!isPlaying) {
							sound.play();
							isPlaying = true;
						}
						break;
					case 'Digit8':
						keyboard[56].position.y = 0;
						break;
					case 'Digit9':
						keyboard[57].position.y = 0;
						break;
					case 'Digit0':
						keyboard[58].position.y = 0;
						break;
					case 'Minus':
						keyboard[59].position.y = 0;
						break;
					case 'Equal':
						keyboard[60].position.y = 0;
						break;
					case 'Slash':
						keyboard[16].position.y = 0;
						break;
					case 'Semicolon':
						keyboard[29].position.y = 0;
						break;
					case 'Backslash':
						keyboard[45].position.y = 0;
						break;
					case 'Quote':
						keyboard[30].position.y = 0;
						break;
					case 'Comma':
						keyboard[14].position.y = 0;
						break;
					case 'Period':
						keyboard[15].position.y = 0;
						break;
					case 'Backquote':
						keyboard[61].position.y = 0;
						break;
				}
			});

			keyboard[1].material = testmaterial;

			keyboard.forEach((mesh) => {
				scene.add(mesh);
			});
		});

		render();
		window.addEventListener('resize', onWindowResize);

		//RENDER
		function render() {
			requestAnimationFrame(render);
			testmaterial.uniforms.time.value += 0.01;
			renderer.render(scene, camera);
			labeRenderer.render(scene, camera);
		}

		//RESIZE
		function onWindowResize() {
			const width = window.innerWidth;
			const height = window.innerHeight;

			camera.aspect = width / height;
			camera.updateProjectionMatrix();

			renderer.setSize(width, height);
			labeRenderer.setSize(width, height);
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
		background-color: rgba(0, 0, 0, 0);
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
