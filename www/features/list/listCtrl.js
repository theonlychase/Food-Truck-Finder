(function() {
    'use strict';

angular.module('food-truck-finder').controller('listCtrl', function ($scope, $state, $cordovaGeolocation, mapService, userService) {
    
        userService.getAuthedUser().then(function(data) {
            $scope.authedUser = data;
        });
    
        mapService.getTrucks().then(function (response) {
            $scope.listTrucks = response;
            console.log("These are the list of trucks", $scope.listTrucks);
        });

    $scope.addToFavorites = function (id) {
        mapService.addFavorite($scope.authedUser.user._id, id).then(function (response) {
            console.log("this is the list response", id);
            console.log("this is the list response", $scope.authedUser.user._id);
        });
    };

});
})();