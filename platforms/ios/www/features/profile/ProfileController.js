angular.module('food-truck-finder')

    .controller('ProfileController', function($scope, $state, $http, API_ENDPOINT, $ionicPopup, ProfileService, AUTH_EVENTS) {
        
       var getAuthedUser = function() {
            $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
            $scope.authedUser = result.data;
            console.log("This is the authed user's id ", $scope.authedUser.user._id);
            });
        };
        
        getAuthedUser();
       
       $scope.truck = {
        truckName: '',
        address: '',
        phone: '',
        genre: '',
        price: '',
        website: '',
        imgUrl: '',
        description: ''
      };
      

      $scope.submitProfile = function() {
          console.log($scope.truck);
        ProfileService.submitProfile($scope.authedUser.user._id, $scope.truck).then(function(msg) {
          var alertPopup = $ionicPopup.alert({
            title: 'Profile Updated!',
            template: msg
          });
        }, function(errMsg) {
          var alertPopup = $ionicPopup.alert({
            title: 'Profile Submission failed!',
            template: errMsg
          });
        });
      };
    });