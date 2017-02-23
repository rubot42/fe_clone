//javascript code for basic grid that can be interacted with
//created by Evan Bedser

//used to show map/tiles (not frequently updated)
var mapCanvas = document.getElementById("mapLayer");
var mapCtx = mapCanvas.getContext("2d");
//used to show units (frequently updated)
var unitCanvas = document.getElementById("unitLayer");
var unitCtx = unitCanvas.getContext("2d");
//effect layer
var effectCanvas = document.getElementById("effectLayer");
var effectCtx = unitCanvas.getContext("2d");
/*
 _ = plains
 W = water
 C = cliff
 B = bridge

 */
map1 = [
    "MMMMMMMfvvv______Rf____f____",
    "MMMMMff_vvv______B_f__HH____",
    "MMMMMf__vVv__C___R____CCCC__",
    "f_f___fH____C____R__________",
    "===____CCCCCf____RRRR_______",
    "===_________________B_______",
    "=G=__________f______R_______",
    "_______f__ff____f___W__C____",
    "______f_____________WCCWWWWC",
    "__________f___ff__CCWWWWWWWW",
    "________C___f______WWWWWWWWW",
    "C___f___CC_________WWWWWWWWW",
    "WCC_fvvv_HC_______WWWWWW__WW",
    "WWWf_vvv___H__CWWWWWWW_WCCWW",
    "WWW__vVv______WWWWWWW_F_WWWF",
    "WWWC_________CWWWWWWW___WWC_",
    "WWWW________CWWWWF_WWWWWWWW_"
    ];
class Box{
    constructor(x,y,size, name, moveCost){
        this.x = x;
        this.y = y;
        this.top = x;
        this.bottom = x+size;
        this.left = y;
        this.right = y+size;
        this.size = size;
        this.name = name || "none";
        this.moveCost = moveCost || 1;
        /*
        this.tl = [x,y];
        this.tr = [x+size,y];
        this.bl = [x,y+size];
        this.br = [x+size,y+size];
        this.corners = [this.tl, this.tr, this.bl, this.br];
         */
        this.occupied = false;
        this.occupiedBy = null;
    }
    toString(){
        return this.name + " " + this.moveCost;
    }
}

class Grid{
    constructor(xSize,ySize,boxSize){
        this.xSize = xSize;
        this.ySize = ySize;
        this.boxSize = boxSize;
        //this.boxList=[];
        this.boxArray = [];
        //this.moveCostArray=[];
        for(var x = 0; x<xSize;x++){
            var row = [];
            var moveCostRow = [];
            for(var y = 0; y<ySize; y++){
                //this.boxList.push(new Box(x*boxSize,y*boxSize,boxSize));
                row.push(new Box(x*boxSize,y*boxSize,boxSize));
                //moveCostRow.push(1);
            }
            this.boxArray.push(row);
            //this.moveCostArray.push(moveCostRow);
        }
    }

    /*returns true if the x and y are in the grid*/
    inGrid(x,y){
        return ((x >= 0) && (x < this.xSize) && (y >= 0) && (y < this.ySize));
    }

    /*returns the box object at the coordinate in the grid*/
    getBoxAt(x,y){
        if(this.inGrid(x,y)){
            return this.boxArray[x][y];
        }
        else{
            throw new Error("this is not in the grid");
        }
    }

    /*changes the color of the box at the coordinate*/
    changeColorAt(context,x,y,color){
        var aBox = this.getBoxAt(x,y);
        context.fillStyle = color;
        context.fillRect(aBox.x,aBox.y,aBox.size,aBox.size);
    }

    /*Takes the x and y coordinates from getMousePos and returns the array location (x,y)*/
    canvasPosToCoord(x,y){
        var newX = (Math.floor(x/this.boxSize));
        var newY = (Math.floor(y/this.boxSize));
        if(this.inGrid(newX, newY)){
            return [newX, newY];
        }
        else{
            return [-1, -1];
        }
    }
    cursorHighlight(){
        effectCtx.clearRect(0,0,effectCanvas.width,effectCanvas.height);
        if(this.inGrid(mouseX, mouseY)){
            this.changeColorAt(effectCtx, mouseX,mouseY,"rgba(255, 255, 255, 0.5)");
        }
    }

    addDetail(aMap){
        for(var yi = 0; yi < this.ySize; yi++){
            for(var xi = 0; xi < this.xSize; xi++){
                this.getBoxAt(xi,yi).name = aMap[yi][xi];
                switch(this.getBoxAt(xi,yi).name){
                case "_":
                    this.getBoxAt(xi,yi).name = "land";
                    this.getBoxAt(xi,yi).moveCost = 1;
                    break;
                case "W":
                    this.getBoxAt(xi,yi).name = "water";
                    this.getBoxAt(xi,yi).moveCost = -1;
                    break;
                case "R":
                    this.getBoxAt(xi,yi).name = "river";
                    break;
                case "C":
                    this.getBoxAt(xi,yi).name = "cliff";
                    this.getBoxAt(xi,yi).moveCost = -1;
                    break;
                case "M":
                    this.getBoxAt(xi,yi).name = "mountain";
                    this.getBoxAt(xi,yi).moveCost = 4;
                    break;
                case "B":
                    this.getBoxAt(xi,yi).name = "bridge";
                    this.getBoxAt(xi,yi).moveCost = 1;
                    break;
                case "f":
                    this.getBoxAt(xi,yi).name = "forest";
                    this.getBoxAt(xi,yi).moveCost = 2;
                    break;
                case "F":
                    this.getBoxAt(xi,yi).name = "fort";
                    this.getBoxAt(xi,yi).moveCost = 2;
                    break;
                case "H":
                    this.getBoxAt(xi,yi).name = "house";
                    this.getBoxAt(xi,yi).moveCost = 1;
                    break;
                case "=":
                    this.getBoxAt(xi,yi).name = "wall";
                    this.getBoxAt(xi,yi).moveCost = -1;
                    break;
                case "|":
                    this.getBoxAt(xi,yi).name = "fence";
                    this.getBoxAt(xi,yi).moveCost = -1;
                    break;
                case "V":
                    this.getBoxAt(xi,yi).name = "village gate";
                    this.getBoxAt(xi,yi).moveCost = 1;
                    break;
                case "v":
                    this.getBoxAt(xi,yi).name = "village";
                    this.getBoxAt(xi,yi).moveCost = -1;
                    break;
                case "G":
                    this.getBoxAt(xi,yi).name = "gate";
                    this.getBoxAt(xi,yi).moveCost = 1;
                    break;
                default:
                    this.getBoxAt(xi,yi).name = "none";
                    this.getBoxAt(xi,yi).moveCost = 1;
                }
            }
        }
    }
}

unitList = [];
class Unit{
    constructor(name,aGrid,color, x, y, mov, team){
        this.name = name;
        this.x = x;
        this.y = y;
        this.color = color;
        this.visible = true;
        this.mov = 0 || mov;
        this.team = team;
        aGrid.getBoxAt(x,y).occupied = true;
        aGrid.getBoxAt(x,y).occupiedBy = this;
        unitList.push(this);
    }
    toString(){
        return this.name;
    }
    renderUnit(aGrid){
        if(this.visible){
            aGrid.changeColorAt(unitCtx,this.x,this.y,this.color);
        }
    }
    moveUnit(aGrid,x,y){
        if(!grid1.getBoxAt(x,y).occupied){
            grid1.getBoxAt(this.x,this.y).occupiedBy = null;
            grid1.getBoxAt(this.x,this.y).occupied = false;
            grid1.getBoxAt(x,y).occupiedBy = this;
            grid1.getBoxAt(x,y).occupied = true;
            this.x=x;
            this.y=y;
        }
    }
    potentialMoveGrid(mov,grid){
        var x = this.x;
        var y = this.y;
        var graph=[];
        for(var bx = 0-mov; bx <= 0; bx++){
            for(var ax = 0-mov-bx; ax<=mov+bx;ax++){
                if(grid.inGrid(x-ax,y-bx) && ((ax !== 0)||(bx !== 0))){
                    graph.push([x-ax,y-bx]);
                }
            }
        }
        for(var bx = 1; bx <= mov; bx++){ 
            for(var ax = 0-mov+bx; ax<=mov-bx;ax++){
                if(grid.inGrid(x-ax,y-bx) && ((ax !== 0)||(bx !== 0))){
                    graph.push([x-ax,y-bx]);
                }
            }
        }
        return graph;
    }

    //currently working on
    advancedMoveGrid(grid){
        var checkList = [];
        var checkDict = {};
        var checked = [];
        //first position is starting position of unit
        checkList.push([this.x,this.y,0]);

        while(checkList.length > 0){
            var aX = checkList[0][0];
            var aY = checkList[0][1];
            var aM = checkList[0][2];
            if((grid.getBoxAt(aX,aY).moveCost === -1)||(aM > this.mov*2)){
                checkList = checkList.slice(1,checkList.length);
                continue;
            }
            checkDict[[aX,aY]]=aM+grid.getBoxAt(aX,aY).moveCost;
            if(!([aX,aY] in checked)){
                checked.push([aX,aY]);
            }
            var afterMove = checkDict[[aX,aY]];
            var nextList = [[aX+1, aY],[aX-1, aY],[aX, aY+1],[aX, aY-1]];
            //console.log(nextList);//testing
            for(var i = 0; i < nextList.length; i++){
                var bX = nextList[i][0];
                var bY = nextList[i][1];
                var free = true;
                var newMove = 0;
                if(grid.inGrid(bX,bY)){
                    if(grid.getBoxAt(bX,bY).occupied){
                        free = grid.getBoxAt(bX,bY).occupiedBy.team == this.team;
                        free = free && (grid.getBoxAt(bX,bY).occupiedBy != this);
                    }
                }
                else{
                    free = false;
                }
                if(free){
                    newMove = afterMove + grid.getBoxAt(bX,bY).moveCost;
              /*      console.log(afterMove);
                    console.log("new");
                    console.log(newMove);*/
                    free = (newMove > afterMove) && (newMove <= this.mov*2) && (newMove > 0) ;
                    //free = free && ([bX,bY in checkDict]);
                    if([bX,bY] in checkDict){
                        free = free && (newMove < checkDict[[bX,bY]]);
                    }
                }
                else{
                }
                if(free){
                    checkList.push([bX,bY,newMove]);
                    if(!([bX,bY] in checked)){
                        checked.push([bX,bY]);
                    }
                    //console.log(checkList[checkList.length-1]);
                }
            }
            checkList = checkList.slice(1,checkList.length);
            //console.log(checkList.length);
        }
        return checked;
    }
}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

var mousePosition = [-1,-1], mouseX = -1, mouseY = -1;
var clickX = -1, clickY = -1;
function updateMousePosition(evt){
    var x = getMousePos(mapCanvas, evt).x;
    var y = getMousePos(mapCanvas, evt).y;
    mousePosition = grid1.canvasPosToCoord(x,y);
    mouseX = mousePosition[0];
    mouseY = mousePosition[1];
}
function getClick(evt){
    var x = getMousePos(mapCanvas, evt).x;
    var y = getMousePos(mapCanvas, evt).y;
    var clickPosition = grid1.canvasPosToCoord(x,y);
    clickX = clickPosition[0];
    clickY = clickPosition[1];
}

//background image
var imageObj = new Image();
imageObj.onload = function(){
    mapCtx.drawImage(imageObj,0,0);
};
imageObj.src= 'http://www.fe-online.co.uk/fe7/images/maps/14.jpg';

//testing
window.addEventListener("mousemove",updateMousePosition);
window.addEventListener("mousedown",getClick);
//initializing a unit
grid1 = new Grid(28,17,16); //a vital object in the code. grid1 is utilized in functions
grid1.addDetail(map1);
var info = "";
var selection = null;
unit1 = new Unit("friendly unit",grid1,"rgba(0,0,255,.7)",5,5,8,1);
unit2 = new Unit("enemy unit",grid1,"rgba(255, 0, 0, .7)",7,10,5,2);
unit3 = new Unit("neutral unit",grid1,"rgba(0, 255, 0 ,.7)", 11, 5,4,1);
var moveGraph = [];
function inMoveGraph(x,y){
    var outcome = false;
    for(var i = 0; i<moveGraph.length;i++){
        if(moveGraph[i][0] == x && moveGraph[i][1] == y){
            outcome = true;
        }
    }
    return outcome;
}
function updateGame(){
    if(grid1.inGrid(clickX,clickY)){
        if(selection === null){
            selection = grid1.getBoxAt(clickX,clickY).occupiedBy;
            if(selection !== null){
                // moveGraph = selection.potentialMoveGrid(selection.mov,grid1);
                moveGraph = selection.advancedMoveGrid(grid1);
            }
            clickX = -1;
            clickY = -1;
        }
        else if((selection.x == clickX)&&(selection.y == clickY)){
            selection = null;
            moveGraph = [];
            clickX = -1;
            clickY = -1;
        }
        else if(selection !== null && inMoveGraph(clickX,clickY)){
            selection.moveUnit(grid1,clickX,clickY);
            selection = null;
            moveGraph = [];
            clickX = -1;
            clickY = -1;
        }
    }

}
function drawGame(){
    //update
    info = "("+mousePosition+")";
    if (selection !== null){
        info += selection;
    }
    else if(grid1.inGrid(mouseX,mouseY)){
        info += grid1.getBoxAt(mouseX,mouseY);
    }
    else{
        info += "out of map";
    }
    document.getElementById("info").innerHTML =info;
    grid1.cursorHighlight();
    for(var i = 0; i < unitList.length; i++){
        unitList[i].renderUnit(grid1);
    }
    var moveSelected = [];
    for(var z = 0; z < moveGraph.length; z++){
        if(moveGraph[z] in moveSelected){
        }
        else{
            moveSelected.push(moveGraph[z]);
            grid1.changeColorAt(effectCtx,moveGraph[z][0],moveGraph[z][1],"rgba(255,255,255,.5)");
        }
    }

}

var ONE_FRAME_TIME = 1000 / 60 ;
var mainloop = function() {
    updateGame();
    drawGame();
    };
setInterval( mainloop, ONE_FRAME_TIME );
