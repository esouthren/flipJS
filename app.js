var todomvc = angular.module('todomvc', ['firebase']);

todomvc.controller('TodoCtrl', function TodoCtrl($scope, $location, $firebase) {
    
   
	var fireRef = new Firebase('https://flipjs-71ead.firebaseio.com/');
    
    $scope.currentCat = "easy";
    
    var scores = fireRef.child($scope.currentCat);
 
    $scope.scores = $firebase(scores).$asArray();

    
    var categoryType = "scores"; // to change category style in $watch function

	$scope.$watch(categoryType, function(){
		var total = 0;
		$scope.scores.forEach(function(scores){
           total++;
		});
        
        $scope.max = 0;
        for (var i = 0; i < $scope.scores.length; i++) {
            if ($scope.scores[i].score > $scope.max) {
                 $scope.max = $scope.scores[i].score;
                 $scope.maxObj = $scope.scores[i];
            }
        }
		$scope.totalScores = total;	
}, true);
 
    $scope.catEasy = function() {
        $scope.currentCat = "easy";
         var scores = fireRef.child($scope.currentCat);
         $scope.scores = $firebase(scores).$asArray();
    };
    
    $scope.catMed = function() {
        $scope.currentCat = "medium";
        var scores = fireRef.child($scope.currentCat);
        $scope.scores = $firebase(scores).$asArray();
    };
    
    $scope.catDiff = function() {
        $scope.currentCat = "difficult";
        var scores = fireRef.child($scope.currentCat);
         $scope.scores = $firebase(scores).$asArray();
    };

	$scope.addScore = function(){
        
       
        

        if ($scope.totalScores < 5)  {
            $scope.scores.$add({
                name: 'name',    // user input name
                score: $scope.newScore // $clicks

            });
        }
        else {
                if ($scope.newScore <= $scope.max) {
                    $scope.scores.$add({
                    name: 'less than max',    // user input name
                    score: $scope.newScore // $clicks

                    });
                    for (var i = 0; i < $scope.scores.length; i++) {
                        if ($scope.scores[i].score == $scope.max) {
                            $scope.scores.$remove($scope.scores[i]);
                            break;
                        }
                    }
            
            }
        
        }
	};



	$scope.removeScore = function(score){
		$scope.scores.$remove(score);
	};


	
});


