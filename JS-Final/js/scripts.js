// KEY = <nope>

// Get weather data for any zip
// http://api.openweathermap.org/data/2.5/weather?zip=02763,us&appid=<nope>

// This will get the favicon for any site.
// http://www.google.com/s2/favicons?domain_url=http%3A%2F%2F{URL Here}%2F

// Get weather icon w/ this url
// http://openweathermap.org/img/w/{id}

// Activate tooltips.
$('[data-toggle="tooltip"]').tooltip();

// Kelvin to celsius
function ktoc(kelvin) {
  if (kelvin < (0))
    return '0'; // Absolute zero
  else
    return (kelvin-273.15);
}

// Celsius to fahrenheit
function ctof (c) {
  return c*1.8+32;
}

// Hexadecimal to RGBA (So I can set the bg opacity to a constant val)
function hexToRGBA(hex, opacity){
  hex = hex.replace('#','');
  r = parseInt(hex.substring(0,2), 16);
  g = parseInt(hex.substring(2,4), 16);
  b = parseInt(hex.substring(4,6), 16);

  result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
  return result;
}

// Convert an image into Base64 so I can put it in localstorage.
function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  var dataURL = canvas.toDataURL("image/png");

  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

var d;
var mid;

$(function () {

  d = new Date();
  mid = 'am';

  // Load the style preferences from the user's browser. 
  if(localStorage.getItem('bg') == null || localStorage.getItem('win') == null || localStorage.getItem('txt') == null)
  {
    localStorage.setItem('bg', "#000");
    localStorage.setItem('win', "#fff");
    localStorage.setItem('txt', "#fff");
  }

  if(localStorage.getItem('bgimg') == null)
    localStorage.setItem('bgimg', 'background.jpg');
  else
    $('.background').css("background-image", "url(uploads/"+localStorage.getItem('bgimg')+")");

  // Also set the modal color fields to to the correct colors.
  $("#bg").css({"background":localStorage.getItem('bg')});
  $("#win").css({"background":localStorage.getItem('win')});
  $("#txt").css({"background":localStorage.getItem('txt')});
  $('.background').css("background", 'url("../uploads/'+localStorage.getItem('bgimg')+'") !important');

  $('.content').css({"background":hexToRGBA(localStorage.getItem('bg'), 20)}); //localStorage.getItem('bg')
  $('.navbar, #modal').css({"background":localStorage.getItem('win')});
  $('.content').css({"color":localStorage.getItem('txt')});

  // Get location data based on ip.
  $.get("http://ipinfo.io", function(response) {
    // Get weather data (Using the zipcode from the ipinfo.io response)
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?zip="+response.postal+",us&appid=<nope>")
      .done(function(json) {
      $('.city').text(json.name+' (');
      $('.temp').text(Math.round(ctof(ktoc(json.main.temp)))).append('&deg; F)');
      $('.icon').html("<img src='http://openweathermap.org/img/w/"+json.weather[0].icon+".png'>");
    })
      .fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      $('.weather h4').html("Could not load weather. D:");
      console.log( "Request Failed: " + err );
    });
  }, "jsonp");

  // Options menu
  $('#options').click(function () {
    if ($('#modal').prop('opened') == false)
      $('#modal').prop('opened', true).prop('closed', false);
    else
      $('#modal').prop('opened', false).prop('closed', true);

    var files;

    // Check if file is uploaded, call to some php script. Then change bg if successfull.
    $("input:file").change(function (e) {
      if($(this).val()) {
        prepareUpload(e);
        $('form').submit();
      }
    });

    $('form').on('submit', function (e) {
      uploadFiles(e);
    });

    function prepareUpload(e) {
      files = e.target.files;
    }

    function uploadFiles(e) {
      e.stopPropagation();
      e.preventDefault();

      // Create a formdata object and add the files
      var data = new FormData();
      var tempname;
      $.each(files, function (key, value) {
        tempname = value.name;
        allowedtypes = ["image/jpeg", "image/png", "image/gif"];

        if($.inArray(value.type, allowedtypes) != -1)
          data.append(key, value);
        else {
          alert("The following filetypes are allowed: .jpg, .jpeg, .png, and .gif");
        }
      });

      $.ajax({
        url: 'submit.php?files',
        type: 'POST',
        data: data,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data, textStatus, jqXHR) { localStorage.setItem('bgimg', tempname); submitForm(e, data); },
        error: function (jqXHR, textStatus, errorThrown) { console.log('ERRORS: ' + errorThrown+' ('+textStatus+')'); }
      });
    }

    function submitForm(e, data) {
      // Create a jQuery object from the form
      $form = $(e.target);

      // Serialize the form data
      var formData = $form.serialize();

      $.each(data.files, function (key, value) {
        formData = formData + '&filenames[]=' + value;
      });

      $.ajax({
        url: 'submit.php',
        type: 'POST',
        data: formData,
        cache: false,
        success: function (data, textStatus, jqXHR) {
          if (!typeof data.error === 'undefined')
            console.log('ERRORS: ' + data.error);
        },
        error: function (jqXHR, textStatus, errorThrown) { console.log('ERRORS: ' + errorThrown+' ('+textStatus+')'); },
        complete: function () {
          $($(e.target).next().context.children[0].children[1]).val(null); // Clear the file input value
          location.reload(); // Refresh the page after, so the change takes effect.
        }
      });
    }
  });

  // Help modal
  $('.help').click(function () {
    if($('#helpModal').prop('opened') == false)
      $('#helpModal').prop('opened', true).prop('closed', false);
    else
      $('#helpModal').prop('opened', false).prop('closed', true);
  });

  // Add link modal
  $(".add").click(function(){
    if($('#addModal').prop('opened') == false)
      $('#addModal').prop('opened', true).prop('closed', false);
    else
      $('#addModal').prop('opened', false).prop('closed', true);

    // Wait a few ms to set focus, so the modal can show up first.
    setTimeout(function() {$('#urlfield').trigger('focus')}, 250);
  });


  // So I can spam add shortcuts for debugging
  $('*').keydown(function (e) {
    if(e.keyCode === 192)
    {
      var url = ("http://www.google.com");
      dlw = $('.help').width();
      dlh = $('.help').height();

      $('.navbar-fixed-bottom.hidden-sm.hidden-xs > div > div > ul > li.add').before('<a href="'+url+'" target="_blank"><li class="shortcut" data-toggle="tooltip" data-placement="top" title="'+url+'"><h4><img src="http://www.google.com/s2/favicons?domain_url='+url+'%2F" /></h4></a></li>').hide().show("fadeIn");

      // Setting the width so it matches the others.
      $('.shortcut').css({width: dlw-$('.shortcut img').width(), height: dlh});

      // Offset all links so it stays centered.
      $('.links').css('margin-left', parseInt($('.links').css('margin-left'), 10) - (parseInt($('.shortcut').width()/2, 10)));
    }
  });

  $('#addModal #urlfield').keydown(function(e){
    // If enter is pressed inside #urlfield, add a new link.
    if(e.keyCode === 13 && $('#urlfield').val()){
      // If http isn't there, add it.
      var url = ($(this).val().indexOf('http') !== 0) ? ('http://'+$(this).val()) : ($(this).val());
      dlw = $('.help').width();
      dlh = $('.help').height();

      $('.navbar-fixed-bottom.hidden-sm.hidden-xs > div > div > ul > li.add').before('<a href="'+url+'" target="_blank"><li class="shortcut" data-toggle="tooltip" data-placement="top" title="'+url+'"><h4><img src="http://www.google.com/s2/favicons?domain_url='+url+'%2F" /></h4></a></li>').hide().show("fadeIn");

      // Setting the width so it matches the others.
      $('.shortcut').css({width: dlw-$('.shortcut img').width(), height: dlh});

      // Offset all links so it stays centered.
      $('.links').css('margin-left', parseInt($('.links').css('margin-left'), 10) - (parseInt($('.shortcut').width()/2, 10)));

      $(this).val(null);
      $('#addModal').prop('opened', false).prop('closed', true);
    }
  });

  $('#reset').click(function() {
    var r = confirm("Are you sure you would like to reset your settings to default? This cannot be undone.");
    if (r == true) {
      localStorage.clear();
      location.reload();
    }
  });

  // Colorpicker
  $("#bg, #win, #txt").spectrum({
    color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showPalette: true,
    showSelectionPalette: true,
    maxSelectionSize: 10,
    preferredFormat: "rgba",
    localStorageKey: "spectrum.demo",
    showAlpha: true,
    change: function(e) {
      $(this).css({'background': $(this).spectrum('get')});
      localStorage.setItem($(this).attr('class'), $(this).spectrum('get'));
    },
    palette: [
      ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
       "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
      ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
       "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"]
    ]
  });

  // Disable right clicking.
  //document.oncontextmenu = function() {return false;};

  /*$('div.each-sticky-note-outer').mousedown(function(e){
		if( e.button == 2 ) {
			alert('Right mouse button!');
			return false;
		}
		return true;
	});*/


  var notelist = [];

  // Begin stickynotes
  // I couldn't figure out a way to save them in time.
  // But the notes themselves can be used, they just aren't
  // persistent.
  $('.content').coaStickyNote({
    resizable: true,
    availableThemes: [
      { text: "Yellow", value: "sticky-note-yellow-theme" },
      { text: "Green", value: "sticky-note-green-theme" },
      { text: "Blue", value: "sticky-note-blue-theme" },
      { text: "Pink", value: "sticky-note-pink-theme" },
      { text: "Orange", value: "sticky-note-orange-theme" }],
    notePosition: { top: "100px", left: "50px" },
    noteDimension: { width: "150px", height: "150px" },
    noteText: "Enter text here",
    noteHeaderText: "Untitled Note",
    deleteLinkText: '<i class="fa fa-times" aria-hidden="true"></i>',
    startZIndex: 50,
    beforeCreatingNoteBox: function (note) {},
    onNoteBoxCreated: function (note) { $('div.each-sticky-note-options > div').html('<i class="fa fa-cog" aria-hidden="true"></i>'); },
    onNoteBoxHeaderUpdate: function (note) {},
    onNoteBoxTextUpdate: function (note) {},
    onNoteBoxDelete: function (note) {},
    onNoteBoxDraggingStop: function (note) {},
  });
  // End sticky notes


  $('.buttons paper-button[dialog-dismiss]').click(function() {
    $("#bg").css({"background":localStorage.getItem('bg')});
    $("#win").css({"background":localStorage.getItem('win')});
    $("#txt").css({"background":localStorage.getItem('txt')});
  });

  $('.buttons paper-button[dialog-confirm]').click(function() {
    $('.content').css({"background":hexToRGBA(localStorage.getItem('bg'), 20)}); //localStorage.getItem('bg')
    $('.navbar, #modal').css({"background":localStorage.getItem('win')});
    $('.content').css({"color":localStorage.getItem('txt')});
  });

});

setInterval(function() {
  d = new Date();

  if(d.getHours() == 0) //At 00 hours we need to show 12 am
    d.setHours(12);
  else if(d.getHours() > 12)
  {
    d.setHours(d.getHours()%12);
    mid = 'pm';
  }

  if(d.getMinutes().toString().length == 1)
    $('.clock h1').text(d.getHours().toString() +':0'+(d.getMinutes()).toString()).append('<span class="space"></span>'+mid.toUpperCase());
  else
    $('.clock h1').text(d.getHours().toString() +':'+(d.getMinutes()).toString()).append('<span class="space"></span>'+mid.toUpperCase());
}, 1000);
