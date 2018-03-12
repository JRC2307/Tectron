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

var playerID;
var roomID;

function login() {
    firebase.auth().onAuthStateChanged(function( user ) {
        if ( user ) {
            // User is signed in
            console.log( "Player is signed in " );
            playerID = user.uid;
        } else {
            // User is signed out
            console.log( "Player is signed out " );
            firebase.auth().signInAnonymously().catch(function(error) {
                console.log( error.code + ": " + error.message );
            })
        }
    });
}

// function to create a new room, and add the current player as the host. Player name provided
function createRoom(playerName) {
    // generate random key of 6 characters for other players to join the room.
    var roomKey = generateRoomKey();
    console.log(roomKey);
    // create room
    db.collection("rooms").set({
        key: roomKey
    })
    .then(function(roomDocRef) {
        console.log("Room document written with ID: ", roomDocRef.id);
        roomID = roomDocRef.id;
        // Add player as room host.
        db.collection("rooms/"+roomID+"/players/"+playerID).set({
            host: true,
            number: 1,
            name: playerName
        })
        .then(function(playerDocRef) {
            console.log("Host player added to new room: ", playerDocRef.id);
        })
        .catch(function(error) {
            console.error("Error adding player document: ", error);
        });
    })
    .catch(function(error) {
        console.error("Error adding room document: ", error);
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
function joinRoom(roomKey, playerName) {
    db.collection("rooms").where("key", "==", roomKey)
        .get()
        .then(function(roomQuerySnapshot) {
            if (roomQuerySnapshot.size > 0) {
                var roomDoc = roomQuerySnapshot[0];
                console.log(roomDoc.id, " => ", roomDoc.data());
                roomID = roomDoc.id;
                // Query room players to assign player number
                db.collection("rooms/"+roomID+"/players")
                    .get()
                    .then(function(roomPlayersQuerySnapshot) {
                        if (roomPlayersQuerySnapshot.size > 0) {
                            // Add player as room guest.
                            db.collection("rooms/"+roomID+"/players/"+playerID).set({
                                host: false,
                                number: roomPlayersQuerySnapshot.size,
                                name: playerName
                            })
                            .then(function(playerDocRef) {
                                console.log("Guest player added to new room: ", playerDocRef.id);
                            })
                            .catch(function(error) {
                                console.error("Error adding player document: ", error);
                            });
                        }
                    });
            } else {
                console.log("No room found with the specified key");
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
}