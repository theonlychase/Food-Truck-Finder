angular.module('food-truck-finder').controller('favoritesCtrl', function ($scope, userService, favoritesService, $http, API_ENDPOINT, $rootScope) {

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
    
    // userService.getAuthedUser().then(function(data) {
    //     $scope.user = data.user;
    //     console.log("this is the user ", $scope.user);
    // });
    
    // favoritesService.getSpecificUser($scope.user._id).then(function (user) {
    //             $scope.user = user;
    // });

});