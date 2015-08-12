function Tile () {}

var TileType = {
    EMPTY: 0
};

Tile.create = function (x,y){
    var tile = document.createElement('div');
    tile.x = x;
    tile.y = y;
    tile.tileType = TileType.EMPTY;
    tile.style.background = 'grey';
    
    return tile;
};

Tile.reset = function (tile) {
    tile.tileType = TileType.EMPTY;
    tile.style.background = 'grey';
};

// Using selectedTileType can be problematic if there is a cluster of similar tiles
Tile.neighbours = function (tile,tiles,selectedTileType){
    var maxSize = tiles.length;
    
    var N = ((tile.y+1 < maxSize) ? tiles[tile.x][tile.y+1] : null), 
        E = ((tile.x+1 < maxSize) ? tiles[tile.x+1][tile.y] : null),
        S = ((tile.y-1 >= 0) ? tiles[tile.x][tile.y-1] : null),
        W = ((tile.x-1 >= 0) ? tiles[tile.x-1][tile.y] : null);
    
    var neighbours = [];
    
    //North
    if (N && (N.tileType == TileType.EMPTY || N.tileType == selectedTileType)){
        neighbours.push({x:N.x, y:N.y});
    }
    //East
    if (E && (E.tileType == TileType.EMPTY || E.tileType == selectedTileType)){
        neighbours.push({x:E.x, y:E.y});
    }
    //South
    if (S && (S.tileType == TileType.EMPTY || S.tileType == selectedTileType)){
        neighbours.push({x:S.x, y:S.y});
    }
    //West
    if (W && (W.tileType == TileType.EMPTY || W.tileType == selectedTileType)){
        neighbours.push({x:W.x, y:W.y});
    }
    return neighbours;
};

Tile.tilesEmpty = function (tiles){
    for(x = 0; x < tiles.length; x++){
        for(y = 0; y < tiles.length; y++){
            if(tiles[x][y].tileType != TileType.EMPTY){
                return false;
            }
        }
    }
    return true;
};