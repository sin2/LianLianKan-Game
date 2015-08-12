(function () {
    var gameArea = document.createElement('div');
        
    document.body.appendChild(gameArea);
    gameArea.classList.add('gameArea');

    var gameSize = 10;
    var tileSize = 500/gameSize;
    var tiles = new Array(gameSize);
    var selectedTiles = [];
    
    gameArea.createNewTiles = function () {        
        for (x = 0; x < gameSize; x++){
            
            var column = new Array(gameSize);
            
            for (y = 0; y < gameSize; y++) {
                
                // Create and place tile
                var tile = Tile.create(x,y);
                
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

                var result = gameArea.searchPath(selectedTiles[0],selectedTiles[1]);
                $.each(result,function(index, value){
                    var blinkTile = tiles[value[0]][value[1]];
                    $(blinkTile).addClass('blinkRed');
                    
                    $(blinkTile).bind('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function (e) {               
                        $(blinkTile).removeClass('blinkRed'); 
                    });
                    

                });

                if (result.length){
                    Tile.reset(selectedTiles[0]);
                    Tile.reset(selectedTiles[1]);
                }
            }
            
            // Reset Selection
            selectedTiles = [];
        }
        
        else if(selectedTiles.length > 2){
            selectedTiles = [];
        }
        
    };
    
    // Start and End are tiles
    gameArea.searchPath = function (start,end){
        var startNode = Node(null, {x:start.x,y:start.y});
        var endNode = Node(null, {x:end.x, y:end.y});
        
        var AStar = Util.initialize2dArray(gameSize,gameSize);
        
        var open = [startNode];
        var closed = [];
        var result = [];
        var neighbours;
        var currentNode;
        var pathNode;
        var length,max,min,i,j;
        
        // Go through open list
        while(length = open.length){
            max = gameSize * gameSize;
            min = -1;
            for(i = 0; i < length; i++){
				if(open[i].f < max){
					max = open[i].f;
					min = i;
				}
			}
            currentNode = open.splice(min,1)[0];
            
            // Current node is end node
            if(currentNode.x == endNode.x && currentNode.y == endNode.y){
                pathNode = closed[closed.push(currentNode) -1];
                do{
                    result.push([pathNode.x, pathNode.y]);
                } while (pathNode = pathNode.Parent);
                
                closed = open = [];
                AStar = Util.initialize2dArray(gameSize,gameSize);
                result.reverse(); // I don't think this is needed
                
                // If path contains >2 bends then don't return a path
                if(Util.numberOfBends(result) > 2){
                    console.log('Too many turns!');
                    return [];
                }
            }
            // Current node is not the end node
            else{
                neighbours = Tile.neighbours(tiles[currentNode.x][currentNode.y], tiles, start.tileType);
                
                for(i = 0, j = neighbours.length; i < j; i++){
                    
                    var gCost = 1;
                    var currParent = currentNode.Parent;
                    var originalDirection = ((currParent) ? Util.adjacentDirection(currParent.x,currParent.y,currentNode.x,currentNode.y) : null);
                    
					pathNode = Node(currentNode, neighbours[i]);
					if (!AStar[pathNode.x][pathNode.y]){
                        
                        var newDirection = Util.adjacentDirection(currentNode.x,currentNode.y,neighbours[i].x,neighbours[i].y);
                        
                        if(originalDirection && originalDirection != newDirection){
                            // Add a cost to change direction
                            gCost = 25;
                        }
                        
						// estimated cost of this particular route so far (g)                        
//						pathNode.g = currentNode.g + Util.manhattanDistance(neighbours[i].x,neighbours[i].y, currentNode.x,currentNode.y);
                        pathNode.g = currentNode.g + gCost;
						// estimated cost of entire guessed route to the destination (h)
						pathNode.f = pathNode.g + Util.manhattanDistance(neighbours[i].x,neighbours[i].y, endNode.x, endNode.y);
						// remember this new path for testing above
						open.push(pathNode);
						// mark this node in the world graph as visited
						AStar[pathNode.x][pathNode.y] = true;
					}
				}
                closed.push(currentNode);
            }
        }
        return result;
    }
    
    
    gameArea.createNewTiles();
    gameArea.setGameTiles(6, 6);
    
})();