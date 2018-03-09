//Logica de interfaz

var scene = new THREE.Scene();
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.01, 100 );
var renderer = new THREE.WebGLRenderer();


renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



var geometry = new THREE.CubeGeometry( 1, 0 );
var material = new THREE.();
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
camera.position.z = 3;


var render = function () {
  renderer.render( scene, camera );
};



render();
