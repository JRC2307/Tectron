var params = {
  rotateX: 0.0,
  rotateY: 0.0,
  rotateZ: 0.00,
  transalteX: 0,
  translateY: 0,
  translateZ: 0,
  scalingX: 1,
  scalingY: 1,
  scalingZ: 1,
  animate: true,
};

var scene = new THREE.Scene();
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.01, 100 );
var renderer = new THREE.WebGLRenderer();


//dat gui
var gui = new dat.GUI();
gui.add( params, 'rotateX', -0.3, 0.3 ).listen();
gui.add( params, 'rotateY', -0.3, 0.3 ).listen();
gui.add( params, 'rotateZ', -0.3, 0.3 ).listen();
var a = gui.add( params, 'transalteX', -3, 3 ).listen();
gui.add( params, 'translateY', -3, 3 ).listen();
gui.add( params, 'translateZ', -3, 3 ).listen();
gui.add( params, 'scalingX', 1, 10 ).listen();
gui.add( params, 'scalingY', 1, 10 ).listen();
gui.add( params, 'scalingZ', 1, 10 ).listen();

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.CubeGeometry( 1, 0 );
var material = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
camera.position.z = 3;


var render = function () {
  requestAnimationFrame( render );
  this.speed = 0.8;
  this.displayOutline = false;
  cube.position.x = params.transalteX;
  cube.position.y = params.translateY;
  cube.position.z = params.translateZ;
  cube.scale.x = params.scalingX;
  cube.scale.y = params.scalingY;
  cube.scale.z = params.scalingZ;
  cube.rotation.x += params.rotateX;
  cube.rotation.y += params.rotateY;
  cube.rotation.z += params.rotateZ;

  renderer.render( scene, camera );
};



render();
