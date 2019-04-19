const express = require("express");
const app = express();
const port = process.env.PORT;
const server = require("http").Server(app);

var socketList = [];

/*
Keep the this part the same
var class1 = [];
var class2 = [];
List needs to be enclosed in [] brackets and the line must end in a ; semicolon.

Names enclosed with "" double quotes
Names seperated with , commas
*/

var class1 = ["McKen Z", "Duncan", "Run After", "Rise Up", "Rean Yoo", "Irish Buddhist", "You Don't Mess with the Mohan", "Miles"];
var class2 = ["PopnLock", "Helene Belete", "Jimmy", "Trohia", "Ivanka", "BiTS", "Curse", "Lil' Jane", "Nguyener", "LOUD", "Bo-WO", "Derk McGerk", "Joey", "Puchi", "Tuyet"];

var ouch1 = [];
var ouch2 = [];
for (var i = 0; i < class1.length; i++) {
    ouch1.push(false);
}
for (var i = 0; i < class2.length; i++) {
    ouch2.push(false);
}

var values = [];
var buttonStates = [];
var times = [];

app.use(express.static(__dirname + "/public"));
app.use("/libraries", express.static(__dirname + "/libraries"));

app.get("/", function(request, response) {
    response.sendFile(__dirname + "/public/index.html");
});

app.get("/edit_class", function(request, response) {
    response.sendFile(__dirname + "/public/edit_class.html");
});

app.get("/note", function(request, response) {
    response.sendFile(__dirname + "/public/note.html");
});

app.get("/get_class_data", function(request, response) {
    response.json({class1, class2});
});

app.get("/remove_person", function(request, response) {
    var id = request.query.id;
    if (id > class1.length) {
        class2.splice(id - class1.length, 1);
    } else {
        class1.splice(id, 1);
    }
    
    console.log(class1);
    console.log(class2);
    
    values.splice(id, 1);
    buttonStates.splice(id, 1);
    times.splice(id, 1);
});

server.listen(port);
console.log("Server listening on port " + port);

const io = require("socket.io")(server);
var currentConnection = 0;

var silence = 0;
var classNumber = 1;

io.sockets.on("connection", function(socket) {
    socketList[currentConnection] = socket;
    currentConnection++;
    
    sizeArray(values);
    sizeArray(buttonStates);
    sizeArray(times);
    
    socket.emit("change_class_makeup", {class1, class2});
    socket.emit("changeClass", classNumber);
    socket.emit("set_button_type", buttonStates);
    socket.emit("up", values);
    socket.emit("increment_time", times);
    socket.emit("set_ouch", {ouch1, ouch2});
    
    socket.on("changeClass", function() {
        if (classNumber == 1) classNumber = 2;
        else classNumber = 1;
        for (var i = 0; i < socketList.length; i++) {
            socketList[i].emit("changeClass", classNumber);
        }
    });
    
    socket.on("reset", function() {
        silence = 0;
        for (var i = 0; i < values.length; i++) {
            values[i] = 0;
            times[i] = 0;
            buttonStates[i] = 0;
        }
        
        for (var i = 0; i < socketList.length; i++) {
            socketList[i].emit("up", values);
            socketList[i].emit("increment_time", times);
            socketList[i].emit("set_button_type", buttonStates);
            socketList[i].emit("silence", silence);
        }
    });
    
    socket.on("count", function(data) {
        values[data]++;
        for (var i = 0; i < socketList.length; i++) {
            socketList[i].emit("up", values);
        }
    });
    
    socket.on("change_button_type", function(data) {
        buttonStates[data] = !buttonStates[data];
        
        if (buttonStates[data]) {
            for (var i = 0; i < buttonStates.length; i++) {
                if (i != data) buttonStates[i] = 0;
            }
        }
        
        for (var i = 0; i < socketList.length; i++) {
            socketList[i].emit("set_button_type", buttonStates);
        }
    });
    
    socket.on("silence", function(data) {
        silence += data;
        for (var i = 0; i < socketList.length; i++) {
            socketList[i].emit("silence", silence);
        }
    });
    
    socket.on("uncount", function(data) {
        if (values[data] > 0) values[data]--;
        for (var i = 0; i < socketList.length; i++) {
            socketList[i].emit("up", values);
        }
    });
    
    socket.on("ouch", function(data) {
        if (data > class1.length - 1) {
            var id = data - class1.length;
            if (ouch2[id]) {
                ouch2[id] = false;
                for (var i = 0; i < socketList.length; i++) {
                    socketList[i].emit("set_ouch", {ouch1, ouch2});
                }
            } else {
                ouch2[id] = true;
                for (var i = 0; i < socketList.length; i++) {
                    socketList[i].emit("set_ouch", {ouch1, ouch2});
                }
            }
        } else {
            if (ouch1[data]) {
                ouch1[data] = false;
                for (var i = 0; i < socketList.length; i++) {
                    socketList[i].emit("set_ouch", {ouch1, ouch2});
                }
            } else {
                ouch1[data] = true;
                for (var i = 0; i < socketList.length; i++) {
                    socketList[i].emit("set_ouch", {ouch1, ouch2});
                }
            }
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

setInterval(incrementTime, 1000);

function incrementTime() {
    for (var j = 0; j < buttonStates.length; j++) {
        if (buttonStates[j]) {
            times[j]++;
            for (var i = 0; i < socketList.length; i++) {
                socketList[i].emit("increment_time", times);
            }
        }
    }
}

function sizeArray(array) {
    for (var i = 0; i < class1.length; i++) array.push(0);
    for (var i = 0; i < class2.length; i++) array.push(0);
    array.push(0);
}
