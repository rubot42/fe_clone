//javascript code for basic grid that can be interacted with
//created by Evan Bedser

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
class Box{
    constructor(x,y,size){
        this.x = x;
        this.y = y;
        this.top = x;
        this.bottom = x+size;
        this.left = y;
        this.right = y+size;
        this.size = size;
        this.tl = [x,y];
        this.tr = [x+size,y];
        this.bl = [x,y+size];
        this.br = [x+size,y+size];
        this.corners = [this.tl, this.tr, this.bl, this.br];
    }
    inBox(x,y){//left<=x<=right top<=y<=bottom
        return((this.left <= x)&&(x <= this.right)&&(this.top <= y)&&(y <= bottom));
    }

}
class Grid{
    constructor(xSize,ySize,boxSize){
        this.xSize = xSize;
        this.ySize = ySize;
        this.boxSize = boxSize;
        this.boxList=[];
        this.boxArray = [];
        for(var x = 0; x<xSize;x++){
            var row = [];
            for(var y = 0; y<ySize; y++){
                this.boxList.push(new Box(x*boxSize,y*boxSize,boxSize));
                row.push(new Box(x*boxSize,y*boxSize,boxSize));
            }
            this.boxArray.push(row);
        }
    }

    /*returns the box object at the coordinate in the grid*/
    getBoxAt(x,y){
        return this.boxArray[x][y];
    }

    /*changes the color of the box at the coordinate*/
    changeColorAt(ctx,x,y,color){
        var aBox = this.getBoxAt(x,y);
        ctx.fillStyle = color;
        ctx.fillRect(aBox.x,aBox.y,aBox.size,aBox.size);
    }

    /*prints out the grid. testing version*/
    printGridTest(ctx, color){
        ctx.fillStyle = color;
        for(var i = 0; i < this.boxList.length; i++){
            var aBox = this.boxList[i];
            ctx.fillRect(aBox.x,aBox.y,this.boxSize,this.boxSize);
        }
    }
    /*Takes the x and y coordinates from getMousePos and returns the array location (x,y)*/
    canvasPosToCoord(x,y){
        return([(Math.floor(x/this.boxSize)),(Math.floor(y/this.boxSize))]);
    }
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}
//testing
grid1 = new Grid(32,32,16);
grid1.printGridTest(ctx,"blue");
document.getElementById("info").innerHTML = "test";
window.addEventListener("click",paintTest);
function posTest(evt){
    var x = getMousePos(myCanvas, evt).x;
    var y = getMousePos(myCanvas, evt).y;
    document.getElementById("info").innerHTML = grid1.canvasPosToCoord(x,y);
}
function paintTest(evt){
    var x = getMousePos(myCanvas, evt).x;
    var y = getMousePos(myCanvas, evt).y;
    var coord =grid1.canvasPosToCoord(x,y);
    document.getElementById("info").innerHTML = coord;
    grid1.changeColorAt(ctx,coord[0],coord[1],"green");
}
