(function() {
    'use strict';

angular.module('food-truck-finder')

// <<<<<<< HEAD
    .controller('ProfileController', function ($rootScope, $scope, $state, $ionicPopup, ProfileService, AUTH_EVENTS, userService) {

        userService.getAuthedUser().then(function(data) {
            $scope.authedUser = data;
            $scope.profileImg = $scope.authedUser.user.truck.imgUrl || $scope.defaultImg;
            $scope.truck = $scope.authedUser.user.truck;
            $scope.id = $scope.authedUser.user._id; 
        });
        
        
//         var getAuthedUser = function () {
//             $http.get(API_ENDPOINT.url + '/memberinfo').then(function (result) {
//                 $scope.authedUser = result.data;
//                 $scope.truck = $scope.authedUser.user.truck;
// // =======
// //     .controller('ProfileController', function($scope, $state, $http, API_ENDPOINT, $ionicPopup, ProfileService, AUTH_EVENTS, $cordovaFileTransfer) {
        
// //        var getAuthedUser = function() {
// //             $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
// //             $scope.authedUser = result.data;
// //             console.log("This is the authed user's id ", $scope.authedUser.user._id);
// // >>>>>>> master
//             });
//         };

//         getAuthedUser();

        // $scope.truck = {
        //     truckName: '',
        //     address: '',
        //     phone: '',
        //     genre: '',
        //     price: '',
        //     website: '',
        //     imgUrl: '',
        //     description: ''
        // };
        
        $rootScope.$on('profileChange', function(event, data) { $scope.profileImg = data.truck.imgUrl || $scope.defaultImg });
        
        $scope.submitProfile = function () {
            ProfileService.submitProfile($scope.id, $scope.truck).then(function (msg) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Profile Updated!',
                    template: msg
                });
            }, function (errMsg) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Profile Submission failed!',
                    template: errMsg
                });
            });
        };
    });
})();