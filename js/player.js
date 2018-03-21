class Player {

  constructor() {
    this.isAlive = true;
    this.model = this.initPlayerModel();
  }

  initPlayerModel() {
    let geometry = new THREE.BoxGeometry( 5, 5, 5 );
    let material = new THREE.MeshStandardMaterial({color: 0xfff000});
    cube = new THREE.Mesh( geometry, material );
    cube.position.set(0, 0, 0);
    cube.castShadow = true; //default is false
    cube.receiveShadow = true;

    return cube
  }

}
