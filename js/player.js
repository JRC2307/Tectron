class Player {
  constructor(id, controllable, name, number) {
    this.id = id;
    this.controllable = controllable;
    this.name = name;
    this.number = number;
    this.isAlive = true;

    this.speed = 0.2;
    this.tail = 5;

    // Setup the players facing each other
    switch(number) {
      case 1:
        this.direction = 90;
        this.x = 0;
        this.z = 10;
        break;
      case 2:
        this.direction = 270;
        this.x = 0;
        this.z = -10;
        break;
      case 3:
        this.direction = 180;
        this.x = 10;
        this.z = 0;
        break;
      case 4:
        this.direction = 0;
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
      case 0:
        return this.speed;
      case 180:
        return this.speed * -1;
      default:
        return 0;
    }
  }

  getZMovement() {
    switch(this.direction) {
      case 90:
        return this.speed * -1
      case 270:
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
      case 90:
        if (newDirection == 'left')
          this.direction = 180;
        else
          this.direction = 0;
        break;
      case 0:
        if (newDirection == 'left')
          this.direction = 90;
        else
          this.direction = 270;
        break;
      case 270:
        if (newDirection == 'left')
          this.direction = 0;
        else
          this.direction = 180;
        break;
      case 180:
        if (newDirection == 'left')
          this.direction = 270;
        else
          this.direction = 90;
        break;
    }
  }

  bark() {
    console.log('Woof');
  }

}
