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
                             <th class="header">Ouch</th>\
                             </tr>');
        
        $("#class2").append($("#class1").html());
        
        for (var i = 0; i < data.class1.length; i++) {
            $("#class1").append('<tr>\
                                 <th id="name' + i + '">' + data.class1[i] + '</th>\
                                 <th><p id="counter' + i + '">0</p></th>\
                                 <th><p id="timer' + i + '">0:00</p></th>\
                                 <th><button class="button_counter" id="button' + i + '">Start</button></th>\
                                 <th><button class="button_uncounter" id="unbutton' + i + '">UnTalk</button></th>\
                                 <th><button class="button_oucher" id="ouch' + i + '">Ouch</button></th>\
                                 </tr>');
        }
        
        for (var i = 0; i < data.class2.length; i++) {
            $("#class2").append('<tr>\
                                 <th id="name' + (data.class1.length + i) + '">' + data.class2[i] + '</th>\
                                 <th><p id="counter' + (data.class1.length + i) + '">0</p></th>\
                                 <th><p id="timer' + (data.class1.length + i) + '">0:00</p></th>\
                                 <th><button class="button_counter" id="button' + (data.class1.length + i) + '">Start</button></th>\
                                 <th><button class="button_uncounter" id="unbutton' + (data.class1.length + i) + '">UnTalk</button></th>\
                                 <th><button class="button_oucher" id="ouch' + (data.class1.length + i) + '">Ouch</button></th>\
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
        
        $(".button_oucher").each(function(i, obj) {
            $("#ouch" + i).on("click", function() {
                socket.emit("ouch", i);
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
        highlight_count_average(average);
    });
    
    socket.on("set_button_type", function(data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i]) $("#button" + i).html("Stop");
            else $("#button" + i).html("Start");
        }
    });
    
    socket.on("set_ouch", function(data) {
        for (var i = 0; i < data.ouch1.length; i++) {
            if (data.ouch1[i]) {
                $("#ouch" + i).html("UnOuch");
                $("#button" + i).prop("disabled", true);
                $("#unbutton" + i).prop("disabled", true);
                $("#name" + i).css("background-color", "#d1b98e");
                $("#counter" + i).css("background-color", "#d1b98e");
                $("#timer" + i).css("background-color", "#d1b98e");
            }
            else {
                $("#ouch" + i).html("Ouch");
                $("#button" + i).prop("disabled", false);
                $("#unbutton" + i).prop("disabled", false);
                $("#name" + i).css("background-color", "#fff");
                $("#counter" + i).css("background-color", "#fff");
                $("#timer" + i).css("background-color", "#fff");
            }
        }
        
        for (var i = 0; i < data.ouch2.length; i++) {
            if (data.ouch2[i]) {
                $("#ouch" + (data.ouch1.length + i)).html("UnOuch");
                $("#button" + (data.ouch1.length + i)).prop("disabled", true);
                $("#unbutton" + (data.ouch1.length + i)).prop("disabled", true);
                $("#name" + (data.ouch1.length + i)).css("background-color", "#d1b98e");
                $("#counter" + (data.ouch1.length + i)).css("background-color", "#d1b98e");
                $("#timer" + (data.ouch1.length + i)).css("background-color", "#d1b98e");
            }
            else {
                $("#ouch" + (data.ouch1.length + i)).html("Ouch");
                $("#button" + (data.ouch1.length + i)).prop("disabled", false);
                $("#unbutton" + (data.ouch1.length + i)).prop("disabled", false);
                $("#name" + (data.ouch1.length + i)).css("background-color", "#fff");
                $("#counter" + (data.ouch1.length + i)).css("background-color", "#fff");
                $("#timer" + (data.ouch1.length + i)).css("background-color", "#fff");
            }
        }
        
        const count_average = calculateAverage();
        const time_average = calculateTimeAverage();
        $("#average_count").html(count_average);
        $("#average_time").html(time_average);
        highlight_count_average(count_average);
        highlight_time_average(time_average);
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
        
        highlight_time_average(average);
    });
};

function highlight_time_average(average) {
    var minutes2 = Math.floor(average / 60);
    var seconds2 = average % 60;
    for (var i = 0; i < numStudents; i++) {
        var value = $("#timer" + i).html();
        value = (60 * parseInt(value.split(':')[0])) + parseInt(value.split(':')[1]);
        var time = (minutes2 * 60) + seconds2;
        if ((value > time + 60 || value < time - 30) && $("#ouch" + i).html() == "Ouch") {
            $("#timer" + i).css("background-color", "#ef6502");
        } else if ($("#ouch" + i).html() != "UnOuch"){
            $("#timer" + i).css("background-color", "#ffffff");
        }
    }
}

function highlight_count_average(average) {
    for (var i = 0; i < numStudents; i++) {
        var value = parseInt($("#counter" + i).html());
        if ((value > average + 2 || value < average - 1.5) && $("#ouch" + i).html() == "Ouch") {
            $("#counter" + i).css("background-color", "#ef6502");
        } else if ($("#ouch" + i).html() != "UnOuch") {
            $("#counter" + i).css("background-color", "#ffffff");
        }
    }
}

function calculateAverage() {
    var sum = 0;
    var count = 0;
    for (var i = 0; i < numStudents; i++) {
        if ($("#counter" + i).is(":visible") && $("#ouch" + i).html() == "Ouch") {
            sum += parseInt($("#counter" + i).html());
            count++;
        }
    }
    return Math.round((sum / count) * 100) / 100;
}

function calculateTimeAverage() {
    var sum = 0;
    var count = 0;
    for (var i = 0; i < numStudents; i++) {
        if ($("#timer" + i).is(":visible") && $("#ouch" + i).html() == "Ouch") {
            var time = $("#timer" + i).html();
            sum += (60 * parseInt(time.split(":")[0])) + parseInt(time.split(":")[1]);
            count++;
        }
    }
    return Math.round(sum / count);
}