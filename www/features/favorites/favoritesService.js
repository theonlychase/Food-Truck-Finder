angular.module('food-truck-finder').service('favoritesService', function ($http, API_ENDPOINT) {

    this.getSpecificUser = function(userId) {
        return $http.get(API_ENDPOINT.url + '/users/' + userId).then(function(response) {
            return response.data;
        });
    };

});