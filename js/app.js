let players = [];
let debugMode = 1;

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
  scene.firstPersonCamera.aspect = window.innerWidth / window.innerHeight;
  scene.firstPersonCamera.updateProjectionMatrix();
  scene.miniMapCamera.aspect = window.innerWidth / window.innerHeight;
  scene.miniMapCamera.updateProjectionMatrix();
  scene.renderer.setSize( window.innerWidth, window.innerHeight );
}

function hideMainSite(elementid) {
    var x = document.getElementById(elementid);
    document.getElementById('joinRoom').style.display = "none";
    document.getElementById('createRoom').style.display = "none";
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function initPlayers() {
  getPlayersCollection().onSnapshot(function(playersSnapshot) {

    playersSnapshot.forEach(function(playerDoc) {


      let existingPlayer = players.filter(
        player => player.playerID === playerDoc.data().playerID);


      if (existingPlayer.length === 0 && playerDoc.id !== mainPlayerID) {

          player = new Player(playerDoc.id, false, playerDoc.data().name, playerDoc.data().number);
          players.push(player);
          scene.updatePlayerModels(player);

      } else if (playerDoc.id !== mainPlayerID) {
          existingPlayer[0].setXPosition(playerDoc.data().x);
          existingPlayer[0].setZPosition(playerDoc.data().z);
      }

      console.log(playerDoc.data().name, playerDoc.data().x, playerDoc.data().z)
    });
  });
}

function animate() {
  requestAnimationFrame(animate);
  scene.render();
}


function run() {
  scene = new Scene(players);
  initPlayers();
  animate();
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
// function createOrJoinRoom() {
//   let createRoom = prompt("Create room (1) or join room (0):");
//   if (createRoom === '1') {
//     onCreateRoom();
//   } else {
//     onJoinRoom();
//   }
// }

function onCreateRoom() {
  let playerName = document.getElementById('usrcreate').value;
  if(playerName === null) {
    alert("Invalid value. Try again");
    onCreateRoom()
  }
  console.log(playerName);
  createRoom(playerName)
    .then(function (playerInfo) {
      console.log("room created successfully.");
      console.log(playerInfo);
      setMainPlayer(playerInfo);
      hideMainSite('mainSite');
    })
    .catch(function (error) {
      console.error("Error creating room.");
      console.error(error);
    });
}

function onJoinRoom() {
  // let key = prompt("Joining: Introduce the room key:");
  let key = document.getElementById('code').value;
  if(key === null || key.length !== 6) {
    alert("Invalid value. Try again");
    onJoinRoom();
  }
  console.log(key);
  let playerName = document.getElementById('usrjoin').value;
  if(playerName === null) {
    alert("Invalid value. Try again");
    onJoinRoom();
  }
  console.log(playerName);
  joinRoom(key, playerName)
    .then(function (playerInfo) {
      hideMainSite('mainSite');
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
