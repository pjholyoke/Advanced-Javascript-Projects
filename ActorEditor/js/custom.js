var Actors = [];

$(function () {

  $('#add, #del').click(function(e) { showForm(e); });

  $(document).on('click', 'a.edit', function (e) {
    editActor(e);
    $(this).off('click');
  });

  $(document).on('click', 'a.del', function (e) {
    deleteActor(e);
    $(this).off('click');
  });

  // So I can add temporary actors quickly for debugging.
  $(document).keypress("z", function(e) {
    if(e.ctrlKey)
      shortAdd();
  });

  // So the form doesn't actually do anything and cause issues.
  $(document).on("submit", "form", function(e){
    e.preventDefault();
  });
});

function showForm(sender) {
  switch(sender.target.id) {
    case "add":
      $('#action').html = ("Add Actor");
      $('#prompt').slideUp(250, function() {
        $('#form').load('addForm.html');

        $('#form').fadeIn("slow", function () {
          // Datepicker stuff
          $(".date-picker").datepicker();

          // Once that animation finishes, see if button is clicked.
          $('#addActor').click(function (e) {
            addActor();
          });
        });
      });
      break;
  }
}

function addActor() {

  var fName   = $('#fName').val();
  var lName   = $('#lName').val();
  var bDay    = $('#date-picker').val();
  var gend    = $('[name="gen"]:checked').val();
  var genres  = [];

  $('.checkbox-inline input:checked').each(function () {
    genres.push($(this).val());
  });

  Actors.push({
    fname: fName,
    lname: lName,
    gender: gend,
    bday: bDay,
    genre: genres
  });

  // Fade in the title and list.
  $('#actorList, #action').fadeIn("slow");

  // Put stuff in the list when that's done.
  $('#list').append('<tr class="'+Actors.length+'"><td class="'+Actors.length+' name">' + fName + ' ' + lName + '</td><td class="text-right"><a class="edit"><span class="'+Actors.length+'  glyphicon glyphicon-pencil" aria-hidden="true"></span></a><a class="del"><span class="'+Actors.length+' glyphicon glyphicon-remove" aria-hidden="true"></span></a></td></td></td></tr>').css('textTransform', 'capitalize');

  // Every time a new item is inserted, hide and fade it in again. (Because it looks cool)
  $('#list tr:last').hide().fadeIn("slow");

  // After adding the actor, clear everything.
  $('form *').filter(':input').each(function(){
    $(this).val("");
  });

  // Found a neat plugin that makes bootstrap-like notifications
  $.bootstrapGrowl("Actor Added", { type: 'success' });
}

function shortAdd() {

  var fName = "Test";
  var lName = "Test";
  var bDay = "1/2/33";
  var gend = "Male";
  var genres = [];

  $('.checkbox-inline input:checked').each(function () {
    genres.push($(this).val());
  });

  Actors.push({
    fname: fName,
    lname: lName,
    gender: gend,
    bday: bDay,
    genre: genres
  });

  // Fade in the title and list.
  $('#actorList, #action').fadeIn("slow");

  // Put stuff in the list when that's done.
  $('#list').append('<tr class="'+Actors.length+'"><td class="'+Actors.length+' name">' + fName + ' ' + lName + '</td><td class="text-right"><a class="edit"><span class="'+Actors.length+' glyphicon glyphicon-pencil" aria-hidden="true"></span></a><a class="del"><span class="'+Actors.length+' glyphicon glyphicon-remove" aria-hidden="true"></span></a></td></td></td></tr>').css('textTransform', 'capitalize');

  // Every time a new item is inserted, hide and fade it in again. (Because it looks cool)
  $('#list tr:last').hide().fadeIn("slow");

  // After adding the actor, clear everything.
  $('form *').filter(':input').each(function () {
    $(this).val("");
  });

  // Found a neat plugin that makes bootstrap-like notifications
  $.bootstrapGrowl("Actor Added", {type: 'success'});
}


function editActor(id) {
  selected = Actors[$(id.target).attr('class').split(' ')[0]-1];
  $(".date-picker").datepicker();

  $('.mod h4.modal-title').text("Editing \""+selected.fname +' '+selected.lname+"\"");
  $('.mod #fName').val(selected.fname);
  $('.mod #lName').val(selected.lname);

  $('#editForm').modal('toggle');

  $('#editForm').on('click', '#save', function () {
    selected.fname = $('.mod #fName').val();
    selected.lname = $('.mod #lName').val();

    $(id.target).parent().parent().parent().html('<td class="'+Actors.length+' name">' + selected.fname + ' ' + selected.lname + '</td><td class="text-right"><a class="edit"><span class="'+Actors.length+' glyphicon glyphicon-pencil" aria-hidden="true"></span></a><a class="del"><span class="'+Actors.length+' glyphicon glyphicon-remove" aria-hidden="true"></span></a></td></td></td>');
    $.bootstrapGrowl("Actor Updated", {type: 'success'});

    // Remove all event handlers from this.
    $('#editForm').off();
    $('#editForm').modal('hide'); // Then hide the modal.
  });
}

function deleteActor(id) {
  selected = Actors[$(id.target).attr('class').split(' ')[0]-1];

  $(id.target).parent().parent().parent().remove();
  Actors.splice($(id.target).attr('class').split(' ')[0], 1);

  $.bootstrapGrowl("Actor Deleted", {type: 'danger'});
}
