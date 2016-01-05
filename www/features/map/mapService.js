angular.module('food-truck-finder').service('mapService', function ($http, $q) {

    this.getTrucks = function () {
        return $http.get('/api/trucks').then(function (trucks) {
            return trucks.data;
        });
    };

    this.shareTruckLocation = function (myTruckData) {
        console.log('myTruckData', myTruckData);
        return $http({
            method: 'PUT',
            url: '/api/trucks/' + myTruckData.id,
            dataType: 'json',
            data: myTruckData
        }).then(function (response) {
            return response.data;
        });
    };
    







});