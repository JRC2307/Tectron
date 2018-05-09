class Player {
  constructor(id, controllable, name, number) {
    this.id = id;
    this.controllable = controllable;
    this.name = name;
    this.number = number;
    this.isAlive = true;
    this.tail = [];
    this.tailDelay = 0;

    this.speed = 0.75;

    // Setup the players facing each other
    switch(this.number) {
      case 1:
        this.direction = 90;
        this.position = { x: 0, z: 50 };
        break;
      case 2:
        this.direction = 270;
        this.position = { x: 0, z: -50 };
        break;
      case 3:
        this.direction = 180;
        this.position = { x: 50, z: 50 };
        break;
      case 4:
        this.direction = 0;
        this.position = { x: -50, z: 0 };
        break;
    }

    console.log(this.position);
    this.initPlayerModel().then( function (model) {
      this.model = model;
    });
    console.log(this.model.position);
    this.model.castShadow = true; //default is false
    this.model.receiveShadow = true;
  }

  async initPlayerModel() {

    let mtlLoader = new THREE.MTLLoader();
      return await mtlLoader.load( 'LC/HQ_Movie cycle.mtl', async function(  materials ) {
        materials.preload();
        let objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        return await objLoader.load( 'LC/HQ_Movie cycle.obj', function ( model ) {
          scene.add( model );
        });
      });


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
    if (!(this.tailDelay % 2))
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
