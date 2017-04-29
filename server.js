//WEB SERVER STUFF
var https = require('https');
var fs = require('fs');
var credentials = {
  key: fs.readFileSync('my-key.pem'),
  cert: fs.readFileSync('my-cert.pem')
};

var express = require("express");
var app = express();
// var server = app.listen(8800, function(){
//   console.log("listening on port 8800");
// });
app.use(express.static("public"));


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
  console.log("saving new user:");
  console.log(request.body);
  users.push(request.body);
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
}

app.post('/userLeft', userLeft);
function userLeft(req, rep){
  console.log("user left: " + req.body.userID);
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
      users[i].latitude = req.body.latitude;
      users[i].longitude = req.body.longitude;
      fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
      break;
    }
  }
}

var httpsServer = https.createServer(credentials, app);
// Default HTTPS Port
httpsServer.listen(443);
console.log("server started");

/**/
