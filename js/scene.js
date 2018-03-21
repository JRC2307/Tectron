class Scene {

  constructor(players) {

    this.players = players
    this.createFirstPersonCamera();
    this.createMiniMapCamera();

    this.scene = new THREE.Scene();

    let helper = new THREE.CameraHelper( this.miniMapCamera );
    this.scene.add( helper );

    for (var player of players) {
      this.scene.add( player.model );
    }

    this.createGroundPlane();
    this.addLights();

    this.configureRenderer();

    document.body.appendChild( this.renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );

  }

  createFirstPersonCamera() {
    // firstPersonCamera initialization
    this.firstPersonCamera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      100
    );

    this.firstPersonCamera.position.set(-60, 10, 0);

    this.firstPersonCamera.lookAt(new THREE.Vector3(0,0,0));
    this.firstPersonCamera.up = new THREE.Vector3(0,0,0);
  }


  createMiniMapCamera() {
    // miniMapCamera initialization
    this.miniMapCamera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      100
    );

    this.miniMapCamera.position.set(0, 50, 0);

    this.miniMapCamera.lookAt(new THREE.Vector3(0,0,0));
    this.miniMapCamera.up = new THREE.Vector3(0,0,0);
  }


  createGroundPlane() {
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
  }


  addLights() {
    // AmbientLight
    let ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 ); // soft white light
    this.scene.add( ambientLight );

    // HemisphereLight
    let hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    this.scene.add(hemisphereLight);
  }

  configureRenderer() {
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    this.renderer.autoClear = false; // important!
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  renderPlayers() {
    for (var player of this.players) {

      if (player.controllable) {

        player.model.position.x += player.getXMovement();
        player.model.position.z += player.getZMovement();

        // Camera 1 Orientation
        this.firstPersonCamera.position.set(
          player.model.position.x,
          player.model.position.y + 10,
          player.model.position.z + 20
        );

        this.firstPersonCamera.lookAt(
          player.model.position.x,
          player.model.position.y -20,
          player.model.position.z -20
        );

        this.firstPersonCamera.up = new THREE.Vector3(0,0,0);
      } else {

        // player.model.position.x = player.getXPosition();
        // player.model.position.z = player.getZPosition();

      }
    }
  }


  // This function could be refactored
  render() {

    this.renderPlayers();

    this.renderer.clear();
    this.renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
    this.renderer.render( this.scene, this.firstPersonCamera );

    this.renderer.clearDepth(); // important! clear the depth buffer
    this.renderer.setViewport( displayWindow.x, displayWindow.y, displayWindow.width, displayWindow.height);
    this.renderer.render( this.scene, this.miniMapCamera );
  }

}
