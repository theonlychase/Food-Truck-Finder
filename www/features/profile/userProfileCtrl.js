angular.module('food-truck-finder').controller('userProfileCtrl', function( $scope, userService, $stateParams ) {
//$stateParams here will = userId)
    
	$scope.userId = $stateParams.userId;
	
    $scope.getUser = function(){
		userService.getUser($scope.userId).then(function(response){
			// console.log(response);
			$scope.user=response;
		})
	}();
		
	$scope.udpateUser = function() {
		userService.udpateUser($scope.userId).then(function(response){
			// console.log("updated user: ", response);
			$scope.user=response;
		})
	};
	
    $scope.deleteUser = function(){
		userService.deleteUser($scope.userId).then(function(response){
			// console.log(response);
			$scope.user=response;
		})
	};    
    
    



//end
});