angular.module('food-truck-finder').controller('truckProfileCtrl', function($scope, truckService, $stateParams ) {
    
	$scope.truckId = $stateParams.truckId;
	
	$scope.getTrucks=function() {
		truckService.getTrucks().then(function(response){
			console.log(response);
			$scope.truck = response;
			})
	}();    
    
    
    
    $scope.getThisTruck = function(){
		truckService.getThisTruck($scope.truckId).then(function(response){
			console.log(response);
			$scope.truck=response;
		})
	}();
		
	$scope.udpateThisTruck = function() {
		truckService.udpateTruck($scope.truckId).then(function(response){
			console.log("updated this truck: ", response);
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