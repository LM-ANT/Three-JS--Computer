import * as THREE from 'three';


export default class setupLoadingManager {

    constructor() {
        this.loadingManager = new THREE.LoadingManager();
        const progressBarContainer = document.querySelector('.progress-bar-container');
        //const progressBar = document.getElementById('progress-bar');
        this.loadingManager.onProgress = function (url, loaded, total) {
            const value = (loaded / total) * 100;
            if (value === 100) {
                //progressBarContainer.style.display = 'none';
            }
        };
    }
}