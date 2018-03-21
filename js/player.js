class Player {

  constructor(playerID, controllable) {
    this.playerID = playerID;
    this.controllable = controllable;
    this.isAlive = true;

    this.speed = 0.4;
    this.z = 0

    // Setup the players facing each other
    switch(playerID) {
      case 1:
        this.direction = 'north';
        this.x = 0;
        this.z = 10;
        break;
      case 2:
        this.direction = 'south';
        this.x = 0;
        this.z = -10;
        break;
      case 3:
        this.direction = 'west';
        this.x = 10;
        this.z = 0;
        break;
      case 4:
        this.direction = 'east';
        this.x = -10;
        this.z = 0;
        break;
    }

    this.model = this.initPlayerModel();
  }

  initPlayerModel() {
    let geometry = new THREE.BoxGeometry( 5, 5, 5 );
    let material = new THREE.MeshStandardMaterial({color: 0xfff000});
    let cube = new THREE.Mesh( geometry, material );

    cube.position.set(this.x, 0, this.z);
    cube.castShadow = true; //default is false
    cube.receiveShadow = true;

    return cube
  }

  getXPosition() {
    // Firebase func here
    return 1
  }

  getZPosition() {
    // Firebase func here
    return 1
  }

  setXPosition(x) {
    // Firebase func here
    //
  }

  setZPosition(z) {
    // Firebase func here
    // this.z = z
  }

  getXMovement() {
    switch(this.direction) {
      case 'east':
        return this.speed;
      case 'west':
        return this.speed * -1;
      default:
        return 0;
    }
  }

  getZMovement() {
    switch(this.direction) {
      case 'north':
        return this.speed * -1
      case 'south':
        return this.speed;
      default:
        return 0;
    }
  }

  changeDirection(newDirection) {
    if (!this.controllable)
      return

    switch(this.direction) {
      case 'north':
        if (newDirection == 'left')
          this.direction = 'west';
        else
          this.direction = 'east';
        break;
      case 'east':
        if (newDirection == 'left')
          this.direction = 'north';
        else
          this.direction = 'south';
        break;
      case 'south':
        if (newDirection == 'left')
          this.direction = 'east';
        else
          this.direction = 'west';
        break;
      case 'west':
        if (newDirection == 'left')
          this.direction = 'south';
        else
          this.direction = 'north';
        break;
    }
  }

  bark() {
    console.log('Woof');
  }

}
