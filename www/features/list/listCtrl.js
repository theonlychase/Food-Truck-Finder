(function() {
    'use strict';

angular.module('food-truck-finder').controller('listCtrl', function ($scope, $http, $state, $cordovaGeolocation, mapService, API_ENDPOINT) {
    
    $scope.getData = function () {

        mapService.getTrucks().then(function (response) {
            $scope.listTrucks = response;
            console.log($scope.listTrucks);
        });
    };
    
    $scope.getData();

    $scope.addToFavorites = function (id) {
        mapService.addFavorite($scope.authedUser.user._id, id).then(function (response) {
            console.log(response);
        });
    };

});
})();