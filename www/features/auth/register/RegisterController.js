angular.module('food-truck-finder')


    .controller('RegisterController', function($scope, AuthService, $ionicPopup, $state) {
      $scope.user = {
        name: '',
        password: ''
      };
      
      $scope.truck = {
        name: '',
        password: ''
      };
      
      $scope.selected_tab = "";

      $scope.$on('my-tabs-changed', function (event, data) {
    		$scope.selected_tab = data.title;
    	});

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
