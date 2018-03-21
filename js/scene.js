let firstPersonCamera, miniMapCamera, cube; // This should go to player

class Scene {

  constructor() {
    this.renderer
    this.scene
  }

  init() {

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

    this.scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0xf0f0f0 );

    let helper = new THREE.CameraHelper( miniMapCamera );
    this.scene.add( helper );

    // cube
    let geometry = new THREE.BoxGeometry( 5, 5, 5 );
    let material = new THREE.MeshStandardMaterial({color: 0xfff000});
    cube = new THREE.Mesh( geometry, material );
    cube.position.set(0, 0, 0);
    cube.castShadow = true; //default is false
    cube.receiveShadow = true;
    this.scene.add( cube );

    // Comment the next 4 lines for textures:
    let groundPlane = new THREE.Mesh(
      new THREE.PlaneGeometry( 80, 80 ),
      new THREE.MeshStandardMaterial( {color: 0x6B69FE, side: THREE.DoubleSide} )
    );

    groundPlane.material.side = THREE.DoubleSide;
    groundPlane.position.set(0, -5, 0);
    groundPlane.rotation.x = Math.PI / 2;
    groundPlane.castShadow = true; //default is false
    groundPlane.receiveShadow = true;
    this.scene.add(groundPlane);

    this.addLights();

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    this.renderer.autoClear = false; // important!

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

  }

  addLights() {
    // AmbientLight
    let ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 ); // soft white light
    this.scene.add( ambientLight );

    // HemisphereLight
    let hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    this.scene.add(hemisphereLight);
  }

  render() {
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

    this.renderer.clear();
    this.renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
    this.renderer.render( this.scene, firstPersonCamera );

    this.renderer.clearDepth(); // important! clear the depth buffer
    this.renderer.setViewport( displayWindow.x, displayWindow.y, displayWindow.width, displayWindow.height);
    this.renderer.render( this.scene, miniMapCamera );
  }

}
