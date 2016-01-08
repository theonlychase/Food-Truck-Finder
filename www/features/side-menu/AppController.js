(function() {
    'use strict';

angular.module('food-truck-finder')

    .controller('AppController', function($scope, $state, $http, $ionicPopup, AuthService, AUTH_EVENTS, API_ENDPOINT) {
        
        var getAuthedUser = function() {
            $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
            $scope.authedUser = result.data;
            console.log("This is the authed user ", $scope.authedUser);
            });
        };
        
        getAuthedUser();
        
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
