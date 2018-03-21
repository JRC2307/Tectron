let displayWindow = {
  x: window.innerWidth - (window.innerWidth/4) - 10,
  y: 10,
  width: (window.innerWidth/4),
  height: (window.innerHeight/4)
};

let player = new Player()

let keys = {
  87: 'up', // W
  65: 'left', // A
  68: 'right', // D
  83: 'down', // S
  32: 'spacebar' // spacebar
}


var keyActions = {
  'up': {
    enabled: true,
    action: function() {
      // keyActions.backward.enabled = false;
      console.log('up');
    }
  },
  'left': {
    enabled: true,
    action: function() {
      player.changeDirection('left');
      // player.forward();
      // keyActions.backward.enabled = false;
      console.log('left');
    }
  },
  'right': {
    enabled: true,
    action: function() {
      player.changeDirection('right');
      // player.forward();
      // keyActions.backward.enabled = false;
      console.log('right');
    }
  },
  'down': {
    enabled: true,
    action: function(){
      // player.forward();
      // keyActions.backward.enabled = false;
      console.log('down');
    }
  },
  'spacebar': {
    enabled: false,
    action: function() {
      // player.forward();
      // keyActions.backward.enabled = false;
      console.log('spacebar');
    }
  }
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
  scene = new Scene(player);

  animate();
}

function onKeyPressUp(e) {
  let keyAction = keyActions[keys[e.keyCode]];
  if (keyAction && keyAction.enabled) {
    keyAction.action();
  }
}

document.addEventListener('keyup', onKeyPressUp, false);

run();
