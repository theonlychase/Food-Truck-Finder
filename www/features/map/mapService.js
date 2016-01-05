angular.module('food-truck-finder').service('mapService', function ($http, $q) {

    // this.getTrucks = function () {
    //     console.log('hi');
    //     var deferred = $q.defer();
    //     $http({
    //         method: 'GET',
    //         url: '/api/test'
    //     }).then(function (response) {
    //         console.log(response)
    //         deferred.resolve(response.data)
    //     })
    //     return deferred.promise
    // };
    
    this.getTrucks = function () {
        return $http.get('/api/trucks').then(function (trucks) {
            return trucks.data;
        });
    };



});