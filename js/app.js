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


function subscribeFirebase() {
  getPlayersCollection().onSnapshot(function(playersSnapshot) {

    console.log(' --- Snapshot --- ');
    playersSnapshot.forEach(function(firebasePlayer) {

      let existingPlayer = players.filter(
        player => player.id === firebasePlayer.data().id);

      if (existingPlayer.length === 0 && firebasePlayer.id !== mainPlayerID) {

        player = new Player(
          firebasePlayer.id,
          false,
          firebasePlayer.data().name,
          firebasePlayer.data().number
        );

        players.push(player);
        scene.updatePlayerModels(player);
      }

      players.forEach(function(player) {
        if (player.id !== mainPlayerID && player.id === firebasePlayer.id) {
          let x = (firebasePlayer.data().x);
          let y = (firebasePlayer.data().z);
          player.setPosition(x, y);
        }
        // console.log(player.name, player.position.x, player.position.z);
      });
    });
  });
}

function animate() {
  requestAnimationFrame(animate);
  scene.render();
}


function run() {
  scene = new Scene(players);
  subscribeFirebase();
  animate();
}


function startGame(player) {
  document.addEventListener('keyup', onKeyPressUp, false);
  run();
  ticker(player);
}

async function ticker(player) {

  while (true) {
    await sleep(250);
    let updatedPlayer = Object.assign({}, player);
    delete updatedPlayer.model;
    updateCurrentPlayerDocument(updatedPlayer);
  }
}

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
  let key = document.getElementById('code').value;
  // let key = 'rTyhHg';
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
