function Util() {}

Util.direction = {
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3
};

Util.arrayShuffle = function (array) {
    
    var shuffled = [];
    var arraySize = array.length;
    var temp;

    for (i = 0; i < arraySize; i++) {
        
        var k = Math.floor(Math.random() * array.length);

        // Swap random value at k with last
        temp = array[k];
        array[k] = array[array.length -1];
        array[array.length -1] = temp;
        
        shuffled.push(array.pop());
    }
    
    return shuffled;
};

Util.manhattanDistance = function (x1,y1,x2,y2) {
    return Math.abs(x2-x1) + Math.abs(y2-y1);
};

// Returns the side an adjacent tile is located
Util.adjacentDirection = function(x1,y1,x2,y2) {
    if(y1<y2) return Util.direction.NORTH;
    if(x1<x2) return Util.direction.EAST;
    if(y1>y2) return Util.direction.SOUTH;
    if(x1>x2) return Util.direction.WEST;
};


function Node(Parent, Point)
{
    var newNode = {
        // pointer to another Node object
        Parent:Parent,
        
        // the location coordinates of this Node
        x:Point.x,
        y:Point.y,
        // the distanceFunction cost to get
        // TO this Node from the START
        f:0,
        // the distanceFunction cost to get
        // from this Node to the GOAL
        g:0
    };

    return newNode;
};

Util.initialize2dArray = function (x,y) {
    var twoDArr = [];
    for(i = 0; i < x; i++){
        twoDArr.push(new Array(y));
    }
    return twoDArr;
};
