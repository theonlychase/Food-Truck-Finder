angular.module('food-truck-finder').controller('favoritesCtrl', function ($rootScope, $scope, userService, favoritesService, $http, API_ENDPOINT) {


    var getAuthedUser = function () {
        $scope.loadingFavorites = true;
        $http.get(API_ENDPOINT.url + '/memberinfo').then(function (result) {
            $scope.authedUser = result.data.user;
            favoritesService.getSpecificUser($scope.authedUser._id).then(function (user) {
                $scope.user = user;
                $scope.myFavoritesList = $scope.user.favorites;

                $scope.loadingFavorites = false;
                
                $scope.myFavoritesList.forEach(function (element) {
                    if (element.truck.status === 'Active') {
                        element.truckStatus = true;
                    } else {
                        element.truckStatus = false;
                    }
                });

                var truckIds = $rootScope.truckInfo.map(function (element) {
                    return element.id;
                });

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
