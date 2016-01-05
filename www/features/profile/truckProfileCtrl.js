angular.module('food-truck-finder').controller('truckProfileCtrl', function($scope, truckService, $stateParams ) {
    
	$scope.truckId = $stateParams.truckId;
	
    $scope.getThistruck = function(){
		truckService.getThistruck($scope.truckId).then(function(response){
			console.log(response);
			$scope.truck=response;
		})
	}();
		
	$scope.udpateThisTruck = function() {
        //not sure if user id's are stored on truck, or truck ID's stored on user
		// var volunteer = {
		// 	truckId: $stateParams.id,
		// 	status: "true" //favorite???
		// } 
		truckService.udpatetruckfav($scope.truckId, fav).then(function(response){
			console.log("updated favorite truck: ", response);
			$scope.truck=response;
		})
	};
	
    $scope.deleteThistruck = function(){
		truckService.deleteTruck($scope.truckId).then(function(response){
			console.log(response);
			$scope.truck=response;
		})
	};    
    
    
    
    
    
    


//end    
});