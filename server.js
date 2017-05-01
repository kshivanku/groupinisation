//WEB SERVER STUFF
var https = require('https');
var fs = require('fs');
var credentials = {
  key: fs.readFileSync('my-key.pem'),
  cert: fs.readFileSync('my-cert.pem')
};

//Express App
var express = require("express");
var app = express();
// var httpsServer = app.listen(8800, function(){
//   console.log("listening on port 8800");
// });
app.use(express.static("public"));

//HTTPS Server
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(443, function(){
  console.log("server started");
});

//Web Socket
var socket = require('socket.io');
var io = socket(httpsServer);

io.sockets.on('connection', function(socket){
  console.log('connected: ' + socket.id);
  io.sockets.connected[socket.id].emit('sessionID', socket.id); //send the sessionID back to client

  socket.on('userData', function(userData) {
    var users = JSON.parse(fs.readFileSync("users.json"));
    var userFound = false;
    for (var i = 0 ; i < users.length ; i++) {
      if(users[i].userID == userData.userID) {
        userFound = true;
        users[i].latitude = userData.latitude;
        users[i].longitude = userData.longitude;
        break;
      }
    }
    if(!userFound && userData.userID) {  //New User
      var newUser = userData;
      users.push(newUser);
    }
    io.sockets.emit('allUsers', users);
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
  })

  socket.on('disconnect', function(){
    console.log('disconnected: ' + socket.id);
    var users = JSON.parse(fs.readFileSync("users.json"));
    for (var i = 0 ; i < users.length ; i++) {
      if(users[i].userID == socket.id) {
        users.splice(i, 1);
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
        break;
      }
    }
  })
});


/**/
