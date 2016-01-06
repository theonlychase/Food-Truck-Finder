angular.module('food-truck-finder')

    .controller('AppController', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
      $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
        AuthService.logout();
        $state.go('auth.login');
        var alertPopup = $ionicPopup.alert({
          title: 'Session Lost!',
          template: 'Sorry, You have to login again.'
        });
      });
    });
