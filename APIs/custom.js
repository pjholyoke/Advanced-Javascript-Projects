// Show number with digits.
$.fn.digits = function(){
  return this.each(function(){
    $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
  })
}

$(function(){
  //sid = "76561198013275030"; My steamid
  sid = "76561198068553858"; // Friend's steamid

  $.get("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=<nope>&steamids="+sid, function (res) {
    $('#avatar').append("<img src="+res.response.players[0]["avatarfull"]+"/>");
    $('.name ').text(res.response.players[0]["personaname"]);

    // Online status of the user.
    var onlineState;
    switch(res.response.players[0]["personastate"])
    {
      case 0:
        onlineState = "<span class='text-muted'>Offline</span>";
        break;
      case 1:
        onlineState = "<span class='text-success'>Online</span>";
        break;
      case 2:
        onlineState = "<span class='text-info'>Busy</span>";
        break;
      case 3:
        onlineState = "<span class='text-warning'>Away</span>";
        break;
      case 4:
        onlineState = "<span class='text-muted'>Snooze</span>";
        break;
      case 5:
        onlineState = "<span class='text-info'>Looking to Trade</span>";
        break;
      case 6:
        onlineState = "<span class='text-info'>Looking to Play</span>";
        break;
    };

    myAchievements = null;
    globalAchievements = null;

    $('.onlineStatus').html(onlineState);

    // My personal achievements
    $.get("http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=730&key=<nope>&steamid="+sid, function (data) {
      myAchievements = data;
    });

    // Achievement schema (All the images and stuff.)
    $.get("http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2?appid=730&key=<nope>&steamid="+sid, function (data) {
      globalAchievements = data;
    });

    myStats = null;
    // My personal stats for Counter-StrikeL Global Offensive
    $.get("http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=<nope>&steamid="+sid, function (data) {
      myStats = data;
      $('.gamename').html(myAchievements.playerstats.gameName);

      $('.kills span').text(myStats.playerstats.stats[0].value);
      $('.deaths span').text(myStats.playerstats.stats[1].value);
      $('.kdr span').text( (myStats.playerstats.stats[0].value / myStats.playerstats.stats[1].value).toFixed(2) );
      $('.hs span').text(myStats.playerstats.stats[25].value);

      // Add commas to numbers.
      $('.kills span, .deaths span, .hs span').digits();
    });
  });
});