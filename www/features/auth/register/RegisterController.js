angular.module('food-truck-finder')


    .controller('RegisterController', function($scope, AuthService, $ionicPopup, $state) {
      $scope.user = {
        name: '',
        password: ''
      };

      $scope.signup = function() {
        AuthService.register($scope.user).then(function(msg) {
          $state.go('auth.login');
          var alertPopup = $ionicPopup.alert({
            title: 'Register success!',
            template: msg
          });
        }, function(errMsg) {
          var alertPopup = $ionicPopup.alert({
            title: 'Register failed!',
            template: errMsg
          });
        });
      };
    });
