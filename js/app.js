let displayWindow = {
    x: window.innerWidth - (window.innerWidth/4) - 10,
    y: 10,
    width: (window.innerWidth/4),
    height: (window.innerHeight/4)
};

let deltaRotation = 0;

function onWindowResize() {
    displayWindow = {
        x: window.innerWidth - (window.innerWidth/4) - 10,
        y: window.innerHeight - (window.innerHeight/4) - 10,
        height: (window.innerWidth/4),
        width: (window.innerHeight/4)
    };
    firstPersonCamera.aspect = window.innerWidth / window.innerHeight;
    firstPersonCamera.updateProjectionMatrix();
    miniMapCamera.aspect = window.innerWidth / window.innerHeight;
    miniMapCamera.updateProjectionMatrix();
    scene.renderer.setSize( window.innerWidth, window.innerHeight );
}

function initGui() {

}

function animate() {
    requestAnimationFrame(animate);
    scene.render();
}

function run() {
  scene = new Scene();
  animate();
}

run();
