(function () {
    var gameArea = document.createElement('div');
        
    document.body.appendChild(gameArea);
    gameArea.classList.add('gameArea');

    var gameSize = 10;
    var tileSize = 500/gameSize;
    var tiles = new Array(gameSize);
    var selectedTiles = [];
    
    var TileType = {
        EMPTY: 0
    };
    
    gameArea.createNewTiles = function () {        
        for (x = 0; x < gameSize; x++){
            
            var column = new Array(gameSize);
            
            for (y = 0; y < gameSize; y++) {
                
                // Create and place tile
                var tile = document.createElement('div');
                Util.resetTile(tile);
                
//                tile.addEventListener('click', gameArea.tileClicked);
                $(tile).click(gameArea.tileClicked);
                
                tile.style.width = tileSize + 'px';
                tile.style.height = tileSize + 'px';
                
                tile.style.left = ( tileSize * x) + 'px';
                tile.style.top = (tileSize * y) + 'px';
                
                gameArea.appendChild(tile);
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
        
        var numPairs = (width * height) / 2;
        var typeArray = gameArea.createTypeArray(numPairs);
        
        for (x = startX; x < startX+width; x++){
            for(y = startY; y < startY+height; y++){
                
                // type is an array [int,colour]
                var type = typeArray.pop();
                
                tiles[x][y].tileType = type[0];
                tiles[x][y].style.background = type[1];
            }
        }

    };
    
    gameArea.createTypeArray = function (numPairs) {
        
        var types = [];
        
        // Start at 1 becuase 0 means empty tile
        for (x = 1; x <= numPairs; x++) {
            
            var colour = Colours.random();
            var tileType = x;
            
            $.each(types,function(index,value){
                if(colour == value[1]){
                    tileType = value[0];
                    console.log('Duplicate colour');
                }
            });
            
            var item = [tileType, colour];
            types.push(item,item);
        }
        return Util.arrayShuffle(types);
    };
    
    gameArea.tileClicked = function (event){
        
        var clickedTile = event.currentTarget;
        
        // Tile is not empty tile
        if(clickedTile.tileType != TileType.EMPTY){
            selectedTiles.push(clickedTile);
        }
        
        if(selectedTiles.length == 2){
            
            // Tiles are the same
            if (selectedTiles[0] == selectedTiles[1]){

            }
            
            // Tiles are the same type
            else if (selectedTiles[0].tileType == selectedTiles[1].tileType){
                // Confirm valid match
                Util.resetTile(selectedTiles[0]);
                Util.resetTile(selectedTiles[1]);
            }
            
            // Reset Selection
            selectedTiles = [];
        }
        
        else if(selectedTiles.length > 2){
            selectedTiles = [];
        }
        
    };
    
    
    gameArea.createNewTiles();
    gameArea.setGameTiles(6, 6);
    
})();