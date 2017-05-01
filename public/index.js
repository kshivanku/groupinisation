var userID, userType;
var latitude = undefined;
var longitude = undefined;
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
    $('.choice').click(function(){
      //set user type
      userType = $(this)[0].id;

      //show player page
      $('#selection_page').css("display", "none");
      $('#player_page').css("display", "block");
      $('#loading').css("display", "block");
      $('#playing').css("display", "none");
      $('#player_page h1').html("Great! People near you will listen to <span style='font-weight: 700'>" + userType + "</span>");

      //register as user and start monitoring geolocation
      interval = setInterval(updateUserData, 4000);
    });

    $("#back p").click(function(){
      location.reload();
    });
})

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
