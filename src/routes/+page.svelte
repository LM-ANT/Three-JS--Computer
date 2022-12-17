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
			loader.loadAsync('src/assets/models/bracketsLarge.glb'),
			loader.loadAsync('src/assets/models/break.glb'),
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
			loader.loadAsync('src/assets/models/scroll.glb'),
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
				object.position.y = 0;
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
			const keyName = event.code;
			console.log(keyName)
			switch (keyName) {
				case 'KeyA':
					keyboard[0].position.y = -0.01;
					sound.play();
					break;
				case 'KeyB':
					keyboard[4].position.y = -0.01;
					sound.play();
					break;
				case 'KeyC':
					keyboard[12].position.y = -0.01;
					sound.play();
					break;
				case 'KeyD':
					keyboard[17].position.y = -0.01;
					sound.play();
					break;
				case 'KeyE':
					keyboard[21].position.y = -0.01;
					sound.play();
					break;
				case 'KeyF':
					keyboard[27].position.y = -0.01;
					sound.play();
					break;
				case 'KeyG':
					keyboard[34].position.y = -0.01;
					sound.play();
					break;
				case 'KeyH':
					keyboard[35].position.y = -0.01;
					sound.play();
					break;
				case 'KeyI':
					keyboard[37].position.y = -0.01;
					sound.play();
					break;
				case 'KeyJ':
					keyboard[38].position.y = -0.01;
					sound.play();
					break;
				case 'KeyK':
					keyboard[39].position.y = -0.01;
					sound.play();
					break;
				case 'KeyL':
					keyboard[40].position.y = -0.01;
					sound.play();
					break;
				case 'KeyM':
					keyboard[42].position.y = -0.01;
					sound.play();
					break;
				case 'KeyN':
					keyboard[45].position.y = -0.01;
					sound.play();
					break;
				case 'KeyO':
					keyboard[47].position.y = -0.01;
					sound.play();
					break;
				case 'KeyP':
					keyboard[49].position.y = -0.01;
					sound.play();
					break;
				case 'KeyQ':
					keyboard[55].position.y = -0.01;
					sound.play();
					break;
				case 'KeyR':
					keyboard[59].position.y = -0.01;
					sound.play();
					break;
				case 'KeyS':
					keyboard[64].position.y = -0.01;
					sound.play();
					break;
				case 'KeyT':
					keyboard[73].position.y = -0.01;
					sound.play();
					break;
				case 'KeyU':
					keyboard[77].position.y = -0.01;
					sound.play();
					break;
				case 'KeyV':
					keyboard[79].position.y = -0.01;
					sound.play();
					break;
				case 'KeyW':
					keyboard[80].position.y = -0.01;
					sound.play();
					break;
				case 'KeyX':
					keyboard[82].position.y = -0.01;
					sound.play();
					break;
				case 'KeyY':
					keyboard[83].position.y = -0.01;
					sound.play();
					break;
				case 'KeyZ':
					keyboard[84].position.y = -0.01;
					sound.play();
					break;
				case 'Numpad0':
					keyboard[85].position.y = -0.01;
					sound.play();
					break;
				case 'Numpad1':
					keyboard[78].position.y = -0.01;
					sound.play();
					break;
				case 'Numpad2':
					keyboard[19].position.y = -0.01;
					sound.play();
					break;
				case 'Numpad3':
					keyboard[75].position.y = -0.01;
					sound.play();
					break;
				case 'Numpad4':
					keyboard[56].position.y = -0.01;
					sound.play();
					break;
				case 'Numpad5':
					keyboard[15].position.y = -0.01;
					sound.play();
					break;
				case 'Numpad6':
					keyboard[70].position.y = -0.01;
					sound.play();
					break;
				case 'Numpad7':
					keyboard[69].position.y = -0.01;
					sound.play();
					break;
				case 'Numpad8':
					keyboard[36].position.y = -0.01;
					sound.play();
					break;
				case 'Numpad9':
					keyboard[46].position.y = -0.01;
					sound.play();
					break;
				case 'NumpadDecimal':
					keyboard[53].position.y = -0.01;
					sound.play();
					break;
				case 'NumpadEnter':
					keyboard[22].position.y = -0.01;
					sound.play();
					break;
				case 'Space':
					keyboard[71].position.y = -0.01;
					sound.play();
					break;
				case 'Tab':
					keyboard[74].position.y = -0.01;
					sound.play();
					break;
				case 'F1':
					keyboard[28].position.y = -0.01;
					sound.play();
					break;
				case 'F2':
					keyboard[29].position.y = -0.01;
					sound.play();
					break;
				case 'F3':
					keyboard[30].position.y = -0.01;
					sound.play();
					break;
				case 'F4':
					keyboard[31].position.y = -0.01;
					sound.play();
					break;
				case 'F5':
					keyboard[32].position.y = -0.01;
					sound.play();
					break;
				case 'Escape':
					keyboard[24].position.y = -0.01;
					sound.play();
					break;
				case 'ShiftLeft':
					keyboard[67].position.y = -0.01;
					sound.play();
					break;
				case 'ShiftRight':
					keyboard[68].position.y = -0.01;
					sound.play();
					break;
				case 'CapsLock':
					keyboard[13].position.y = -0.01;
					sound.play();
					break;
				case 'ControlLeft':
					keyboard[16].position.y = -0.01;
					sound.play();
					break;
				case 'Backspace':
					keyboard[6].position.y = -0.01;
					sound.play();
					break;
				case 'Delete':
					keyboard[18].position.y = -0.01;
					sound.play();
					break;
				case 'Enter':
					keyboard[41].position.y = -0.01;
					sound.play();
					break;
				case 'Digit1':
					keyboard[26].position.y = -0.01;
					sound.play();
					break;
				case 'Digit2':
					keyboard[2].position.y = -0.01;
					sound.play();
					break;
				case 'Digit3':
					keyboard[3].position.y = -0.01;
					sound.play();
					break;
				case 'Digit4':
					keyboard[20].position.y = -0.01;
					sound.play();
					break;
				case 'Digit5':
					keyboard[54].position.y = -0.01;
					sound.play();
					break;
				case 'Digit6':
					keyboard[1].position.y = -0.01;
					sound.play();
					break;
				case 'Digit7':
					keyboard[25].position.y = -0.01;
					sound.play();
					break;
				case 'Digit8':
					keyboard[33].position.y = -0.01;
					sound.play();
					break;
				case 'Digit9':
					keyboard[51].position.y = -0.01;
					sound.play();
					break;
				case 'Digit0':
					keyboard[50].position.y = -0.01;
					sound.play();
					break;
				case 'Minus':
					keyboard[44].position.y = -0.01;
					sound.play();
					break;
				case 'Equal':
					keyboard[52].position.y = -0.01;
					sound.play();
					break;
				case 'Slash':
					keyboard[57].position.y = -0.01;
					sound.play();
					break;
				case 'Semicolon':
					keyboard[14].position.y = -0.01;
					sound.play();
					break;
				case 'Backslash':
					keyboard[5].position.y = -0.01;
					sound.play();
					break;
				case 'Quote':
					keyboard[58].position.y = -0.01;
					sound.play();
					break;
				case 'Comma':
					keyboard[43].position.y = -0.01;
					sound.play();
					break;
				case 'Period':
					keyboard[72].position.y = -0.01;
					sound.play();
					break;
				case 'Backquote':
					keyboard[76].position.y = -0.01;
					sound.play();
					break;
				case 'ç':
					keyboard[74].position.y = -0.01;
					sound.play();
					break;
				case '-':
					keyboard[75].position.y = -0.01;
					sound.play();
					break;
				case 'é':
					keyboard[76].position.y = -0.01;
					sound.play();
					break;
				case '"':
					keyboard[77].position.y = -0.01;
					sound.play();
					break;
				case 'b':
					keyboard[78].position.y = -0.01;
					sound.play();
					break;
				case '\\':
					keyboard[79].position.y = -0.01;
					sound.play();
					break;
				case '-':
					keyboard[80].position.y = -0.01;
					sound.play();
					break;
				case 'è':
					keyboard[81].position.y = -0.01;
					sound.play();
					break;
				case 'è':
					keyboard[82].position.y = -0.01;
					sound.play();
					break;
				case 'è':
					keyboard[83].position.y = -0.01;
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
