let players = [];
let debugMode = 1;

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
  getPlayersCollection().onSnapshot(function(playersSnapshot) {

    playersSnapshot.forEach(function(playerDoc) {

      let existingPlayer = players.filter(
        player => player.playerID === playerDoc.data().playerID);

      console.log('existingPlayer', existingPlayer);

      if (existingPlayer.length === 0 && playerDoc.id !== mainPlayerID) {

          player = new Player(playerDoc.id, false, playerDoc.data().name, playerDoc.data().number);
          players.push(player);
          console.log('Player does not exist, created it:', player);
      } else if (playerDoc.id !== mainPlayerID) {
          console.log('Player exists:', existingPlayer[0]);
          existingPlayer[0].setXPosition(playerDoc.data().x);
          existingPlayer[0].setZPosition(playerDoc.data().z);
      }
    });
  });
}

function animate() {
  requestAnimationFrame(animate);
  scene.render();
}


function run() {
  initPlayers();
  scene = new Scene(players);

  animate();
}


function onKeyPressUp(e) {
  let keyAction = keyActions[keys[e.keyCode]];
  if (keyAction && keyAction.enabled) {
    keyAction.action();
  }
}

function startGame(player) {
  document.addEventListener('keyup', onKeyPressUp, false);
  run();
  ticker(player);
}

async function ticker(player) {

  while (true) {
    await sleep(1000);
    let updatedPlayer = Object.assign({}, player);
    delete updatedPlayer.model;
    updateCurrentPlayerDocument(updatedPlayer);
    console.log('Updated position');
  }
}

// Main app configurations:

/**
 * Function to log the user in (if not logged in yet) and send flow to let the user create or join a room.
 */
function login() {
  firebase.auth().onAuthStateChanged(function( user ) {
    if ( user ) {
      // User is signed in
      console.log( "Player is signed in " + user.uid);
      mainPlayerID = user.uid;
      createOrJoinRoom();
    } else {
      // User is signed out
      console.log( "Player is signed out " );
      firebase.auth().signInAnonymously().catch(function(error) {
        console.log( error.code + ": " + error.message );
      })
    }
  });
}

/**
 * Function for the user to decide to join a room or create one.
 */
function createOrJoinRoom() {
  let createRoom = prompt("Create room (1) or join room (0):");
  if (createRoom === '1') {
    onCrateRoom();
  } else {
    onJoinRoom();
  }
}

function onCrateRoom() {
  let playerName = prompt("Creating: Introduce your player name:");
  if(playerName === null) {
    alert("Invalid value. Try again");
    onCrateRoom()
  }
  console.log(playerName);
  createRoom(playerName)
    .then(function (playerInfo) {
      console.log("room created successfully.");
      console.log(playerInfo);
      setMainPlayer(playerInfo);
    })
    .catch(function (error) {
      console.error("Error creating room.");
      console.error(error);
    });
}

function onJoinRoom() {
  // let key = prompt("Joining: Introduce the room key:");
  let key = 'RMdXbV'
  if(key === null || key.length !== 6) {
    alert("Invalid value. Try again");
    onJoinRoom();
  }
  console.log(key);
  let playerName = prompt("Introduce your player name:");
  if(playerName === null) {
    alert("Invalid value. Try again");
    onJoinRoom();
  }
  console.log(playerName);
  joinRoom(key, playerName)
    .then(function (playerInfo) {
      console.log("Joined room successfully.");
      console.log(playerInfo);
      setMainPlayer(playerInfo);
    })
    .catch(function (error) {
      console.error("Error joining  room.");
      console.error(error);
    });
}

function setMainPlayer(playerInfo) {
  mainPlayer = new Player(mainPlayerID, true, playerInfo.name, playerInfo.number);
  players.push(mainPlayer);
  startGame(mainPlayer);
}

function startApp() {
  login();
}

startApp();
