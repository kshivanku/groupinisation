setInterval(updateUsers, 5000);
var users;
var neighbor = [];
var k = 1;

function updateUsers(){
  $.get('/users', function(data) {
      users = data;
      findNearNeighbors();
  })
}

function findNearNeighbors() {
  var distance;
  for (i = 0 ; i < users.length ; i++) {
    if (users[i].userID != userID) {
      var lat1 = userPos.latitude;
      var long1 = userPos.longitude;
      var lat2 = users[i].latitude;
      var long2 = users[i].longitude;
      distance = getDistanceFromLatLonInM(lat1, long1, lat2, long2);
    }
    else {
      distance = Infinity;
    }
    // console.log("distance from " + users[i].userID + "is " + distance);

    n = {
      "userID": users[i].userID,
      "type": users[i].type,
      "latitude": users[i].latitude,
      "longitude": users[i].longitude,
      "distance": distance
    }
    neighbor.push(n);
  }
  // neighbor.sort(byDistance);
  // function byDistance(a, b){
  //   return a.distance - b.distance;
  // }

  var knn = {};
  for (var j = 0; j < min(k, neighbor.length) ; j++) {
    var nb = neighbor[j];
    if(knn[nb.type]){
      knn[nb.type]++;
    }
    else {
      knn[nb.type] = 1;
    }
  }
  // console.log(knn);
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

function changeContent(c) {
  // console.log("classification" + c);
  r = Math.random();
  var col;
  if (r > 0.6) col = "Blue";
  else if(r > 0.3) col = "Green";
  else col = "Red";

  console.log(col);

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

// function getDistanceFromLatLonInM(lat1,lon1,lat2,lon2) {
//   var R = 6371; // Radius of the earth in km
//   var dLat = deg2rad(lat2-lat1);  // deg2rad below
//   var dLon = deg2rad(lon2-lon1);
//   var a =
//     Math.sin(dLat/2) * Math.sin(dLat/2) +
//     Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
//     Math.sin(dLon/2) * Math.sin(dLon/2)
//     ;
//   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//   var d = R * c; // Distance in km
//   return d * 1000;
// }
//
// function deg2rad(deg) {
//   return deg * (Math.PI/180)
// }


function getDistanceFromLatLonInM(lat1,long1,lat2,long2) {
  var x = lat1 - lat2;
  var y = long1 - long2;
  var d = Math.sqrt(x*x + y*y);
  return d * 1000;
}
