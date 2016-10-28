// Show number with digits.
$.fn.digits = function(){
  return this.each(function(){
    $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
  })
}

$(function(){
  sid = "76561198013275030";
  onlineState = null;
  myAchievements = null;
  //sid = "76561198068553858";

  url = encodeURIComponent("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?steamids="+sid);
  $.post('data.php?url='+url, function (res) {
    test = JSON.parse(res);
    console.log(test);

    $('#avatar').append("<img src="+test.response.players[0]["avatarfull"]+"/>");
    $('.name ').text(test.response.players[0]["personaname"]);

    switch(test.response.players[0]["personastate"]) {
      case 0:
        onlineState = "<span class='text-muted'>Offline</span>";
        break;
      case 1:
        onlineState = "<span class='text-online'>Online</span>";
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

    // Take the time since epoch and convert it to a normal date.
    var timeCreatedUTC = test.response.players[0].timecreated;
    var d = new Date(0);
    var now = new Date();
    d.setUTCSeconds(timeCreatedUTC);
    var accAge = now.getFullYear() - d.getFullYear();

    $('.onlineStatus').html(onlineState);

    if(accAge >= 1 && accAge <= 12)
      $('.old').html('<img src="js/YOS Images/'+accAge+'.png" alt="Account is '+accAge+' years old." />');
  });

  // List of personal acheivements.
  url = encodeURIComponent("http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=730&steamid="+sid);
  $.post("data.php?url="+url, function (data) {
    myAchievements = JSON.parse(data);
    $('.gamename').html(myAchievements.playerstats.gameName);
  });

  // List of achievement data (Images and names and stuff).
  url = encodeURIComponent("http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2?appid=730&steamid="+sid);
  $.post("data.php?url="+url, function (data) {
    globalAchievements = JSON.parse(data);
  });

  // Games list
  url = encodeURIComponent("http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=33F82F7FE600B330DF7AE9524FE7449E&steamid="+sid);
  $.post("data.php?url="+url, function (data) {

  });

  // My personal stats for cs:go
  url = encodeURIComponent("http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&steamid="+sid);

  $.post("data.php?url="+url, function (data) {
    myStats = JSON.parse(data);
    $('.kills span').text(myStats.playerstats.stats[0].value);
    $('.deaths span').text(myStats.playerstats.stats[1].value);
    $('.kdr span').text( (myStats.playerstats.stats[0].value / myStats.playerstats.stats[1].value).toFixed(2) );
    $('.hs span').text(myStats.playerstats.stats[25].value);

    // Add commas.
    $('.kills span, .deaths span, .hs span').digits();
  });
});