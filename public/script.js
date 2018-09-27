const socket = io();

window.onload = function() {
    $("#class1").hide();
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
        
        $("#average_count").html(calculateAverage());
    });
    
    socket.on("up", function(data) {
        for (var i = 0; i < 20; i++) {
            $("#counter" + (i + 1)).html(data[i]);
        }
        var average = calculateAverage();
        $("#average_count").html(average);
        for (var i = 1; i <= 19; i++) {
            var value = parseInt($("#counter" + i).html());
            if (value > average + 2 || value < average - 2) {
                $("#counter" + i).css("background-color", "#ef6502");
            } else {
                $("#counter" + i).css("background-color", "#ffffff");
            }
        }
    });
};

function calculateAverage() {
    var sum = 0;
    var count = 0;
    for (var i = 1; i <= 19; i++) {
        if ($("#counter" + i).is(":visible")) {
            sum += parseInt($("#counter" + i).html());
            count++;
        }
    }
    return (sum / count);
}