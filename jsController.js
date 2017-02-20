// (c) Eilidh Southren 2017. Use freely. Go nuts. If you make millions, come find me.

var flipJs = angular.module('flipJs', ['ngAnimate', 'firebase']);

flipJs.controller('flipController', function flipController($scope, $location, $firebase) {    
    
    // Initialise scope variables
    $scope.coveredImage = "covered.png";
    $scope.emptyImage = "empty.png";
    $scope.squareSize = 30;

    $scope.HEIGHT = 3;
    $scope.LENGTH = 3;
    $scope.clicks = 0;
    
    $scope.difficultyToggle = true;
    $scope.welcomeToggle = false;
    $scope.newGameToggle = true;
    $scope.whiteSpaceToggle = false;
    $scope.menuToggle = true;
    $scope.winToggle = true;
    $scope.gridToggle = true;
    $scope.instructionButtonText = "Get Started";
    $scope.gameActive = false;
    $scope.minefieldClass = "minefieldSmallTd"; 
    $scope.winMessage = "boop"; 
    $scope.scoresToggle = true;
    $scope.newHighScore = false;
    $scope.noNewHighScore = true;    
    $scope.userName = "your name";    
    
    // --------------------------- FIREBASE BITS ----------------------
    
    var fireRef = new Firebase('https://flipjs-71ead.firebaseio.com/');
    
    $scope.difficulty = "easy";
    
    // Create array of scores based on current Difficulty selected
    var scores = fireRef.child($scope.difficulty); 
    $scope.scores = $firebase(scores).$asArray();
    
    var categoryType = "scores"; // to change category style in $watch function

	$scope.$watch(categoryType, function(){    
        // Count current number of scores in category 
		var total = 0;
		$scope.scores.forEach(function(scores){
           total++;
		});
        
        $scope.max = 0;        
        // Find the maximum current score for 'new high score?' comparison
        for (var i = 0; i < $scope.scores.length; i++) {
            if ($scope.scores[i].score > $scope.max) {
                 $scope.max = $scope.scores[i].score;
                 $scope.maxObj = $scope.scores[i];
            }
        }
		$scope.totalScores = total;	
    }, true);
 
    // Switch Categories 
    
    $scope.catEasy = function() {
        $scope.difficulty = "easy";
         var scores = fireRef.child($scope.difficulty);
         $scope.scores = $firebase(scores).$asArray();
         $scope.scores.sort(); 
    };
    
    $scope.catMed = function() {
        $scope.difficulty = "medium";
        var scores = fireRef.child($scope.difficulty);
        $scope.scores = $firebase(scores).$asArray();
    };
    
    $scope.catDiff = function() {
        $scope.difficulty = "difficult";
        var scores = fireRef.child($scope.difficulty);
         $scope.scores = $firebase(scores).$asArray();
        
    };
	
	$scope.catLeg = function() {   // Legendary category 
	   $scope.difficulty = "legendary";
	   var scores = fireRef.child($scope.difficulty);
	   $scope.scores = $firebase(scores).$asArray();
    };
    
    // Add new High Score
	$scope.addScore = function(){      
       
        // If number of scores is less than 5, add score immediately
        if ($scope.totalScores < 5)  {
            $scope.scores.$add({
                name: $scope.userName,    // user input name
                score: $scope.clicks // score = number of clicks 
            });
        }
        else {
            // if new score is smaller than the max, add to database
            if ($scope.clicks <= $scope.max) {
                $scope.scores.$add({
                    name: $scope.userName,    // user input name
                    score: $scope.clicks // $clicks
                });
                // then remove the old worst score
                for (var i = 0; i < $scope.scores.length; i++) {
                    if ($scope.scores[i].score == $scope.max) {
                        $scope.scores.$remove($scope.scores[i]);
                        break;
                    }
                }            
            }        
        }
        $scope.scoresToggle = false;
        $scope.newGame();
	};   
    
    // -------------------- // END OF FIREBASE GIBBLETS ---------------------------------
    
   
    // creating a new gameplay grid based on difficulty selection
    $scope.difficultyButton = function(length, height, squareSize) {            
            
        $scope.HEIGHT = height;
        $scope.LENGTH = length;
        $scope.minefield = createMinefield(length, height);
        $scope.clicks = 0;
        $scope.difficultyToggle = true;
        $scope.newGameToggle = false;
        $scope.whiteSpaceToggle = ($scope.whiteSpaceToggle) ? false : true;
        $scope.squareSize = squareSize;
        $scope.gridToggle = false;
        $scope.gameActive = true;
        $scope.size = length;
        $scope.gridStyle = "width: {{ ($scope.HEIGHT)*100 }}";

        if (length === 3) {
            $scope.minefieldClass = "minefieldSmallTd";
            $scope.difficulty = "Easy";
            $scope.winMessage = "> Getting there! Why not try Medium?";
        }
        else if (length === 5) {
            $scope.minefieldClass = "minefieldMediumTd";
            $scope.difficulty = "Medium";              
            $scope.winMessage = "> Now you're getting somewhere!";
        }
        else if (length === 7) {
            $scope.minefieldClass = "minefieldDifficultTd";
            $scope.difficulty = "Difficult";
            $scope.winMessage = "> Hardcore! Well done.";
        }
        else if (length === 10) {
            $scope.minefieldClass = "minefieldHecticTd";
            $scope.difficulty = "Legendary";
            $scope.winMessage = "YOU LEGEND!";
        }
    }
    
    // tester method providing shortcut to a Win, sneaky sneak
    $scope.winShortcut = function() {
        allActive = true;
        $scope.winToggle = false;
    }
        
    $scope.getStartedButton = function() {
        
        $scope.welcomeToggle = true;        
        // if game is not currently happening
        if (!$scope.gameActive) {
            $scope.difficultyToggle = false;            
        }
         else {        
            $scope.whiteSpaceToggle = false;
            $scope.gridToggle = false;        
            $scope.difficultyToggle = true;
        }
        
    }
    
    // Open or Close Menu
    $scope.menuButton = function() {
        $scope.menuToggle = ($scope.menuToggle) ? false : true;     
    }
    
    // Open or close High Scores
    $scope.closeScores = function() {
        $scope.scoresToggle = ($scope.scoresToggle) ? false : true;
    }
   
    $scope.setLayout = function() {
        $scope.whiteSpaceToggle = true;       
       
        // if there is not a current game
        if (!$scope.gameActive) {
            $scope.difficultyToggle = false;
            $scope.gridToggle = true;
            $scope.newGameToggle = true;
        }
        // if a game is currently running
        else {
            $scope.difficultyToggle = false;
            $scope.gridToggle = false;              
            $scope.newGameToggle = false;
        }
    }
  
    // open or close Instructions popup
    $scope.instructionButton = function() {
        
        $scope.menuToggle = ($scope.menuToggle) ? false : true;       
        $scope.welcomeToggle = false;
        
        if ($scope.gameActive) {
            $scope.gridToggle = true;
            $scope.instructionButtonText = "Return to Game";
            $scope.whiteSpaceToggle = false;
        }
        else {
            $scope.difficultyToggle = true;
            $scope.whiteSpaceToggle = false;
            $scope.instructionButtonText = "Get Started";
        }
    }
    
    // change colour schemes
    $scope.greenScheme = function() {
        $scope.menuButton(); 
        $scope.coveredImage = "greenCovered.png";
        $scope.emptyImage = "greenEmpty.png";        
    }
    $scope.blueScheme = function() {
        $scope.menuButton(); 
        $scope.coveredImage = "covered.png";
        $scope.emptyImage = "empty.png";        
    }        
    $scope.redScheme = function() {
        $scope.menuButton(); 
        $scope.coveredImage = "redCovered.png";
        $scope.emptyImage = "redEmpty.png";    
    }  
    
    $scope.newGame = function() {
       
        $scope.welcomeToggle = true;
        $scope.menuToggle = true;
        $scope.gameActive = false;
        $scope.newHighScore = true;
        $scope.userName = "your name";
        $scope.setLayout();
        if (!$scope.winToggle) { $scope.winToggle = true; }        
    }
   
    
// --------------- GAME MECHANICS ---------------------------------------
    
    // flip north/south/east/west squares of selected spot
    $scope.doSouth = function(x,y) {
        $scope.south = getSpot($scope.minefield, x, (y+1));
        $scope.south.isCovered = ($scope.south.isCovered) ? false : true;
    }
    $scope.doEast = function(x,y) {
        $scope.east = getSpot($scope.minefield, (x+1), y);
        $scope.east.isCovered = ($scope.east.isCovered) ? false: true;
    }
    $scope.doNorth = function(x,y) {
        $scope.north = getSpot($scope.minefield, x, (y-1));
        $scope.north.isCovered = ($scope.north.isCovered) ? false : true;
    }
    $scope.doWest = function(x,y) {
        $scope.west = getSpot($scope.minefield, (x-1), y);
        $scope.west.isCovered = ($scope.west.isCovered) ? false : true;
    }
    
    // check if the user has won, called every click
    $scope.hasWon = function() {
       
        allActive = true;
        allDeactive = true;
     
        for (var i = 0; i < $scope.HEIGHT; i++) {
            for (var j = 0; j < $scope.LENGTH; j++) {
                thisSpot = getSpot($scope.minefield, j, i);
                if (thisSpot.isCovered) { 
                    allDeactive = false;
                } else if (!thisSpot.isCovered) {
                    allActive = false;
                }
            }
        }
        
        if (allDeactive || allActive) {
            if ($scope.clicks <= $scope.max) {
                $scope.newHighScore = false;
                $scope.noNewHighScore = true;
            } else {
                $scope.newHighScore = true;
                $scope.noNewHighScore = false;
            }
            $scope.winToggle = false;          
        }     
    }
    
    // Flip tiles: Checking first where the square is located 
    $scope.flip = function(x,y) {
        
        $scope.clicks++;
        
        // TOP LEFT
        if (x === 0 && y === 0) {
            $scope.doEast(x,y);
            $scope.doSouth(x,y);         
        }        
        // TOP RIGHT
        else if (x === $scope.LENGTH-1 && y === 0) {
            $scope.doSouth(x,y);
            $scope.doWest(x,y);            
        }       
        // BOTTOM LEFT
        else if (x === 0 && y === $scope.HEIGHT-1) {
            $scope.doNorth(x,y);
            $scope.doEast(x,y);
        }        
        // BOTTOM RIGHT
        else if (x === $scope.LENGTH-1 && y === $scope.HEIGHT-1) {
            $scope.doNorth(x,y);
            $scope.doWest(x,y);
        }        
        // TOP WALL
        else if (y === 0 && x > 0 && x < $scope.LENGTH-1) {
            $scope.doSouth(x,y);
            $scope.doEast(x,y);
            $scope.doWest(x,y);
        }        
        // BOTTOM WALL
        else if (y === $scope.HEIGHT-1 && x > 0 && x < $scope.LENGTH-1) {
            $scope.doNorth(x,y);
            $scope.doEast(x,y);
            $scope.doWest(x,y);
        }        
        // RIGHT WALL
        else if (x === $scope.LENGTH-1 && y > 0 && y < $scope.HEIGHT-1) {
            $scope.doNorth(x,y);
            $scope.doSouth(x,y);
            $scope.doWest(x,y);
        }
        // LEFT WALL
        else if (x === 0 && y > 0 && y < $scope.HEIGHT-1) {
            $scope.doNorth(x,y);
            $scope.doSouth(x,y);
            $scope.doEast(x,y);
        }
        // if the spot isn't along an edge
        else {
            $scope.doNorth(x,y);
            $scope.doEast(x,y);
            $scope.doSouth(x,y);
            $scope.doWest(x,y); 
        }
        
        // reverse selected spot
        $scope.spot = getSpot($scope.minefield, x,y);
        $scope.spot.isCovered = ($scope.spot.isCovered) ? false : true;
        // check if the grid is in a winning state
        $scope.hasWon();
        
    };
});

            
// Create gameplay Grid 
function createMinefield(HEIGHT, LENGTH) {

    var minefield = {};
    minefield.rows = [];

    for(var i = 0; i < HEIGHT; i++) {
        var row = {};
        row.spots = [];

        // Randomise spots for isCovered toggle 
        for(var j = 0; j < LENGTH; j++) {
            var spot = {};
            randBoolean = Math.random() >= 0.5;
            spot.isCovered = randBoolean;
            spot.x = j;
            spot.y = i;
            row.spots.push(spot);
        }
        minefield.rows.push(row);
    }   
    return minefield;
}

function getSpot(minefield, row, column) {
    return minefield.rows[column].spots[row];
}            
