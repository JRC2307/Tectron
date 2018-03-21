class Player {

  constructor() {
    this.isAlive = true;
    this.model = this.initPlayerModel();
    this.speed = 0.4;
    this.direction = 'north'
  }

  initPlayerModel() {
    let geometry = new THREE.BoxGeometry( 5, 5, 5 );
    let material = new THREE.MeshStandardMaterial({color: 0xfff000});
    let cube = new THREE.Mesh( geometry, material );
    cube.position.set(0, 0, 0);
    cube.castShadow = true; //default is false
    cube.receiveShadow = true;

    return cube
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
