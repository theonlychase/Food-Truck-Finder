(function() {
    'use strict';

angular.module('food-truck-finder').controller('listCtrl', function ($scope, $state, $cordovaGeolocation, mapService, userService) {
    
        userService.getAuthedUser().then(function(data) {
            $scope.authedUser = data;
            
            console.log("This is the authed user ", $scope.authedUser);
            $scope.myFavorites = $scope.authedUser.favorites;
            console.log('myfaves', $scope.myFavorites);

            $scope.listTrucks.forEach(function (element) {
                console.log(element._id);
                if ($scope.myFavorites.indexOf(element._id) !== -1) {
                    element.favStatus = true;
                } else {
                    element.favStatus = false;
                }
            })
            console.log('listTrucks ', $scope.listTrucks);
        });
            

        mapService.getTrucks().then(function (response) {
            $scope.listTrucks = response;
            console.log("These are the list of trucks", $scope.listTrucks);
        });

     $scope.toggleFavorites = function (favId, favStatus, index) {
        $scope.listTrucks[index].favStatus = favStatus;
        if (favStatus) {
            console.log('remove');
            $scope.removeFromFavorites(favId, index);

        } else {
            console.log('add');
            $scope.addToFavorites(favId, index);

        }
    };

    $scope.addToFavorites = function (favId, index) {

        var truckId = {
            id: favId
        };
        mapService.addFavorite($scope.authedUser._id, truckId).then(function (response) {
            console.log(response);
            $scope.listTrucks[index].favStatus = true;
        }, function (err) {
            $scope.listTrucks[index].favStatus = false;
        });

        $scope.removeFromFavorites = function (favId, index) {
            var truckId = {
                id: favId
            };
            mapService.removeFavorite($scope.authedUser._id, truckId).then(function (response) {
                console.log(response);
                $scope.listTrucks[index].favStatus = false;

            }, function (err) {
                $scope.listTrucks[index].favStatus = true;
            });
        };
    }

});
})();
