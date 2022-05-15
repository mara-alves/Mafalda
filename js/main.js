/* global THREE */

var camera, scene, renderer, controls;

var character, eyes;

function addEllipse(obj, x, y, z) {
    'use strict';
    var path = new THREE.Shape();
    path.absellipse(0, 0, 20, 10, 0, Math.PI * 2, false, 0);
    var geometry = new THREE.ShapeBufferGeometry(path);
    var material = new THREE.MeshBasicMaterial({ color: 0xffafcc });
    var ellipse = new THREE.Mesh( geometry, material );
    scene.add(ellipse);

    ellipse.position.set(x, y, z);
    obj.add(ellipse);
}

function addCylinder(obj, x, y, z, radius, height, c) {
    'use strict';
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
    const material = new THREE.MeshPhysicalMaterial({ color: c, wireframe: false });
    const cylinder = new THREE.Mesh(geometry, material);

    cylinder.position.set(x, y, z);
    cylinder.rotation.z = Math.PI / 2;
    obj.add(cylinder);
}

function addSphere(obj, x, y, z, size, c) {
    'use strict';
    const geometry = new THREE.SphereGeometry(size, 32, 16);
    const material = new THREE.MeshBasicMaterial({ color: c, wireframe: false });
    const sphere = new THREE.Mesh(geometry, material);

    sphere.position.set(x, y, z);
    obj.add(sphere);
}

function addTorus(obj, x, y, z) {
    'use strict';
    const geometry = new THREE.TorusGeometry(155, 12, 16, 100, Math.PI);
    const material = new THREE.MeshPhysicalMaterial({ color: 0xa663cc, wireframe: false });
    const torus = new THREE.Mesh(geometry, material);

    torus.position.set(x, y, z);
    obj.add(torus);
}

function addMouth(obj, x, y, z) {
    'use strict';
    const geometry = new THREE.TorusGeometry(15, 3, 16, 100, Math.PI);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: false });
    const torus = new THREE.Mesh(geometry, material);

    torus.position.set(x, y, z);
    torus.rotation.x = Math.PI;
    obj.add(torus);
}

function addCube(obj, x, y, z) {
    'use strict';
    const geometry = new THREE.BoxGeometry(250, 250, 250);
    const material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, wireframe: false });
    const cube = new THREE.Mesh(geometry, material);

    cube.position.set(x, y, z);
    obj.add(cube);
}

function createCharacter() {
    'use strict';
    character = new THREE.Object3D();
    character.userData = { jump : false, step : 0 };

    addCube(character, 0, 0, 0);

    // Eyes
    eyes = new THREE.Object3D();
    addSphere(eyes, -55, 25, 125, 18, 0x000000);
    addSphere(eyes, 55, 25, 125, 18, 0x000000);
    // shine
    addSphere(eyes, -49, 35, 135, 5, 0xffffff);
    addSphere(eyes, 62, 35, 135, 5, 0xffffff);
    addSphere(eyes, -55, 30, 140, 3, 0xffffff);
    addSphere(eyes, 55, 30, 140, 3, 0xffffff);
    character.add(eyes);

    addMouth(character, 0, 10, 125);
    addEllipse(character, -55, -10, 135);
    addEllipse(character, 55, -10, 135);

    // Headphones
    addTorus(character, 0, 55, 0);
    addCylinder(character, -125, 0, 0, 60, 90, 0xa663cc);
    addCylinder(character, 125, 0, 0, 60, 90, 0xa663cc);
    addCylinder(character, -175, 0, 0, 50, 20, 0x9a5fbf);
    addCylinder(character, 175, 0, 0, 50, 20, 0x9a5fbf);

    character.position.set(0, 0, 0);
    scene.add(character);
}

function closeEyes() {
    const geometry = new THREE.TorusGeometry(15, 3, 16, 100, Math.PI);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: false });
    const eye1 = new THREE.Mesh(geometry, material);
    const eye2 = new THREE.Mesh(geometry, material);

    eyes.visible = false;

    eye1.position.set(-55, 25, 125);
    eye1.rotation.x = -Math.PI;

    eye2.position.set(55, 25, 125);
    eye2.rotation.x = -Math.PI;

    character.add(eye1);
    character.add(eye2);
}

function openEyes() {
    eyes.visible = true;
}

function render() {
    'use strict';
    renderer.render(scene, camera);
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(100));

    createCharacter();

    // lights, 3 point lighting
    var color = 0xffffff; // set

    var light = new THREE.AmbientLight(color, 0.6);

    var keyLight = new THREE.DirectionalLight(color, 0.6);
    keyLight.position.set(20, 30, 10);
    keyLight.castShadow = true;
    keyLight.shadow.camera.top = 20;

    var fillLight = new THREE.DirectionalLight(color, 0.3);
    fillLight.position.set(-20, 20, 20);

    var backLight = new THREE.DirectionalLight(color, 0.1);
    backLight.position.set(10, 0, -20);

    scene.add(light);
    scene.add(keyLight);
    scene.add(fillLight);
    scene.add(backLight);
}

function createCamera() {
    'use strict';

    camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, 
                                          window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(200, 200, 300);
    camera.lookAt(scene.position);
    controls.update();
}

function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
        case 52: // 4
            scene.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
            });
            break;

        case 32: // spacebar
            if (character.userData.step == 0)
                character.userData.jump = !character.userData.jump;
            break;
    }

    render();
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
}

function animate() {
    'use strict';

    requestAnimationFrame(animate);

    if (character.userData.jump) {
        closeEyes();
        character.userData.step += 0.03;
        character.position.y = Math.abs(150 * (Math.sin(character.userData.step)));
        
        // stop jumping after one jump
        if (character.userData.step >= Math.PI) {
            openEyes();
            character.userData.step = 0;
            character.userData.jump = !character.userData.jump;
        }
    }
    controls.update();

    render();
}

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}