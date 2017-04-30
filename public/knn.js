var users;
var neighbor = [];
var k = 1;

//regularly gets all user data from socket
socket.on('allUsers', function(allUserData){
  users = allUserData;
  neighbor = []; //reset all neighbors to none
  findNearNeighbors();
});


function findNearNeighbors() {
  var distance;
  for (i = 0 ; i < users.length ; i++) {
    if (users[i].userID != userID) {
      var lat1 = latitude;
      var long1 = longitude;
      var lat2 = users[i].latitude;
      var long2 = users[i].longitude;
      distance = getDistanceFromLatLonInM(lat1, long1, lat2, long2);
    }
    else {
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
  function byDistance(a, b){
    return a.distance - b.distance;
  }
  console.log(neighbor);
  var knn = {};
  for (var j = 0; j < min(k, neighbor.length) ; j++) {
    var nb = neighbor[j];
    if(knn[nb.userType]){
      knn[nb.userType]++;
    }
    else {
      knn[nb.userType] = 1;
    }
  }

  var options = Object.keys(knn);
  var record = 0;
  var classification;
  for(var l = 0 ; l < options.length; l++) {
    if (record < knn[options[l]]) {
      record = knn[options[l]];
      classification = options[l];
    }
  }
  changeContent(classification);
}

function changeContent(col) {
  var color = "#000000"
  if(col == "Red") {
    color = "#FF0000";
  }
  else if(col == "Green") {
    color = "#00FF00";
  }
  else {
    color = "#0000FF"
  }
  $("body").css("background-color", color);
}

function min(a, b) {
  if (a < b) return a;
  else return b
}

//getting distance in m
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = (lat2 - lat1).toRad();
  var dLon = (lon2 - lon1).toRad();
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d * 1000;
}
Number.prototype.toRad = function() {
  return this * Math.PI / 180;
}
