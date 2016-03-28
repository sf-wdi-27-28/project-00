$(document).ready(function() {

var offset = 5;
var car1clicks = 0;
var car2clicks = 0;
var winner = false;
//moves car 1
$("body").keypress(function (e) {
    console.log(e.keyCode);
    if(e.keyCode == '112') {
        var pos1 = $("#d").position();
        $("#d").css('left', pos1.left + offset);
        car1clicks++;
        console.log("Car One has moved " + car1clicks + " feet");
    } else if (e.keyCode == '99') {
        var pos2 = $("#c").position();
        $("#c").css('left', pos2.left + offset);
        car2clicks++;
        console.log("Car Two has moved " + car2clicks + " feet");
    }if(car2clicks > 100){
          alert("player 2 wins");
      } if (car1clicks > 100) {
          alert("player 1 wins");
      }
  });


$('#reset').on('click', function(){
location.reload();
});
});
