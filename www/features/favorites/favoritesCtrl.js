angular.module('food-truck-finder').controller('favoritesCtrl', function ($scope, $http, $stateParams, favoritesService, API_ENDPOINT) {

    var getAuthedUser = function () {
        $http.get(API_ENDPOINT.url + '/memberinfo').then(function (result) {
            $scope.authedUser = result.data.user;
            console.log("This is the authed user ", $scope.authedUser);
            favoritesService.getSpecificUser($scope.authedUser._id).then(function (user) {
                $scope.user = user;
            });
        });
    };

    getAuthedUser();

});