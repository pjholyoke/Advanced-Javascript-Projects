
$(function () {
  printScores();

  // Make sure only numbers may be entered into #score.
  $("#score").keydown(function (e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
        // Allow: Ctrl+A, Command+A
        (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) ||
        // Allow: home, end, left, right, down, up and F1-F12 too.
        (e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode >= 112 && e.keyCode <= 126) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  });
  
  $(".container").keypress(function (e) {
    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
      if($('#name, #score').val() != "" && $('#name, #score').val() != null) {
        newScore($('#name').val(), $('#score').val());
        $('#name, #score').val("");
      }
      else
        alert("You need to fill out both fields.");
    } else {
      return true;
    }
  });
});

function printScores()
{
  var str = "<ul>";

  $.getJSON( "score.php", {action:"list"},  function( scores ) {
    for (i=0; i< scores.Result.length; i++)
      str += "<tr><td>" + scores.Result[i]["uname"] + "</td><td>(" + scores.Result[i]["score"] + ") </td></tr>";

    str += "</ul>";

    $("#highscores .table").html(str).hide();
    $("#highscores .table").effect("pulsate").fadeIn("250");
  });

}

function newScore(user, score) {
  $.get("score.php", {action: "add", uname: user, score: score}, function () {
    printScores();
  });
}