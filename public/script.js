const socket = io();

window.onload = function() {
    $("button").each(function(i, obj) {
        $("#button" + (i + 1)).on("click", function() {
            socket.emit("count", i + 1);
        });
    });
    
    socket.on("up", function(data) {
        var value = parseInt($("#counter" + data).html());
        $("#counter" + data).html(value + 1);
    });
};