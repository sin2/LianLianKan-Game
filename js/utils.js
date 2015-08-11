function Util() {}

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

Util.resetTile = function (tile) {
    tile.tileType = 0;
    tile.style.background = 'grey';
};