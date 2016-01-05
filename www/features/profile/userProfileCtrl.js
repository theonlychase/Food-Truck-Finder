angular.module('food-truck-finder').controller('userProfileCtrl', function( $scope, userService, $stateParams ) {
//$stateParams here will = userId)
    
	$scope.userId = $stateParams.userId;
	
    $scope.getThisUser = function(){
		userService.getThisUser($scope.userId).then(function(response){
			console.log(response);
			$scope.user=response;
		})
	}();
		
	$scope.udpateThisUser = function() {
		userService.udpateUser($scope.userId).then(function(response){
			console.log("updated user: ", response);
			$scope.user=response;
		})
	};
	
    $scope.deleteThisUser = function(){
		userService.deleteUser($scope.userId).then(function(response){
			console.log(response);
			$scope.user=response;
		})
	};    
    
    



//end
});