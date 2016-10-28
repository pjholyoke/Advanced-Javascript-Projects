
function printCars()
{
  var str = "<ul>";

  $.getJSON( "car2.php", {action:"list"},  function( cars ) {
    for (i=0; i< cars.Result.length; i++)
      str += "<li>" + cars.Result[i].carMake + " (" + cars.Result[i].carModel + ") </li>";
    
    str += "</ul>";
    $("#results").html(str);
  });
}

$(document).ready(function(){
  printCars();
});

