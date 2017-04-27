//WEB SERVER STUFF
var express = require("express");
var app = express();
var server = app.listen(8000, function(){
  console.log("listening on port 8000");
});
app.use(express.static("public"));

var fs = require('fs');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/users", getUsers);
function getUsers(request, response){
  var users = JSON.parse(fs.readFileSync("users.json"));
  response.send(users);
}

app.post('/saveNewUser', saveNewUser);
function saveNewUser(request, response) {
  var users = JSON.parse(fs.readFileSync("users.json"));
  users.push(request.body);
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
}

app.post('/userLeft', userLeft);
function userLeft(req, rep){
  var users = JSON.parse(fs.readFileSync("users.json"));
  var index = users.indexOf(req.body.userID);
  users.splice(index, 1);
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
}

app.post('/updateLocationInfo', updateLocationInfo);
function updateLocationInfo(req, res) {
  var users = JSON.parse(fs.readFileSync("users.json"));
  for (i = 0 ; i < users.length ; i++) {
    if(users[i].userID == req.body.userID) {
      console.log("updating geolocation");
      users[i].lat = req.body.lat;
      users[i].long = req.body.long;
      fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    }
  }
}





/**/
