<script>
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	import { vShader } from '../assets/shaders/vertexShader.js';
	import { fShader } from '../assets/shaders/fragmentShader.js';

	import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
	import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

	onMount(() => {
		//RENDERER
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMap.enabled = true;
		document.body.appendChild(renderer.domElement);

		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0x0a0a0a);

		//CAMERA
		const camera = new THREE.PerspectiveCamera(
			40,
			window.innerWidth / window.innerHeight,
			0.1,
			1000 // Augmenté de 100 à 1000 pour éviter le clipping lors du dézoom
		);

		// Position finale après l'animation
		const finalCameraPosition = { x: 70, y: 30, z: -20 };
		const finalLookAt = { x: 0, y: 10, z: 0 };

		// Position de départ (très éloignée)
		camera.position.set(300, 120, 100);
		camera.lookAt(0, 5, 0);

		//CAMERA CONTROLS
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enabled = false; // Désactive tous les contrôles de caméra
		controls.minDistance = 10;
		controls.maxPolarAngle = Math.PI / 2;
		controls.maxDistance = 800;

		//LOADING MANAGER
		const loadingManager = new THREE.LoadingManager();
		const progressBarContainer = document.querySelector('.progress-bar-container');
		const progressBar = document.getElementById('progress-bar');
		const loaderStartTime = Date.now();
		const minLoaderDuration = 2500; // 2,5 secondes
		let bootDone = false;
		let loadingDone = false;
		function tryHideLoader() {
			if (bootDone && loadingDone) {
				if (customLoader) {
					customLoader.style.opacity = 0;
					setTimeout(() => {
						customLoader.style.display = 'none';
					}, 700);
				}
			}
		}
		loadingManager.onProgress = function (url, loaded, total) {
			progressBar.value = (loaded / total) * 100;
			if (progressBar.value === 100) {
				progressBarContainer.style.display = 'none';
				const elapsed = Date.now() - loaderStartTime;
				const wait = Math.max(0, minLoaderDuration - elapsed);
				setTimeout(() => {
					loadingDone = true;
					tryHideLoader();
				}, wait);
			}
		};

		//LIGHTS - Éclairage ambiant optimisé pour l'ambiance CRT
		const lightPositions = [
			[0, 15, -15], // Lumière arrière principale
			[15, 12, 0], // Lumière latérale droite
			[-15, 12, 0], // Lumière latérale gauche
			[0, 8, 15] // Lumière frontale douce
		];

		lightPositions.forEach((position, index) => {
			const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3); // Intensité réduite
			directionalLight.position.set(...position);
			directionalLight.target.position.set(0, 0, 0);
			directionalLight.castShadow = true;

			// Configuration des ombres optimisée
			directionalLight.shadow.mapSize.width = 1024;
			directionalLight.shadow.mapSize.height = 1024;
			directionalLight.shadow.camera.near = 0.5;
			directionalLight.shadow.camera.far = 50;

			scene.add(directionalLight);
			scene.add(directionalLight.target);
		});

		// Lumière ambiante douce pour éviter les zones trop sombres
		const ambientLight = new THREE.AmbientLight(0x404060, 0.2); // Légèrement bleutée
		scene.add(ambientLight);

		// Lumière d'appoint chaude pour équilibrer le vert de l'écran
		const fillLight = new THREE.DirectionalLight(0xffaa44, 0.15); // Orange douce
		fillLight.position.set(-20, 25, 10);
		fillLight.target.position.set(0, 0, 0);
		scene.add(fillLight);
		scene.add(fillLight.target);

		// CRÉATION DE L'ÉCRAN PORTFOLIO FIXE
		function createFixedPortfolioScreen() {
			// Créer un canvas pour le contenu de l'écran
			const canvas = document.createElement('canvas');
			canvas.width = 800;
			canvas.height = 600;
			const ctx = canvas.getContext('2d');

			// SYSTÈME DE TERMINAL INTERACTIF
			let terminalHistory = [];
			let currentCommand = '';
			let cursorPosition = 0;
			let blinkState = true;
			let isPongMode = false;
			let commandHistory = [];
			let historyIndex = -1;

			// Base de données des commandes
			const commands = {
				help: () => [
					'Commandes disponibles:',
					'  help       - Affiche cette aide',
					'  whoami     - Informations personnelles',
					'  skills     - Compétences techniques',
					'  projects   - Mes projets',
					'  contact    - Informations de contact',
					'  ls         - Liste des fichiers',
					'  cat [file] - Affiche un fichier',
					"  clear      - Efface l'écran",
					'  matrix     - Mode Matrix ;)',
					'  pong       - Lancer le mode Pong',
					''
				],
				whoami: () => [
					'DÉVELOPPEUR FULL-STACK',
					'Passionné par les technologies web',
					'Spécialisé en JavaScript/TypeScript',
					"Créateur d'expériences interactives",
					''
				],
				skills: () => [
					'COMPÉTENCES TECHNIQUES:',
					'━━━━━━━━━━━━━━━━━━━━━━━━',
					'• Frontend: React, Vue.js, Svelte',
					'• Backend: Node.js, Python, PHP',
					'• 3D/WebGL: Three.js, WebGL natif',
					'• Bases de données: MongoDB, PostgreSQL',
					'• DevOps: Docker, AWS, Git',
					''
				],
				projects: () => [
					'PROJETS RÉALISÉS:',
					'━━━━━━━━━━━━━━━━',
					'📁 Clavier virtuel 3D (Actuel)',
					'📁 Portfolio interactif WebGL',
					'📁 Application de visualisation de données',
					'📁 Jeu en ligne multijoueur',
					'📁 API REST pour e-commerce',
					''
				],
				contact: () => [
					'CONTACT:',
					'━━━━━━━━━',
					'📧 votre.email@domain.com',
					'🔗 github.com/votre-username',
					'💼 linkedin.com/in/votre-profil',
					'🌐 votre-portfolio.com',
					''
				],
				ls: () => [
					'portfolio/',
					'projets/',
					'cv.pdf',
					'competences.txt',
					'contact.md',
					'README.md',
					''
				],
				clear: () => {
					terminalHistory = [];
					return [];
				},
				matrix: () => [
					'Wake up, Neo...',
					'The Matrix has you...',
					'Follow the white rabbit.',
					'',
					'Knock, knock, Neo.',
					''
				],
				pong: () => {
					// Lancer le mode Pong
					isPongMode = true;
					startPong();
					return ['PONG MODE : Utilisez ↑ et ↓ pour jouer. Echap pour quitter.'];
				}
			};

			// Fonction pour exécuter une commande
			function executeCommand(cmd) {
				const parts = cmd.trim().split(' ');
				const command = parts[0].toLowerCase();
				const args = parts.slice(1);

				if (command === '') return [];

				if (command === 'cat' && args.length > 0) {
					const file = args[0];
					switch (file) {
						case 'cv.pdf':
							return [
								"Impossible d'afficher un PDF dans un terminal!",
								'Utilisez: contact pour mes informations',
								''
							];
						case 'competences.txt':
							return commands.skills();
						case 'contact.md':
							return commands.contact();
						case 'README.md':
							return [
								'# Portfolio Terminal',
								'Terminal interactif en Three.js',
								'Tapez `help` pour commencer',
								''
							];
						default:
							return [`cat: ${file}: Fichier non trouvé`, ''];
					}
				}

				if (commands[command]) {
					return commands[command]();
				} else {
					return [
						`bash: ${command}: commande introuvable`,
						'Tapez "help" pour voir les commandes disponibles',
						''
					];
				}
			}

			// Fonction pour dessiner le terminal
			function drawTerminal() {
				if (isPongMode) return; // Ne pas dessiner le terminal si Pong actif
				// Fond noir
				ctx.fillStyle = '#0a0a0a';
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				// Configuration du texte
				ctx.font = '14px "Courier New", monospace';
				ctx.textBaseline = 'top';
				ctx.shadowColor = '#00ff00';
				ctx.shadowBlur = 3;

				let y = 20;
				const lineHeight = 18;
				const leftMargin = 60; // Marge gauche augmentée
				const rightMargin = 60; // Nouvelle marge droite

				// Header amélioré
				const now = new Date();
				const dateStr = now.toLocaleDateString('fr-FR');
				const timeStr = now.toLocaleTimeString('fr-FR', {
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit'
				});
				ctx.fillStyle = '#00ff00';
				ctx.font = 'bold 16px "Courier New", monospace';
				const headerText = 'HEATHKIT H89 TERMINAL - CRT PORTFOLIO';
				const headerX = (canvas.width - ctx.measureText(headerText).width) / 2;
				ctx.fillText(headerText, headerX, y);
				ctx.font = '12px "Courier New", monospace';
				ctx.fillStyle = '#00ff88';
				ctx.fillText(
					dateStr + ' ' + timeStr,
					canvas.width - rightMargin - ctx.measureText(dateStr + ' ' + timeStr).width,
					y + 2
				);
				y += 28;

				// Séparateur double ligne
				ctx.strokeStyle = '#00ff00';
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(leftMargin, y);
				ctx.lineTo(canvas.width - rightMargin, y);
				ctx.stroke();
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(leftMargin, y + 4);
				ctx.lineTo(canvas.width - rightMargin, y + 4);
				ctx.stroke();
				y += 16;

				// Afficher l'historique du terminal
				terminalHistory.forEach((line) => {
					if (line.startsWith('C:\\>')) {
						ctx.fillStyle = '#ffff00'; // Jaune pour les commandes
					} else if (
						line.includes('━') ||
						line.includes('COMPÉTENCES') ||
						line.includes('PROJETS') ||
						line.includes('CONTACT')
					) {
						ctx.fillStyle = '#00ffff'; // Cyan pour les titres
					} else {
						ctx.fillStyle = '#00ff00'; // Vert pour le texte normal
					}
					ctx.fillText(line, leftMargin, y);
					y += lineHeight;
				});

				// Ligne de commande actuelle
				ctx.fillStyle = '#ffff00';
				const promptText = 'C:\\> ';
				ctx.fillText(promptText, leftMargin, y);

				ctx.fillStyle = '#ffffff';
				ctx.fillText(currentCommand, leftMargin + ctx.measureText(promptText).width, y);

				// Curseur clignotant
				if (blinkState) {
					const cursorX = leftMargin + ctx.measureText(promptText + currentCommand).width;
					ctx.fillStyle = '#00ff00';
					ctx.fillRect(cursorX, y, 8, 16);
				}
			}

			// Initialiser le terminal avec un message de bienvenue
			terminalHistory.push('Bienvenue dans mon portfolio terminal!');
			terminalHistory.push('Tapez "help" pour voir les commandes disponibles.');
			terminalHistory.push('');

			// Dessiner le terminal initial
			drawTerminal();

			// Créer la texture Three.js
			const texture = new THREE.CanvasTexture(canvas);
			texture.needsUpdate = true;

			// Gestionnaire d'événements clavier pour le terminal
			window.addEventListener('keydown', (event) => {
				if (isPongMode) return;
				if (event.key === 'Enter') {
					// Ajouter la commande à l'historique
					terminalHistory.push(`C:\\> ${currentCommand}`);
					if (currentCommand.trim() !== '') {
						commandHistory.push(currentCommand);
					}
					historyIndex = -1;
					// Exécuter la commande
					const result = executeCommand(currentCommand);
					terminalHistory.push(...result);
					// Limiter l'historique pour éviter le débordement
					if (terminalHistory.length > 25) {
						terminalHistory = terminalHistory.slice(-25);
					}
					// Réinitialiser la commande
					currentCommand = '';
					cursorPosition = 0;
					// Redessiner
					drawTerminal();
					texture.needsUpdate = true;
				} else if (event.key === 'Backspace') {
					if (currentCommand.length > 0) {
						currentCommand = currentCommand.slice(0, -1);
						drawTerminal();
						texture.needsUpdate = true;
					}
				} else if (event.key === 'ArrowUp') {
					if (commandHistory.length > 0) {
						if (historyIndex === -1) historyIndex = commandHistory.length - 1;
						else if (historyIndex > 0) historyIndex--;
						currentCommand = commandHistory[historyIndex];
						drawTerminal();
						texture.needsUpdate = true;
					}
				} else if (event.key === 'ArrowDown') {
					if (commandHistory.length > 0 && historyIndex !== -1) {
						if (historyIndex < commandHistory.length - 1) {
							historyIndex++;
							currentCommand = commandHistory[historyIndex];
						} else {
							historyIndex = -1;
							currentCommand = '';
						}
						drawTerminal();
						texture.needsUpdate = true;
					}
				} else if (event.key.length === 1 && !event.ctrlKey && !event.altKey) {
					// Ajouter le caractère à la commande
					currentCommand += event.key;
					drawTerminal();
					texture.needsUpdate = true;
				}
			});

			// Animation du curseur
			setInterval(() => {
				blinkState = !blinkState;
				drawTerminal();
				texture.needsUpdate = true;
			}, 500);

			// Créer le matériau pour l'écran
			const screenMaterial = new THREE.MeshBasicMaterial({
				map: texture,
				transparent: true,
				side: THREE.DoubleSide,
				emissive: new THREE.Color(0x004400), // Émission verte plus intense
				emissiveIntensity: 0.8
			});

			// Créer la géométrie de l'écran (plan)
			const screenGeometry = new THREE.PlaneGeometry(31, 21); // Ajustez la taille selon vos besoins
			const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);

			// Positionner l'écran dans l'espace 3D (ajustez selon votre modèle)
			screenMesh.position.set(1, 19, 6.3);

			// Orientation : faire les rotations séparément pour éviter les problèmes d'ordre
			screenMesh.rotateY(Math.PI / 2); // D'abord tourner à droite
			screenMesh.rotateX(-0.2); // Puis incliner vers l'arrière

			// AJOUTER UNE LUMIÈRE ÉMISE PAR L'ÉCRAN
			const screenLight = new THREE.PointLight(0x00ff00, 8, 80, 1.5); // Lumière verte plus intense
			screenLight.position.copy(screenMesh.position);
			screenLight.position.add(new THREE.Vector3(2, 0, 0)); // Décaler légèrement vers l'avant
			scene.add(screenLight);

			// Lumière d'ambiance verte subtile pour l'écran
			const screenSpotLight = new THREE.SpotLight(0x00ff00, 4, 50, Math.PI / 4, 0.2);
			screenSpotLight.position.copy(screenMesh.position);
			screenSpotLight.position.add(new THREE.Vector3(5, 0, 0)); // Position devant l'écran
			screenSpotLight.target.position.set(-10, 19, 6); // Éclaire vers le clavier
			scene.add(screenSpotLight);
			scene.add(screenSpotLight.target);

			// Ajouter l'écran à la scène
			scene.add(screenMesh);

			// --- ZOOM/DEZOOM SUR L'ÉCRAN AU CLIC ---
			let isZooming = false;
			let isZoomed = false;
			let savedCameraPosition = null;
			let savedLookAt = null;
			const zoomTarget = { x: 40, y: 30, z: 6 }; // Position caméra proche de l'écran
			const zoomLookAt = { x: 0, y: 19, z: 5 };
			const zoomDuration = 1200; // ms

			// Raycaster pour détecter le clic sur l'écran
			const raycaster = new THREE.Raycaster();
			const mouse = new THREE.Vector2();

			function onScreenClick(event) {
				if (isZooming) return;
				// Calculer la position du clic dans le canvas
				const rect = renderer.domElement.getBoundingClientRect();
				mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
				mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

				raycaster.setFromCamera(mouse, camera);
				const intersects = raycaster.intersectObject(screenMesh);
				if (intersects.length === 0) {
					return;
				}

				isZooming = true;

				let start, startLook, target, lookTarget;
				if (!isZoomed) {
					// Sauvegarder la position et la cible actuelles avant le zoom
					savedCameraPosition = {
						x: camera.position.x,
						y: camera.position.y,
						z: camera.position.z
					};
					const camDir = new THREE.Vector3();
					camera.getWorldDirection(camDir);
					savedLookAt = {
						x: camera.position.x + camDir.x * 100,
						y: camera.position.y + camDir.y * 100,
						z: camera.position.z + camDir.z * 100
					};
					start = { ...savedCameraPosition };
					startLook = { ...savedLookAt };
					target = zoomTarget;
					lookTarget = zoomLookAt;
				} else {
					start = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
					startLook = { ...zoomLookAt };
					target = savedCameraPosition;
					lookTarget = savedLookAt;
				}

				const startTime = Date.now();

				function animateZoom() {
					const elapsed = Date.now() - startTime;
					const t = Math.min(elapsed / zoomDuration, 1);
					const ease = 1 - Math.pow(1 - t, 2);

					camera.position.x = start.x + (target.x - start.x) * ease;
					camera.position.y = start.y + (target.y - start.y) * ease;
					camera.position.z = start.z + (target.z - start.z) * ease;

					camera.lookAt(
						startLook.x + (lookTarget.x - startLook.x) * ease,
						startLook.y + (lookTarget.y - startLook.y) * ease,
						startLook.z + (lookTarget.z - startLook.z) * ease
					);

					if (t < 1) {
						requestAnimationFrame(animateZoom);
					} else {
						isZooming = false;
						isZoomed = !isZoomed;
					}
				}
				animateZoom();
			}

			renderer.domElement.addEventListener('click', onScreenClick);

			// --- DÉPLACEMENT DE STARTPONG ICI ---
			function startPong() {
				// Paramètres du jeu
				const paddleWidth = 12,
					paddleHeight = 120;
				const sideMargin = 50;
				let playerY = canvas.height / 2 - paddleHeight / 2;
				let aiY = canvas.height / 2 - paddleHeight / 2;
				let ballX = canvas.width / 2,
					ballY = canvas.height / 2;
				let ballVX = -1.5,
					ballVY = 1.0; // Vitesse initiale plus faible
				let playerScore = 0,
					aiScore = 0;
				let upPressed = false,
					downPressed = false;
				let pongAnim;

				function drawPong() {
					ctx.fillStyle = '#0a0a0a';
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					// Filet
					ctx.strokeStyle = '#00ff00';
					ctx.setLineDash([8, 12]);
					ctx.beginPath();
					ctx.moveTo(canvas.width / 2, 0);
					ctx.lineTo(canvas.width / 2, canvas.height);
					ctx.stroke();
					ctx.setLineDash([]);
					// Marges visuelles
					ctx.strokeStyle = '#003300';
					ctx.lineWidth = 2;
					ctx.beginPath();
					ctx.moveTo(sideMargin, 0);
					ctx.lineTo(sideMargin, canvas.height);
					ctx.moveTo(canvas.width - sideMargin, 0);
					ctx.lineTo(canvas.width - sideMargin, canvas.height);
					ctx.stroke();
					ctx.lineWidth = 1;
					// Scores
					ctx.font = '32px Courier New';
					ctx.fillStyle = '#00ff00';
					ctx.fillText(playerScore, canvas.width / 2 - 60, 50);
					ctx.fillText(aiScore, canvas.width / 2 + 40, 50);
					// Raquettes
					ctx.fillRect(sideMargin, playerY, paddleWidth, paddleHeight);
					ctx.fillRect(canvas.width - sideMargin - paddleWidth, aiY, paddleWidth, paddleHeight);
					// Balle
					ctx.beginPath();
					ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
					ctx.fill();
				}

				function updatePong() {
					if (upPressed) playerY -= 6;
					if (downPressed) playerY += 6;
					playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
					// IA simple
					if (aiY + paddleHeight / 2 < ballY) aiY += 4.2;
					else if (aiY + paddleHeight / 2 > ballY) aiY -= 4.2;
					aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));
					// Balle
					ballX += ballVX;
					ballY += ballVY;
					// Collisions haut/bas
					if (ballY < 10 || ballY > canvas.height - 10) ballVY *= -1;
					// Collisions raquettes
					if (
						ballX < sideMargin + paddleWidth &&
						ballY > playerY &&
						ballY < playerY + paddleHeight
					) {
						ballVX *= -1.03;
						ballVY += (Math.random() - 0.5) * 1.2;
						ballX = sideMargin + paddleWidth + 10;
					}
					if (
						ballX > canvas.width - sideMargin - paddleWidth &&
						ballY > aiY &&
						ballY < aiY + paddleHeight
					) {
						ballVX *= -1.03;
						ballVY += (Math.random() - 0.5) * 1.2;
						ballX = canvas.width - sideMargin - paddleWidth - 10;
					}
					// Buts
					if (ballX < sideMargin) {
						aiScore++;
						resetBall();
					}
					if (ballX > canvas.width - sideMargin) {
						playerScore++;
						resetBall();
					}
				}

				function resetBall() {
					ballX = canvas.width / 2;
					ballY = canvas.height / 2;
					ballVX = (Math.random() < 0.5 ? -1.5 : 1.5) * (1 + Math.random() * 0.1); // Vitesse réduite
					ballVY = (Math.random() - 0.5) * 2; // Vitesse réduite
				}

				function pongLoop() {
					if (!isPongMode) return;
					updatePong();
					drawPong();
					texture.needsUpdate = true;
					pongAnim = requestAnimationFrame(pongLoop);
				}
				pongLoop();

				function onPongKey(e) {
					if (!isPongMode) return;
					if (e.key === 'ArrowUp') upPressed = true;
					if (e.key === 'ArrowDown') downPressed = true;
					if (e.key === 'Escape') quitPong();
				}
				function onPongKeyUp(e) {
					if (!isPongMode) return;
					if (e.key === 'ArrowUp') upPressed = false;
					if (e.key === 'ArrowDown') downPressed = false;
				}
				window.addEventListener('keydown', onPongKey);
				window.addEventListener('keyup', onPongKeyUp);

				function quitPong() {
					isPongMode = false;
					window.removeEventListener('keydown', onPongKey);
					window.removeEventListener('keyup', onPongKeyUp);
					cancelAnimationFrame(pongAnim);
					drawTerminal();
					texture.needsUpdate = true;
				}
			}
		}

		// Créer l'écran portfolio fixe
		const portfolioScreen = createFixedPortfolioScreen();

		//AUDIO - Pool d'objets Audio optimisé
		const audioPool = [];
		const poolSize = 10;
		let currentAudioIndex = 0;

		// Créer le pool d'objets Audio
		for (let i = 0; i < poolSize; i++) {
			const sound = new Audio('src/assets/sounds/type.wav');
			sound.volume = 0.5;
			sound.preload = 'auto';
			audioPool.push(sound);
		}

		// Fonction optimisée pour jouer un son depuis le pool
		function playKeySound() {
			const sound = audioPool[currentAudioIndex];
			sound.currentTime = 0;
			sound.play().catch((e) => console.log('Audio play failed:', e));
			currentAudioIndex = (currentAudioIndex + 1) % poolSize;
		}

		const loader = new OBJLoader(loadingManager);
		const textureLoader = new THREE.TextureLoader(loadingManager);
		let keyboard = [];

		// MAPPING DES TOUCHES - Optimisation majeure
		const keyMapping = {
			// Lettres
			KeyA: 20,
			KeyB: 11,
			KeyC: 9,
			KeyD: 22,
			KeyE: 36,
			KeyF: 23,
			KeyG: 24,
			KeyH: 25,
			KeyI: 41,
			KeyJ: 26,
			KeyK: 27,
			KeyL: 28,
			KeyM: 13,
			KeyN: 12,
			KeyO: 42,
			KeyP: 43,
			KeyQ: 34,
			KeyR: 37,
			KeyS: 21,
			KeyT: 38,
			KeyU: 40,
			KeyV: 10,
			KeyW: 35,
			KeyX: 8,
			KeyY: 39,
			KeyZ: 7,

			// Pavé numérique
			Numpad0: 77,
			Numpad1: 80,
			Numpad2: 79,
			Numpad3: 78,
			Numpad4: 83,
			Numpad5: 82,
			Numpad6: 81,
			Numpad7: 86,
			Numpad8: 85,
			Numpad9: 84,
			NumpadDecimal: 76,
			NumpadEnter: 75,

			// Touches spéciales
			Space: 5,
			Tab: 33,
			Escape: 48,
			ShiftLeft: 6,
			ShiftRight: 17,
			CapsLock: 19,
			ControlLeft: 3,
			Backspace: 62,
			Delete: 47,
			Enter: 46,

			// Chiffres
			Digit1: 49,
			Digit2: 50,
			Digit3: 51,
			Digit4: 52,
			Digit5: 53,
			Digit6: 54,
			Digit7: 55,
			Digit8: 56,
			Digit9: 57,
			Digit0: 58,

			// Touches de fonction
			F1: 64,
			F2: 65,
			F3: 66,
			F4: 67,
			F5: 68,

			// Ponctuation
			Minus: 59,
			Equal: 60,
			Slash: 16,
			Semicolon: 29,
			Backslash: 45,
			Quote: 30,
			Comma: 14,
			Period: 15,
			Backquote: 61
		};

		// Chargement des textures optimisé
		const textureFiles = {
			normalMap: 'src/assets/textures/H89_Normal.png',
			texture: 'src/assets/textures/H89_Light_BaseColor.png',
			roughnessMap: 'src/assets/textures/H89_Roughness.png',
			aoMap: 'src/assets/textures/H89_AO.png',
			metalnessMap: 'src/assets/textures/H89_Metallic.png'
		};

		const textures = {};
		Object.entries(textureFiles).forEach(([key, path]) => {
			textures[key] = textureLoader.load(path);
		});

		const material = new THREE.MeshStandardMaterial({
			map: textures.texture,
			normalMap: textures.normalMap,
			roughnessMap: textures.roughnessMap,
			aoMap: textures.aoMap,
			metalnessMap: textures.metalnessMap
		});

		// Create the ShaderMaterial avec effet CRT amélioré
		const testmaterial = new THREE.RawShaderMaterial({
			uniforms: {
				time: { value: 0 },
				lineCount: { value: 150 },
				color1: { value: new THREE.Color(0x000000) }, // Noir transparent
				color2: { value: new THREE.Color(0x002200) }, // Vert très sombre
				speed: { value: 1 },
				screenTexture: { value: null } // Pour les futurs améliorations
			},
			vertexShader: vShader,
			fragmentShader: fShader,
			transparent: true,
			side: THREE.DoubleSide,
			blending: THREE.NormalBlending,
			depthWrite: false
		});

		loader.load('src/assets/models/ordinateur.obj', function (obj) {
			obj.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					// Filtrer pour ne garder que les éléments du clavier (position Y proche de 0)
					// et éviter les éléments de l'écran qui sont plus hauts
					if (child.position.y < 5) {
						// Ajustez cette valeur selon la géométrie de votre modèle
						child.castShadow = true;
						child.material = material;
						keyboard.push(child);
					}
				}
			});

			// GESTIONNAIRES D'ÉVÉNEMENTS OPTIMISÉS
			document.addEventListener('keydown', (event) => {
				if (event.repeat) return; // Empêche le son en boucle si touche maintenue
				const keyboardIndex = keyMapping[event.code];
				if (keyboardIndex !== undefined && keyboard[keyboardIndex]) {
					keyboard[keyboardIndex].position.y = -0.7;
					playKeySound();
				}
			});

			document.addEventListener('keyup', (event) => {
				const keyboardIndex = keyMapping[event.code];
				if (keyboardIndex !== undefined && keyboard[keyboardIndex]) {
					keyboard[keyboardIndex].position.y = 0;
				}
			});

			keyboard[1].material = testmaterial;

			keyboard.forEach((mesh) => {
				scene.add(mesh);
			});
		});

		// FONCTIONS DE RENDU ET REDIMENSIONNEMENT
		function render() {
			requestAnimationFrame(render);
			testmaterial.uniforms.time.value += 0.01;
			renderer.render(scene, camera);
		}

		function onWindowResize() {
			const width = window.innerWidth;
			const height = window.innerHeight;

			camera.aspect = width / height;
			camera.updateProjectionMatrix();

			renderer.setSize(width, height);
		}

		// ANIMATION DE ZOOM D'INTRODUCTION
		let animationProgress = 0;
		const animationDuration = 3000; // 3 secondes
		const startTime = Date.now();
		const startPosition = { x: 300, y: 120, z: 100 };

		function animateCamera() {
			const currentTime = Date.now();
			const elapsed = currentTime - startTime;
			animationProgress = Math.min(elapsed / animationDuration, 1);

			// Fonction d'easing (ease-out pour un effet fluide)
			const easeOut = 1 - Math.pow(1 - animationProgress, 3);

			// Interpolation des positions
			camera.position.x = startPosition.x + (finalCameraPosition.x - startPosition.x) * easeOut;
			camera.position.y = startPosition.y + (finalCameraPosition.y - startPosition.y) * easeOut;
			camera.position.z = startPosition.z + (finalCameraPosition.z - startPosition.z) * easeOut;

			camera.lookAt(finalLookAt.x, finalLookAt.y, finalLookAt.z);

			// Continuer l'animation si pas finie
			if (animationProgress < 1) {
				requestAnimationFrame(animateCamera);
			}
		}

		// Démarrer l'animation après un court délai
		setTimeout(() => {
			animateCamera();
		}, 500);

		render();
		window.addEventListener('resize', onWindowResize);

		// Animation des points de boot
		let bootDots = 0;
		const bootDotsElem = document.getElementById('boot-dots');
		const bootInterval = setInterval(() => {
			bootDots = (bootDots + 1) % 4;
			if (bootDotsElem) bootDotsElem.textContent = '.'.repeat(bootDots);
		}, 400);

		// Affichage du loader custom au début
		const customLoader = document.getElementById('custom-loader');

		// Séquence de boot animée
		const bootLines = [
			'HEATHKIT H89 BIOS v1.04',
			'640K RAM SYSTEM  1 DISK DRIVE FOUND',
			'VIDEO: CRT 80x25 GREEN PHOSPHOR',
			'KEYBOARD: OK',
			'FLOPPY: OK',
			'LOADING THREE.JS...',
			'LOADING ASSETS...',
			'LOADING PORTFOLIO MODULE...',
			'INITIALIZING VIRTUAL CRT...',
			'READY.'
		];
		const bootSequenceElem = document.getElementById('boot-sequence');
		const bootPromptElem = document.getElementById('boot-prompt');
		let bootIndex = 0;
		function showNextBootLine() {
			if (bootIndex < bootLines.length) {
				bootSequenceElem.textContent += bootLines[bootIndex] + '\n';
				bootIndex++;
				setTimeout(showNextBootLine, 250 + Math.random() * 200);
			} else {
				bootPromptElem.style.display = '';
				bootDone = true;
				tryHideLoader();
			}
		}
		showNextBootLine();

		// Animation du prompt clignotant READY_
		// (déjà géré par le CSS .blink)
	});
</script>

<body>
	<div id="custom-loader" class="custom-loader">
		<div class="scanlines" />
		<div class="boot-sequence" id="boot-sequence" />
		<div class="boot-prompt" id="boot-prompt" style="display:none;">
			READY<span class="blink">_</span>
		</div>
	</div>
	<div class="progress-bar-container" style="display:none;">
		<progress id="progress-bar" max="100" value="0" />
	</div>
</body>

<style>
	:global(*) {
		margin: 0;
		background-color: rgba(0, 0, 0, 0);
	}

	.custom-loader {
		position: fixed;
		z-index: 9999;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: #050805;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		transition: opacity 0.7s;
		overflow: hidden;
	}
	.scanlines {
		pointer-events: none;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: repeating-linear-gradient(
			to bottom,
			rgba(0, 255, 0, 0.04) 0px,
			rgba(0, 255, 0, 0.04) 2px,
			transparent 2px,
			transparent 4px
		);
		animation: scanmove 2s linear infinite;
		z-index: 2;
	}
	@keyframes scanmove {
		0% {
			background-position-y: 0;
		}
		100% {
			background-position-y: 4px;
		}
	}
	.boot-sequence {
		color: #00ff00;
		font-family: 'Courier New', Courier, monospace;
		font-size: 1.3rem;
		text-shadow: 0 0 8px #00ff00, 0 0 2px #00ff00;
		white-space: pre;
		z-index: 3;
		margin-bottom: 30px;
	}
	.boot-prompt {
		color: #00ff00;
		font-family: 'Courier New', Courier, monospace;
		font-size: 1.5rem;
		text-shadow: 0 0 8px #00ff00, 0 0 2px #00ff00;
		z-index: 4;
		margin-top: 20px;
	}
	.blink {
		animation: blink 1s steps(1) infinite;
	}
	@keyframes blink {
		0%,
		50% {
			opacity: 1;
		}
		51%,
		100% {
			opacity: 0;
		}
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
