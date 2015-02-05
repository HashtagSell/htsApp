/**
 * Created by braddavis on 11/15/14.
 */
htsApp.controller('splashController', ['$scope', '$sce', '$state', '$modal', 'splashFactory', 'Session', 'socketio', function ($scope, $sce, $state, $modal, splashFactory, Session, socketio) {

    var splashInstanceCtrl = ['$scope', 'sideNavFactory', 'uiGmapGoogleMapApi', function ($scope, sideNavFactory, uiGmapGoogleMapApi) {

        function toTitleCase(str) {
            console.log(str);
            return str.replace(/\w\S*/g, function(txt){
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }

        $scope.userObj = Session.userObj;
        $scope.result = splashFactory.result;
        $scope.result.body_clean = $sce.trustAsHtml(splashFactory.result.body);
        $scope.result.heading_clean = toTitleCase($sce.trustAsHtml(splashFactory.result.heading).toString());




        $scope.slickConfig = {
            dots: true,
            lazyLoad: 'progressive',
            infinite: true,
            speed: 100,
            slidesToScroll: 1,
            //TODO: Track this bug to allow for variableWidth on next release: https://github.com/kenwheeler/slick/issues/790
            variableWidth: true,
            centerMode: false
        };


        $scope.toggles = {
            showCarousel: true
        };

        uiGmapGoogleMapApi.then(function(maps) {
            $scope.map = {
                settings: {
                    center: {
                        latitude: $scope.result.location.lat,
                        longitude: $scope.result.location.long
                    },
                    options: {
                        zoomControl: false,
                        panControl: false,
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
                }
            };
        });

        $scope.windowOptions = {
            content: 'please wait',
            disableAutoPan: false
        };

        //Google maps InfoWindow on marker click
        $scope.infoWindow = {
            show: false
        };

        $scope.onClick = function () {
            $scope.$apply(function () {
                $scope.infoWindow.show = !$scope.infoWindow.show;
            });
        };

        $scope.closeClick = function () {
            $scope.infoWindow.show = false;
        };

        //If we do not know the formatted address of the item we use the lat and lon to reverse geocode the closest address or cross-street.
        if (!$scope.result.location.formatted_address) {
            (function () {

                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng($scope.result.location.lat, $scope.result.location.long);

                geocoder.geocode({'latLng': latlng}, function (results, status) {

                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            console.log('reverse geocoded info', results[1].formatted_address);

                            $scope.windowOptions.content = results[1].formatted_address;
                        }
                    } else {
                        $scope.windowOptions.content = 'no address discovered';
                    }
                });

            })();
        } else {

            $scope.windowOptions.content = $scope.result.location.formatted_address;
            console.log('already have address: ', $scope.windowOptions.content);
        }

        //If the item has annotations then display only ones that match our whitelist.
        if ($scope.result.annotations) {
            $scope.result.sanitized_annotations = splashFactory.sanitizeAnnotations($scope.result.annotations);
        }




        //Socket.io RTC integration
        $scope.updates = socketio.updates;

        socketio.socket.on('message', function () {
            $scope.$apply($scope.updates);
            console.log('controller sees', $scope.updates);
        });

        $scope.askSellerQuestion = function (question) {
            socketio.sendMessage($scope.result.external_id, question);
        };




        //Responsive Navigation
        $scope.sideNavOffCanvas = sideNavFactory.sideNavOffCanvas;

        console.log($scope.sideNavOffCanvas);

        $scope.toggleOffCanvasSideNav = function () {
            $scope.sideNavOffCanvas.hidden = !$scope.sideNavOffCanvas.hidden;
        };

    }];









    var splashInstance = $modal.open({
        backdrop: false,
        templateUrl: "js/splash/partials/splash_content_new.html",
        windowTemplateUrl: "js/splash/partials/splash_window.html",
        controller: splashInstanceCtrl
    });


    splashInstance.result.then(function (selectedItem) {
        console.log(selectedItem);
    }, function (reason) {
        console.log('Splash dismissed at: ' + new Date());
        if(reason === 'feed' || reason === 'results' || reason === 'selling' || reason === 'notifications' || reason === 'interested') {
            splashInstance.dismiss();
            $state.go(reason);
        } else {
            splashInstance.dismiss();
            $state.go('^');
        }
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