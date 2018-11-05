/* global $ */
/* global io */

const socket = io();
var numStudents = 0;

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
    
    $("#button_reset_yes").on("click", function() {
        socket.emit("reset");
        $("#confirm").hide();
    });
    
    $("#button_reset_no").on("click", function() {
        $("#confirm").hide();
    });
    
    $("#button_silence").on("click", function() {
        socket.emit("silence", 1);
    });
    
    $("#button_unsilence").on("click", function() {
        socket.emit("silence", -1);
    });
    
    socket.on("change_class_makeup", function(data) {
        $("#class1").html("");
        $("#class2").html("");
        
        $("#class1").append('<tr>\
                             <th class="header">Name</th>\
                             <th class="header">Times Spoken</th>\
                             <th class="header">Time</th>\
                             <th class="header">Count</th>\
                             <th class="header">UnCount</th>\
                             </tr>');
        
        $("#class2").append($("#class1").html());
        
        for (var i = 0; i < data.class1.length; i++) {
            $("#class1").append('<tr>\
                                 <th>' + data.class1[i] + '</th>\
                                 <th><p id="counter' + i + '">0</p></th>\
                                 <th><p id="timer' + i + '">0:00</p></th>\
                                 <th><button class="button_counter" id="button' + i + '">Start</button></th>\
                                 <th><button class="button_uncounter" id="unbutton' + i + '">UnTalk</button></th>\
                                 </tr>');
        }
        
        for (var i = 0; i < data.class2.length; i++) {
            $("#class2").append('<tr>\
                                 <th>' + data.class2[i] + '</th>\
                                 <th><p id="counter' + (data.class1.length + i) + '">0</p></th>\
                                 <th><p id="timer' + (data.class1.length + i) + '">0:00</p></th>\
                                 <th><button class="button_counter" id="button' + (data.class1.length + i) + '">Start</button></th>\
                                 <th><button class="button_uncounter" id="unbutton' + (data.class1.length + i) + '">UnTalk</button></th>\
                                 </tr>');
        }
        
        $(".button_counter").each(function(i, obj) {
            $("#button" + i).on("click", function() {
                var button_html = $("#button" + i).html();
                if (button_html == "Start") {
                    socket.emit("count", i);
                }
                
                socket.emit("change_button_type", i);
            });
        });
        
        $(".button_uncounter").each(function(i, obj) {
            $("#unbutton" + i).on("click", function() {
                socket.emit("uncount", i);
            });
        });
        
        numStudents = data.class1.length + data.class2.length;
    });
    
    socket.on("silence", function(data) {
        $("#silence_counter").html(data);
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
        for (var i = 0; i < data.length; i++) {
            $("#counter" + i).html(data[i]);
        }
        var average = calculateAverage();
        $("#average_count").html(average);
        for (var i = 0; i < numStudents; i++) {
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
            if (data[i]) $("#button" + i).html("Stop");
            else $("#button" + i).html("Start");
        }
    });
    
    socket.on("increment_time", function(data) {
        for (var i = 0; i < data.length; i++) {
            var minutes = Math.floor(data[i] / 60);
            var seconds = data[i] % 60;
            $("#timer" + i).html(minutes + ":" + ("0" + seconds).slice(-2));
        }
        
        var average = calculateTimeAverage();
        var minutes2 = Math.floor(average / 60);
        var seconds2 = average % 60;
        $("#average_time").html(minutes2 + ":" + ("0" + seconds2).slice(-2));
        
        for (var i = 0; i < numStudents; i++) {
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
    for (var i = 0; i <= numStudents; i++) {
        if ($("#timer" + i).is(":visible")) {
            var time = $("#timer" + i).html();
            sum += (60 * parseInt(time.split(":")[0])) + parseInt(time.split(":")[1]);
            count++;
        }
    }
    return Math.round(sum / count);
}