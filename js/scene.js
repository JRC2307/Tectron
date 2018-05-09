class Scene {

  constructor(players) {

    this.players = players;
    this.scene = new THREE.Scene();

    this.createFirstPersonCamera();
    this.createMiniMapCamera();

    for (var player of players) {
      this.scene.add( player.model );
    }

    this.collidableMeshList = [];

    this.createGroundPlane();
    this.createWalls();
    this.addLights();

    this.configureRenderer();

    document.body.appendChild( this.renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );

  }

  createFirstPersonCamera() {
    // fps camera pivot for rotation
    this.fpsCameraPivot = new THREE.Object3D();
    this.fpsCameraPivot.lookAt( new THREE.Vector3( 0, 0, 0 ) );

    // firstPersonCamera initialization
    this.firstPersonCamera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      500
    );

    this.firstPersonCamera.position.set(0, 20, 20);
    this.firstPersonCamera.lookAt(new THREE.Vector3(0,-10,-20));
    this.fpsCameraPivot.add( this.firstPersonCamera );
    this.scene.add( this.fpsCameraPivot );

    var fpsHelper = new THREE.CameraHelper( this.firstPersonCamera );
    this.scene.add( fpsHelper );
  }


  createMiniMapCamera() {
    // miniMapCamera initialization
    this.miniMapCamera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      110
    );

    this.miniMapCamera.position.set(0, 100, 0);

    this.miniMapCamera.lookAt(new THREE.Vector3(0,0,0));
    this.miniMapCamera.up = new THREE.Vector3(0,0,0);
  }


  createGroundPlane() {
    // Comment the next 4 lines for textures:
    var texture = THREE.ImageUtils.loadTexture('resources/floor.jpg');
    let groundPlane = new THREE.Mesh(
      new THREE.PlaneGeometry( 400, 400 ),
      new THREE.MeshStandardMaterial( {map: texture, side: THREE.DoubleSide} )
    );

    groundPlane.material.side = THREE.DoubleSide;
    groundPlane.position.set(0, -2, 0);
    groundPlane.rotation.x = Math.PI / 2;
    groundPlane.receiveShadow = true;
    this.scene.add(groundPlane);
  }

  createWall(texture) {
    let wall = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
      new THREE.MeshStandardMaterial( {map: texture, side: THREE.DoubleSide} )
    );

    wall.material.side = THREE.DoubleSide;

    return wall;
  }

  createWalls(){
    var texture = THREE.ImageUtils.loadTexture('resources/wall2.jpg');

    // North Wall
    let northWall = this.createWall(texture);
    northWall.position.set(0, 0, -200);
    northWall.receiveShadow = true;
    this.scene.add(northWall);
    this.collidableMeshList.push(northWall)

    // SouthWall
    let southWall = this.createWall(texture);
    southWall.position.set(0, 0, 200);
    southWall.receiveShadow = true;
    this.scene.add(southWall);
    this.collidableMeshList.push(southWall)

    // East
    let eastWall = this.createWall(texture);
    eastWall.position.set(200, 0, 0);
    eastWall.rotation.y = Math.PI / 2;
    eastWall.receiveShadow = true;
    this.scene.add(eastWall);
    this.collidableMeshList.push(eastWall)

    // West
    let westWall = this.createWall(texture);
    westWall.position.set(-200, 0, 0);
    westWall.rotation.y = Math.PI / 2;
    westWall.receiveShadow = true;
    this.scene.add(westWall);
    this.collidableMeshList.push(westWall)
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

  setFirstPersonCameraDirection(player){
    this.fpsCameraPivot.position.set(
      player.model.position.x,
      player.model.position.y,
      player.model.position.z
    );
    let rotation = 0;
    let rotationSpeed = 0.2;
    let rotationMargin = 0.2;
    switch(player.direction) {
      case 0:
        // East
        rotation = (270 * Math.PI)/180;
        if(this.fpsCameraPivot.rotation.y === 0)
          this.fpsCameraPivot.rotation.y = 6.28319;
        if(this.fpsCameraPivot.rotation.y > (rotation + rotationMargin)){
          this.fpsCameraPivot.rotation.y -= rotationSpeed;
        } else if(this.fpsCameraPivot.rotation.y < (rotation - rotationMargin)) {
          this.fpsCameraPivot.rotation.y += rotationSpeed;
        } else {
          this.fpsCameraPivot.rotation.y = rotation;
        }
        break;
      case 90:
        // North
        rotation = 0;
        if(this.fpsCameraPivot.rotation.y >= (270 * Math.PI)/180)
          rotation = (2 * Math.PI);
        if(this.fpsCameraPivot.rotation.y > (rotation + rotationMargin)){
          this.fpsCameraPivot.rotation.y -= rotationSpeed;
        } else if(this.fpsCameraPivot.rotation.y < (rotation - rotationMargin)) {
          this.fpsCameraPivot.rotation.y += rotationSpeed;
        } else {
          this.fpsCameraPivot.rotation.y = 0;
        }
        break;
      case 180:
        // West
        rotation = (90 * Math.PI)/180;
        if(this.fpsCameraPivot.rotation.y > (rotation + rotationMargin)){
          this.fpsCameraPivot.rotation.y -= rotationSpeed;
        } else if(this.fpsCameraPivot.rotation.y < (rotation - rotationMargin)) {
          this.fpsCameraPivot.rotation.y += rotationSpeed;
        } else {
          this.fpsCameraPivot.rotation.y = rotation;
        }
        break;
      case 270:
        // South
        rotation = Math.PI;
        if(this.fpsCameraPivot.rotation.y > (rotation + rotationMargin)){
          this.fpsCameraPivot.rotation.y -= rotationSpeed;
        } else if(this.fpsCameraPivot.rotation.y < (rotation - rotationMargin)) {
          this.fpsCameraPivot.rotation.y += rotationSpeed;
        } else {
          this.fpsCameraPivot.rotation.y = rotation;
        }
        break;
    }
  }

  renderPlayers() {
    for (var player of this.players) {

      if (player.controllable && player.isAlive) {

        player.updateMainPlayerPosition();
        this.setFirstPersonCameraDirection(player);

      } else if (player.isAlive == false) {

        var removedPlayer = this.scene.getObjectByName(player.id);
        this.scene.remove( removedPlayer );
      }
    }
  }


  renderPlayersTail() {
    let material = new THREE.MeshStandardMaterial({color: 0x00ff00});

    for (var player of this.players) {

      if (player.isAlive && player.tail.length > 0) {

        // Create a new tail object
        let x, z;

        if(player.controllable && player.direction === 180) {
            x = 3
            z = 0.5
        } else if(player.controllable && player.direction === 0) {
            x = 3
            z = 0.5
        } else if (player.controllable) {
            x = 0.5
            z = 3
        } else if (!player.controllable && player.direction === 180) {
            x = 10
            z = 0.5
        } else if (!player.controllable && player.direction === 0) {
            x = 10
            z = 0.5
        } else {
            x = 0.5
            z = 10
        }

        let geometry = new THREE.BoxGeometry(x, 4, z);
        let tail = new THREE.Mesh( geometry, material);

        let correction = 5

        // I needed to add this because the player would colide against his
        // own tail whenever there was a switch in direction

        switch(player.direction) {
          case 0:
            tail.position.set(player.tail[0].x - correction, 0, player.tail[0].z);
            break;
          case 90:
            tail.position.set(player.tail[0].x, 0, player.tail[0].z + correction);
            break;
          case 180:
            tail.position.set(player.tail[0].x + correction, 0, player.tail[0].z);
            break;
          case 270:
            tail.position.set(player.tail[0].x, 0, player.tail[0].z - correction);
            break;
        }


        tail.castShadow = true;
        tail.receiveShadow = true;

        // Add tail to the scene
        this.scene.add(tail);
        this.collidableMeshList.push(tail)
        player.tail = [];
      }
    }
  }

  addPlayerModels(player) {
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

  update() {
    for (var player of this.players) {


      if (player.controllable && player.isAlive) {

        var originPoint = player.model.position.clone();

        for (var vertexIndex = 0;
          vertexIndex < player.model.geometry.vertices.length;
          vertexIndex++) {

          var localVertex = player.model.geometry.vertices[vertexIndex].clone();
          var globalVertex = localVertex.applyMatrix4( player.model.matrix );
          var directionVector = globalVertex.sub( player.model.position );
          var ray = new THREE.Raycaster(
            originPoint, directionVector.clone().normalize() );
          var collisionResults = ray.intersectObjects( this.collidableMeshList );

          if (collisionResults.length > 0 &&
            collisionResults[0].distance < directionVector.length() ) {

            player.kill();
            console.log('Collission Detected');
          }
        }
      }
    }
  }
}
