angular.module('food-truck-finder').controller('mapCtrl', function ($scope, $state, $cordovaGeolocation, mapService) {

    var options = { timeout: 10000, enableHighAccuracy: true };

    var map;
    var currentLocation = [];

    $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        currentLocation[1] = position.coords.latitude;
        currentLocation[0] = position.coords.longitude;

        $scope.pos = {
            lat: currentLocation[1],
            lng: currentLocation[0]
        };
        console.log($scope.pos);
        
        
        // GET ADDRESS VIA REVERSE GEOLOCATION TO SHOW IN LIST VIEW //
        mapService.reverseGeolocate($scope.pos).then(function (address) {
            // SET CURRENT LOCATION TO SEND TO DB WHEN LOCATION IS BROADCAST //
            $scope.address = address;
            console.log($scope.address);
        });

        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
            center: latLng,
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

        map = $scope.map;

        google.maps.event.addListenerOnce(map, 'idle', function () {

            var marker = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.DROP,
                icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                position: latLng
            });

            var infoWindow = new google.maps.InfoWindow({
                content: "Here I am!"
            });

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open($scope.map, marker);
            });


            var locations = [];
            var markers = [];

            mapService.getTrucks().then(function (users) {

                console.log('users', users);

                for (var i = 0; i < users.length; i++) {
                    var truck = users[i].truck;
                    locations.push({
                        latlon: new google.maps.LatLng(truck.currentLocation[0], truck.currentLocation[1]),
                        name: truck.name,
                        id: truck._id,
                        updated: truck.updated_at_readable
                    })
                };

                for (var i = 0; i < locations.length; i++) {
                    locations[i].distanceFromCurrentUser = google.maps.geometry.spherical.computeDistanceBetween(latLng, locations[i].latlon) * .000621371;
                }

                console.log('locations array', locations);

                for (var i = 0; i < locations.length; i++) {
                    var marker = new google.maps.Marker({
                        position: locations[i].latlon,
                        map: map,
                        title: locations[i].name,
                        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                        id: locations[i].id,
                        info: "<p>" + locations[i].name + " has been here since " + locations[i].updated + "</p>"
                    });

                    markers.push(marker);
                }
                var infowindow = new google.maps.InfoWindow({
                    // test: 'test123'
                });

                for (var i = 0; i < markers.length; i++) {
                    var marker = markers[i];

                    google.maps.event.addListener(marker, 'click', function () {
                        infowindow.setContent(this.info);
                        infowindow.open(map, this);
                    })
                }
            });
        });

    }, function (error) {
        console.log("Could not get location");
    });
    
    
    // TOGGLE MY LOCATION SHARING (TRUCK) //
    $scope.locationStatus = "Inactive";

    $scope.toggleTruckLocation = function () {
        var myTruckData;

        var myTruckDataShare = {
            truck: {
                id: '568c3c37dca6041c1da6a719',
                status: 'Active',
                currentLocation: [currentLocation[1], currentLocation[0]],
                address: $scope.address,
                updatedAt_readable: moment().format('ddd, MMM D YYYY, h:mma')
            }

        };

        var myTruckDataStop = {
            truck: {
                id: '568c3c37dca6041c1da6a719',
                status: 'Inactive',
                currentLocation: [undefined, undefined],
                address: null,
                updatedAt_readable: moment().format('ddd, MMM D YYYY, h:mma')
            }
        };

        if ($scope.locationStatus === 'Active') {
            myTruckData = myTruckDataStop
        } else if ($scope.locationStatus === 'Inactive') {
            myTruckData = myTruckDataShare;
        }

        mapService.shareTruckLocation(myTruckData).then(function (response) {
            console.log(response);
            $scope.locationStatus = response.truck.status;
            console.log($scope.locationStatus);
        })
    };
















});