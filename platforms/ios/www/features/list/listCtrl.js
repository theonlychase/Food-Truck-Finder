angular.module('food-truck-finder').controller('listCtrl', function ($rootScope, $scope, $state, $cordovaGeolocation, mapService) {

    $scope.getData = function () {

        mapService.getTrucks().then(function (trucks) {
            $scope.listTrucks = trucks;
        });
    };

    console.log($rootScope.authedUser._id);
    
    $scope.getData();

    $scope.addToFavorites = function (fav) {
        mapService.addFavorite($rootScope.authedUser._id, fav).then(function (response) {
            console.log(response);
        });
    };

});