// Initialize Firebase
var config = {
  apiKey: "AIzaSyBNqb5PRq4jNW6gHvxx2j8E1T8-FAnXGYE",
  authDomain: "tectron111.firebaseapp.com",
  databaseURL: "https://tectron111.firebaseio.com",
  projectId: "tectron111",
  storageBucket: "tectron111.appspot.com",
  messagingSenderId: "1087328543626"
};

firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

var mainPlayerID;
var roomID;
var roomKey;

// function to create a new room, and add the current player as the host. Player name provided
async function createRoom(playerName) {
  // generate random key of 6 characters for other players to join the room.
  roomKey = generateRoomKey();
  // create room
  return await firebase.firestore().collection("rooms").add({
    key: roomKey
  })
    .then(async function(roomDocRef) {
      roomID = roomDocRef.id;
      console.log("Room document written with ID: ", roomID);
      console.log("Room Key: ", roomKey);
      // Add player as room host.
      var playerInfo = {
        id: mainPlayerID,
        host: true,
        number: 1,
        name: playerName
      };
      return await db.doc("rooms/"+roomID+"/players/"+mainPlayerID).set(playerInfo, {merge: true})
        .then(function() {
          console.log("Host player added to new room. ");
          return playerInfo
        })
        .catch(function(error) {
          return Promise.reject("Error adding player document: " + error)
        });
    })
    .catch(function(error) {
      return Promise.reject("Error adding room document: " + error)
    });
}

// Function to generate a random key of 6 characters
function generateRoomKey() {
  var key = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    key += possible.charAt(Math.floor(Math.random() * possible.length));

  return key;
}

// Query room, get players, set new player.
async function joinRoom(roomKey, playerName) {
  return await db.collection("rooms").where("key", "==", roomKey)
    .get()
    .then(async function(roomQuerySnapshot) {
      if (roomQuerySnapshot.size > 0) {
        var roomDoc = roomQuerySnapshot.docs[0];
        console.log(roomDoc.id, " => ", roomDoc.data());
        roomID = roomDoc.id;
        // Query room players to assign player number
        return await db.collection("rooms/"+roomID+"/players")
          .get()
          .then(async function(roomPlayersQuerySnapshot) {
            // limit room size to 4
            if (roomPlayersQuerySnapshot.size > 0 && roomPlayersQuerySnapshot.size < 4) {
              // Add player as room guest.
              var playerInfo = {
                id: mainPlayerID,
                host: false,
                number: (roomPlayersQuerySnapshot.size +1),
                name: playerName
              };
              return await db.doc("rooms/"+roomID+"/players/"+mainPlayerID).set(playerInfo, {merge: true})
                .then(function() {
                  console.log("Guest player added to new room. ");
                  return playerInfo
                })
                .catch(function(error) {
                  return Promise.reject("Error adding player document: " + error);
                });
            } else {
              return Promise.reject("No space left in the room");
            }
          });
      } else {
        return Promise.reject("No room found with the specified key");
      }
    })
    .catch(function(error) {
      return Promise.reject("Error getting documents: " + error);
    });
}

function getCurrentPlayerDocument() {
  return db.doc("rooms/"+roomID+"/players/"+mainPlayerID).get();
}

// function receives a player object containing new position and orientation.
function updateCurrentPlayerDocument(player) {
  return db.doc("rooms/"+roomID+"/players/"+mainPlayerID).set(player);
}

// fetch players collection, returns listener
function getPlayersCollection() {
  return db.collection("rooms/"+roomID+"/players");
}

// function receives a tail object containing: position, orientation and color.
function addCurrentPlayerTail(tail) {
  return db.collection("rooms/"+roomID+"/players/"+mainPlayerID+"/tails/").add(tail);
}

// fetch a players tail collection.
function getPlayerTail(othermainPlayerID) {
  // return db.collection("rooms/"+roomID+"/players/"+othermainPlayerID+"/tails/").onSnapshot();
}
