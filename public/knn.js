var users;
var neighbor = [];
var k = 10;

//regularly gets all user data from socket
socket.on('allUsers', function(allUserData) {
    users = allUserData;
    neighbor = []; //reset all neighbors to none
    if(latitude != undefined && longitude != undefined){
      findNearNeighbors();
    }
});

function findNearNeighbors() {
    var distance;
    for (i = 0; i < users.length; i++) {
        if (users[i].userID != userID) {
            var lat1 = latitude;
            var long1 = longitude;
            var lat2 = users[i].latitude;
            var long2 = users[i].longitude;
            distance = getDistanceFromLatLonInM(lat1, long1, lat2, long2);
        } else {
            distance = Infinity;
        }

        n = {
            "userID": users[i].userID,
            "userType": users[i].userType,
            "latitude": users[i].latitude,
            "longitude": users[i].longitude,
            "distance": distance
        }
        neighbor.push(n);
    }
    neighbor.sort(byDistance);
    function byDistance(a, b) {
        return a.distance - b.distance;
    }

    var knn = {};
    for (var j = 0; j < min(k, neighbor.length); j++) {
        var nb = neighbor[j];
        if (knn[nb.userType]) {
            knn[nb.userType]++;
        } else {
            knn[nb.userType] = 1;
        }
    }

    var options = Object.keys(knn);
    var record = 0;
    var classification;
    for (var l = 0; l < options.length; l++) {
        if (record < knn[options[l]]) {
            record = knn[options[l]];
            classification = options[l];
        }
    }
    changeContent(classification);
}

function changeContent(c) {
    var source = "";
    switch (c) {
        case "pop":
            source = "audio_files/pop.mp3";
            break;
        case "hiphop":
            source = "audio_files/hiphop.mp3";
            break;
        case "latino":
            source = "audio_files/latino.mp3";
            break;
        case "edm":
            source = "audio_files/edm.mp3";
            break;
        case "kpop":
            source = "audio_files/kpop.mp3";
            break;
        case "classical":
            source = "audio_files/classical.mp3";
            break;
        case "jazz":
            source = "audio_files/jazz.mp3";
            break;
        case "metal":
            source = "audio_files/metal.mp3";
            break;
        default:
            source = "audio_files/pop.mp3";
    }

    if (source != $("#player").attr("src")) { //load the player only if the source changes
        $("#player").attr("src", source);
        $("#playing").css('display', 'block');
        $("#playing").css('background', 'url(images/' + c + '.gif) top left / 100px repeat #121212');
        $("#playing h1").html(c);
        $("#loading").css('display', 'none');
        $("#back p").html("< your preference: " + userType);
    }
}

function min(a, b) {
    if (a < b)
        return a;
    else
        return b
}

//getting distance in m
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = (lat2 - lat1).toRad();
    var dLon = (lon2 - lon1).toRad();
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d * 1000;
}
Number.prototype.toRad = function() {
    return this * Math.PI / 180;
}
