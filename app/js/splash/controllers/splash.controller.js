/**
 * Created by braddavis on 11/15/14.
 */
htsApp.controller('splashController', ['$scope', '$sce', '$state', '$modal', 'splashFactory', 'Session', function ($scope, $sce, $state, $modal, splashFactory, Session) {

    var splashInstanceCtrl = ['$scope', function ($scope) {

        $scope.userObj = Session.userObj;
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


htsApp.directive('sideProfile', ['splashFactory', function (splashFactory) {
    return {
        restrict: 'E',
        scope: {
            result: '='
        },
        link : function (scope, element, attrs) {

            console.log(scope.result.images[0]);

            if(scope.result.source === 'HSHTG') {

                var sellerID = scope.result.seller_id;

                splashFactory.getUserProfile(sellerID).then(function (response) {

                    if (response.status !== 200) {

                        var error = response.data.error;
                        console.log(error);

                    } else if (response.status === 200) {

                        var sellerProfileDetails = response.data.user;

                        element.css({
                            'background-image': "url(" + sellerProfileDetails.banner_photo + ")",
                            'background-size': "cover"
                        });

                        var profilePhotoElement = angular.element(element[0].querySelector('.bs-profile-image'));
                        profilePhotoElement.css({
                            'background-image': "url(" + sellerProfileDetails.profile_photo + ")",
                            'background-size': "cover"
                        });

                    }
                }, function (response) {

                    console.log(response);

                    //TODO: Use modal service to notify users

                });
            } else {

                if (scope.result.images.length) {

                    var photoIndex = scope.result.images.length - 1;
                    var lastImage = scope.result.images[photoIndex].thumb || scope.result.images[photoIndex].images || scope.result.images[photoIndex].full;

                    element.css({
                        'background-image': "url(" + lastImage + ")",
                        'background-size': "cover"
                    });
                }


                var sourceIcon = angular.element(element[0].querySelector('.bs-profile-image'));
                if (scope.result.source === "APSTD") {

                    sourceIcon.css({
                        'background-image': "url(/images/logo/sources/apartments_com_splash.png)",
                        'background-size': "cover"
                    });

                } else if (scope.result.source === "AUTOD") {

                    sourceIcon.css({
                        'background-image': "url(/images/logo/sources/autotrader_splash.png)",
                        'background-size': "cover"
                    });

                } else if (scope.result.source === "BKPGE") {

                    sourceIcon.css({
                        'background-image': "url(/images/logo/sources/backpage_splash.png)",
                        'background-size': "cover"
                    });

                } else if (scope.result.source === "CRAIG") {

                    sourceIcon.css({
                        'background-image': "url(/images/logo/sources/craigslist_splash.png)",
                        'background-size': "cover"
                    });

                } else if (scope.result.source === "EBAYM") {

                    sourceIcon.css({
                        'background-image': "url(/images/logo/sources/ebay_motors_splash.png)",
                        'background-size': "cover"
                    });

                } else if (scope.result.source === "E_BAY") {

                    sourceIcon.css({
                        'background-image': "url(/images/logo/sources/ebay_splash.png)",
                        'background-size': "cover"
                    });

                }

            }
        }
    };
}]);