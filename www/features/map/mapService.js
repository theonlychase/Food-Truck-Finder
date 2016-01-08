angular.module('food-truck-finder').service('mapService', function ($http, $q, API_ENDPOINT) {

    this.getTrucks = function () {
        return $http.get(API_ENDPOINT.url + '/users/trucks').then(function (trucks) {
            return trucks.data;
        });
    };

    this.shareTruckLocation = function (myTruckData) {
        // console.log('myTruckData', myTruckData);
        return $http({
            method: 'PUT',
            url: API_ENDPOINT.url + '/users' + myTruckData.truck.id,
            dataType: 'json',
            data: myTruckData
        }).then(function (response) {
            return response.data;
        });
    };

    this.addFavorite = function (userId, id) {
        return $http.put(API_ENDPOINT.url + '/users/favs/' + userId, {id: id}).then(function (result) {
            console.log(result);
        });
    };

    this.reverseGeolocate = function (pos) {
        var deferred = $q.defer();

        var geocoder = new google.maps.Geocoder();

        var point = new google.maps.LatLng(pos.lat, pos.lng);
        geocoder.geocode({
            'latLng': point
        }, function (results, status) {
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