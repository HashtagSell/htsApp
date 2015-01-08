/**
 * Created by braddavis on 11/15/14.
 */
htsApp.controller('splashController', ['$scope', '$sce', '$state', '$modal', 'splashFactory', function ($scope, $sce, $state, $modal, splashFactory) {

    var splashInstanceCtrl = ['$scope', function ($scope) {

        console.log(splashFactory.result);

        $scope.body = $sce.trustAsHtml(splashFactory.result.body);
        $scope.category = splashFactory.result.category;
        $scope.category_group = splashFactory.category_group;
        $scope.distanceFromUser = splashFactory.result.distanceFromUser;
        $scope.external_id = splashFactory.result.external_id;
        $scope.external_url = splashFactory.result.external_url;
        $scope.heading = $sce.trustAsHtml(splashFactory.result.heading);
        if (splashFactory.result.images.length) {
            //console.log(splashFactory.result.images);
            $scope.images = splashFactory.result.images;
        }
        $scope.location = splashFactory.result.location;
        $scope.price = splashFactory.result.price;
        $scope.source = splashFactory.result.source;


        $scope.map = {
            center: {
                latitude: splashFactory.result.location.lat,
                longitude: splashFactory.result.location.long
            },
            options: {
                zoomControl : false,
                mapTypeControl : false
            },
            zoom: 14
        };


        //Infowindow above map marker displays address or cross streets.  If data not supplied by 3Taps we use google to reverse geocode lat lon
        $scope.reverseGeocode = function (locationObj) {
            if (locationObj.formatted_address) {

                $scope.formatted_address = locationObj.formatted_address;

            } else {

                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(locationObj.lat, locationObj.long);

                geocoder.geocode({'latLng': latlng}, function (results, status) {

                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            console.log('reverse geocoded info', results[1].formatted_address);

                            $scope.formatted_address = results[1].formatted_address;
                        } else {
                            $scope.infoWindow.show = false;
                        }
                    } else {
                        $scope.infoWindow.show = false;
                        console.log('geocoder failed???');
                    }
                });


            }
        };

        $scope.reverseGeocode(splashFactory.result.location);

        $scope.marker = {
            id: 0,
            coords: {
                latitude: splashFactory.result.location.lat,
                longitude: splashFactory.result.location.long
            }
        };

        $scope.infoWindow = {
            show: true
        };


        if(splashFactory.result.annotations) {

            $scope.annotations = splashFactory.sanitizeAnnotations(splashFactory.result.annotations);

            console.log('here are sanatized annotations', $scope.annotations);
        }

    }];

    var splashInstance = $modal.open({
        backdrop: false,
        templateUrl: "js/splash/partials/splash_content.html",
        windowTemplateUrl: "js/splash/partials/splash_window.html",
        controller: splashInstanceCtrl
    });


    splashInstance.result.then(function (selectedItem) {
        console.log(selectedItem);
    }, function () {
        console.log('Splash dismissed at: ' + new Date());
        splashInstance.dismiss();
        $state.go('^');
    });


    //Hack this closes splash modal when user clicks back button https://github.com/angular-ui/bootstrap/issues/335
    $scope.$on('$stateChangeStart', function () {
        splashInstance.dismiss();
    });


}]);