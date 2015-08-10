(function () {
    var gameArea = document.createElement('div');
    

        
    document.body.appendChild(gameArea);
    gameArea.classList.add('gameArea');


    
    var gameSize = 10;
    var tileSize = 500/gameSize;
    var tiles = new Array(gameSize);
    
    var TileType = {
        EMPTY: 0
    };
    
    gameArea.createNewTiles = function () {        
        for (x = 0; x < gameSize; x++){
            
            var column = new Array(gameSize);
            
            for (y = 0; y < gameSize; y++) {
                
                // Create and place tile
                var tile = document.createElement('div');
                tile.tileType = TileType.EMPTY;
                
                tile.style.width = tileSize + 'px';
                tile.style.height = tileSize + 'px';
                
                tile.style.left = (gameArea.offsetLeft + tileSize * x) + 'px';
                tile.style.top = (gameArea.offsetTop + tileSize * y) + 'px';
                
                document.body.appendChild(tile);
                tile.classList.add('tile');
                column[y] = tile;
            }
            
            tiles[x] = column;
        }
    };
    
    gameArea.setGameTiles = function (width, height) {
        // Check that width * height is even and each smaller than the gameSize
        //  Random colour:  "#"+((1<<24)*Math.random()|0).toString(16);
        var startX = gameSize/2 - width/2;
        var startY = gameSize/2 - height/2;
        
        var numTypes = (width * height) * 2;
        
        for (x = startX; x < startX+width; x++){
            for(y = startY; y < startY+height; y++){
                tiles[x][y].style.background = 'red';
            }
        }

    };
    
    gameArea.createNewTiles();
    gameArea.setGameTiles(6, 6);
    console.log(tiles);
    
})();