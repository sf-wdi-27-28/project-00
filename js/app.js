console.log("Sanity Check: JS is working!");

$(document).ready(function(){

  // code in here
  var totalClickCount = 0;
  var gameActive = false;

  loadGrid(135,185);
  var fieldArr = loadArr(135,185);
  // initRow(fieldArr)
  initMaze(fieldArr,mazeArr);

  var player1Val = {
    "name": "Player 1",
    "color": "blue",
  };

  var player2Val = {
    "name": "Player 2",
    "color": "yellow",
  };
  var player1 = null;
  var player2 = null;
  var spriteArr = [];


  $("#player1").on("submit", function(event){
    event.preventDefault();
    player1Val.name = $("#name1").val();
    player1Val.color = $("#color1").val();
    $("#player1Name").text(player1Val.name);
    $("#player1").toggleClass("hidden");
  });
  $("#player2").on("submit", function(event){
    event.preventDefault();
    player2Val.name = $("#name2").val();
    player2Val.color = $("#color2").val();
    $("#player2Name").text(player2Val.name);
    $("#player2").toggleClass("hidden");
  });

  $("#play").on("click", function(event){
    event.preventDefault();
    player1 = new Car(player1Val.color,7,65,fieldArr,"player1",player1Val.name,player2);
    console.log(player1);
    player2 = new Car(player2Val.color, 7,76,fieldArr,"player2",player2Val.name,player1);
    console.log(player2);
    player1.placeOnBoard(fieldArr);
    player2.placeOnBoard(fieldArr);
    $("#play").toggleClass("hidden");
    gameActive = true;
  });
  $("#reset").on("click",function(event){
    event.preventDefault();
    var characterArr = spriteArr;
    characterArr.push(player1);
    characterArr.push(player2);
    console.log(characterArr);
    characterArr.forEach(function(el){
      for(var row = el.occ.row.start; row >= el.occ.row.finish; row--){
        for(var col = el.occ.col.start; col <= el.occ.col.finish; col++){
          fieldArr[row][col].spaceHolder = false;
          fieldArr[row][col].open = true;
          console.log(fieldArr[row][col]);
          console.log($(".row-num-" + row + " .col-num-" + col).html());
          $(".row-num-" + row + " .col-num-" + col).css("background-color", "rgba(10, 10, 10, 1)");
        }
      }
    });
    spriteArr = [];
    totalClickCount = 0;
    player1.alive = true;
    player1.returnToOrigin();
    player1.placeOnBoard(fieldArr);
    player2.alive = true;
    player2.returnToOrigin();
    player2.placeOnBoard(fieldArr);
  });




  $(window).on("keydown",function(event){
    if(gameActive === true){
      totalClickCount++;
      if(totalClickCount % 100 === 0){
        var sprite = new Sprite(7,fieldArr,76, player1,player2);
        spriteArr.push(sprite);
        sprite.placeOnBoard(fieldArr);
      }
      player1.moveOnBoard(event,fieldArr);
      player2.moveOnBoard(event,fieldArr);
      if(spriteArr.length > 0){
        spriteArr.forEach(function(el){
          el.moveOnBoard(event,fieldArr,player1,player2);
        });
      }
    }
  });


});

function loadArr(rows,cols){
  var field = [];
  for (var row = 0; row < rows; row++){
    var rowArr = [];
    for(var col = 0; col < cols; col++){
      var space = new Space(row,col);
      rowArr.push(space);
    }
    field.push(rowArr);
  }
  return field;
}

function Space(row,col){
  this.position = {
    "row": row,
    "col": col,
  };
  this.color = "#333";
  this.spaceHolder = false;
  this.open = true;
  this.htmlRender = "";
}

function loadGrid(rows,cols){
  for(var i = 0; i < rows; i++){
    $("#field").append("<div class='field-row row-num-"+ i +"'></div>");
  }
  for(var j = 0; j < cols; j++){
    $(".field-row").append("<td class='col-num-" + j + "'></td>");
  }
}

function Car(color,size,row,fieldArr,player,name,opponent){
  this.user = player;
  this.wins = 0;
  this.name = name;
  this.alive = true;
  this.color = color;
  this.position = {
    "row": row,
    "col": 2,
  };
  this.occ = {
    "row": {
      "start": this.position.row,
      "finish": this.position.row - size
    },
    "col": {
      "start": this.position.col,
      "finish": this.position.col + size
    }
  };
  this.returnToOrigin = function(){
    this.occ.row.start = row;
    this.occ.row.finish = row - size;
    this.occ.col.start = 2;
    this.occ.col.finish = 2 + size;
  };
  this.placeOnBoard = function(fieldArr){
    for(var row = this.occ.row.start; row >= this.occ.row.finish; row--){
      for(var col = this.occ.col.start; col <= this.occ.col.finish; col++){
        fieldArr[row][col].spaceHolder = player;
        $(".row-num-" + row + " .col-num-" + col).css("background-color", this.color);
      }
    }
  };
  this.newCol = function(column){
    $(".col-num-" + column + " " + player).removeClass(player);
  };
  this.clearCol = function(column){
    $(".col-num-" + column + " " + player).removeClass(player);
  };
  this.clearOnBoard = function(){
    $(".row-num-" + this.position.row + " .col-num-" + this.position.col).css("background", "blue");
  };
  this.keyCodesDecide = function(player){
    if(player === "player1"){
      return [87,83,68,65];
    } else if(player === "player2") {
      return [38,40,39,37];
    }
  };
  this.keyCodes = this.keyCodesDecide(player);
  this.moveOnBoard = function(event,fieldArr){
    if(this.alive === true){
      if(event.keyCode === this.keyCodes[0]){
        /////UP
        if(this.checkUp(fieldArr)){
          for(var col = this.occ.col.start; col <= this.occ.col.finish; col++){
            fieldArr[(this.occ.row.finish - 1)][col].spaceHolder = player;
            fieldArr[(this.occ.row.start)][col].spaceHolder = false;
            $(".row-num-" + (this.occ.row.finish - 1) + " .col-num-" + col).css("background-color", this.color);
            $(".row-num-" + (this.occ.row.start) + " .col-num-" + col).css("background-color","rgba(10, 10, 10, 1)");
          }
          this.position.row--;
          this.occ.row.start--;
          this.occ.row.finish--;
        }
      }
      if(event.keyCode === this.keyCodes[1]){
        /////DOWN
        if(this.checkDown(fieldArr)){
          for(var colD = this.occ.col.start; colD <= this.occ.col.finish; colD++){
            fieldArr[(this.occ.row.start + 1)][colD].spaceHolder = player;
            fieldArr[(this.occ.row.finish)][colD].spaceHolder = false;
            $(".row-num-" + (this.occ.row.start + 1) + " .col-num-" + colD).css("background-color", this.color);
            $(".row-num-" + (this.occ.row.finish) + " .col-num-" + colD).css("background","rgba(10, 10, 10, 1)");
          }
          this.position.row++;
          this.occ.row.start++;
          this.occ.row.finish++;
        }
      }
      if(event.keyCode === this.keyCodes[2]){
        //////RIGHT
        if(this.checkRight(fieldArr)){
          for(var row = this.occ.row.start; row >= this.occ.row.finish; row--){
            fieldArr[row][(this.occ.col.finish + 1)].spaceHolder = player;
            fieldArr[row][(this.occ.col.start)].spaceHolder = false;
            $(".row-num-" + row + " .col-num-" + (this.occ.col.finish + 1)).css("background", this.color);
            $(".row-num-" + row + " .col-num-" + (this.occ.col.start)).css("background","rgba(10, 10, 10, 1)");
          }
          this.position.col++;
          this.occ.col.start++;
          this.occ.col.finish++;
        }
      }
      if(event.keyCode === this.keyCodes[3]){
        //////LEFT
        if(this.checkLeft(fieldArr)){
          for(var rowL = this.occ.row.start; rowL >= this.occ.row.finish; rowL--){
            fieldArr[rowL][(this.occ.col.start - 1)].spaceHolder = player;
            fieldArr[rowL][(this.occ.col.finish)].spaceHolder = false;
            $(".row-num-" + rowL + " .col-num-" + (this.occ.col.start - 1)).css("background", this.color);
            $(".row-num-" + rowL + " .col-num-" + (this.occ.col.finish)).css("background","rgba(10, 10, 10, 1)");
          }
          this.position.col--;
          this.occ.col.start--;
          this.occ.col.finish--;
        }
      }
    }
  };
  this.checkUp = function(fieldArr){
    for(var col = this.occ.col.start; col <= this.occ.col.finish; col++){
      if((fieldArr[(this.occ.row.finish - 1)][col].open === false)
      || (fieldArr[(this.occ.row.finish - 1)][col].spaceHolder === "player1")
      || (fieldArr[(this.occ.row.finish - 1)][col].spaceHolder === "player2")){
        return false;
      }
    }
    return true;
  };
  this.checkDown = function(fieldArr){
    for(var col = this.occ.col.start; col <= this.occ.col.finish; col++){
      if((fieldArr[(this.occ.row.start + 1)][col].open === false) || (fieldArr[(this.occ.row.start + 1)][col].spaceHolder === "player1") || (fieldArr[(this.occ.row.start + 1)][col].spaceHolder === "player2")){
        return false;
      }
    }
    return true;
  };
  this.checkRight = function(fieldArr){
    for(var row = this.occ.row.start; row >= this.occ.row.finish; row--){
      if((fieldArr[row][(this.occ.col.finish + 1)].open === false)
      || (fieldArr[row][(this.occ.col.finish + 1)].spaceHolder === "player1")
      || (fieldArr[row][(this.occ.col.finish + 1)].spaceHolder === "player2")){
        return false;
      } else if ((this.occ.col.finish + 1) === fieldArr[0].length - 1){
        $("#dialogue").text(this.name + " WINS!");
        this.wins++;
        console.log(this.wins)
        $("#" + this.user + "Wins").text("Wins: " + this.wins);
        this.alive = false;
        opponent.alive = false;
        break;
      }
    }
    return true;
  };
  this.checkLeft = function(fieldArr){
    for(var row = this.occ.row.start; row >= this.occ.row.finish; row--){
      if((fieldArr[row][(this.occ.col.start - 1)].open === false)
      || (fieldArr[row][(this.occ.col.start - 1)].spaceHolder === "player1")
      || (fieldArr[row][(this.occ.col.start - 1)].spaceHolder === "player2")
      || (this.occ.col.finish + 1) === 0){
        return false;
      }
    }
    return true;
  };
  this.dies = function(fieldArr,opponent){
    this.alive = false;
    for(var row = this.occ.row.start; row >= this.occ.row.finish; row--){
      for(var col = this.occ.col.start; col <= this.occ.col.finish; col++){
        fieldArr[row][col].open = true;
        fieldArr[row][col].spaceHolder = false;
        $(".row-num-" + row + " .col-num-" + col).css("background", "rgba(10, 10, 10, 1)");
      }
    }
    $("#dialogue").text(this.name + " was eaten!");
    if(opponent.alive === false){
      $("#dialogue").text(this.name + " was eaten! No one wins!");
      gameActive = false;
    }
  };
}


function buildWall(space){
  space.color = "gray";
  space.open = false;
  $(".row-num-" + space.position.row + " .col-num-" + space.position.col).addClass("wall");
}

function initMaze(fieldArr,mazeArr){
  mazeArr.forEach(function(el){
    for(var row = el.row.start; row < el.row.finish; row++){
      for(var col = el.col.start; col < el.col.finish; col++){
        if(row > el.row.start && row < el.row.finish - 1 && col > el.col.start && col < el.col.finish - 1){
          // $(".row-num-" + row + " .col-num-" + col).addClass("wall");
        } else {
          buildWall(fieldArr[row][col]);
        }
      }
    }
  });
}

var mazeArr = [{'row':{'start':0,'finish':5},
'col':{'start': 0, 'finish': 185}},
{'row':{'start':5,'finish':50},
'col':{'start': 0, 'finish': 5}},
{'row':{'start':50,'finish':55},
'col':{'start': 0, 'finish': 40}},
{'row':{'start':80,'finish':85},
'col':{'start': 0, 'finish': 40}},
{'row':{'start':85,'finish':130},
'col':{'start': 0, 'finish': 5}},
{'row':{'start':130,'finish':135},
'col':{'start': 0, 'finish': 185}},
{'row':{'start':25,'finish':30},
'col':{'start': 25, 'finish': 70}},
{'row':{'start':105,'finish':110},
'col':{'start': 25, 'finish': 70}},
{'row':{'start':30,'finish':105},
'col':{'start': 65, 'finish': 70}},
{'row':{'start':5,'finish':57},
'col':{'start': 90, 'finish': 95}},
{'row':{'start':72,'finish':130},
'col':{'start': 90, 'finish': 95}},
{'row':{'start':30,'finish':105},
'col':{'start': 115, 'finish': 120}},
{'row':{'start':25,'finish':30},
'col':{'start': 115, 'finish': 160}},
{'row':{'start':50,'finish':55},
'col':{'start': 140, 'finish': 185}},
{'row':{'start':80,'finish':85},
'col':{'start': 140, 'finish': 185}},
{'row':{'start':105,'finish':110},
'col':{'start': 115, 'finish': 160}},
{'row':{'start':5,'finish':50},
'col':{'start': 180, 'finish': 185}},
{'row':{'start':85,'finish':130},
'col':{'start': 180, 'finish': 185}}];

function initRow(fieldArr){
  for(var rowTop = 0; rowTop < 55; rowTop++){
    for(var colTop = 0; colTop < 185;colTop++){
      if(rowTop > 0 && rowTop < 54 && colTop > 0 && colTop < 184){
        $(".row-num-" + rowTop + " .col-num-" + colTop).addClass("wall");
      } else {
        buildWall(fieldArr[rowTop][colTop]);
      }
    }
  }
  for(var rowBot = 80; rowBot < 135; rowBot++){
    for(var colBot = 0; colBot < 185;colBot++){
      if(rowBot > 80 && rowBot < 134 && colBot > 0 && colBot < 184){
        $(".row-num-" + rowBot + " .col-num-" + colBot).addClass("wall");
      } else {
        buildWall(fieldArr[rowBot][colBot]);
      }
    }
  }
}

function clearRowField(fieldArr){
  for(var rowTop = 0; rowTop < 55; rowTop++){
    for(var colTop = 0; colTop < 185;colTop++){
      if(rowTop > 0 && rowTop < 54 && colTop > 0 && colTop < 184){
        $(".row-num-" + rowTop + " .col-num-" + colTop).removeClass("wall");
      } else {
        fieldArr[rowTop][colTop].open = true;
        $(".row-num-" + rowTop + " .col-num-" + colTop).removeClass("wall");
      }
    }
  }
  for(var rowBot = 80; rowBot < 135; rowBot++){
    for(var colBot = 0; colBot < 185;colBot++){
      if(rowBot > 80 && rowBot < 134 && colBot > 0 && colBot < 184){
        $(".row-num-" + rowBot + " .col-num-" + colBot).removeClass("wall");
      } else {
        fieldArr[rowBot][colBot].open = true;
        $(".row-num-" + rowBot + " .col-num-" + colBot).removeClass("wall");
      }
    }
  }
}

function Sprite(size,fieldArr,row,player1,player2){
  this.user = "sprite";
  this.alive = true;
  this.color = "white";
  this.position = {
    "row": row,
    "col": 170,
  };
  this.occ = {
    "row": {
      "start": this.position.row,
      "finish": this.position.row - size
    },
    "col": {
      "start": this.position.col,
      "finish": this.position.col + size
    }
  };
  this.placeOnBoard = function(fieldArr){
    for(var row = this.occ.row.start; row >= this.occ.row.finish; row--){
      for(var col = this.occ.col.start; col <= this.occ.col.finish; col++){
        fieldArr[row][col].spaceHolder = this.user;
        $(".row-num-" + row + " .col-num-" + col).addClass(this.user);
      }
    }
  };
  this.newCol = function(column){
    $(".col-num-" + column + " " + this.user).removeClass(this.user);
  };
  this.clearCol = function(column){
    $(".col-num-" + column + " " + this.user).removeClass(this.user);
  };
  this.clearOnBoard = function(){
    $(".row-num-" + this.position.row + " .col-num-" + this.position.col).css("background", "blue");
  };
  this.orientationOptions = ["up","down","left","right"];
  this.orientation = this.orientationOptions[3];
  this.moveOnBoard = function(event,fieldArr,player1,player2){
    if(this.orientation === this.orientationOptions[0]){
      /////UP
      if(this.checkUp(fieldArr,player1,player2)){
        for(var col = this.occ.col.start; col <= this.occ.col.finish; col++){
          fieldArr[(this.occ.row.finish - 1)][col].spaceHolder = this.user;
          fieldArr[(this.occ.row.start)][col].spaceHolder = false;
          $(".row-num-" + (this.occ.row.finish - 1) + " .col-num-" + col).css("background-color","white");
          $(".row-num-" + (this.occ.row.start) + " .col-num-" + col).css("background-color","rgba(10, 10, 10, 1)");
        }
        this.position.row--;
        this.occ.row.start--;
        this.occ.row.finish--;
      }
    }
    if(this.orientation === this.orientationOptions[1]){
      /////DOWN
      if(this.checkDown(fieldArr,player1,player2)){
        for(var colD = this.occ.col.start; colD <= this.occ.col.finish; colD++){
          fieldArr[(this.occ.row.start + 1)][colD].spaceHolder = this.user;
          fieldArr[(this.occ.row.finish)][colD].spaceHolder = false;
          $(".row-num-" + (this.occ.row.start + 1) + " .col-num-" + colD).css("background-color","white");
          $(".row-num-" + (this.occ.row.finish) + " .col-num-" + colD).css("background-color","rgba(10, 10, 10, 1)");
        }
        this.position.row++;
        this.occ.row.start++;
        this.occ.row.finish++;
      }
    }
    if(this.orientation === this.orientationOptions[2]){
      //////RIGHT
      if(this.checkRight(fieldArr,player1,player2)){
        for(var row = this.occ.row.start; row >= this.occ.row.finish; row--){
          fieldArr[row][(this.occ.col.finish + 1)].spaceHolder = this.user;
          fieldArr[row][(this.occ.col.start)].spaceHolder = false;
          $(".row-num-" + row + " .col-num-" + (this.occ.col.finish + 1)).css("background-color","white");
          $(".row-num-" + row + " .col-num-" + (this.occ.col.start)).css("background-color","rgba(10, 10, 10, 1)");
        }
        this.position.col++;
        this.occ.col.start++;
        this.occ.col.finish++;
      }
    }
    if(this.orientation === this.orientationOptions[3]){
      //////LEFT
      if(this.checkLeft(fieldArr,player1,player2)){
        for(var rowL = this.occ.row.start; rowL >= this.occ.row.finish; rowL--){
          fieldArr[rowL][(this.occ.col.start - 1)].spaceHolder = this.user;
          fieldArr[rowL][(this.occ.col.finish)].spaceHolder = false;
          $(".row-num-" + rowL + " .col-num-" + (this.occ.col.start - 1)).css("background-color","white");
          $(".row-num-" + rowL + " .col-num-" + (this.occ.col.finish)).css("background-color","rgba(10, 10, 10, 1)");
        }
        this.position.col--;
        this.occ.col.start--;
        this.occ.col.finish--;
      }
    }
  };
  this.checkUp = function(fieldArr,player1,player2){
    for(var col = this.occ.col.start; col <= this.occ.col.finish; col++){
      if((fieldArr[(this.occ.row.finish - 1)][col].open === false)
      || (fieldArr[(this.occ.row.finish - 1)][col].spaceHolder === "sprite")){
        var num = Math.random();
        if(num < .5){
          this.orientation = this.orientationOptions[2];
        } else {
          this.orientation = this.orientationOptions[3];
        }
        return false;
      } else if (fieldArr[(this.occ.row.finish - 1)][col].spaceHolder === "player1"){
        player1.dies(fieldArr);
      } else if (fieldArr[(this.occ.row.finish - 1)][col].spaceHolder === "player2"){
        player2.dies(fieldArr);
      }
    }
    return true;
  };
  this.checkDown = function(fieldArr,player1,player2){
    for(var col = this.occ.col.start; col <= this.occ.col.finish; col++){
      if((fieldArr[(this.occ.row.start + 1)][col].open === false)
      || (fieldArr[(this.occ.row.start + 1)][col].spaceHolder === "sprite")){
        var num = Math.random();
        if(num < .5){
          this.orientation = this.orientationOptions[2];
        } else {
          this.orientation = this.orientationOptions[3];
        }
        return false;
      } else if (fieldArr[(this.occ.row.start + 1)][col].spaceHolder === "player1"){
        player1.dies(fieldArr);
      } else if (fieldArr[(this.occ.row.start + 1)][col].spaceHolder === "player2"){
        player2.dies(fieldArr);
      }
    }
    return true;
  };
  this.checkRight = function(fieldArr,player1,player2){
    for(var row = this.occ.row.start; row >= this.occ.row.finish; row--){
      if((fieldArr[row][(this.occ.col.finish + 1)].open === false)
      || (fieldArr[row][(this.occ.col.finish + 1)].spaceHolder === "sprite")
      || (fieldArr[row][(this.occ.col.finish + 1)].position.col === fieldArr[0].length - 1)){
        var num = Math.random();
        if(num < .5){
          this.orientation = this.orientationOptions[0];
        } else {
          this.orientation = this.orientationOptions[1];
        }
        return false;
      } else if (fieldArr[row][(this.occ.col.finish + 1)].spaceHolder === "player1"){
        player1.dies(fieldArr);
      } else if (fieldArr[row][(this.occ.col.finish + 1)].spaceHolder === "player2") {
        player2.dies(fieldArr);
      }
    }
    return true;
  };
  this.checkLeft = function(fieldArr,player1,player2){
    for(var row = this.occ.row.start; row >= this.occ.row.finish; row--){
      if((fieldArr[row][(this.occ.col.start - 1)].open === false)
      || (fieldArr[row][(this.occ.col.start - 1)].spaceHolder === "sprite")){
        var num = Math.random();
        if(num < .5){
          this.orientation = this.orientationOptions[0];
        } else {
          this.orientation = this.orientationOptions[1];
        }
        return false;
      } else if (fieldArr[row][(this.occ.col.start - 1)].spaceHolder === "player1") {
        player1.dies(fieldArr);
      } else if (fieldArr[row][(this.occ.col.start - 1)].spaceHolder === "player2") {
        player2.dies(fieldArr);
      }
    }
    return true;
  };
}
