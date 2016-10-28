canvas = $('#can')[0];
ctx = canvas.getContext("2d");

w = 150, h = 45;
xcount = 0;
ycount = 0;

randcolor1 = randHex();
randcolor2 = randHex();

$(function () {
  var p1 = createPlayer("Player 1", 0, h-27, w, h, randcolor1);
  var p2 = createPlayer("Player 2", 0, h*5.3, w, h, randcolor2);

  p1.draw();
  p2.draw();

  ctx.fillStyle="#fff";
  ctx.font="18px sans-serif";
  ctx.fillText("Player 1", (p1.x+p2.w/3.5), (p1.h));
  ctx.fillText("Player 2", (p2.x+p2.w/3.5), (p2.h*5.9));
  ctx.globalCompositeOperation = 'destination-over';

  $('#next').click(function () {

    rn1 = randNum(250);
    rn2 = randNum(250);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle="#fff";
    ctx.font="18px sans-serif";
    ctx.fillText("Player 1", p1.x+(rn1+30), p1.h);
    ctx.fillText("Player 2", p2.x+(rn2+30), p2.h*5.9);
    ctx.globalCompositeOperation = 'destination-over';

    p1.setPos(p1.x+rn1, p1.y);
    p1.draw();

    p2.setPos(p2.x+rn2, p2.y);
    p2.draw();

    if(p1.x+(p1.w) >= 972) {
      alert(p1.name+" wins!");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var temp = $('#next').clone();
      temp.text("Play again?");
      temp.prop("id", "restart");
      temp.addClass("btn-info");

      $('#next').replaceWith(temp);
    }
    else if(p2.x+(p2.w) >= 972) {
      alert(p2.name+" wins!");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var temp = $('#next').clone();
      temp.text("Play again?");
      temp.prop("id", "restart");
      temp.addClass("btn-info");

      $('#next').replaceWith(temp);
    }
  });

  $(document.body).on('click', '#restart', function () {
    location.reload();
    $(this).off('click');
  });

});

function createPlayer(name, x, y, w, h, color) {
  var player = {};

  player.color = color;
  player.name = name
  player.img = "";
  player.x = x;
  player.y = y;
  player.w = w;
  player.h = h;

  player.draw = function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.w, player.h);
  }

  player.getPos = function () {
    var arr = [];
    arr.push(player.w);
    arr.push(player.h);
    return arr;
  };

  player.setPos = function (x, y) {
    player.x = x;
    player.y = y;
    player.draw();
  };

  return player;
}

function randNum(max) {
  return Math.ceil(Math.random()*max) + 1;
}

function randHex() {
  return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}
