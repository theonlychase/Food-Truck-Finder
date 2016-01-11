(function () {
    'use strict';

    angular.module('food-truck-finder').controller('listCtrl', function ($http, $scope, $state, $cordovaGeolocation, mapService, API_ENDPOINT) {

        $scope.getData = function () {

            mapService.getTrucks().then(function (trucks) {
                $scope.listTrucks = trucks;
            });
        };

        $scope.getData();

        var getAuthedUser = function () {
            $http.get(API_ENDPOINT.url + '/memberinfo').then(function (result) {
                $scope.authedUser = result.data;
                console.log("This is the authed user ", $scope.authedUser);
            });
        };

        console.log($scope.authedUser.user._id);

        $scope.addToFavorites = function (id) {
            mapService.addFavorite($scope.authedUser.user._id, id).then(function (response) {
                console.log(response);
            });
        };

    });

})();