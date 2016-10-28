$(document).ready(function() {

  var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
  $('.datepicker span').html(months[new Date().getMonth()].substr(0, 3)+" - "+new Date().getFullYear());

  // If you click on a td, add bootstrap 'bg-success' class.
  // Add a 'bg-danger' if it already has a 'bg-success'.
  // Set it to default if it's already red.
  $("#calendar").on("click", "td", function() {
    if($(this).hasClass("bg-success") == 0 && $(this).hasClass("bg-danger") == 0)
      $(this).addClass("bg-success selectedFree");
    else if($(this).hasClass("bg-success")) {
      $(this).addClass("bg-danger selectedNotFree");
      $(this).removeClass("bg-success");
    }
    else
      $(this).removeClass("bg-danger");
  });

  // Don't apply this to choices which the user has selected.
  $('.btn-success').click(function () {
    $.each($('td'), function (index, value) {
      if($(this).hasClass("selectedFree") || $(this).hasClass("selectedNotFree")) {}
      // Do nothing
      else
      {
        $(this).attr('class', 'text-center');
        $(this).addClass("bg-success");
      }
    });
  });

  // Don't apply this to choices which the user has selected.
  $('.btn-danger').click(function () {
    $.each($('td'), function (index, value) {
      if($(this).hasClass("selectedFree") || $(this).hasClass("selectedNotFree")) {}
      // Do nothing
      else
      {
        $(this).attr('class', 'text-center');
        $(this).addClass("bg-danger");
      }
    });
  });

  // If the user has selected something, don't clear it.
  $('.btn-default').click(function () {
    $.each($('td'), function (index, value) {
      if($(this).hasClass("selectedFree") || $(this).hasClass("selectedNotFree")) {}
      // Do nothing
      else
        $(this).attr('class', 'text-center');
    });
  });

  // Double click clear all to remove everything, including user choices.
  $('.btn-default').dblclick(function () {
    $.each($('td'), function (index, value) {
      $(this).attr('class', 'text-center');
    });
  });

  // Setting bootstrap's datepicker for months/years only.
  $('.datepicker').datepicker({
    format: "mm/yyyy",
    minViewMode: 1,
    autoclose: true,
    todayHighlight: true
  });

  $('.datepicker').datepicker("setDate", new Date());

  // If the datepicker's month changes, change the date which is displaying, then change the calendar.
  $('.datepicker').datepicker().on("changeMonth", function(e) {
    $('.datepicker span').html( e.date.toString().substr(4, 4) +'-'+ e.date.toString().substr(10, 6));
  });

  $('.datepicker').datepicker().on("hide", function(e) {
    $('#calendar').empty();
    generateCalendar($('.datepicker').datepicker("getDate"));
  });

  generateCalendar($('.datepicker').datepicker("getDate"));
});

function daysInMonth(anyDateInMonth) {
  return new Date(anyDateInMonth.getYear(),
                  anyDateInMonth.getMonth()+1,
                  0).getDate();
}

function generateCalendar(d) {
  var mth = d.getMonth()+1;
  var yr 	= d.getFullYear();

  var firstDayOfMonth = mth + "/1/" + yr;
  var d = new Date (firstDayOfMonth);
  var numberOfDaysInMonth = daysInMonth (d);
  var firstDayOfWeek = d.getDay();

  var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  $('#calendar').append("<thead class='weekdays'></thead>");
  $('#calendar').append("<tbody class='days'></tbody>");

  $.each(days, function (index, value) {
    $('.weekdays').append("<th class='text-center'>"+value+"</th>");
  });

  var x = 1;
  for (var i = 0; i < (numberOfDaysInMonth/7); i++) {
    $('.days').append("<tr class='w_"+i+"'></tr>");
    for (var j = 1; j <= 7; j++) {
      if(x < numberOfDaysInMonth+1)
        $('.w_'+i).append("<td class='text-center'>"+(x++)+"</td>");
      else
        $('.w_'+i).append("<td></td>");
    }
  }
}