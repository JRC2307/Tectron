let players

let displayWindow = {
  x: window.innerWidth - (window.innerWidth/4) - 10,
  y: 10,
  width: (window.innerWidth/4),
  height: (window.innerHeight/4)
};

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
    }
  },
  'left': {
    enabled: true,
    action: function() {
      for (var player of players) {
        player.changeDirection('left');
      }
      // player.forward();
      // keyActions.backward.enabled = false;
    }
  },
  'right': {
    enabled: true,
    action: function() {
      for (var player of players) {
        player.changeDirection('right');
      }
      // player.forward();
      // keyActions.backward.enabled = false;
    }
  },
  'down': {
    enabled: true,
    action: function(){
      // player.forward();
      // keyActions.backward.enabled = false;
    }
  },
  'spacebar': {
    enabled: false,
    action: function() {
      // player.forward();
      // keyActions.backward.enabled = false;
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
  scene.firstPersonCamera.aspect = window.innerWidth / window.innerHeight;
  scene.firstPersonCamera.updateProjectionMatrix();
  scene.miniMapCamera.aspect = window.innerWidth / window.innerHeight;
  scene.miniMapCamera.updateProjectionMatrix();
  scene.renderer.setSize( window.innerWidth, window.innerHeight );
}

function initGui() {

}

function initPlayers() {
  let players = [];

  players.push(new Player(1, true));
  players.push(new Player(2, false));
  players.push(new Player(3, false));
  players.push(new Player(4, false));

  return players;
}

function animate() {
  requestAnimationFrame(animate);
  scene.render();
}


function run() {
  players = initPlayers();
  scene = new Scene(players);

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
