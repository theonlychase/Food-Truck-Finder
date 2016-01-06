angular.module('food-truck-finder').service('mapService', function ($http, $q, API_ENDPOINT) {

    this.getTrucks = function () {
        return $http.get(API_ENDPOINT.url + '/trucks').then(function (trucks) {
            return trucks.data;
        });
    };

    this.shareTruckLocation = function (myTruckData) {
        console.log('myTruckData', myTruckData);
        return $http({
            method: 'PUT',
            url: API_ENDPOINT.url + '/trucks/' + myTruckData.id,
            dataType: 'json',
            data: myTruckData
        }).then(function (response) {
            return response.data;
        });
    };

    this.reverseGeolocate = function (pos) {
        var deferred = $q.defer();

        var geocoder = new google.maps.Geocoder();

        var point = new google.maps.LatLng(pos.lat, pos.lng);
        geocoder.geocode({ 'latLng': point }, function (results, status) {
            if (status !== google.maps.GeocoderStatus.OK) {
                console.log(status);
            }
            // This is checking to see if the Geoeode Status is OK before proceeding
            if (status == google.maps.GeocoderStatus.OK) {
                // console.log(results[0].formatted_address);
            }
            deferred.resolve(results[0].formatted_address);
        })
        return deferred.promise
    };






});