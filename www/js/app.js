// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('food-truck-finder', ['ionic', 'food-truck-finder.directives', 'ngCordova'])

.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('auth', {
            url: '/auth',
            abstract: true,
            templateUrl: 'features/auth/home/auth.html',
            controller: 'AuthController'
        })
        .state('auth.home', {
            url: '/home',
            templateUrl: 'features/auth/home/home.html'
        })
        .state('auth.login', {
            url: '/login',
            templateUrl: 'features/auth/login/login.html',
            controller: 'LoginController'
        })
        .state('auth.register', {
            url: '/register',
            templateUrl: 'features/auth/register/register.html',
            controller: 'RegisterController'
        })
        .state('auth.forgot-password', {
            url: '/forgot-password',
            templateUrl: 'features/auth/forgot-password/forgot-password.html',
            controller: 'ForgotPasswordController'
        })
        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "features/side-menu/side-menu.html",
            controller: 'AppController'
        })
        .state('app.maps', {
            url: '/map/:id',
            views: {
                'menuContent': {
                    templateUrl: 'features/map/mapView.html',
                    controller: 'mapCtrl'
                }
            }
        })
        .state('app.list', {
            url: '/list/:id',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: '/features/list/listView.html',
                    controller: 'listCtrl'
                }
            }
        })
        .state('app.favorites', {
            url: '/favorites/:id',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: '/features/favorites/favoritesView.html',
                    controller: 'favoritesCtrl'
                }
            }
        })
        .state('app.profile', {
            url: '/profile/:id',
            views: {
                'menuContent': {
                    templateUrl: 'features/profile/profile.html',
                    controller: 'ProfileController'
                }
            }
        });

    $urlRouterProvider

        .otherwise('/auth/home');
})

.run(function ($rootScope, $state, AuthService, AUTH_EVENTS, $ionicPlatform) {
    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
        if (!AuthService.isAuthenticated()) {
            console.log(next.name);
            if (next.name !== 'auth.login' && next.name !== 'auth.register' && next.name !== 'auth.home' && next.name !== 'auth.forgot-password') {
                event.preventDefault();
                $state.go('auth.home');
            }
        }
    });

    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});