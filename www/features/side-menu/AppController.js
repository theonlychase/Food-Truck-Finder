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
        
        userService.getAuthedUser().then(function(data) {
            $scope.authedUser = data;
            $rootScope.authedUser = data.user;
            console.log("This is the authedUser", $scope.authedUser);
            // console.log("This is the root authedUser", $rootScope.authedUser);
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
