angular.module('food-truck-finder').controller('mapCtrl', function ($scope, $state, $cordovaGeolocation, mapService) {

    var options = { timeout: 10000, enableHighAccuracy: true };


    var map;

    $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

        map = $scope.map;

        google.maps.event.addListenerOnce($scope.map, 'idle', function () {

            var marker = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.DROP,
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

            mapService.getTrucks().then(function (trucks) {

                console.log('trucks', trucks);
                
                for (var i = 0; i < trucks.length; i++) {
                    var truck = trucks[i];
                    locations.push({
                        latlon: new google.maps.LatLng(truck.currentLocation[1], truck.currentLocation[0]),
                        name: truck.name,
                        id: truck._id,
                        updated: truck.updated_at_readable,
                    })
                };
                console.log('locations', locations);

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
                    console.log('markers', markers);
                }

            });


        });

    }, function (error) {
        console.log("Could not get location");
    });












});