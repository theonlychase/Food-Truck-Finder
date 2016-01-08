angular.module('food-truck-finder').controller('listCtrl', function ($scope, $state, $cordovaGeolocation, mapService, socketService) {

    $scope.getData = function () {

        mapService.getTrucks().then(function (trucks) {

            console.log('trucks', trucks);
            $scope.listTrucks = trucks;
        });

    };

    $scope.getData();

    $scope.addToFavorites = function (userId) {
        mapService.addFavorite(userId).then(function (response) {
            console.log(response);
        });
    };



});