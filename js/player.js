class Player {
  constructor(id, controllable, name, number) {
    this.id = id;
    this.controllable = controllable;
    this.name = name;
    this.number = number;
    this.isAlive = true;
    this.tail = [{ x: 0, z: 10 }];

    this.speed = 1;

    // Setup the players facing each other
    switch(number) {
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

    return model;
  }

  addTail() {
    this.tail.push({ x: this.position.x, z: this.position.z});
  }

  // addTail() {
    // let material2 = new THREE.MeshStandardMaterial({color: 0x00ff00});
    // let geometry = new THREE.BoxGeometry( 5, 5, 5 );

    // let tail = new THREE.Mesh( geometry, material2); // tail.position.set(this.position.x, 0, (this.z - 5));
    // this.model.add(tail);


    //create child cube mesh
    // let cubeMesh = []
    // cubeMesh[0] = new THREE.Mesh( geometry, material2);
    // cubeMesh[1] = new THREE.Mesh( geometry, material2);
    // cubeMesh[2] = new THREE.Mesh( geometry, material2);

    // cubeMesh[0].position.set(this.x, 0, (this.z - 5));
    // cubeMesh[1].position.set(this.x, 0, (this.z - 10));
    // cubeMesh[2].position.set(this.x, 0, (this.z - 15));

    //Add child cubes to the scene
    // for (var i = 0; i < 3; i++)
      // this.model.add(cubeMesh[i]);
  // }
  //
  setPosition(x, z) {
    this.model.position.x = x
    this.model.position.z = z
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

    this.position.x += this.getXMovement();
    this.position.z += this.getZMovement();

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

  bark() {
    console.log('Woof');
  }

}
