angular.module('food-truck-finder').controller('mapCtrl', function ($rootScope, $scope, $state, $cordovaGeolocation, mapService, socketService) {


    var options = { timeout: 10000, enableHighAccuracy: true };

    var currentLocation = [];
    $scope.myStatus = false;

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
                content: "Here I am!"
            });

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open($scope.map, marker);
            });

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

            for (var i = 0; i < $scope.locations.length; i++) {
                var marker = new google.maps.Marker({
                    position: $scope.locations[i].latlon,
                    // map: map,
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
                truckName: $rootScope.authedUser.truck.truckName,
                id: $rootScope.authedUser._id,
                address: $scope.address,
                updatedAt_readable: moment().format('ddd, MMM D YYYY, h:mma')
            }
        };

        // console.log($scope.myStatus);
        if ($scope.myStatus === false) {
            myTruckData.truck.status = 'Active';
            myTruckData.truck.address = $scope.address;
            myTruckData.truck.currentLocation = [currentLocation[0], currentLocation[1]];

        } else if ($scope.myStatus === true) {
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
            console.log($scope.myStatus);
            
            // SOCKET --> NEED TO SEND NOTICE THAT I UPDATED!
            socketService.emit('notifyUpdatedTruck', $scope.myUserId);
            console.log('I sent a notice that I updated');
            console.log('End Toggle Slide Function');
        })
    };
    
    



    

    // UPDATE MAP WITH CHANGE FROM SOCKET.IO //
    // $scope.updateSingleTruck = function (updatedTruckData) {
    //     $scope.$on('$destroy', function (event) {
    //         socketService.removeAllListeners();
    //         console.log('$Destroy triggered!');
    //     });


    //     console.log('locations', $scope.locations);
    //     for (var i = 0; i < $scope.locations.length; i++) {
    //         if (updatedTruckData.truck.id === $scope.locations[i].id) {
    //             console.log('splice!');
    //             $scope.locations.splice(i, 1);
    //             i--;
    //         }
    //     }
    //     console.log('locations after splice', $scope.locations);

    //     for (var i = 0; i < $scope.markers.length; i++) {
    //         if (updatedTruckData.truck.id === $scope.markers[i].id) {
    //             $scope.markers[i].setMap(null);

    //         }
    //     }
    //     $scope.markers.length = 0;
    //     $scope.markers = [];

    //     if (updatedTruckData.truck.status === "Active") {
    //         var temp = [];
    //         temp.push({
    //             latlon: new google.maps.LatLng(updatedTruckData.truck.currentLocation[0], updatedTruckData.truck.currentLocation[1]),
    //             name: updatedTruckData.truck.truckName,
    //             id: updatedTruckData.truck.id,
    //             updated: updatedTruckData.truck.updatedAt_readable
    //         });

    //         temp[0].distanceFromCurrentUser = (google.maps.geometry.spherical.computeDistanceBetween($scope.latLng, temp[0].latlon) * .000621371).toFixed(2);
    //         $scope.locations.push(temp[0]);
    //         console.log('temp! ', temp);
    //         console.log($scope.locations.length);
    //         temp = undefined;
    //     }

    //     for (var i = 0; i < $scope.locations.length; i++) {
    //         var marker = new google.maps.Marker({
    //             position: $scope.locations[i].latlon,
    //             // map: map,
    //             title: $scope.locations[i].name,
    //             icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    //             id: $scope.locations[i].id,
    //             distanceFromUser: $scope.locations[i].distanceFromCurrentUser,
    //             info: "<p>" + $scope.locations[i].name + " has been here since " + $scope.locations[i].updated + "</p> <p>" + $scope.locations[i].distanceFromCurrentUser + " miles from your current location.</p>"
    //         });

    //         $scope.markers.push(marker);
    //     }
    //     var infowindow = new google.maps.InfoWindow({
    //         // test: 'test123'
    //     });

    //     for (var i = 0; i < $scope.markers.length; i++) {
    //         var marker = $scope.markers[i];
    //         marker.setMap(map);

    //         google.maps.event.addListener(marker, 'click', function () {
    //             infowindow.setContent(this.info);
    //             infowindow.open(map, this);
    //         })
    //     }
    //     console.log('locations after any change ', $scope.locations);
    //     console.log('markers after any change ', $scope.markers);
    // };
    
    
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
                    info: "<p>" + $scope.locations[i].name + " has been here since " + $scope.locations[i].updated + "</p> <p>" + $scope.locations[i].distanceFromCurrentUser + " miles from your current location.</p>"
                })
                $scope.markers.push(newMarker);
            }

            console.log('After looping through and creating markers, the new locations array is now this: ', $scope.locations);
            console.log('And the new markers array looks like this: ', $scope.markers);
        })
    });



});