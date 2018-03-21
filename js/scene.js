var camera1, miniMapCamera, scene, renderer, texture, groundPlane, gridHelper;
var geometry, material, cube;
var ambientLight, hemisphereLight;
var parameters =
    {
        AmbientLight: true,
        DirectionalLight: true
    };

var window2 = {
    x: window.innerWidth - (window.innerWidth/4) - 10,
    y: 10,
    width: (window.innerWidth/4),
    height: (window.innerHeight/4)
};
var deltaRotation = 0;

var players = [];
var playerCubes = [];

init();
animate();

function init() {
    // Big scene
    camera1 = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100 );
    camera1.position.set(-60,10,0);

    // Small scene
    miniMapCamera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100 );
    miniMapCamera.position.set(0, 50, 0);

    // Camera 1 Orientation
    camera1.lookAt(new THREE.Vector3(0,0,0));
    camera1.up = new THREE.Vector3(0,0,0);

    // Camera 2 Orientation
    miniMapCamera.lookAt(new THREE.Vector3(0,0,0));
    miniMapCamera.up = new THREE.Vector3(0,0,0);

    scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0xf0f0f0 );

    var helper = new THREE.CameraHelper( miniMapCamera );
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

    initPlayers();
    initGui();
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
    window2 = {
        x: window.innerWidth - (window.innerWidth/4) - 10,
        y: window.innerHeight - (window.innerHeight/4) - 10,
        height: (window.innerWidth/4),
        width: (window.innerHeight/4)
    };
    camera1.aspect = window.innerWidth / window.innerHeight;
    camera1.updateProjectionMatrix();
    miniMapCamera.aspect = window.innerWidth / window.innerHeight;
    miniMapCamera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function initGui() {

}

function initPlayers() {
    testGetPlayersCollection()
        .then( function(playersSnapshot) {
            console.log("Players changed...");
            // players = [];
            playersSnapshot.forEach(function(doc) {
                if (doc.id !== playerID) {
                    console.log("Player: " + doc);
                    var player = players.filter(function(player){ return player.id === doc.id });
                    if (player === undefined) {
                        player = doc.data();
                        player.id = doc.id();
                        players.push(player);
                        // cube
                        geometry = new THREE.BoxGeometry( 5, 5, 5 );
                        material = new THREE.MeshStandardMaterial({color: 0xfff000});
                        cube = new THREE.Mesh( geometry, material );
                        cube.position.set(player.posX, player.posY, player.posZ);
                        cube.castShadow = true; //default is false
                        cube.receiveShadow = true;
                        playerCubes.push(cube);
                        scene.add( cube );
                    } else {
                        player = doc.data();
                        player.id = doc.id;
                    }
                }
            });
        })
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    deltaRotation += 0.01;
    cube.position.x = Math.sin(deltaRotation) * 10;
    cube.position.z = Math.cos(deltaRotation) * 10;

    testUpdateCurrentPlayerDocument({
        posX: cube.position.x,
        posY: cube.position.y,
        posZ: cube.position.z
    });

    // Big scene
    camera1.position.set(cube.position.x, cube.position.y + 10, cube.position.z + 20);

    // Camera 1 Orientation
    camera1.lookAt(cube.position.x, cube.position.y -20, cube.position.z -20);
    camera1.up = new THREE.Vector3(0,0,0);

    renderer.clear();
    renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
    renderer.render( scene, camera1 );

    renderer.clearDepth(); // important! clear the depth buffer
    renderer.setViewport( window2.x, window2.y, window2.width, window2.height);
    renderer.render( scene, miniMapCamera );
}