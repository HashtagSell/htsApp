/**
 * Created by braddavis on 11/15/14.
 */
htsApp.controller('splashController', ['$scope', '$sce', '$state', '$modal', 'splashFactory', 'Session', 'socketio', function ($scope, $sce, $state, $modal, splashFactory, Session, socketio) {

    var splashInstanceCtrl = ['$scope', 'sideNavFactory', 'uiGmapGoogleMapApi', 'authModalFactory', 'favesFactory', 'qaFactory', function ($scope, sideNavFactory, uiGmapGoogleMapApi, authModalFactory, favesFactory, qaFactory) {

        $scope.userObj = Session.userObj;
        $scope.result = splashFactory.result;

        $scope.slickConfig = {
            dots: true,
            lazyLoad: 'progressive',
            infinite: true,
            speed: 100,
            slidesToScroll: 1,
            variableWidth: true,
            centerMode: true
        };


        $scope.toggles = {
            showCarousel: true
        };

        uiGmapGoogleMapApi.then(function (maps) {
            $scope.map = {
                settings: {
                    center: {
                        latitude: $scope.result.geo.coordinates[1],
                        longitude: $scope.result.geo.coordinates[0]
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
                        latitude: $scope.result.geo.coordinates[1],
                        longitude: $scope.result.geo.coordinates[0]
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


        if ($scope.userObj.user_settings.loggedIn) {
            favesFactory.checkFave($scope.result, function (response) {
                console.log('favorited response: ' + response);
                $scope.favorited = response;
            });
        }


        $scope.toggleFave = function (item) {
            if ($scope.userObj.user_settings.loggedIn) {
                console.log('favorited status: ', $scope.favorited);
                console.log(item);
                if (!$scope.favorited) { //If not already favorited
                    favesFactory.addFave(item, function () {  //Add the favorite and flag as done
                        $scope.favorited = true;
                    });
                } else { //toggle off favorite
                    favesFactory.removeFave(item, function () {
                        $scope.favorited = false;
                    });
                }
            } else {

                authModalFactory.signInModal();

            }
        };


        //If we do not know the formatted address of the item we use the lat and lon to reverse geocode the closest address or cross-street.
        if (!$scope.result.external.threeTaps.location.formatted) {
            console.log($scope.result);
            (function () {

                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng($scope.result.geo.coordinates[0], $scope.result.geo.coordinates[1]);

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

            $scope.windowOptions.content = $scope.result.external.threeTaps.location.formatted;
            console.log('already have address: ', $scope.windowOptions.content);
        }

        //If the item has annotations then display only ones that match our whitelist.
        if ($scope.result.annotations) {
            $scope.result.sanitized_annotations = splashFactory.sanitizeAnnotations($scope.result.annotations);
        }


        //Responsive Navigation
        $scope.sideNavOffCanvas = sideNavFactory.sideNavOffCanvas;

        console.log($scope);

        $scope.toggleOffCanvasSideNav = function () {
            $scope.sideNavOffCanvas.hidden = !$scope.sideNavOffCanvas.hidden;
        };


        $scope.questions = qaFactory.questions;

        $scope.getPostingIdQuestions = function() {

            qaFactory.getPostingIdQuestions($scope.result.postingId).then(function (response) {
                console.log(response);
            }, function (err) {
                console.log(err);
            });

        };

        $scope.submitQuestion = function(question) {
            if ($scope.userObj.user_settings.loggedIn) {
                qaFactory.submitQuestion(question, $scope.result.postingId, $scope.userObj.user_settings.name).then(function (response) {
                    console.log(response);
                }, function (err) {
                   console.log(err);
                });
            } else {
                authModalFactory.signInModal();
            }
        };


    }];




    var showSplashModal = function () {

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
            if(reason === 'feed' || reason === 'selling' || reason === 'notifications' || reason === 'interested' || reason === 'mailbox') {
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
    };


    //If the result object is passed in via router
    if (splashFactory.result) {

        console.log(splashFactory.result);

        showSplashModal();

    } else { //The user has been linked to the splash page or refreshed and we must lookup the item in our database.

        var postingId = $state.params.id;

        splashFactory.lookupItemDetails(postingId).then(function (response) {

            splashFactory.result = response.data;

            showSplashModal();

        }, function (err) {

            console.log(err);

        });

    }
}]);


htsApp.directive('splashSideProfile', ['splashFactory', function (splashFactory) {
    return {
        restrict: 'E',
        scope: {
            result: '='
        },
        link : function (scope, element, attrs) {

            console.log(scope.result.images[0]);

            if(scope.result.external.source.code === 'HSHTG') {

                var username = scope.result.username;

                splashFactory.getUserProfile(username).then(function (response) {

                    if (response.status !== 200) {

                        var error = response.data.error;
                        console.log(error);

                    } else if (response.status === 200) {

                        var sellerProfileDetails = response.data.user;

                        console.log(sellerProfileDetails);

                        var bannerElement = angular.element(element[0].querySelector('.profile'));
                        bannerElement.css({
                            'background-image': "url(" + sellerProfileDetails.banner_photo + ")",
                            'background-size': "cover"
                        });

                        var profilePhotoElement = angular.element(element[0].querySelector('.bs-profile-image'));
                        profilePhotoElement.css({
                            'background-image': "url(" + sellerProfileDetails.profile_photo + ")",
                            'background-size': "cover"
                        });

                        var username = angular.element(element[0].querySelector('.splash-bs-username'));
                        username.html('@' + sellerProfileDetails.name);
                    }
                }, function (response) {

                    console.log(response);

                    //TODO: Use modal service to notify users

                });
            } else {

                var bannerElement = angular.element(element[0].querySelector('.profile'));

                if (scope.result.images.length) {

                    var photoIndex = scope.result.images.length - 1;
                    var lastImage = scope.result.images[photoIndex].thumb || scope.result.images[photoIndex].images || scope.result.images[photoIndex].full;

                    bannerElement.css({
                        'background-image': "url(" + lastImage + ")",
                        'background-size': "cover"
                    });
                } else {

                    alert('finish banner placeholder');
                }

                var usernamePlaceholder = angular.element(element[0].querySelector('.splash-bs-username'));
                var sourceIcon = angular.element(element[0].querySelector('.bs-profile-image'));
                if (scope.result.external.source.code === "APSTD") {

                    sourceIcon.css({
                        'background-image': "url(/images/logo/sources/apartments_com_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@apartments.com');

                } else if (scope.result.external.source.code === "AUTOD") {

                    sourceIcon.css({
                        'background-image': "url(/images/logo/sources/autotrader_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@autotrader.com');

                } else if (scope.result.external.source.code === "BKPGE") {

                    sourceIcon.css({
                        'background-image': "url(/images/logo/sources/backpage_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@backpage.com');

                } else if (scope.result.external.source.code === "CRAIG") {

                    sourceIcon.css({
                        'background-image': "url(/images/logo/sources/craigslist_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@craigslist.com');

                } else if (scope.result.external.source.code === "EBAYM") {

                    sourceIcon.css({
                        'background-image': "url(/images/logo/sources/ebay_motors_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@ebaymotors.com');

                } else if (scope.result.external.source.code === "E_BAY") {

                    sourceIcon.css({
                        'background-image': "url(/images/logo/sources/ebay_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@ebay.com');
                }

            }
        }
    };
}]);