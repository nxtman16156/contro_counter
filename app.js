const express = require("express");
const app = express();
const port = process.env.PORT;
const server = require("http").Server(app);

app.use(express.static(__dirname + "/public"));
app.use("/libraries", express.static(__dirname + "/libraries"));

app.get("/", function(request, response) {
    response.sendFile(__dirname + "/public/index.html");
});

server.listen(port);
console.log("Server listening on port " + port);

const io = require("socket.io")(server);
var currentConnection = 0;
var socketList = [];

var values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var classNumber = 1;

io.sockets.on("connection", function(socket) {
    socketList[currentConnection] = socket;
    currentConnection++;
    
    socket.emit("changeClass", classNumber);
    socket.emit("up", values);
    
    socket.on("changeClass", function() {
        if (classNumber == 1) classNumber = 2;
        else classNumber = 1;
        for (var i = 0; i < socketList.length; i++) {
            socketList[i].emit("changeClass", classNumber);
        }
    });
    
    socket.on("reset", function() {
        for (var i = 0; i < 19; i++) {
            values[i] = 0;
        }
        
        for (var i = 0; i < socketList.length; i++) {
            socketList[i].emit("up", values);
        }
    });
    
    socket.on("count", function(data) {
        values[data]++;
        for (var i = 0; i < socketList.length; i++) {
            socketList[i].emit("up", values);
        }
    });
    
    socket.on("uncount", function(data) {
        values[data]--;
        for (var i = 0; i < socketList.length; i++) {
            socketList[i].emit("up", values);
        }
    });
    
    socket.on("disconnect", function() {
        for (var i = 0; i < socketList.length; i++) {
            if (socket == socketList[i]) {
                socketList.splice(i, 1);
                currentConnection--;
            }
        }
    });
});