angular.module('food-truck-finder').service('mapService', function ($http, $q, API_ENDPOINT) {

    this.getTrucks = function () {
        return $http.get(API_ENDPOINT.url + '/users/trucks').then(function (trucks) {
            return trucks.data;
        });
    };

    this.getActiveTrucks = function () {
        return $http.get(API_ENDPOINT.url + '/active').then(function (trucks) {
            return trucks.data;
        });
    };

    this.getOneTruckData = function (truckToUpdateId) {
        return $http.get(API_ENDPOINT.url + '/users/truck/' + truckToUpdateId).then(function (truck) {
            return truck.data;
        });
    };

    this.shareTruckLocation = function (myTruckData) {
        return $http({
            method: 'PUT',
            url: API_ENDPOINT.url + '/users/' + myTruckData.truck.id,
            dataType: 'json',
            data: myTruckData
        }).then(function (response) {
            return response.data;
        });
    };

    this.addFavorite = function (userId, truckId) {
        // console.log(truckId);
        return $http.put(API_ENDPOINT.url + '/users/favs/' + userId, truckId).then(function (result) {
            return result.data;
        });
    };

    this.removeFavorite = function (userId, truckId) {
        // console.log('id to remove from faves, in service --sending', truckId);
        return $http.put(API_ENDPOINT.url + '/users/favs/remove/' + userId, truckId).then(function (result) {
            return result.data;
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
    
    
    this.getAuthedUser = function(user) {
        return  $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
            return result.data;
        });
    }



});