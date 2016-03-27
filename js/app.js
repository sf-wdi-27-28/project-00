console.log("Sanity Check: JS is working!");

$(document).ready(function(){

  // code in here
  var totalClickCount = 0;

  loadGrid(135,185);
  var fieldArr = loadArr(135,185);
  // initRow(fieldArr)
  initMaze(fieldArr,mazeArr);


  var car = new Car("red",7,65,fieldArr,"player1");
  var car2 = new Car("green", 7,76,fieldArr,"player2");
  car.placeOnBoard(fieldArr);
  car2.placeOnBoard(fieldArr);

  // var sprite = new Sprite(7,fieldArr,76, player1,player2);
  // sprite.placeOnBoard(fieldArr);


  $(window).on("keyup",function(event){
    totalClickCount++;
    if(totalClickCount === 40){
      // clearRowField(fieldArr);
    }
    car.moveOnBoard(event,fieldArr);
    car2.moveOnBoard(event,fieldArr);
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
  this.color = "blue";
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

function Car(color,size,row,fieldArr,player){
  this.user = player;
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
  this.placeOnBoard = function(fieldArr){
    for(var row = this.occ.row.start; row >= this.occ.row.finish; row--){
      for(var col = this.occ.col.start; col <= this.occ.col.finish; col++){
        fieldArr[row][col].spaceHolder = player;
        $(".row-num-" + row + " .col-num-" + col).addClass(player);
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
            $(".row-num-" + (this.occ.row.finish - 1) + " .col-num-" + col).addClass(player);
            $(".row-num-" + (this.occ.row.start) + " .col-num-" + col).removeClass(player);
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
            $(".row-num-" + (this.occ.row.start + 1) + " .col-num-" + colD).addClass(player);
            $(".row-num-" + (this.occ.row.finish) + " .col-num-" + colD).removeClass(player);
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
            $(".row-num-" + row + " .col-num-" + (this.occ.col.finish + 1)).addClass(player);
          }
          $(".col-num-" + (this.occ.col.start)).removeClass(player);
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
            $(".row-num-" + rowL + " .col-num-" + (this.occ.col.start - 1)).addClass(player);
          }
          $(".col-num-" + (this.occ.col.finish)).removeClass(player);
          this.position.col--;
          this.occ.col.start--;
          this.occ.col.finish--;
        }
      }
    }
  };
  this.checkUp = function(fieldArr){
    for(var col = this.occ.col.start; col <= this.occ.col.finish; col++){
      if((fieldArr[(this.occ.row.finish - 1)][col].open === false) || (fieldArr[(this.occ.row.finish - 1)][col].spaceHolder === "player1") || (fieldArr[(this.occ.row.finish - 1)][col].spaceHolder === "player2")){
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
      if((fieldArr[row][(this.occ.col.finish + 1)].open === false) || (fieldArr[row][(this.occ.col.finish + 1)].spaceHolder === "player1") || (fieldArr[row][(this.occ.col.finish + 1)].spaceHolder === "player2")){
        return false;
      }
    }
    return true;
  };
  this.checkLeft = function(fieldArr){
    for(var row = this.occ.row.start; row >= this.occ.row.finish; row--){
      if((fieldArr[row][(this.occ.col.start - 1)].open === false) || (fieldArr[row][(this.occ.row.start - 1)].spaceHolder === "player1") || (fieldArr[row][(this.occ.col.start - 1)].spaceHolder === "player2")){
        return false;
      }
    }
    return true;
  };
  this.dies = function(fieldArr){
    for(var row = this.occ.row.start; row <= this.occ.row.finish; row++){
      for(var col = this.occ.col.start; col <= this.occ.col.finish; col++){
        fieldArr[row][col].open = true;
        fieldArr[row][col].spaceHolder = false;
        $(".row-num-" + row + " .col-num-" + col).removeClass(player);
      }
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
        if(row > el.row.start && row < el.row.finish-1 && col > el.col.start && col < el.col.finish){
          $(".row-num-" + row + " .col-num-" + col).addClass("wall");
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
  this.orientation = this.orientationOptions[2];
  this.moveOnBoard = function(event,fieldArr){
    if(this.orientation === this.orientationOptions[0]){
      /////UP
      if(this.checkUp(fieldArr)){
        for(var col = this.occ.col.start; col <= this.occ.col.finish; col++){
          fieldArr[(this.occ.row.finish - 1)][col].spaceHolder = player;
          fieldArr[(this.occ.row.start)][col].spaceHolder = false;
          $(".row-num-" + (this.occ.row.finish - 1) + " .col-num-" + col).addClass(this.user);
          $(".row-num-" + (this.occ.row.start) + " .col-num-" + col).removeClass(this.user);
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
          fieldArr[(this.occ.row.start + 1)][colD].spaceHolder = this.user;
          fieldArr[(this.occ.row.finish)][colD].spaceHolder = false;
          $(".row-num-" + (this.occ.row.start + 1) + " .col-num-" + colD).addClass(this.user);
          $(".row-num-" + (this.occ.row.finish) + " .col-num-" + colD).removeClass(this.user);
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
          fieldArr[row][(this.occ.col.finish + 1)].spaceHolder = this.user;
          fieldArr[row][(this.occ.col.start)].spaceHolder = false;
          $(".row-num-" + row + " .col-num-" + (this.occ.col.finish + 1)).addClass(this.user);
        }
        $(".col-num-" + (this.occ.col.start)).removeClass(this.user);
        this.position.col++;
        this.occ.col.start++;
        this.occ.col.finish++;
      }
    }
    if(event.keyCode === this.keyCodes[3]){
      //////LEFT
      if(this.checkLeft(fieldArr)){
        for(var rowL = this.occ.row.start; rowL >= this.occ.row.finish; rowL--){
          fieldArr[rowL][(this.occ.col.start - 1)].spaceHolder = this.user;
          fieldArr[rowL][(this.occ.col.finish)].spaceHolder = false;
          $(".row-num-" + rowL + " .col-num-" + (this.occ.col.start - 1)).addClass(this.user);
        }
        $(".col-num-" + (this.occ.col.finish)).removeClass(this.user);
        this.position.col--;
        this.occ.col.start--;
        this.occ.col.finish--;
      }
    }
  };
  this.checkUp = function(fieldArr){
    for(var col = this.occ.col.start; col <= this.occ.col.finish; col++){
      if((fieldArr[(this.occ.row.finish - 1)][col].open === false)
      || (fieldArr[(this.occ.row.finish - 1)][col].spaceHolder === "sprite")){
        var num = Math.random();
        if(num < .33){
          this.orientation = this.orientationOptions[1];
        } else if (num > .33 && num < .66) {
          this.orientation = this.orientationOptions[2];
        } else {
          this.orientation = this.orientationOptions[3];
        }
        return false;
      } else if (fieldArr[(this.occ.row.finish - 1)][col].spaceHolder === "player1"){
        player1.dies(fieldArr);
        player1.alive = false;
      } else if (fieldArr[(this.occ.row.finish - 1)][col].spaceHolder === "player2"){
        player2.dies(fieldArr);
        player2.alive = false;
      }
    }
    return true;
  };
  this.checkDown = function(fieldArr){
    for(var col = this.occ.col.start; col <= this.occ.col.finish; col++){
      if((fieldArr[(this.occ.row.start + 1)][col].open === false)
      || (fieldArr[(this.occ.row.start + 1)][col].spaceHolder === "sprite")){
        var num = Math.random();
        if(num < .33){
          this.orientation = this.orientationOptions[0];
        } else if (num > .33 && num < .66) {
          this.orientation = this.orientationOptions[2];
        } else {
          this.orientation = this.orientationOptions[3];
        }
        return false;
      } else if (fieldArr[(this.occ.row.start + 1)][col].spaceHolder === "player1"){
        player1.dies(fieldArr);
        player1.alive = false;
      } else if (fieldArr[(this.occ.row.start + 1)][col].spaceHolder === "player2"){
        player2.dies(fieldArr);
        player2.alive = false;
      }
    }
    return true;
  };
  this.checkRight = function(fieldArr){
    for(var row = this.occ.row.start; row >= this.occ.row.finish; row--){
      if((fieldArr[row][(this.occ.col.finish + 1)].open === false)
      || (fieldArr[row][(this.occ.col.finish + 1)].spaceHolder === "sprite")){
        var num = Math.random();
        if(num < .33){
          this.orientation = this.orientationOptions[0];
        } else if (num > .33 && num < .66){
          this.orientation = this.orientationOptions[1];
        } else {
          this.orientation = this.orientationOptions[3];
        }
        return false;
      } else if (fieldArr[row][(this.occ.col.finish + 1)].spaceHolder === "player1"){
        player1.dies(fieldArr);
        player1.alive = false;
      } else if (fieldArr[row][(this.occ.col.finish + 1)].spaceHolder === "player2") {
        player2.dies(fieldArr);
        player2.alive = false;
      }
    }
    return true;
  };
  this.checkLeft = function(fieldArr){
    for(var row = this.occ.row.start; row >= this.occ.row.finish; row--){
      if((fieldArr[row][(this.occ.col.start - 1)].open === false)
      || (fieldArr[row][(this.occ.row.start - 1)].spaceHolder === "sprite")){
        var num = Math.random();
        if(num < .33){
          this.orientation = this.orientationOptions[0];
        } else if (num > .33 && num < .66) {
          this.orientation = this.orientationOptions[1];
        } else {
          this.orientation = this.orientationOptions[2];
        }
        return false;
      } else if (fieldArr[row][(this.occ.row.start - 1)].spaceHolder === "player1") {
        player1.dies(fieldArr);
        player1.alive = false;
      } else if (fieldArr[row][(this.occ.row.start - 1)].spaceHolder === "player2") {
        player2.dies(fieldArr);
        player2.alive = false;
      }
    }
    return true;
  };
}
