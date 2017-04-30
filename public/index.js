var userID, userType, latitude, longitude;
var socket;

socket = io.connect('https://skf268.itp.io/');
// socket = io.connect('http://localhost:8800');

//receive from server and set sessionID as userID
socket.on('sessionID', function(data) {
  userID = data;
});

//update userData every second. watchPosition doesn't seem to be working :(
var interval = setInterval(updateUserData, 4000);

$(document).ready(function() {

    loadAudioFiles();

    //don't register as user yet
    clearInterval(interval);

    //show selection page
    $('#selection_page').css("display", "block");
    $('#player_page').css("display", "none");

    //once user makes his selection
    $('li').click(function(){
      //set user type
      userType = $(this)[0].innerHTML;

      //show player page
      $('#selection_page').css("display", "none");
      $('#player_page').css("display", "block");
      $('#player_page h1').html(userType);

      //register as user and start monitoring geolocation
      interval = setInterval(updateUserData, 4000);
    });
})


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
