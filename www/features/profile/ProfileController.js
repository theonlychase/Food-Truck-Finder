angular.module('food-truck-finder')

// <<<<<<< HEAD
    .controller('ProfileController', function ($scope, $state, $ionicPopup, ProfileService, AUTH_EVENTS, userService) {

        userService.getAuthedUser().then(function(data) {
            $scope.authedUser = data;
            $scope.truck = $scope.authedUser.user.truck;
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
        
        
        
        $scope.submitProfile = function () {
            ProfileService.submitProfile($scope.authedUser.user._id, $scope.truck).then(function (msg) {
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