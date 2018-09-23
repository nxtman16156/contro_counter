const socket = io();

window.onload = function() {
    $("#class2").hide();
    $("#confirm").hide();
    
    $("#button_switch").on("click", function() {
        socket.emit("changeClass");
    });
    
    $("#button_reset").on("click", function() {
        $("#confirm").show();
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
    
    $("#button_reset_yes").on("click", function() {
        socket.emit("reset");
        $("#confirm").hide();
    });
    
    $("#button_reset_no").on("click", function() {
        $("#confirm").hide();
    });
    
    socket.on("changeClass", function(classID) {
        if (classID == 2) {
            $("#class2").show();
            $("#class1").hide();
        } else {
            $("#class2").hide();
            $("#class1").show();
        }
    });
    
    socket.on("up", function(data) {
        for (var i = 0; i < 20; i++) {
            $("#counter" + (i + 1)).html(data[i]);
        }
    });
};