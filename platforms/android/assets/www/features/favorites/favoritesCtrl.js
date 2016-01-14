angular.module('food-truck-finder').controller('favoritesCtrl', function ($rootScope, $scope, userService, favoritesService, $http, API_ENDPOINT) {

    var getAuthedUser = function () {
        $http.get(API_ENDPOINT.url + '/memberinfo').then(function (result) {
            $scope.authedUser = result.data.user;
            console.log("This is the authed user ", $scope.authedUser);
            favoritesService.getSpecificUser($scope.authedUser._id).then(function (user) {
                $scope.user = user;
                $scope.myFavoritesList = $scope.user.favorites;
                console.log($scope.user);

                console.log($rootScope.truckInfo);

                var truckIds = $rootScope.truckInfo.map(function (element) {
                    return element.id;
                });
                console.log('truckIds: ', truckIds);

                $scope.myFavoritesList.forEach(function (element) {
                    var i = truckIds.indexOf(element._id);
                    if (i !== -1) {
                        element.distanceFromCurrentUser = $rootScope.truckInfo[i].distanceFromCurrentUser;
                    } else {
                        console.log('truckId not found in listTrucks');
                    }

                });
            });
        });
    };

    getAuthedUser();
    
});
