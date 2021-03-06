angular.module('food-truck-finder')


    .controller('RegisterController', function($scope, AuthService, $ionicPopup, $state) {
      $scope.user = {
        name: '',
        password: '',
        role: ''
      };
      
    //   $scope.selected_tab = "";

      $scope.$on('my-tabs-changed', function (event, data) {
    		$scope.selected_tab = data.title;
    	});
        
      $scope.setUserRole = function(userRole) {
          if ($scope.selected_tab === "User Signup") {
            userRole = "User";
          } else if ($scope.selected_tab === "Food Truck Signup") {
            userRole = "Truck";
          }
        return userRole;
      }

      $scope.signup = function() {
          
        $scope.user.role = $scope.setUserRole($scope.user.role);
        
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
