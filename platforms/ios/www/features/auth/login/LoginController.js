angular.module('food-truck-finder')

    .controller('LoginController', function($scope, AuthService, $ionicPopup, $state) {
      $scope.user = {
        name: '',
        password: ''
      };

      $scope.selected_tab = "";

      $scope.$on('my-tabs-changed', function (event, data) {
    		$scope.selected_tab = data.title;
    	});

      $scope.login = function() {
        AuthService.login($scope.user).then(function(msg) {
          $state.go('app.maps');
        }, function(errMsg) {
          var alertPopup = $ionicPopup.alert({
            title: 'Login failed!',
            template: errMsg
          });
        });
      };
    });
