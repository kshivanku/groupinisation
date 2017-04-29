var userID, userPos, userType;

$(document).ready(function() {
    userID = makeid();
    userType = getType();
    getPosition("new");
})
setInterval(getPosition, 10000);

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

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

function getPosition(userStatus) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            userPos = position.coords;
            if(userStatus == "new") {
              createNewUser();
            }
            else {
              updateLocationInfo();
            }
        });
    } else {
        console.log("no position value");
    }
}

function createNewUser() {
    var newUser = {
        "userID": userID,
        "type": userType,
        "latitude" : userPos.latitude,
        "longitude" : userPos.longitude
    }
    $.post('/saveNewUser', newUser);
}

function updateLocationInfo() {
  var update = {
    'userID' : userID,
    'latitude' : userPos.latitude,
    'longitude' : userPos.longitude
  }
  $.post('/updateLocationInfo', update);
}

//CHECKING IF BROWSER TAB HAS BEEN CLOSED
window.addEventListener('beforeunload', function(e) {
  var userLeft = {
    'userID' : userID
  }
  $.post('/userLeft', userLeft);
}, false);
