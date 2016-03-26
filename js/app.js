console.log("Sanity Check: JS is working!");

$(document).ready(function(){

  // code in here
  loadGrid();
  var fieldArr = loadArr();
  var car = new Car("red",1,fieldArr);
  car.placeOnBoard();

  buildWall(fieldArr[5][5]);

  $(window).on("keyup",function(event){
    console.log("pressed");
    car.moveOnBoard(event,fieldArr);
  });


  $(window).on("keypress",function(){
    $("p").css("transform", "rotate(90deg)");
    $("p").css("animation", "rotate(90deg)");
  });
  $(window).on("keyup",function(){
    $("p").css("transform", "rotate(0deg)");
  });

});

function loadArr(){
  var field = [];
  for (var row = 0; row < 10; row++){
    var rowArr = [];
    for(var col = 0; col < 10; col++){
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
  this.occ = false;
  this.open = true;
  this.htmlRender = "";
}

function loadGrid(){
  for(var i = 0; i < 10; i++){
    $("#field").append("<div class='field-row row-num-"+ i +"'></div>");
  }
  for(var j = 0; j < 10; j++){
    $(".field-row").append("<td class='col-num-" + j + "'></td>");
  }
}

function Car(color,size,fieldArr){
  this.color = color;
  this.position = {
    "row": 1,
    "col": 0,
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
  this.placeOnBoard = function(){
    for(var row = this.occ.row.start; row >= this.occ.row.finish; row--){
      for(var col = this.occ.col.start; col <= this.occ.col.finish; col++){
        $(".row-num-" + row + " .col-num-" + col).addClass("player");
      }
    }
  };
  this.newCol = function(column){
    $(".col-num-" + column + " player").removeClass("player");
  };
  this.clearCol = function(column){
    $(".col-num-" + column + " player").removeClass("player");

  };
  this.clearOnBoard = function(){
    $(".row-num-" + this.position.row + " .col-num-" + this.position.col).css("background", "blue");
  };
  this.moveOnBoard = function(event,fieldArr){
    if(event.keyCode === 38){
      /////UP
      if(this.checkUp(fieldArr)){
        for(var col = this.occ.col.start; col <= this.occ.col.finish; col++){
          $(".row-num-" + (this.occ.row.finish - 1) + " .col-num-" + col).addClass("player");
          $(".row-num-" + (this.occ.row.start) + " .col-num-" + col).removeClass("player");
        }
        this.position.row--;
        this.occ.row.start--;
        this.occ.row.finish--;
      }
    }
    if(event.keyCode === 40){
      /////DOWN
      if(this.checkDown(fieldArr)){
        for(var col = this.occ.col.start; col <= this.occ.col.finish; col++){
          $(".row-num-" + (this.occ.row.start + 1) + " .col-num-" + col).addClass("player");
          $(".row-num-" + (this.occ.row.finish) + " .col-num-" + col).removeClass("player");
        }
        this.position.row++;
        this.occ.row.start++;
        this.occ.row.finish++;
      }
    }
    if(event.keyCode === 39){
      //////RIGHT
      if(this.checkRight(fieldArr)){
        for(var row = this.occ.row.start; row >= this.occ.row.finish; row--){
          $(".row-num-" + row + " .col-num-" + (this.occ.col.finish + 1)).addClass("player");
        }
        console.log(this.occ.col.start)
        $(".col-num-" + (this.occ.col.start)).removeClass("player");
        console.log(this)
        this.position.col++;
        this.occ.col.start++;
        this.occ.col.finish++;
        console.log(this);
      }
    }
    if(event.keyCode === 37){
      //////LEFT
      if(this.checkLeft(fieldArr)){
        for(var row = this.occ.row.start; row >= this.occ.row.finish; row--){
          $(".row-num-" + row + " .col-num-" + (this.occ.col.start - 1)).addClass("player");
        }
        $(".col-num-" + (this.occ.col.finish)).removeClass("player");
        this.position.col--;
        this.occ.col.start--;
        this.occ.col.finish--;
      }
    }
  };
  this.checkUp = function(fieldArr){
    for(var col = this.occ.col.start; col <= this.occ.col.finish; col++){
      if(fieldArr[(this.occ.row.finish - 1)][col].open === false){
        return false;
      }
    }
    return true;
  };
  this.checkDown = function(fieldArr){
    for(var col = this.occ.col.start; col <= this.occ.col.finish; col++){
      if(fieldArr[(this.occ.row.start + 1)][col].open === false){
        return false;
      }
    }
    return true;
  };
  this.checkRight = function(fieldArr){
    for(var row = this.occ.row.start; row >= this.occ.row.finish; row--){
      if(fieldArr[row][(this.occ.col.finish + 1)].open === false){
        return false;
      }
    }
    return true;
  };
  this.checkLeft = function(fieldArr){
    for(var row = this.occ.row.start; row >= this.occ.row.finish; row--){
      if(fieldArr[row][(this.occ.col.start - 1)].open === false){
        return false;
      }
    }
    return true;
  };
}


function buildWall(space){
  space.color = "gray";
  space.open = false;
  $(".row-num-" + space.position.row + " .col-num-" + space.position.row).addClass("wall");
}
