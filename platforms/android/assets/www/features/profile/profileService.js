angular.module('food-truck-finder')

.service('ProfileService', function($q, $http, API_ENDPOINT) {
  
  this.submitProfile = function(id, truckProfile) {
      return $q(function(resolve, reject) {
          $http.put(API_ENDPOINT.url + '/truckprofile/' + id, truckProfile).then(function(result) {
              if (result.data.success) {
                  resolve(result.data.msg);
              } else {
                  reject(result.data.msg);
              }
          });
      });
  }
  
  
});
