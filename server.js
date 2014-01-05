var express = require('express'); 
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var jade = require('jade');
var clients = [];
var sausage = require('./sausage');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", {layout: false});
app.configure(function() {
    app.use(express.static(__dirname + '/public')); //allows static content in public i.e. images
});

app.get('/', function(req, res){
    res.render('home.jade');
});

app.use(sausage);
server.listen(3000);

//https://github.com/visionmedia/express/wiki/Migrating-from-2.x-to-3.x
//http.createServer(app).listen(3000);

io.sockets.on('connection', function (socket) {

  clients.push(socket);

  //communicate with one client by using socket instead of sockets
  socket.on('message', function (message) {
    console.log("server received message: "+message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', function() {
    console.log("closing socket: " + socket.id);
    //list clients to console
    for(var i=0; i<clients.length; i++){
      console.log("clients["+i+"]: " + clients[i].id);
    }
    //remove the client that sent the message
    for(var i=0; i<clients.length; i++){
      if(clients[i] == socket) {
        clients.splice(i,1);
        break;
      }
    }
    //list the clients again
    for(var i=0; i<clients.length; i++){
      console.log("new clients["+i+"]: " + clients[i].id);
    }
  });//end disconnect event

});//end of io.sockets

