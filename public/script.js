const socket = io();

window.onload = function() {
    $("#button_reset").on("click", function() {
        socket.emit("reset");
    });
    
    $(".button_counter").each(function(i, obj) {
        $("#button" + (i + 1)).on("click", function() {
            socket.emit("count", i);
        });
    });
    
    $(".button_uncounter").each(function(i, obj) {
        $("#unbutton" + (i + 1)).on("click", function() {
            socket.emit("uncount", i);
        });
    });
    
    socket.on("up", function(data) {
        for (var i = 0; i < 13; i++) {
            $("#counter" + (i + 1)).html(data[i]);
        }
    });
};