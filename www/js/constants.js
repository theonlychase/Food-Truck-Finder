angular.module('food-truck-finder')

.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})

.constant('API_ENDPOINT', {
    // url: 'http://45.55.46.101:80/api'
  url: 'http://127.0.0.1:8080/api'
  //  For a simulator use: url: 'http://127.0.0.1:8080/api'
});
