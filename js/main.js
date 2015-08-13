(function () {
    var gameArea = $('#gameArea'); //document.createElement('div');
        
//    document.body.appendChild(gameArea);
//    gameArea.classList.add('gameArea');

    var gameSize = 10;
    var tileSize = 500/gameSize;
    var tiles = new Array(gameSize);
    var selectedTiles = [];
    
    // Ranges where tiles are in play, contains 2 ranges for x and y axis
    var playAreaRange = [];
    
    var hint; // Array containing coordinate path
    var hintButton;
    
    var timePowerButton;
    
    var timeLeft;
    var maxTime;
    var timer;
    
    var progressBar;
    
    gameArea.setUp = function (){
        gameArea.createNewTiles();
        
        hintButton = document.createElement('input');
        hintButton.type = 'button';
        hintButton.value = 'Hint';
        hintButton.onclick = gameArea.showHint;
        hintButton.classList.add('hintButton');
                
        $('#buttonContainer').append(hintButton);
        
        timePowerButton = document.createElement('input');
        timePowerButton.type = 'button';
        timePowerButton.value = 'Time Power!';
        timePowerButton.onclick = gameArea.activateTimePower;
        timePowerButton.classList.add('timePowerButton');
                
        $('#buttonContainer').append(timePowerButton);
        
        
        var progressBarContainer = document.createElement('div');
        progressBarContainer.classList.add('progressBarContainer');
        $('#buttonContainer').append(progressBarContainer);

        progressBar = document.createElement('div');
        progressBar.classList.add('progressBar');
                
        $(progressBarContainer).append(progressBar);
        
        maxTime = 60;
    };
    
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
                
                gameArea.append(tile);
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
        
        playAreaRange = [[startX,startX+width],[startY,startY+height]];
        
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
        
        //Calculate hint when starting game
        hint = gameArea.checkForSolution();
        if(!hint){
            gameArea.shuffleGame();
        }
        gameArea.startTimer();
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
                    
                    // Calculate new hint
                    hint = gameArea.checkForSolution();
                    if(!hint){
                        console.log('No more solutions!');
                        if(Tile.tilesEmpty(tiles)){
                            gameArea.gameOver();
                        } else {
                            gameArea.shuffleGame();
                        }          
                    }
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
    // Based off http://buildnewgames.com/astar/
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
                            gCost = 30;
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
    
    // Checks if a solution exists and stores first solution
    gameArea.checkForSolution = function(){
        var typesChecked = [];
        var solution = null;
        
        var xRange = playAreaRange[0];
        var yRange = playAreaRange[1];
        
        for(x = xRange[0];x < xRange[1]; x++){
            for(y = yRange[0]; y < yRange[1]; y++){
//                console.log('Tiletype index: '+typeCheckedAlready);
                if(tiles[x][y].tileType != TileType.EMPTY ){//&& $.inArray(tiles[x][y].tileType,typesChecked) == -1){
//                    console.log('Checking tile at :'+x+' ' + y);
                    typesChecked.push(tiles[x][y].tileType);
                    // Check this tile against matching tiles for solution
                    solution = gameArea.checkForSolutionWithTile(tiles[x][y]);
                    if (solution){
                        return solution;
                    }
                }
            }
        }
        return null;
    };
    
    gameArea.checkForSolutionWithTile = function(tile){
        var solution = null;
        
        var xRange = playAreaRange[0];
        var yRange = playAreaRange[1];
        
        for(m = xRange[0];m < xRange[1]; m++){
            for(n = yRange[0]; n < yRange[1]; n++){
                if(tiles[m][n].tileType == tile.tileType && (tile.x != m || tile.y != n)){
                    solution = gameArea.searchPath(tiles[m][n],tile);
                    if (solution.length > 0){
                        return solution;
                    }
                }
            }
        }
        
        return null;
    };
    
    gameArea.shuffleGame = function(){
        Tile.shuffleGameTiles(tiles);
        hint = gameArea.checkForSolution();
        if(!hint){
            gameArea.shuffleGame();
        }
        
    };
    
    gameArea.showHint = function(){
        if(hint){
            $.each(hint,function(index, value){
                var blinkTile = tiles[value[0]][value[1]];
                $(blinkTile).addClass('blinkGreen');

                $(blinkTile).bind('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function (e) {               
                    $(blinkTile).removeClass('blinkGreen'); 
                });
            });
        }
    };
    
    gameArea.gameOver = function(){
        clearInterval(timer);
        $(progressBar).removeClass('countDown'); 
        progressBar.offSetWidth = progressBar.offsetWidth;
        // Show score
        
        // Start new game
        gameArea.setGameTiles(6,6);
    }
    
    gameArea.activateTimePower = function(){
        timeLeft = Math.min(timeLeft+10, maxTime);
        $(progressBar).removeClass('countDown'); 
        
        // https://css-tricks.com/restart-css-animation/
        progressBar.offSetWidth = progressBar.offsetWidth;
        
        progressBar.style.width = ((timeLeft / maxTime) * 100) + '%';
        
        $(progressBar).addClass('countDown');
        progressBar.style.animationDuration = timeLeft + 's';
    };
    
    gameArea.startTimer = function(){
        timeLeft = maxTime;
        
        progressBar.style.width = '100%';
        $(progressBar).addClass('countDown');
        progressBar.style.animationDuration = timeLeft + 's';
        
        $(progressBar).bind('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function (e) {               
            gameArea.gameOver();
        });

        timer = setInterval(function(){
            timeLeft--;
        },1000);
    };
            
    gameArea.setUp();
    gameArea.setGameTiles(6, 6);
    
})();