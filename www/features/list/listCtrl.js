(function () {
    'use strict';

    angular.module('food-truck-finder').controller('listCtrl', function ($scope, $state, $cordovaGeolocation, mapService, userService, $rootScope) {
        
        $scope.loadingTrucksListView = true;
        userService.getAuthedUser().then(function (data) {
            $scope.authedUser = data.user;

            $scope.myFavorites = $scope.authedUser.favorites;

            $scope.listTrucks.forEach(function (element) {
                if ($scope.myFavorites.indexOf(element._id) !== -1) {
                    element.favStatus = true;
                } else {
                    element.favStatus = false;
                }
            });

            var truckIds = $rootScope.truckInfo.map(function (element) {
                return element.id;
            });

            $scope.listTrucks.forEach(function (element) {
                var i = truckIds.indexOf(element._id);
                if (i !== -1) {
                    element.distanceFromCurrentUser = $rootScope.truckInfo[i].distanceFromCurrentUser;
                } else {
                    console.log('truckId not found in listTrucks');
                }

            });

            $rootScope.truckInfoForFaves = $scope.listTrucks;
        });


        mapService.getActiveTrucks().then(function (response) {
            $scope.loadingTrucksListView = false;
            $scope.listTrucks = response;
            if ($scope.listTrucks.length === 0) {
                console.log('NO TRUCKS SHARING LOCATION');
                    $scope.noTrucksSharing = true;
            }
        });

        $scope.toggleFavorites = function (favId, favStatus, index) {
            $scope.listTrucks[index].favStatus = !favStatus;
            if ($scope.listTrucks[index].favStatus === true) {
                console.log('add');
                $scope.addToFavorites(favId, index);

            } else {
                console.log('remove');
                $scope.removeFromFavorites(favId, index);


            }
        };

        $scope.addToFavorites = function (favId, index) {

            var truckId = {
                id: favId
            };
            mapService.addFavorite($scope.authedUser._id, truckId).then(function (response) {
                $scope.listTrucks[index].favStatus = true;
            }, function (err) {
                $scope.listTrucks[index].favStatus = false;
            });
        };


        $scope.removeFromFavorites = function (favId, index) {
            var truckId = {
                id: favId
            };
            mapService.removeFavorite($scope.authedUser._id, truckId).then(function (response) {
                $scope.listTrucks[index].favStatus = false;


            }, function (err) {
                $scope.listTrucks[index].favStatus = true;
            });
        };
    });

})();
