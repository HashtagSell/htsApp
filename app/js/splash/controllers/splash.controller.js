/**
 * Created by braddavis on 11/15/14.
 */
htsApp.controller('splashController', ['$scope', '$rootScope', '$sce', '$state', '$modal', 'splashFactory', 'Session', 'socketio', function ($scope, $rootScope, $sce, $state, $modal, splashFactory, Session, socketio) {

    var splashInstanceCtrl = ['$scope', 'sideNavFactory', 'uiGmapGoogleMapApi', 'authModalFactory', 'favesFactory', 'qaFactory', 'transactionFactory', function ($scope, sideNavFactory, uiGmapGoogleMapApi, authModalFactory, favesFactory, qaFactory, transactionFactory) {

        $scope.userObj = Session.userObj;
        $scope.result = splashFactory.result;


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
                //console.log('favorited response: ' + response);
                $scope.favorited = response;
            });
        }


        $scope.toggleFave = function (item) {
            if ($scope.userObj.user_settings.loggedIn) {
                //console.log('favorited status: ', $scope.favorited);
                //console.log(item);
                if (!$scope.favorited) { //If not already favorited
                    favesFactory.addFave(item, function () {  //Add the favorite and flag as done
                        $scope.favorited = true;
                        socketio.joinPostingRoom(item.postingId, 'inWatchList'); //Join the room of each posting the user owns.
                    });
                } else { //toggle off favorite
                    favesFactory.removeFave(item, function () {
                        $scope.favorited = false;
                        socketio.leavePostingRoom(item.postingId, 'inWatchList'); //Join the room of each posting the user owns.
                    });
                }
            } else {

                $state.go('signup');

            }
        };


        //If we do not know the formatted address of the item we use the lat and lon to reverse geocode the closest address or cross-street.
        if (!$scope.result.external.threeTaps.location.formatted) {
            //console.log($scope.result);
            (function () {

                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng($scope.result.geo.coordinates[0], $scope.result.geo.coordinates[1]);

                geocoder.geocode({'latLng': latlng}, function (results, status) {

                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            //console.log('reverse geocoded info', results[1].formatted_address);

                            $scope.windowOptions.content = results[1].formatted_address;
                        }
                    } else {
                        $scope.windowOptions.content = 'no address discovered';
                    }
                });

            })();
        } else {

            $scope.windowOptions.content = $scope.result.external.threeTaps.location.formatted;
            //console.log('already have address: ', $scope.windowOptions.content);
        }

        //If the item has annotations then display only ones that match our whitelist.
        if ($scope.result.annotations) {
            $scope.result.sanitized_annotations = splashFactory.sanitizeAnnotations($scope.result.annotations);
        }


        //Responsive Navigation
        $scope.sideNav = sideNavFactory.sideNav;

        //console.log($scope);

        $scope.toggleOffCanvasSideNav = function () {
            $scope.sideNav.hidden = !$scope.sideNav.hidden;
        };


        $scope.questions = qaFactory.questions;

        $scope.getPostingIdQuestions = function() {

            qaFactory.getPostingIdQuestions($scope.result.postingId).then(function (response) {
                //console.log(response);
            }, function (err) {
                console.log(err);
            });

        };

        $scope.submitQuestion = function(question) {

            var loggedIn = $scope.userObj.user_settings.loggedIn;

            if (loggedIn) {

                var post = $scope.result;
                var username = $scope.userObj.user_settings.name;

                socketio.joinPostingRoom(post.postingId, 'inWatchList', function(){

                    qaFactory.submitQuestion(question, post, username).then(function (response) {

                        console.log(response);

                    }, function (err) {
                        console.log(err);
                    });

                });

            } else {
                $state.go('signup');
            }
        };







        $scope.emailSeller = function (result) {
            transactionFactory.quickCompose(result);
        };

        $scope.displayPhone = function (result) {
            transactionFactory.displayPhone(result);
        };

        $scope.placeOffer = function (result) {
            transactionFactory.placeOffer(result);
        };

        $scope.buyOnline = function (result) {
            alert('online payment and shipping coming soon!');
        };

        $scope.placeBid = function (result) {
            transactionFactory.placeBid(result);
        };

        $scope.showOriginal = function (result) {
            transactionFactory.showOriginal(result);
        };


    }];




    var showSplashModal = function () {

        var splashInstance = $modal.open({
            backdrop: false,
            templateUrl: "/js/splash/partials/splash_content.html",
            windowTemplateUrl: "js/splash/partials/splash_window.html",
            controller: splashInstanceCtrl
        });


        splashInstance.result.then(function (selectedItem) {
            //console.log(selectedItem);
        }, function (direct) {
            if(!direct) {
                $state.go('^');
            }
        });


        //Hack this closes splash modal when user clicks back button https://github.com/angular-ui/bootstrap/issues/335
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            splashInstance.dismiss('direct');
        });
    };


    //If the result object is passed in via router
    if (splashFactory.result) {

        //console.log(splashFactory.result);

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

            //console.log(scope.result.images[0]);

            if(scope.result.external.source.code === 'HSHTG') {

                var username = scope.result.username;

                splashFactory.getUserProfile(username).then(function (response) {

                    if (response.status !== 200) {

                        var error = response.data.error;
                        console.log(error);

                    } else if (response.status === 200) {

                        var sellerProfileDetails = response.data.user;

                        //console.log(sellerProfileDetails);

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

                    bannerElement.css({
                        'background-image': "url(https://static.hashtagsell.com/htsApp/placeholders/header-placeholder.png)",
                        'background-size': "cover"
                    });
                }

                var usernamePlaceholder = angular.element(element[0].querySelector('.splash-bs-username'));
                var sourceIcon = angular.element(element[0].querySelector('.bs-profile-image'));
                if (scope.result.external.source.code === "APSTD") {

                    sourceIcon.css({
                        'background-image': "url(https://static.hashtagsell.com/logos/marketplaces/apartments_com_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@apartments.com');

                } else if (scope.result.external.source.code === "AUTOD") {

                    sourceIcon.css({
                        'background-image': "url(https://static.hashtagsell.com/logos/marketplaces/autotrader_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@autotrader.com');

                } else if (scope.result.external.source.code === "BKPGE") {

                    sourceIcon.css({
                        'background-image': "url(https://static.hashtagsell.com/logos/marketplaces/backpage_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@backpage.com');

                } else if (scope.result.external.source.code === "CRAIG") {

                    sourceIcon.css({
                        'background-image': "url(https://static.hashtagsell.com/logos/marketplaces/craigslist_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@craigslist.com');

                } else if (scope.result.external.source.code === "EBAYM") {

                    sourceIcon.css({
                        'background-image': "url(https://static.hashtagsell.com/logos/marketplaces/ebay_motors_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@ebaymotors.com');

                } else if (scope.result.external.source.code === "E_BAY") {

                    sourceIcon.css({
                        'background-image': "url(https://static.hashtagsell.com/logos/marketplaces/ebay_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@ebay.com');
                }

            }
        }
    };
}]);