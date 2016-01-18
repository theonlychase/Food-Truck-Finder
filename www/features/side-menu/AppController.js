(function() {
    'use strict';

angular.module('food-truck-finder')

    .controller('AppController', function($rootScope, $scope, $state, $http, $ionicPopup, AuthService, AUTH_EVENTS, userService) {
        
        // var getAuthedUser = function() {
        //     $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
        //     $scope.authedUser = result.data;
        //     $rootScope.authedUser = result.data.user;
        //     console.log("This is the authed user on AppController ", $rootScope.authedUser);
        //     });
        // };
        
        // getAuthedUser();
        $scope.defaultImg = "https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg";
        
       $rootScope.$on('profileChange', function(event, data) { $scope.profileImg = data.truck.imgUrl || $scope.defaultImg });
        
        userService.getAuthedUser().then(function(data) {
            $scope.authedUser = data;
            $scope.profileImg = $scope.authedUser.user.truck.imgUrl || $scope.defaultImg;
            $rootScope.authedUser = data.user;
            console.log("This is the authedUser", $scope.authedUser);
            // console.log("This is the root authedUser", $rootScope.authedUser);
            if ($scope.authedUser.user.role === "Truck") {
                $scope.role = true;
            } else {
                $scope.role = false;
            }
            console.log("authedUser.role = ", $scope.authedUser.user.role);
            console.log("scope role = ", $scope.role)
        });
        
       $scope.logout = function() {
         AuthService.logout();
         $state.go('auth.login');
       };
        
      $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
        AuthService.logout();
        $state.go('auth.login');
        var alertPopup = $ionicPopup.alert({
          title: 'Session Lost!',
          template: 'Sorry, You have to login again.'
        });
      });
    });
})();
