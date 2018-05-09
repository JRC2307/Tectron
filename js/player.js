class Player {
  constructor(id, controllable, name, number) {
    this.id = id;
    this.controllable = controllable;
    this.name = name;
    this.number = number;
    this.isAlive = true;
    this.tail = [];
    this.tailDelay = 0;

    this.speed = 1;

    // Setup the players facing each other
    switch(this.number) {
      case 1:
        this.direction = 90;
        this.position = { x: 0, z: 10 };
        break;
      case 2:
        this.direction = 270;
        this.position = { x: 0, z: -10 };
        break;
      case 3:
        this.direction = 180;
        this.position = { x: 10, z: 10 };
        break;
      case 4:
        this.direction = 0;
        this.position = { x: -10, z: 0 };
        break;
    }

    this.model = this.initPlayerModel();
  }

  initPlayerModel() {
    let geometry = new THREE.BoxGeometry( 5, 5, 5 );
    let material = new THREE.MeshStandardMaterial({color: 0xffff00});
    let model = new THREE.Mesh( geometry, material );

    model.position.set(this.position.x, 0, this.position.z);
    model.castShadow = true; //default is false
    model.receiveShadow = true;
    model.name = this.id

    return model;
  }

  addTail() {
    this.tail.push({ x: this.position.x, z: this.position.z});
  }

  setPosition(position) {
    this.position = position
    this.model.position.x = this.position.x
    this.model.position.z = this.position.z
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

  updateMainPlayerPosition() {

    this.position.x += this.getXMovement();
    this.position.z += this.getZMovement();

    this.tailDelay++;
    if (!(this.tailDelay % 3))
      this.addTail();

    this.model.position.x = this.position.x
    this.model.position.z = this.position.z

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

  kill() {
    this.isAlive = false;
  }

  bark() {
    console.log('Woof');
  }

}
