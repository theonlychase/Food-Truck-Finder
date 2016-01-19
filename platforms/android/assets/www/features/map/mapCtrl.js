(function () {
    'use strict';

    angular.module('food-truck-finder').controller('mapCtrl', function ($rootScope, $scope, $state, $cordovaGeolocation, mapService, socketService, favoritesService, userService) {

        $scope.getAuthedUserInfo = function () {
            userService.getAuthedUser().then(function (response) {
                $scope.authedUser = response.user;
                console.log('AUTHED USER ON mapCtrl: ', $scope.authedUser);
                if ($scope.authedUser.truck.status === 'Active') {
                    $scope.myStatus = true;
                } else if ($scope.authedUser.truck.status === 'Inactive') {
                    $scope.myStatus = false;
                }
                console.log('myStatus = ', $scope.myStatus);
            })
        };

        $scope.getAuthedUserInfo();

        var options = {
            timeout: 10000,
            enableHighAccuracy: true
        };

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

            google.maps.event.addListenerOnce($scope.map, 'idle', function () {

                var marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    position: $scope.latLng
                });

                var infoWindow = new google.maps.InfoWindow({
                    content: '<div class="info-window-popup-row"><h6>You are here!</h6></div>'
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.open($scope.map, marker);
                });

                // CHECK IF A USER IS TRUCK TO SHOW/HIDE LOCATION SHARING TOGGLE //
                if ($scope.authedUser.role === "Truck" || $scope.authedUser.role === "Admin") {
                    $scope.toggleSlider = true;
                } else {
                    $scope.toggleSlider = false;
                }

                $scope.updateMapOnLoad();
            });

        }, function (error) {
            console.log("Could not get location");
        });

        // POPULATE MAP W/ TRUCKS THAT ARE BROADCASTING LOCATION //
        $scope.updateMapOnLoad = function () {

            $scope.locations = [];
            $scope.markers = [];

            mapService.getActiveTrucks().then(function (activeTrucks) {

                console.log('activeTrucks', activeTrucks);

                for (var i = 0; i < activeTrucks.length; i++) {
                    var truck = activeTrucks[i];
                    if (truck.truck.status === "Active") {
                        $scope.locations.push({
                            status: truck.truck.status,
                            latlon: new google.maps.LatLng(truck.truck.currentLocation[1], truck.truck.currentLocation[0]),
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
                $rootScope.truckInfo = $scope.locations;
                for (var i = 0; i < $scope.locations.length; i++) {
                    var marker = new google.maps.Marker({
                        position: $scope.locations[i].latlon,
                        // map: map,
                        title: $scope.locations[i].name,
                        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                        id: $scope.locations[i].id,
                        distanceFromUser: $scope.locations[i].distanceFromCurrentUser,
                        info: '<div class="info-window-popup-row"><h5>' + $scope.locations[i].name + '</h5></div><div class="info-window-popup-row"><h6>' + $scope.locations[i].distanceFromCurrentUser + ' miles away</h6></div><div class="info-window-popup-row"><h6>' + $scope.locations[i].updated + '</h6></div>'
                    });

                    $scope.markers.push(marker);
                }
                var infowindow = new google.maps.InfoWindow({
                    // test: 'test123'
                });

                for (var i = 0; i < $scope.markers.length; i++) {
                    var marker = $scope.markers[i];

                    marker.setMap(null);
                    marker.setMap($scope.map);

                    google.maps.event.addListener(marker, 'click', function () {
                        infowindow.setContent(this.info);
                        infowindow.open($scope.map, this);
                    })
                }
            });
        };

        // TOGGLE MY LOCATION SHARING (TRUCK) //
        $scope.toggleTruckLocation = function () {

            var myTruckData = {
                truck: {
                    truckName: $scope.authedUser.truck.truckName,
                    id: $scope.authedUser._id,
                    updatedAt_readable: moment().format('LT - l'),
                    imgUrl: $scope.authedUser.truck.imgUrl,
                    price: $scope.authedUser.truck.price,
                    genre: $scope.authedUser.truck.genre,
                    phone: $scope.authedUser.truck.phone,
                    createdAt: $scope.authedUser.truck.createdAt,
                    website: $scope.authedUser.truck.website,
                    description: $scope.authedUser.truck.description
                }
            };

            if ($scope.myStatus === false) {

                console.log('my status is false, i am sending active data');

                myTruckData.truck.status = 'Active';
                myTruckData.truck.address = $scope.address;
                myTruckData.truck.currentLocation = [currentLocation[0], currentLocation[1]];

            } else if ($scope.myStatus === true) {

                console.log('my status is true, i am sending inactive data');

                myTruckData.truck.status = 'Inactive';
                myTruckData.truck.address = null;
                myTruckData.truck.currentLocation = [undefined, undefined];
            }


            console.log('sending auth user data to db for update ', myTruckData);
            mapService.shareTruckLocation(myTruckData).then(function (response) {
                $scope.myUserId = response._id;
                console.log('my data coming back from db', response);
                console.log('NEW auth user status after update ', response.truck.status);
                if (response.truck.status === 'Active') {
                    $scope.myStatus = true;
                } else {
                    $scope.myStatus = false;
                }


                // SOCKET --> NEED TO SEND NOTICE THAT I UPDATED!
                socketService.emit('notifyUpdatedTruck', $scope.myUserId);
                console.log('I sent a notice that I updated');
                console.log('End Toggle Slide Function');
            })
        };

        // SOCKET --> LISTENING FOR NOTICE OF A TRUCK CHANGE //
        socketService.on('updateThisTruck', function (truckToUpdateId) {
            console.log('Get new data for this truck: ', truckToUpdateId);
            console.log('Ok, I will go get new data...');
            // --> Go get new data for the updated truck //
            mapService.getOneTruckData(truckToUpdateId).then(function (truck) {
                console.log('Ok, I got you the new data: ', truck);
                console.log('Here are the current items in locations array: ', $scope.locations);
                console.log('Here is the current markers array: ', $scope.markers);

                for (var i = 0; i < $scope.locations.length; i++) {
                    if ($scope.locations[i].id === truck._id) {
                        if (truck.truck.status === 'Inactive') {
                            console.log('The new truck is in locations array, but the new status is INACTIVE --> I am going to splice it.');
                            $scope.locations.splice(i, 1);
                            i--;
                        }
                        console.log('New locations array after item removed: ', $scope.locations);
                        for (var j = 0; j < $scope.markers.length; j++) {
                            if ($scope.markers[j].id === truck._id) {
                                console.log('Found the marker I need to set at null');
                                $scope.markers[j].setMap(null);
                                $scope.markers = [];
                                console.log('Set markers to [] and see result: ', $scope.markers);
                            }
                        }
                        return false;

                    } else {
                        console.log('The new truck is not in the locations array. I will create a new location object and push it in...');
                    }
                }
                var updatedLocation = {
                    status: truck.truck.status,
                    latlon: new google.maps.LatLng(truck.truck.currentLocation[1], truck.truck.currentLocation[0]),
                    name: truck.truck.truckName,
                    id: truck._id,
                    updated: truck.truck.updatedAt_readable
                };
                // Adding in the 'distanceFromCurrentUser' property //
                updatedLocation.distanceFromCurrentUser = (google.maps.geometry.spherical.computeDistanceBetween($scope.latLng, updatedLocation.latlon) * .000621371).toFixed(2);

                $scope.locations.push(updatedLocation);
                console.log('The new location object is in: ', $scope.locations);

                console.log('This is the current markers array: ', $scope.markers);

                for (var i = 0; i < $scope.markers.length; i++) {
                    $scope.markers[i].setMap(null);
                }
                console.log('This is now the markers array after setting markers to null: ', $scope.markers);
                $scope.markers = [];
                console.log('This is now the markers array after setting markers to an empty array: ', $scope.markers);

                for (var i = 0; i < $scope.locations.length; i++) {
                    var newMarker = new google.maps.Marker({
                        position: $scope.locations[i].latlon,
                        map: $scope.map,
                        title: $scope.locations[i].name,
                        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                        id: $scope.locations[i].id,
                        distanceFromUser: $scope.locations[i].distanceFromCurrentUser,
                        info: '<div class="info-window-popup-row"><h5>' + $scope.locations[i].name + '</h5></div><div class="info-window-popup-row"><h6>' + $scope.locations[i].distanceFromCurrentUser + ' miles away</h6></div><div class="info-window-popup-row"><h6>' + $scope.locations[i].updated + '</h6></div>'
                    })
                    $scope.markers.push(newMarker);
                }

                // Create info windows for each marker // 
                var infowindow = new google.maps.InfoWindow;

                for (var i = 0; i < $scope.markers.length; i++) {

                    google.maps.event.addListener($scope.markers[i], 'click', function () {
                        infowindow.setContent(this.info);
                        infowindow.open($scope.map, this);
                    })
                }

                console.log('After looping through and creating markers, the new locations array is now this: ', $scope.locations);
                console.log('And the new markers array looks like this: ', $scope.markers);
            })
        });



    });
})();