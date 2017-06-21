var express = require("express");
var path = require("path");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var kafka = require('kafka-node');
var HighLevelConsumer = kafka.HighLevelConsumer;
var Offset = kafka.Offset;
var Client = kafka.Client;
var topic = 'enriched-feed';
var client = new Client('localhost:2181', "worker-" + Math.floor(Math.random() * 10000));
var payloads = [{ topic: topic }];
var consumer = new HighLevelConsumer(client, payloads);
var offset = new Offset(client);
var port = 3001;

io = io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

consumer = consumer.on('message', function(message) {
    //console.log(message.value);
    io.emit("message", message.value);
});


app.use(express.static(path.join(__dirname,"../app/dist")));
//app.listen(port,function(){
http.listen(port, function(){  
    console.log("Started listening on port", port);
})
