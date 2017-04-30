var userID, userType, latitude, longitude;
var socket;

$(document).ready(function() {
    userType = getType();
    updateUserData();
})

socket = io.connect('https://skf268.itp.io/');

//receive from server and set sessionID as userID
socket.on('sessionID', function(data) {
  userID = data;
});

//update userData every second. watchPosition doesn't seem to be working :(
setInterval(updateUserData, 4000);

//randomly assign type
function getType() {
    var type = "Red";
    var rnd = Math.random(1);
    if (rnd < 0.3) {
        type = "Green";
    } else if (rnd < 0.6) {
        type = "Blue";
    }
    return type;
}

function updateUserData() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            var userData = {
              "userID" : userID,
              "userType": userType,
              "latitude" : latitude,
              "longitude" : longitude
            }
            socket.emit('userData', userData);
        });
    } else {
        console.log("no position value");
    }
}
