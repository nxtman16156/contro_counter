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
            var button_html = $("#button" + (i + 1)).html();
            if (button_html == "Start" || button_html != "Stop") {
                socket.emit("count", i);
            }
            
            if (button_html == "Start" || button_html == "Stop") socket.emit("change_button_type", i);
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
            if (value > average + 2 || value < average - 1.5) {
                $("#counter" + i).css("background-color", "#ef6502");
            } else {
                $("#counter" + i).css("background-color", "#ffffff");
            }
        }
    });
    
    socket.on("set_button_type", function(data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i]) $("#button" + (i + 1)).html("Stop");
            else $("#button" + (i + 1)).html("Start");
        }
    });
    
    socket.on("increment_time", function(data) {
        for (var i = 0; i < data.length; i++) {
            var minutes = Math.floor(data[i] / 60);
            var seconds = data[i] % 60;
            $("#timer" + (i + 1)).html(minutes + ":" + seconds);
        }
        
        var average = calculateTimeAverage();
        var minutes2 = Math.floor(average / 60);
        var seconds2 = average % 60;
        $("#average_time").html(minutes2 + ":" + seconds2);
        
        for (var i = 1; i <= 19; i++) {
            var value = $("#timer" + i).html();
            value = (60 * parseInt(value.split(':')[0])) + parseInt(value.split(':')[1]);
            var time = (minutes2 * 60) + seconds2;
            if (value > time + 60 || value < time - 30) {
                $("#timer" + i).css("background-color", "#ef6502");
            } else {
                $("#timer" + i).css("background-color", "#ffffff");
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
    return Math.round((sum / count) * 100) / 100;
}

function calculateTimeAverage() {
    var sum = 0;
    var count = 0;
    for (var i = 1; i <= 19; i++) {
        if ($("#timer" + i).is(":visible")) {
            var time = $("#timer" + i).html();
            sum += (60 * parseInt(time.split(":")[0])) + parseInt(time.split(":")[1]);
            count++;
        }
    }
    return Math.round(sum / count);
}