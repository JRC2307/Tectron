class Player {
  constructor(id, controllable, name, number) {
    this.id = id;
    this.controllable = controllable;
    this.name = name;
    this.number = number;
    this.isAlive = true;
    // this.host = false;

    this.speed = 0.2;
    this.tail = 5;

    // Setup the players facing each other
    switch(number) {
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
    let geometry = new THREE.BoxGeometry( 5, 5, this.tail );
    let material = new THREE.MeshStandardMaterial({color: 0xffff00});
    let model = new THREE.Mesh( geometry, material );

    model.position.set(this.x, 0, this.z);
    model.castShadow = true; //default is false
    model.receiveShadow = true;

    return model
  }

  setXPosition(x) {
    this.x = x;
    this.model.position.x = this.x
  }

  setZPosition(z) {
    this.z = z;
    this.model.position.z = this.z
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

  updatePlayerPosition() {
    this.x += this.getXMovement();
    this.z += this.getZMovement();
    this.model.position.x = this.x
    this.model.position.z = this.z

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
