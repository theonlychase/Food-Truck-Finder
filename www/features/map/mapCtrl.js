angular.module('food-truck-finder').controller('mapCtrl', function ($rootScope, $scope, $state, $cordovaGeolocation, mapService, socketService) {

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
        
        // GET ADDRESS VIA REVERSE GEOLOCATION TO SHOW IN LIST VIEW //
        mapService.reverseGeolocate($scope.pos).then(function (address) {
            // SET CURRENT LOCATION TO SEND TO DB WHEN LOCATION IS BROADCAST //
            $scope.address = address;
        });

        $scope.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
            center: $scope.latLng,
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
                position: $scope.latLng
            });

            var infoWindow = new google.maps.InfoWindow({
                content: "Here I am!"
            });

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open($scope.map, marker);
            });

            $scope.updateMapWithNewData();
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
                id: '568da45e545c35825b4cbc8e',
                status: 'Active',
                currentLocation: [currentLocation[1], currentLocation[0]],
                address: $scope.address,
                updatedAt_readable: moment().format('ddd, MMM D YYYY, h:mma')
            }

        };

        var myTruckDataStop = {
            truck: {
                id: '568da45e545c35825b4cbc8e',
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
        // SOCKET --> EMIT BROADCAST START/STOP //
        socketService.emit('broadcastChange', myTruckData);

        mapService.shareTruckLocation(myTruckData).then(function (response) {
            // console.log(response);
            $scope.locationStatus = response.truck.status;
            console.log($scope.locationStatus);
        })
    };
    
    // SOCKET --> LISTEN FOR NEW BROADCAST START/STOP INFO //
    socketService.on('updateBroadcastChange', function (data) {
        console.log('NEW BROADCAST DATA COMING FROM SERVER: ', data);
        $scope.updateSingleTruck(data)
    });



    // POPULATE THE MAP ON PAGE LOAD WITH TRUCKS THAT ARE BORADCASTING LOCATION //
    $scope.updateMapWithNewData = function () {
        if ($scope.markers) {
            for (var i = 0; i < $scope.markers.length; i++) {
                $scope.markers[i].setMap(null);
            }
        }

        $scope.locations = [];
        $scope.markers = [];
        console.log('ding');
        mapService.getTrucks().then(function (users) {

            console.log('users', users);

            for (var i = 0; i < users.length; i++) {
                var truck = users[i];
                if (truck.truck.status === "Active") {
                    $scope.locations.push({
                        latlon: new google.maps.LatLng(truck.truck.currentLocation[0], truck.truck.currentLocation[1]),
                        name: truck.truck.truckName,
                        id: truck._id,
                        updated: truck.truck.updatedAt_readable
                    })
                }
            };

            for (var i = 0; i < $scope.locations.length; i++) {
                $scope.locations[i].distanceFromCurrentUser = (google.maps.geometry.spherical.computeDistanceBetween($scope.latLng, $scope.locations[i].latlon) * .000621371).toFixed(2);
            }

            console.log('locations array', $scope.locations);

            for (var i = 0; i < $scope.locations.length; i++) {
                var marker = new google.maps.Marker({
                    position: $scope.locations[i].latlon,
                    map: map,
                    title: $scope.locations[i].name,
                    icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    id: $scope.locations[i].id,
                    distanceFromUser: $scope.locations[i].distanceFromCurrentUser,
                    info: "<p>" + $scope.locations[i].name + " has been here since " + $scope.locations[i].updated + "<br>" + $scope.locations[i].distanceFromCurrentUser + " miles from your current location.</p>"
                });

                $scope.markers.push(marker);
            }
            var infowindow = new google.maps.InfoWindow({
                // test: 'test123'
            });

            for (var i = 0; i < $scope.markers.length; i++) {
                var marker = $scope.markers[i];

                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.setContent(this.info);
                    infowindow.open(map, this);
                })
            }
        });
    };
    
    // UPDATE MAP WITH CHANGE FROM SOCKET.IO //
    $scope.updateSingleTruck = function (updatedTruckData) {
        for (var i = 0; i < $scope.locations.length; i++) {
            if (updatedTruckData.id === $scope.locations[i].id) {
                console.log(true);
                $scope.locations.splice(i, 1);
            }
        }
        $scope.markers = [];
        for (var i = 0; i < $scope.markers.length; i++) {
            if (updatedTruckData.id === $scope.markers[i].id) {
                $scope.markers[i].setMap(null);
            }
        }

        if (updatedTruckData.status === "Active") {
            var temp;
            temp.push({
                latlon: new google.maps.LatLng(updatedTruckData.currentLocation[0], updatedTruckData.currentLocation[1]),
                name: updatedTruckData.truckName,
                id: updatedTruckData._id,
                updated: updatedTruckData.updatedAt_readable
            });
            console.log(temp);
            temp.distanceFromCurrentUser = (google.maps.geometry.spherical.computeDistanceBetween($scope.latLng, $scope.locations[i].latlon) * .000621371).toFixed(2);
            $scope.locations.push(temp);
            temp = undefined;
        }

        for (var i = 0; i < $scope.locations.length; i++) {
            var marker = new google.maps.Marker({
                position: $scope.locations[i].latlon,
                map: map,
                title: $scope.locations[i].name,
                icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                id: $scope.locations[i].id,
                distanceFromUser: $scope.locations[i].distanceFromCurrentUser,
                info: "<p>" + $scope.locations[i].name + " has been here since " + $scope.locations[i].updated + "</p> <p>" + $scope.locations[i].distanceFromCurrentUser + " miles from your current location.</p>"
            });

            $scope.markers.push(marker);
        }
        var infowindow = new google.maps.InfoWindow({
            // test: 'test123'
        });

        for (var i = 0; i < $scope.markers.length; i++) {
            var marker = $scope.markers[i];

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(this.info);
                infowindow.open(map, this);
            })
        }
        console.log('locations after any change ', $scope.locations);
        console.log('markers after any change ', $scope.markers);
    };



});