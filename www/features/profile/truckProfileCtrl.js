angular.module('food-truck-finder').controller('truckProfileCtrl', function($scope, truckService, $stateParams ) {
    
	$scope.truckId = $stateParams.truckId;
    
    
    $scope.getTruck = function(){
		truckService.getThisTruck($scope.truckId).then(function(response){
			// console.log(response);
			$scope.truck=response;
		})
	}();
		
	$scope.udpateTruck = function() {
		truckService.udpateTruck($scope.truckId).then(function(response){
			// console.log("updated this truck: ", response);
			$scope.truck=response;
		})
	};
	
    
    $scope.createTruck = function() {
		$scope.truck.createdBy = $stateParams.id;
		truckService.createTruck($scope.truck).then(function(response){
			// console.log(response);
		})
	}     
    
    $scope.deleteTruck = function(){
		truckService.deleteTruck($scope.truckId).then(function(response){
			// console.log(response);
			$scope.truck=response;
		})
	};    
    
    
    
    
    
    


//end    
});