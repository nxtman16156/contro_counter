/* global $ */

window.onload = function() {
    $.get("/get_class_data", updateClassData);
    
    $(".button").each(function(i, obj) {
        $("#button_class" + (i + 1)).on("click", function() {
            var name = $("#input_class" + (i + 1)).val();
            alert(name);
        });
    });
};

function updateClassData(data) {
    $("#edit_class1").html("");
    $("#edit_class2").html("");
    for (var i = 0; i < data.class1.length; i++) {
        $("#edit_class1").append('<p>\
                                  ' + data.class1[i] + '\
                                  </p>\
                                  <button class="button_remove" id="remove' + i + '">Remove</button>');
    }
    
    for (var i = 0; i < data.class2.length; i++) {
        $("#edit_class2").append('<p>\
                                  ' + data.class2[i] + '\
                                  </p>\
                                  <button class="button_remove" id="remove' + (data.class1.length + i) + '">Remove</button>');
    }
    
    $(".button_remove").each(function(i, obj) {
        $("#remove" + i).on("click", function() {
            $.get("/remove_person", {id: i}, updateClassData);
        });
    });
}