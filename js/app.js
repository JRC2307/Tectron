let firstPersonCamera, miniMapCamera, scene, renderer, texture, groundPlane, gridHelper;
let geometry, material, cube;
let ambientLight, hemisphereLight;

// let parameters =
    // {
        // AmbientLight: true,
        // DirectionalLight: true
    // };

let displayWindow = {
    x: window.innerWidth - (window.innerWidth/4) - 10,
    y: 10,
    width: (window.innerWidth/4),
    height: (window.innerHeight/4)
};

let deltaRotation = 0;

init();
animate();

function init() {

    // Main camera scene
    firstPersonCamera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100 );
    firstPersonCamera.position.set(-60,10,0);

    // Small scene
    miniMapCamera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100 );
    miniMapCamera.position.set(0, 50, 0);

    // Camera 1 Orientation
    firstPersonCamera.lookAt(new THREE.Vector3(0,0,0));
    firstPersonCamera.up = new THREE.Vector3(0,0,0);

    // Camera 2 Orientation
    miniMapCamera.lookAt(new THREE.Vector3(0,0,0));
    miniMapCamera.up = new THREE.Vector3(0,0,0);

    scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0xf0f0f0 );

    let helper = new THREE.CameraHelper( miniMapCamera );
    scene.add( helper );

    // cube
    geometry = new THREE.BoxGeometry( 5, 5, 5 );
    material = new THREE.MeshStandardMaterial({color: 0xfff000});
    cube = new THREE.Mesh( geometry, material );
    cube.position.set(0, 0, 0);
    cube.castShadow = true; //default is false
    cube.receiveShadow = true;
    scene.add( cube );

    // Comment the next 4 lines for textures:
    groundPlane = new THREE.Mesh(
        new THREE.PlaneGeometry( 80, 80 ),
        new THREE.MeshStandardMaterial( {color: 0x6B69FE, side: THREE.DoubleSide} )
    );

    groundPlane.material.side = THREE.DoubleSide;
    groundPlane.position.set(0, -5, 0);
    groundPlane.rotation.x = Math.PI / 2;
    groundPlane.castShadow = true; //default is false
    groundPlane.receiveShadow = true;
    scene.add(groundPlane);

    addLights();

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    renderer.autoClear = false; // important!

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

}

function addLights() {
    // AmbientLight
    ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 ); // soft white light
    scene.add( ambientLight );

    // HemisphereLight
    hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add(hemisphereLight);
}

function onWindowResize() {
    displayWindow = {
        x: window.innerWidth - (window.innerWidth/4) - 10,
        y: window.innerHeight - (window.innerHeight/4) - 10,
        height: (window.innerWidth/4),
        width: (window.innerHeight/4)
    };
    firstPersonCamera.aspect = window.innerWidth / window.innerHeight;
    firstPersonCamera.updateProjectionMatrix();
    miniMapCamera.aspect = window.innerWidth / window.innerHeight;
    miniMapCamera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function initGui() {

}

function animate() {
    requestAnimationFrame(animate);
    render();
}


function render() {
    deltaRotation += 0.01;
    cube.position.x = Math.sin(deltaRotation) * 10;
    cube.position.z = Math.cos(deltaRotation) * 10;

    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;
    cube.rotation.z += 0.005;

    // Big scene
    firstPersonCamera.position.set(cube.position.x, cube.position.y + 10, cube.position.z + 20);

    // Camera 1 Orientation
    firstPersonCamera.lookAt(cube.position.x, cube.position.y -20, cube.position.z -20);
    firstPersonCamera.up = new THREE.Vector3(0,0,0);

    renderer.clear();
    renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
    renderer.render( scene, firstPersonCamera );

    renderer.clearDepth(); // important! clear the depth buffer
    renderer.setViewport( displayWindow.x, displayWindow.y, displayWindow.width, displayWindow.height);
    renderer.render( scene, miniMapCamera );
}
