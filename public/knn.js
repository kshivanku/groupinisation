setInterval(updateUsers, 5000);
var neighbor = [];
var k = 2;

function updateUsers(){
  $.get('/users', function(data) {
      users = data;
      neighbor = [];
      findNearNeighbors();
  })
}

function findNearNeighbors() {
  var distance;
  for (i = 0 ; i < users.length ; i++) {
    if (users[i].userID != userID) {
      distance = getDistanceFromLatLonInKm(userPos.lat, userPos.long, users[i].lat, user[i].long);
    }
    else {
      distance = Infinity;
    }
    n = {
      "userID": users[i].userID,
      "type": users[i].type,
      "lat": users[i].lat,
      "long": users[i].long,
      "distance": distance
    }
    neighbor.push(n);
  }
  neighbor.sort(byDistance);

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
  var color = "#000000"
  if(c == "A") {
    color = "#FF0000";
  }
  else if(c == "B") {
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

function byDistance(a, b){
  return a.distance - b.distance;
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d * 1000;
}
