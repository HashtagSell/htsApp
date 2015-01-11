/**
 * Created by braddavis on 11/15/14.
 */
htsApp.controller('splashController', ['$scope', '$sce', '$state', '$modal', 'splashFactory', function ($scope, $sce, $state, $modal, splashFactory) {

    var splashInstanceCtrl = ['$scope', function ($scope) {

        $scope.result = splashFactory.result;
        $scope.result.body_clean = $sce.trustAsHtml(splashFactory.result.body);
        $scope.result.heading_clean = $sce.trustAsHtml(splashFactory.result.heading);

        $scope.map = {
            settings: {
                center: {
                    latitude: $scope.result.location.lat,
                    longitude: $scope.result.location.long
                },
                options: {
                    zoomControl: false,
                    mapTypeControl: false
                },
                zoom: 14
            },
            marker: {
                id: 0,
                coords: {
                    latitude: $scope.result.location.lat,
                    longitude: $scope.result.location.long
                }
            },
            infoWindow: {
                show: true
            }
        };


        //If we do not know the formatted address of the item we use the lat and lon to reverse geocode the closest address or cross-street.
        if (!$scope.result.location.formatted_address) {
            (function () {

                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng($scope.result.location.lat, $scope.result.location.long);

                geocoder.geocode({'latLng': latlng}, function (results, status) {

                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            console.log('reverse geocoded info', results[1].formatted_address);

                            $scope.result.location.geocoded_address = results[1].formatted_address;
                        } else {
                            $scope.map.infoWindow.show = false;
                        }
                    } else {
                        $scope.map.infoWindow.show = false;
                        console.log('geocoder failed???');
                    }
                });

            })();
        }


        if ($scope.result.annotations) {

            $scope.result.sanitized_annotations = splashFactory.sanitizeAnnotations($scope.result.annotations);

        }

        console.log($scope.result);
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