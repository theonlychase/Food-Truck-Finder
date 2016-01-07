angular.module('food-truck-finder').controller('listCtrl', function ($scope, $state, $cordovaGeolocation, mapService) {
    
    $scope.getData = function(){
          
          mapService.getTrucks().then(function (trucks) {
              
                console.log('trucks', trucks);
                $scope.listTrucks = trucks;
          });
                
      };        
    
    $scope.getData();
    
    $scope.addToFavorites = function(truckId){
        mapService.addFavorite(userId, truckId).then( function(response){
            console.log(response);
        });
    };
    
});