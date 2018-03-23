let keys = {
  87: 'up', // W
  65: 'left', // A
  68: 'right', // D
  83: 'down', // S
  32: 'spacebar', // spacebar
  77: 'menu' //menu
}

let keyActions = {
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

function onKeyPressUp(e) {
  let keyAction = keyActions[keys[e.keyCode]];
  if (keyAction && keyAction.enabled) {
    keyAction.action();
  }
}


