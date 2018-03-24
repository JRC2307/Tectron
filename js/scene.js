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
      new THREE.PlaneGeometry( 1000, 1000 ),
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

      if (player.controllable && player.isAlive) {

        player.updatePlayerPosition();

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
      } else if (player.isAlive == false) {

        var removedPlayer = this.scene.getObjectByName(player.id);
        this.scene.remove( removedPlayer );
      }
    }
  }


  renderPlayersTail() {
    let material = new THREE.MeshStandardMaterial({color: 0x00ff00});
    let geometry = new THREE.BoxGeometry( 1, 5, 1);

    for (var player of this.players) {
      if (player.isAlive) {
        // Create a new tail object
        console.log(player.tail.length);
        if (player.tail.length > 0){
          let geometry;
          if(player.direction === 180 || player.direction === 0){
            geometry = new THREE.BoxGeometry( 3, 5, 0.5);
          } else {
            geometry = new THREE.BoxGeometry( 0.5, 5, 3);
          }
          let tail = new THREE.Mesh( geometry, material);
          tail.position.set(player.tail[player.tail.length-1].x, 0, player.tail[player.tail.length-1].z);
          tail.castShadow = true;
          tail.receiveShadow = true;
          // Add tail to the scene
          this.scene.add(tail);
          player.tail = [];
        }
      }


      // for (var i = 0; i < player.tail.length; i++) {
      //
      //   // We need to remove the previous tail object, otherwhise we will render
      //   // n ^ 2 tails.
      //   var previousTail = this.scene.getObjectByName(i.toString());
      //   this.scene.remove( previousTail );
      //
      //   if (player.isAlive) {
      //     // Create a new tail object
      //     let tail = new THREE.Mesh( geometry, material);
      //     tail.position.set(player.tail[i].x, 0, player.tail[i].z);
      //     tail.castShadow = true;
      //     tail.receiveShadow = true;
      //     tail.name = i.toString();
      //
      //     // Add tail to the scene
      //     this.scene.add(tail);
      //   }
      // }
    }
  }

  updatePlayerModels(player) {
    this.scene.add( player.model );
    this.players.push(player);
  }


  // This function could be refactored
  render() {

    this.renderPlayers();
    this.renderPlayersTail();

    this.renderer.clear();
    this.renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
    this.renderer.render( this.scene, this.firstPersonCamera );

    this.renderer.clearDepth(); // important! clear the depth buffer
    this.renderer.setViewport( displayWindow.x, displayWindow.y, displayWindow.width, displayWindow.height);
    this.renderer.render( this.scene, this.miniMapCamera );
  }

}
