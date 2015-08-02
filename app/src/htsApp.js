// _    _           _     _               _____      _ _
//| |  | |         | |   | |             / ____|    | | |
//| |__| | __ _ ___| |__ | |_ __ _  __ _| (___   ___| | |  ___ ___  _ __ ___
//|  __  |/ _` / __| '_ \| __/ _` |/ _` |\___ \ / _ \ | | / __/ _ \| '_ ` _ \
//| |  | | (_| \__ \ | | | || (_| | (_| |____) |  __/ | || (_| (_) | | | | | |
//|_|  |_|\__,_|___/_| |_|\__\__,_|\__, |_____/ \___|_|_(_)___\___/|_| |_| |_|
//                                  __/ |
//                                 |___/
//
//           This is where it all begins...

var htsApp = angular.module('htsApp', [
    'globalVars',
    'ui.router',
    'ct.ui.router.extras.core',
    'ct.ui.router.extras.dsr',
    'ct.ui.router.extras.sticky',
    'ui.bootstrap',
    'mentio',
    'ui.bootstrap-slider',
    'frapontillo.bootstrap-switch',
    'ngTable',
    'uiGmapgoogle-maps',
    'ivh.treeview',
    'vs-repeat',
    'ui.bootstrap.datetimepicker',
    'ngSanitize',
    'ui-notification',
    'ezfb',
    'slick',
    'braintree-angular',
    'ui.select',
    'angulartics',
    'angulartics.google.analytics'
]);


//Forcing XHR requests via Angular $http (AJAX)
htsApp.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$tooltipProvider', 'ivhTreeviewOptionsProvider', '$locationProvider', 'ezfbProvider', 'ENV', function ($httpProvider, $stateProvider, $urlRouterProvider, $tooltipProvider, ivhTreeviewOptionsProvider, $locationProvider, ezfbProvider, ENV) {

    //Allows for async ajax calls to authentication apis
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

    //removes # from urls
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    //Tells search engines and crawlers this site loads content dynamically
    $locationProvider.hashPrefix('!');

    //set locale of easy facebook angular module
    ezfbProvider.setLocale('en_US');

    ezfbProvider.setInitParams({
        // This is my FB app id
        appId: ENV.fbAppId,
        version: 'v2.1'
    });

    // configure the tooltipProvider.  Turn off tooltips for mobile.  on for desktop.
    var tooltipFactory = $tooltipProvider.$get[$tooltipProvider.$get.length - 1];

    // decorate the tooltip getter
    $tooltipProvider.$get = [
        '$window',
        '$compile',
        '$timeout',
        '$document',
        '$position',
        '$interpolate',
        function ($window, $compile, $timeout, $document, $position, $interpolate) {
            // for touch devices, don't return tooltips
            if ('ontouchstart' in $window) {
                return function () {
                    return {
                        compile: function () { }
                    };
                };
            } else {
                // run the default behavior
                return tooltipFactory($window, $compile, $timeout, $document, $position, $interpolate);
            }
        }
    ];

    //Used to manually trigger tooltips via js code.
    $tooltipProvider.setTriggers({
        'show': 'hide'
    });


    //Modifies category checkbox nesting in feed route
    ivhTreeviewOptionsProvider.set({
        twistieCollapsedTpl: '<span class="glyphicon glyphicon-chevron-right"></span>',
        twistieExpandedTpl: '<span class="glyphicon glyphicon-chevron-down"></span>',
        twistieLeafTpl: '',
        defaultSelectedState: false
    });


    //function assigned to routes that can only be accessed when user logged in
    var loginRequired = ['$q', 'Session', '$state', '$timeout', 'redirect', 'authModalFactory', function ($q, Session, $state, $timeout, redirect, authModalFactory) {
        var deferred = $q.defer();

        console.log('checking login!', Session.userObj);
        console.log('login Checker should redirect to', redirect);

        if (!Session.userObj.user_settings.loggedIn) {

            $timeout(function() {
                $state.go('signup', { 'redirect': redirect });
            });

            //authModalFactory.signUpModal($state.params);

            deferred.resolve();

        } else {
            deferred.resolve();
        }

        return deferred.promise;

    }];


    //Connects to postingId of post when user opens splash page
    var joinRoom = ['socketio', 'Session', '$stateParams', 'splashFactory', function (socketio, Session, $stateParams, splashFactory) {
       if (Session.userObj.user_settings.loggedIn) {
           socketio.joinPostingRoom($stateParams.id, 'toggleSplash');

           //Checks if this is internal hashtagsell posting.. If so join the owner of the postings socket.io room.
           if(splashFactory.result) {
               if (splashFactory.result.external.source === 'HSHTG') {

                   var postingOwner = splashFactory.result.username;

                   socketio.joinUserRoom(postingOwner, Session.userObj.user_settings.name);
               }
           }
       }
    }];

    //Leaves room when user exits splash view
    var leaveRoom = ['socketio', 'Session', '$stateParams', 'splashFactory', function (socketio, Session, $stateParams, splashFactory) {
        if (Session.userObj.user_settings.loggedIn) {
            socketio.leavePostingRoom($stateParams.id, 'toggleSplash');

            if(splashFactory.result) {
                if (splashFactory.result.external.source === 'HSHTG') {

                    var postingOwner = splashFactory.result.username;

                    socketio.leaveUserRoom(postingOwner);
                }
            }
        }
    }];


    //Redirect to 404 page if user requests route we do not recognize.
    $urlRouterProvider.otherwise(function($injector, $location){
        var state = $injector.get('$state');
        state.go('404');
        return $location.path();
    });


    $stateProvider.
        state('404', {
            views: {
                "root": {
                    templateUrl: 'js/404/partials/404.html'
                }
            }
        }).
        state('betaAgreement', {
            url: "/beta-agreement",
            views: {
                'root': {
                    templateUrl: 'js/legal/betaAgreement/partials/betaAgreement.partial.html',
                    controller: 'betaAgreementController'
                }
            }
        }).
        state('checkemail', {
            url: '/checkemail',
            params: { 'redirect': null },
            views: {
                'modal': {
                    controller: function(authModalFactory, $state) {
                        authModalFactory.checkEmailModal($state.params);
                    }
                }
            }

        }).
        state('externalSplash', {
            url: "/ext/:id",
            controller: 'splashController',
            sticky: true
        }).
        state('feed', {
            url: "/feed",
            templateUrl: "js/feed/partials/feed.partial.html",
            controller: "feed.controller",
            resolve: {
                redirect: function () {
                    return 'feed';
                }
            },
            sticky: true
        }).
        state('feed.splash', {
            url: "/:id",
            controller: 'splashController',
            onEnter: joinRoom,
            onExit: leaveRoom,
            sticky: true
        }).
        state('forgot', {
            url: '/forgot?msg',
            params: {
                'redirect': null,
                'msg': null
            },
            views: {
                'modal': {
                    controller: function(authModalFactory, $state, $rootScope) {
                        if(!$state.params.redirect) {
                            authModalFactory.forgotPasswordModal({'redirect': $rootScope.previousState});
                        } else {
                            authModalFactory.forgotPasswordModal($state.params);
                        }
                    }
                }
            }
        }).
        state('myposts', {
            url: "/myposts",
            templateUrl: "js/myPosts/partials/myPosts.html",
            controller: 'myPosts.controller',
            resolve: {
                redirect: function () {
                    return 'myposts';
                }
            },
            sticky: true
        }).
        state('myposts.questions', {
            url: "/questions/:postingId"
        }).
        state('myposts.meetings', {
            url: "/meetings/:postingId"
        }).
        state('myposts.splash', {
            url: "/:id",
            controller: 'splashController',
            sticky: true
        }).
        state('notifications', {
            url: "/notifications",
            templateUrl: "js/notifications/partials/notifications.html",
            controller: 'notifications.controller',
            resolve: {
                redirect: function () {
                    return 'notifications';
                }
            },
            sticky: true
        }).
        state('payment', {
            url: "/payment/:postingId/:offerId",
            views: {
                'root': {
                    controller: 'paymentController',
                    templateUrl: 'js/payment/partials/payment.partial.html'
                }
            }
        }).
        state('postingRules', {
            url: "/posting-rules",
            views: {
                'root': {
                    templateUrl: 'js/legal/postingRules/partials/postingRules.partial.html',
                    controller: 'postingRulesController'
                }
            }
        }).
        state('privacyPolicy', {
            url: "/privacy-policy",
            views: {
                'root': {
                    templateUrl: 'js/legal/privacyPolicy/partials/privacyPolicy.partial.html',
                    controller: 'privacyPolicyController'
                }
            }
        }).
        state('profile', {
            url: "/profile",
            templateUrl: 'js/profile/partials/profile.partial.html',
            controller: 'profile.controller',
            resolve: {
                redirect: function () {
                    return 'profile';
                }
            },
            sticky: true
        }).
        state('reset', {
            url: '/reset/:token/',
            views: {
                modals: {
                    controller: function(authModalFactory, $state) {
                        authModalFactory.resetPasswordModal('signin', $state.params.token);
                    }
                }
            }
        }).
        state('results', {
            url: '/q/:q',
            params: {
                'q': null,
                'city': null,
                'locationObj': null,
                'price': null
            },
            controller: 'results.controller',
            templateUrl: "js/results/partials/results_partial.html",
            resolve: {
                redirect: function () {
                    return 'results';
                }
            },
            sticky: true
        }).
        state('results.splash', {
            url: "/:id",
            params: {
                'q': null,
                'city': null,
                'locationObj': null,
                'id': null
            },
            controller: 'splashController',
            onEnter: joinRoom,
            onExit: leaveRoom,
            sticky: true
        }).
        state('review', {
            url: "/review/:postingId/:offerId/:userId",
            views: {
                'root': {
                    controller: 'peerReviewController',
                    templateUrl: 'js/peerReview/partials/peerReview.partial.html'
                }
            }
        }).
        state('root', {
            url: "/",
            onEnter: function ($state) {
                $state.go('feed', {}, {location: false});
            }
        }).
        state('settings', {
            url: "/settings",
            templateUrl: "js/settings/settings_partial.html",
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'settings';
                }
            }
        }).
        state('settings.account', {
            url: "/account",
            templateUrl: "js/settings/account/partials/settings.account_partial.html",
            controller: "settings.account.controller"
        }).
        state('settings.password', {
            url: "/password",
            templateUrl: "js/settings/password/partials/settings.password_partial.html",
            controller: "settings.password.controller"
        }).
        state('settings.profile', {
            url: "/profile",
            templateUrl: "js/settings/profile/partials/settings.profile_partial.html",
            controller: "settings.profile.controller"
        }).
        state('settings.payment', {
            url: "/payment",
            templateUrl: "js/settings/payment/partials/settings.payment_partial.html",
            controller: "settings.payment.controller"
        }).
        state('signin', {
            url: '/signin?email&tour',
            params: {
                'redirect': null,
                'email': null,
                'tour': null
            },
            views: {
                'modal': {
                    controller: function(authModalFactory, $state, $rootScope) {
                        if(!$state.params.redirect) {
                            authModalFactory.signInModal({'redirect': $rootScope.previousState});
                        } else {
                            authModalFactory.signInModal($state.params);
                        }
                    }
                }
            }
        }).
        state('signup', {
            url: '/signup',
            views: {
                'modal': {
                    controller: function(authModalFactory, $state, $rootScope) {
                        if(!$state.params.redirect) {
                            authModalFactory.signUpModal({'redirect': $rootScope.previousState});
                        } else {
                            authModalFactory.signUpModal($state.params);
                        }
                    }
                }
            },
            params: { 'redirect': null }
        }).
        state('subscribe', {
            url: '/subscribe',
            params: { 'redirect': null },
            views : {
                'modal': {
                    controller: function(authModalFactory, $state, $rootScope) {
                        if(!$state.params.redirect) {
                            authModalFactory.subscribeModal({'redirect': $rootScope.previousState});
                        } else {
                            authModalFactory.subscribeModal($state.params);
                        }
                    }
                }
            }
        }).
        state('termsOfService', {
            url: "/terms-of-service",
            views: {
                'root': {
                    templateUrl: 'js/legal/termsOfService/partials/termsOfService.partial.html',
                    controller: 'termsOfServiceController'
                }
            }
        }).
        state('watchlist', {
            url: "/watchlist",
            templateUrl: "js/watchlist/partials/watchlist.html",
            controller: 'watchlistController',
            resolve: {
                redirect: function () {
                    return 'watchlist';
                }
            },
            sticky: true
        }).
        state('watchlist.questions', {
            url: "/questions/:postingId"
        }).
        state('watchlist.meetings', {
            url: "/meetings/:postingId"
        }).
        state('watchlist.splash', {
            url: "/:id",
            controller: 'splashController',
            onEnter: joinRoom,
            onExit: leaveRoom,
            sticky: true
        });
}]);


//Verifies if input fields match
htsApp.directive('matchinput', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
            matchinput: '='
        },
        link: function (scope, elem, attrs, ctrl) {
            scope.$watch(function () {
                return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || scope.matchinput === ctrl.$modelValue;
            }, function (currentValue) {
                ctrl.$setValidity('match', currentValue);
            });
        }
    };
});


//Convert phone numbers 1234567891 -> (123) 456-7891
htsApp.filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + " (" + city + ") " + number).trim();
    };
});


//Clean the heading of postings in view
htsApp.filter('cleanHeading', ['$sce', function ($sce) {
    return function (dirtyHeading) {
        //Capitalize the first letter of every word
        return dirtyHeading.replace(/\w\S*/g, function (dirtyHeading) {

            //Test against regex expression to find items like integers followed by simicolon.  i.e. 5556;
            var integersAndSimicolon = new RegExp("\\S+([0-9];)");
            if(!integersAndSimicolon.test(dirtyHeading)) {

                var cleanedHeading = dirtyHeading.charAt(0).toUpperCase() + dirtyHeading.substr(1).toLowerCase();
                return $sce.trustAsHtml(cleanedHeading);

            } else {
                return '';
            }
        });
    };
}]);

//Clean the body of postings in the view
htsApp.filter('cleanBody', ['$sce', function ($sce) {
    return function (dirtyBody) {

        dirtyBody = dirtyBody.replace(/[\r\n]/g, '<br />');

        //Find any word that is in ALL CAPS and only capitalize the first letter
        return dirtyBody.replace(/\b([A-Z]{2,})\b/g, function (dirtyBody) {

            //Test against regex expression to find items like integers followed by simicolon.  i.e. 5556;
            var integersAndSimicolon = new RegExp("\\S+([0-9];)");
            if (!integersAndSimicolon.test(dirtyBody)) {

                //TODO: Catch ↵ character and insert new line in html

                var cleanedBody = dirtyBody.charAt(0).toUpperCase() + dirtyBody.substr(1).toLowerCase();
                return $sce.trustAsHtml(cleanedBody);

            } else {
                return '';
            }
        });
    };
}]);


htsApp.filter('cleanBodyExcerpt', ['$sce', function ($sce) {
    return function (dirtyBody) {

        //Find any word that is in ALL CAPS and only capitalize the first letter
        return dirtyBody.replace(/\b([A-Z]{2,})\b/g, function (dirtyBody) {

            //Test against regex expression to find items like integers followed by simicolon.  i.e. 5556;
            var integersAndSimicolon = new RegExp("\\S+([0-9];)");
            if (!integersAndSimicolon.test(dirtyBody)) {

                //TODO: Catch ↵ character and insert new line in html

                var cleanedBody = dirtyBody.charAt(0).toUpperCase() + dirtyBody.substr(1).toLowerCase();
                return $sce.trustAsHtml(cleanedBody);

            } else {
                return '';
            }
        });
    };
}]);





htsApp.directive('awesomebar', ['$sce', function ($sce) {
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function (scope, element, attrs, ngModel) {

            function read() {
                var html = element.html();
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if (attrs.stripBr && html === '<br>') {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }

            if (!ngModel) return; // do nothing if no ng-model

            // Specify how UI should be updated
            ngModel.$render = function () {
                console.log('doing this');
                if (ngModel.$viewValue !== element.html()) {
                    element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
                }
            };

            // Listen for change events to enable binding
            element.on('keydown keyup', function (e) {
                //If the user pressed the enter key
                if(parseInt(e.which) === 13 && e.type === "keydown") {
                    //Check to see if the mentio menu is open or not
                    var mentioMenu = angular.element( document.querySelector( '#mentioMenu') );

                    if(mentioMenu[0].style.display === "none"){
                        console.log('mentio list closed.. submitting query');
                        element.blur();
                        scope.awesomeBarSubmit();
                    } else if(mentioMenu[0].style.display === "block") {
                        console.log('mentio list open');
                    }
                    e.preventDefault();
                } else {
                    scope.$apply(read);
                }
            });
            read(); // initialize
        }
    };
}]);




htsApp.directive('sellbox', ['$sce', '$window', '$timeout', 'newPostFactory', 'mentioUtil', function ($sce, $window, $timeout, newPostFactory, mentioUtil) {
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function (scope, element, attrs, ngModel) {
            function read() {
                var html = element.html();
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if (attrs.stripBr && html === '<br>') {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }

            if (!ngModel) return; // do nothing if no ng-model


            // Specify how UI should be updated
            ngModel.$render = function () {
                if (ngModel.$viewValue !== element.html()) {
                    element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
                }
            };

            //Strips HTML from string.
            function strip(html){
                var tmp = document.createElement("DIV");
                tmp.innerHTML = html;
                return tmp.textContent || tmp.innerText || "";
            }

            //Check if a string is blank, null or undefined
            //function isBlank(str) {
            //    return (!str || /^\s*$/.test(str));
            //}


            //Load the js diff library
            var jsDiff = $window.JsDiff;
            var backspacePressed = false;

            //cleans up model when user removes # $ or @ symbols
            scope.$watch('jsonObj.body', function(newValue, oldValue){

                //if(scope.alerts) {
                //    scope.alerts.banners = [];
                //}

                if(backspacePressed) {
                    backspacePressed = false;
                    console.log('==========Backspace Pressed==========');

                    var oldValueStripped = strip(oldValue);
                    var newValueStripped = strip(newValue);

                    console.log('Old Stripped', oldValueStripped);
                    console.log('New Stripped', newValueStripped);

                    if(newValueStripped) {
                        //Run a diff
                        var diff = jsDiff.diffWords(oldValueStripped, newValueStripped);

                        if (diff.length) {

                            console.log(diff);

                            for (var i = 0; i < diff.length; i++) {
                                var excerpt = diff[i];
                                if (excerpt.removed) {
                                    if (excerpt.value.indexOf('#') !== -1) {
                                        console.log('hasshtag removed ', excerpt.value);

                                        var hashtagToRemove = excerpt.value.replace('#', '');
                                        hashtagToRemove = hashtagToRemove.trim();

                                        scope.cleanModel("#", hashtagToRemove);
                                    } else if (excerpt.value.indexOf('$') !== -1) {
                                        console.log('dollar removed ', excerpt.value);

                                        var priceTagToRemove = excerpt.value.replace('$', '');
                                        priceTagToRemove = priceTagToRemove.trim();

                                        scope.cleanModel("$", priceTagToRemove);
                                    } else if (excerpt.value.indexOf('@') !== -1) {
                                        console.log('@ removed ', excerpt.value);

                                        var atTagToRemove = excerpt.value.replace('@', '');
                                        atTagToRemove = atTagToRemove.trim();

                                        scope.cleanModel("@", atTagToRemove);
                                    }
                                }
                            }
                        }
                    } else {
                        scope.resetAll();
                    }
                }

            });


            //function isEmpty(obj) {
            //    for(var prop in obj) {
            //        if(obj.hasOwnProperty(prop))
            //            return false;
            //    }
            //
            //    return true;
            //}
            //
            //
            //function findMentions(searchText, specialKey) {
            //    //var regexp = /\B\#\w\w+\b/g;
            //    var regexp = new RegExp("\\B\\" + specialKey + "\\w\\w+\\b", "g");
            //    var result = searchText.match(regexp);
            //    if (result) {
            //        for(var m = 0; m < result.length; m++) {
            //            result[m] = result[m].replace(specialKey, '');
            //        }
            //        return result;
            //    } else {
            //        return false;
            //    }
            //}

            // Listen for change events to enable binding
            element.on('keydown keyup', function (e) {
                var keyCode = parseInt(e.which);

                //Catching if users add $ @ or # in their text AFTER up the entire ad.
                //if(e.type === "keyup") {
                //    var specialKey = null;
                //
                //    if (keyCode === 50) {
                //        specialKey = '@';
                //        if(!isEmpty(scope.jsonObj.location)){
                //            return false;
                //        }
                //    } else if (keyCode === 51) {
                //        specialKey = '#';
                //    } else if (keyCode === 52) {
                //        specialKey = '$';
                //        if(!isEmpty(scope.jsonObj.price)){
                //            return false;
                //        }
                //    }
                //
                //    //If the demo text has been cleared and the presed key is # or $ or @
                //    if (scope.placeholderCleared && specialKey !== null) {
                //
                //        //wait 500ms and verify that the hashtag has not already been picked up and put in hashtagarray
                //        $timeout(function () {
                //
                //            var nodeSelection = $window.getSelection();
                //            var text = nodeSelection.anchorNode.data;
                //            var textLength = nodeSelection.anchorNode.length;
                //            var mentions = findMentions(text, specialKey);
                //
                //            console.log(mentions);
                //
                //            //Make sure there is at least one mention in the nodeSelection
                //            if (mentions.length) {
                //
                //                var mentioMenu;
                //                if(specialKey === '#') {
                //                    mentioMenu = angular.element(document.querySelector('.mentioMenuProducts'));
                //                } else if(specialKey === '$') {
                //                    mentioMenu = angular.element(document.querySelector('.mentioMenuPrices'));
                //                } else if(specialKey === '@') {
                //                    mentioMenu = angular.element(document.querySelector('.mentioMenuPlaces'));
                //                }
                //
                //                //Make sure the mentio menu is not visible
                //                if(mentioMenu[0].style.display === "none") {
                //
                //                    var indexOfSpecialChar = text.indexOf(specialKey);
                //                    console.log('index of special char', indexOfSpecialChar);
                //
                //                    var indexOfFirstSpaceAfterSpecialChar = text.indexOf(" ", indexOfSpecialChar);
                //                    console.log('index of first space after special char', indexOfFirstSpaceAfterSpecialChar);
                //
                //                    var stopIndex;
                //                    if (indexOfFirstSpaceAfterSpecialChar > -1) {
                //
                //                        stopIndex = indexOfFirstSpaceAfterSpecialChar - indexOfSpecialChar;
                //                        console.log('stop index', stopIndex);
                //                    } else {
                //
                //                        stopIndex = textLength;
                //                        indexOfFirstSpaceAfterSpecialChar = textLength;
                //                        console.log('stop index is last char in text');
                //                    }
                //
                //                    var trimmedMention = text.substr(indexOfSpecialChar + 1, stopIndex - 1);
                //                    var htmlMention;
                //
                //                    if(specialKey === '#') {
                //
                //                        if(newPostFactory.getProductMetaData({value: trimmedMention})) {
                //                            htmlMention = '<span class="mention-highlighter" contentEditable="false">' + specialKey + trimmedMention + '</span>' + '\xA0';
                //                            mentioUtil.pasteHtml(undefined, htmlMention, indexOfSpecialChar, indexOfFirstSpaceAfterSpecialChar);
                //                        } else {
                //                            newPostFactory.alerts.banners.push({
                //                                type: 'danger',
                //                                msg: 'Duplicate hashtags not necessary'
                //                            });
                //                        }
                //
                //                    } else if(specialKey === '$') {
                //
                //                        if(newPostFactory.getPriceMetaData({value: trimmedMention, rate: 'flat_rate'})){
                //                            htmlMention = '<span class="mention-highlighter-price" contentEditable="false">' + specialKey + trimmedMention + '</span>' + '\xA0';
                //                            mentioUtil.pasteHtml(undefined, htmlMention, indexOfSpecialChar, indexOfFirstSpaceAfterSpecialChar);
                //                        } else {
                //                            //newPostFactory.alerts.banners.push({
                //                            //    type: 'danger',
                //                            //    msg: 'Please only use one $ symbol in your post.'
                //                            //});
                //                            console.log('htsApp sell box directive sees priceMetaData returned false.');
                //                        }
                //
                //                    } else if(specialKey === '@') {
                //
                //                        if(newPostFactory.getPlaceMetaData()) {
                //                            htmlMention = '<span class="mention-highlighter-location" contentEditable="false">' + specialKey + trimmedMention + '</span>' + '\xA0';
                //                            mentioUtil.pasteHtml(undefined, htmlMention, indexOfSpecialChar, indexOfFirstSpaceAfterSpecialChar);
                //                        } else {
                //                            newPostFactory.alerts.banners.push({
                //                                type: 'danger',
                //                                msg: 'Please only use one @ symbol in your post.'
                //                            });
                //                        }
                //                    }
                //
                //
                //
                //                } else {
                //                    console.log('mentio menu open');
                //                }
                //            }
                //        }, 1000);
                //    }
                //}

                if(parseInt(keyCode) === 8 && e.type === "keydown") {
                    backspacePressed = true;
                    console.log('setting backspace pressed to true');
                }

                scope.$apply(read);
            });

            read(); // initialize
        }
    };
}]);





htsApp.directive('dropzone', function () {

    return {
        link: function ($scope, element, attrs) {
            var config, dropzone;

            console.log("dropzone scope:", $scope);

            // Disabling autoDiscover, otherwise Dropzone will try to attach twice.
            Dropzone.autoDiscover = false;

            config = $scope[attrs.dropzone];

            // create a Dropzone for the element with the given options
            dropzone = new Dropzone(element[0], config.options);

            // bind the given event handlers
            angular.forEach(config.eventHandlers, function (handler, event) {
                dropzone.on(event, handler);
            });

            config.init = function () {
                dropzone.processQueue();
            };
        }
    };
});



/**
 * Created by braddavis on 4/7/15.
 */
htsApp.directive('dropdownMultiselect', ['favesFactory', function (favesFactory){
    return {
        restrict: 'E',
        scope:{
            selectedlabels: '=',
            userlabels: '=',
            selectedfaves: '=',
            placeholder: '=ngPlaceholder'
        },
        link: function (scope, element) { //Stops dropdown from closing when user clicks on input box
            element.bind('click', function (event) {
                event.stopPropagation();
            });
        },
        template: "<span class='dropdown' dropdown>"+
        "<i class='fa fa-tags dropdown-toggle' dropdown-toggle ng-click='open=!open;openDropdown()'>&nbsp;&nbsp;#Label</i>"+
        "<ul class='dropdown-menu'>"+
        "   <input ng-model='query' type='text' autofocus class='labels-input' placeholder='Filter or Create New Labels'/>" +
        "   <li ng-repeat='label in userlabels | filter:query' class='label-list'>" +
        "       <a ng-click='setSelectedItem()'>" +
        "           <span ng-click='deleteLabel($event)' class='fa fa-minus-circle pull-left delete-label'></span>#{{label.name}}" +
        "           <span ng-class='isChecked(label.name)'><span/>" +
        "       </a>" +
        "   </li>" +
        "   <li>" +
        "       <a dropdown-toggle ng-click='createNewLabel(query)' ng-show='ifQueryUnique(query)'>{{query}} (create new)</a>" +
        "   </li>" +
        "   <li>" +
        "       <a dropdown-toggle ng-click='applyChanges()' ng-show='updatesNecessary'>Apply</a>" +
        "   </li>" +
        "</ul>" +
        "</span>" ,
        controller: ['$scope', 'favesFactory', 'Session', function($scope, favesFactory, Session){

            $scope.currentFaves = Session.userObj.user_settings.favorites;

            $scope.openDropdown = function(){

                $scope.selectedlabels = [];
                $scope.updatesNecessary = false; //Hide the apply button from the user labels drop down

                console.log($scope);

                var currentFavorites = $scope.currentFaves;

                angular.forEach($scope.selectedfaves, function(selected, id) {
                    if(selected) {  //Make sure the item is checked
                        for(i=0; i<currentFavorites.length; i++){
                            if(currentFavorites[i].postingId == id && currentFavorites[i].labels){  //Using the ID of the checked item grab the email, heading, and other meta data from local storage.

                                for(j=0; j<currentFavorites[i].labels.length; j++){ //Loop though all the labels applied to the selected favorite
                                    var discoveredLabel = currentFavorites[i].labels[j];
                                    if (!_.contains($scope.selectedlabels, discoveredLabel)) {
                                        $scope.selectedlabels.push(discoveredLabel);
                                    }
                                }

                            }
                        }
                    }
                });
            };

            //Return boolean that specifies if the filter sting matches any existing labels... If false then user will see, "new label name (create label)".
            $scope.ifQueryUnique = function(query){
                var unique = true; //by default the create label functionality is shown
                if(!query){ //if the filter string is null
                    unique = false; //don't show create label
                } else { //the input field has a value
                    _.find($scope.userlabels, function (label) { //loop through the users labels
                        if(label.name == query){ //if the filter string matches a label name
                            unique = false; //don't show create label
                        }
                    });
                }
                return unique;
            };

            $scope.createNewLabel = function(newLabel){
                var newLabelObj = {name : newLabel};  //formalize the new label
//                $scope.selectedlabels = []; //Uncheck all the selected labels so that only the new one is applied.
                favesFactory.addFavoriteLabel(newLabelObj); //hand new label to faves factory for processing
                $scope.userlabels = favesFactory.getUserLabels(); //get the update user labels TODO: Need a callback here
                $scope.setSelectedItem(newLabelObj.name);  //pass the name of the new label to get applied to selected favorites
                $scope.applyChanges(); //
                $scope.query = ''; //Set the filter string to null and hide the create label functionality
            };


            //Updates list of selected user user labels
            $scope.setSelectedItem = function(labelname){
                console.log("in setSElectedItem");
                $scope.updatesNecessary = true;  //Update view to show "Apply changes functionality"
                if(!labelname) { //sometimes label names are passed into this function
                    labelname = this.label.name; //sometimes this function is called by the model
                }
                if (_.contains($scope.selectedlabels, labelname)) { //If the label is already checked
                    $scope.selectedlabels = _.without($scope.selectedlabels, labelname); //uncheck the label
                } else { //label is not checked
                    $scope.selectedlabels.push(labelname); //check the label
                }
            };

            //Adds or removes label from each selected favorite
            $scope.applyChanges = function(){
                var currentFavorites = $scope.currentFaves; //get all the users favorited items

                console.log('looping thought selected faves', $scope.selectedfaves);

                angular.forEach($scope.selectedfaves, function(selectedStatus, id) { //loop through all the favorites and find the ones that are checked
                    if(selectedStatus) {  //Make sure the favorite is checked
                        console.log('this item selected', selectedStatus, id);
                        for(i=0; i<currentFavorites.length; i++){ //loop through each favorites metadata
                            if(currentFavorites[i].postingId == id){  //Match the id of checked favorite and get the rest of metadata from localstorage
                                console.log(currentFavorites[i].postingId, id);
                                currentFavorites[i].labels = $scope.selectedlabels;  //Applies all the checked user labels to the favorite TODO: We should not overwrite all the labels but instead add or remove them
                            }
                        }
                    }
                });

                Session.setSessionValue('favorites', currentFavorites);
                //TODO:Select all should only select items on screen.  Not items hidden from filter

                $scope.selectedfaves = {}; //uncheck all the selected favorites from the view
                $scope.updatesNecessary = false; //Hide the apply button from the user labels drop down
            };


            //Deletes the label from the user list and removes the label from any favorite that has it applied
            $scope.deleteLabel = function($event){
                $event.stopPropagation();
                var labelname = this.label.name;
                var labelToRemove = {name : labelname};
                favesFactory.removeFavoriteLabel(labelToRemove, $scope.refreshTable);
            };

            $scope.refreshTable = function(){
                $scope.userlabels = favesFactory.getUserLabels();
                favesFactory.refreshTable();
            };


            //toggles checkmark next to user label
            $scope.isChecked = function (labelname) {
                if (_.contains($scope.selectedlabels, labelname)) { //check if toggle label is already in list of selected labels
                    return 'fa fa-check pull-right';
                }
                return false;
            };
        }]
    };
}]);



/**
 * Created by braddavis on 12/10/14.
 */
htsApp.directive('htsFaveToggle', function () {
    return {
        restrict: 'E',
        template: '<span ng-class="{starHighlighted: favorited, star: !favorited}" ng-click="toggleFave(result); $event.stopPropagation();" tooltip="{{tooltipMessage}}" tooltip-placement="bottom" tooltip-trigger="mouseenter"></span>',
        controller: ['$scope', '$element', 'favesFactory', 'Session', 'authModalFactory', 'socketio', 'sideNavFactory', '$timeout', function ($scope, $element, favesFactory, Session, authModalFactory, socketio, sideNavFactory, $timeout) {

            //console.log(Session.userObj);
            //
            if(Session.userObj.user_settings.loggedIn) {
                favesFactory.checkFave($scope.result, function (response) {
                    $scope.favorited = response;

                    $scope.tooltipMessage = 'please wait';

                    if($scope.favorited){
                        $scope.tooltipMessage = 'Remove from watch list';
                    } else {
                        $scope.tooltipMessage = 'Add to watch list';
                    }
                });
            }

            $scope.toggleFave = function (item) {
                if(Session.userObj.user_settings.loggedIn) {
                    console.log('favorited status: ', $scope.favorited);
                    console.log(item);
                    if (!$scope.favorited) { //If not already favorited
                        favesFactory.addFave(item, function () {  //Add the favorite and flag as done
                            sideNavFactory.defaultMenu[2].active = true;

                            $timeout(function () {
                                sideNavFactory.defaultMenu[2].active = false;
                            }, 250);

                            $scope.favorited = true;
                            $scope.tooltipMessage = 'Remove from watch list';
                            socketio.joinPostingRoom(item.postingId, 'inWatchList'); //Join the room of each posting the user owns.
                        });
                    } else { //toggle off favorite
                        favesFactory.removeFave(item, function () {
                            sideNavFactory.defaultMenu[2].active = true;

                            $timeout(function () {
                                sideNavFactory.defaultMenu[2].active = false;
                            }, 250);

                            $scope.favorited = false;
                            $scope.tooltipMessage = 'Add to watch list';
                            socketio.leavePostingRoom(item.postingId, 'inWatchList'); //Join the room of each posting the user owns.

                        });
                    }
                } else {

                    authModalFactory.signInModal();

                }
            };
        }]
    };
});


htsApp.filter('capitalize', function() {
    return function(input, all) {
        return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    };
});



htsApp.directive('subMerchant', function () {
   return {
       templateUrl: 'js/submerchant/partials/submerchant.partial.html',
       controller: ['$scope', '$http', '$q', '$timeout', '$filter', 'Session', 'ENV', function ($scope, $http, $q, $timeout, $filter, Session, ENV) {

           $scope.alerts = [];
           $scope.closeAlert = function(index) {
               $scope.alerts.splice(index, 1);
           };


           $scope.$watch('subMerchForm.dob.$viewValue', function(newValue, oldValue){

               if(newValue) {
                   if(newValue.length <= 10) {
                       var lastChar = newValue.slice(-1);
                       var isNumber = !isNaN(lastChar);
                       console.log('is last char', lastChar, ' a number? ', isNumber);
                       if (isNumber) {
                           if (newValue && oldValue) {
                               if (oldValue.length == 1 || oldValue.length == 4) {
                                   if (newValue.length == 2 || newValue.length == 5) {
                                       $scope.subMerchantForm.individual.dateOfBirth = $scope.subMerchForm.dob.$viewValue + '/';
                                   }
                               }
                           }
                       } else {
                           if (lastChar === "/") {
                               if (newValue.length == 3 || newValue.length == 6) {
                                   console.log('This forward slash inserted by system.  okay.');
                               } else {
                                   console.log('forward slashed in wrong place');
                                   $scope.subMerchantForm.individual.dateOfBirth = oldValue;
                               }
                           } else {
                               console.log('user inserted invalid character');
                               $scope.subMerchantForm.individual.dateOfBirth = oldValue;
                           }
                       }
                   } else {
                       console.log('user inserted more than 10 chars');
                       $scope.subMerchantForm.individual.dateOfBirth = oldValue;
                   }
               }

           });


           $scope.$watch('subMerchantForm.destination.disperseType', function(newValue, oldValue){

               if (newValue === "bank") {
                   $scope.subMerchant.funding.destination = 'bank';
               } else if (newValue === "venmo") {
                   $scope.subMerchant.funding.destination = 'email';
               }

           });



           $scope.subMerchantForm = {
               business: {
                   isbusinessAccount: null,
                   businessOptionsDropdown: [
                       {name: 'No', value: false},
                       {name: 'Yes', value: true}
                   ],
                   addressLookup: null
               },
               individual: {
                   addressLookup: null,
                   dateOfBirth: null,
               },
               destination: {
                   disperseToBank: null,
                   disperseToVenmo: null
               },
               update: null
           };

           $scope.subMerchant = {
               business: {
                   legalName: null,
                   taxId: null,
                   address: {
                       street_address: null,
                       locality: null,
                       region: null,
                       postalCode: null
                   }
               },
               individual: {
                   firstName: null,
                   lastName: null,
                   email: null,
                   dateOfBirth: null,
                   address: {
                       streetAddress: null,
                       locality: null,
                       region: null,
                       postalCode: null
                   }
               },
               funding: {
                   destination: 'email',
                   email: null,
                   mobilePhone: null,
                   accountNumber: null,
                   routingNumber: null
               },
               tosAccepted: true
           };


           $scope.convertIndividualDob = function (dob, type){

               var dobParts = '';
               var month = '';
               var day = '';
               var year = '';
               var convertedDate = '';

               if (type === "dashes"){

                   dobParts = dob.split("/");

                   month = dobParts[0];
                   day = dobParts[1];
                   year = dobParts[2];

                   convertedDate = year + '-' + month + '-' + day;

               } else if (type === "slashes") {

                   dobParts = dob.split("-");

                   year = dobParts[0];
                   month = dobParts[1];
                   day = dobParts[2];

                   convertedDate = month + '/' + day + '/' + year;

               }

               return convertedDate;
           };



           (function(){
               $scope.recoveredMerchantAccount = Session.getSessionValue('merchantAccount');
                console.log($scope.recoveredMerchantAccount);
               if($scope.recoveredMerchantAccount.response.status) {
                   if ($scope.recoveredMerchantAccount.response.status === "pending") {
                       $scope.alerts.push({msg: "This account is currently pending approval.", type: 'warning'});
                   } else if ($scope.recoveredMerchantAccount.response.status === "declined") {
                       $scope.alerts.push({msg: "This account is currently declined.", type: 'danger'});
                   }

                   if($scope.recoveredMerchantAccount.details.id) {
                       $scope.subMerchantForm.individual.dateOfBirth = $scope.convertIndividualDob($scope.recoveredMerchantAccount.details.individual.dateOfBirth, 'slashes');
                       console.log($scope.recoveredMerchantAccount.details);
                       $scope.subMerchant = $scope.recoveredMerchantAccount.details;
                   }
               }
           })();




           $scope.submitSubMerchant = function () {

               $scope.alerts = [];

                $scope.subMerchant.individual.dateOfBirth = $scope.convertIndividualDob($scope.subMerchantForm.individual.dateOfBirth, 'dashes');

                $http.post(ENV.paymentAPI + '/submerchant', {
                    subMerchant: $scope.subMerchant,
                    existingSubMerchant: $scope.recoveredMerchantAccount.response.id
                }).success(function (response) {

                    if (!response.success) {
                        $scope.alerts.push({msg: response.message, type: 'danger'});
                    } else {
                        if (response.merchantAccount.status === "pending") {
                            $scope.alerts.push({
                                msg: 'Congrats! Your seller account is pending approval, but don\'t let this stop you from posting now.',
                                type: 'success'
                            });


                            if($scope.$dismiss){ //This directive is loaded in a modal and we need to close that modal.
                                $scope.$dismiss("subMerchantModalSuccess", response);
                            }

                            //Update browser session since user now has submerchant account.
                            Session.getUserFromServer().then(function (response) {
                                Session.create(response);
                            });

                        }
                    }
                }).error(function (err) {
                    $scope.alerts.push({msg: err.message, type: 'danger'});
                });
           };




            $scope.predictAddress = function (address) {

                return $scope.predictPlace(address).then(function (results) {
                    return results.map(function(item){
                        return item;
                    });
                });

            };





           $scope.predictPlace = function (address) {

               var defaultBounds = new google.maps.LatLngBounds(
                   new google.maps.LatLng(37.79738, -122.52464),
                   new google.maps.LatLng(37.68879, -122.36122)
               );

               //need to set bounds to cornwall/bodmin
               var locationRequest = {
                   input: address,
                   bounds: defaultBounds,
                   componentRestrictions: {country: 'US'}
               };
               var googlePlacesService = new google.maps.places.AutocompleteService();

               var deferred = $q.defer();

               //Get predictions from google
               googlePlacesService.getPlacePredictions(locationRequest, function (predictions, status) {
                   deferred.resolve(predictions);
               });

               return deferred.promise;
           };



           $scope.setAddressComponents = function (placesObj, type){
               console.log(placesObj);
               console.log(type);

               var googleMaps = new google.maps.places.PlacesService(new google.maps.Map(document.createElement("map-canvas")));

               //capture the place_id and send to google maps for metadata about the place
               var request = {
                   placeId: placesObj.place_id
               };

               googleMaps.getDetails(request, function (placeMetaData, status) {

                   var street = '';
                   var street_number = '';

                   for(var i = 0; i < placeMetaData.address_components.length; i++){
                       var component = placeMetaData.address_components[i];

                       console.log(component);

                       for(var j = 0; j < component.types.length; j++){
                           var componentType = component.types[j];

                           console.log($scope.subMerchant);

                           if(componentType === "locality"){
                               $scope.subMerchant[type].address.locality = component.long_name;
                               break;
                           } else if(componentType === "administrative_area_level_1"){
                               $scope.subMerchant[type].address.region = component.short_name;
                               break;
                           } else if(componentType === "route") {
                               street = component.long_name;
                               break;
                           } else if(componentType === "postal_code") {
                               $scope.subMerchant[type].address.postalCode = component.long_name;
                               break;
                           } else if(componentType === "street_number") {
                               street_number = component.long_name;
                               break;
                           }
                       }
                   }

                   $scope.subMerchant[type].address.streetAddress = street_number + ' ' + street;

               });

           };

       }]
   };
});



//Google returns City, St, United States.  this function removes unnecessary united states from string for awesome bar
htsApp.filter('awesomecity', function() {
    return function(longCityName) {

        var awesomeCity;

        if(longCityName) {
            // do some bounds checking here to ensure it has that index
            awesomeCity = longCityName.replace(/,[^,]+$/, "");
        } else {
            awesomeCity = "Nearby";
        }

        return awesomeCity;
    };
});


//Only allow integers to be inserted into html input
htsApp.directive('onlyDigits', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits = val.replace(/\/[^0-9]/g, '');

                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseInt(digits,10);
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});


//run function when user presses enter on an html input field
htsApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});


//Graphic user sees when applications is waiting/working
htsApp.directive('spinner', ['sideNavFactory', function (sideNavFactory) {
    return {
        restrict: 'E',
        scope: {
            spinnerTextAttribute:'@spinnerAttribute'
        },
        template:
        "<div>"+
            "<div class='spinner'>"+
            "<div class='bounce1' style='background-color: white;'></div>"+
            "<div class='bounce2' style='background-color: white;'></div>"+
            "<div class='bounce3' style='background-color: white;'></div>"+
        "</div>"+
        "<h4>{{spinnerText}}</h4>",
        link: function(scope, element, attrs) {

            scope.sideNav = sideNavFactory.sideNav;

            attrs.$observe('spinnerText', function () {
                scope.spinnerText = attrs.spinnerText;
                if(scope.spinnerTextAttribute){
                    scope.spinnerText = scope.spinnerText.replace('searchTerm', scope.spinnerTextAttribute);
                }
            });


            scope.$watch(function(){return scope.sideNav.listView;}, function(listView) {
                if(listView){
                    element.addClass('nudge-spinner');
                } else {
                    element.removeClass('nudge-spinner');
                }
            });

            //scope.$watch('scope.spinner.show', function(newValue, oldValue){
            //    console.log("newvalue", newValue, "oldvalue", oldValue);
            //});
        }
    };
}]);






htsApp.directive('bookingSystem', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'js/bookingSystem/partials/bookingSystem.html',
        link: function(scope, element, attrs) {

            var proposedTimes = [];
            //var previouslyDeclinedTimes = [];
            scope.selectedDay = null;

            scope.daySelected = function($index){

                //Toggle the selected day
                scope.days[$index].selected = !scope.days[$index].selected;

                //If a day is selected
                if(scope.days[$index].selected) {

                    scope.selectedDay = scope.days[$index];

                    scope.selectedHours = scope.days[$index].hours; // set the selected hours
                } else {

                    scope.selectedDay = null;

                    scope.selectedHours = [];
                }
            };


            scope.getAllProposedTimes = function () {

                proposedTimes = [];

                for(var i = 0; i < scope.days.length; i++){
                    var day = scope.days[i];

                    for(var j = 0; j < day.hours.length; j++) {
                        var hour = day.hours[j];
                        if(hour.selected){
                            proposedTimes.push(hour.value.format());
                        }
                    }

                }

                scope.deal.when = proposedTimes;
                console.log(scope.deal);
            };

            scope.back = function () {
                scope.selectedDay = null;
            };

            //scope.getAllDeclinedTimes = function () {
            //    for (var i = 0; i < scope.offers.proposals.length; i++) {
            //        var proposal = scope.offers.proposals[i];
            //
            //        for (var j = 0; j < proposal.when.length; j++) {
            //            var previouslyProposedTime = proposal.when[j];
            //
            //            previouslyDeclinedTimes.push(previouslyProposedTime);
            //        }
            //
            //    }
            //};



            //var checkIfPreviouslyDeclined = function(timestamp){
            //    return previouslyDeclinedTimes.indexOf(timestamp) > -1;
            //};
            //
            //
            //var checkIfEntireDayBlocked = function () {
            //    for(var i = 0; i < scope.days.length; i++){
            //        var day = scope.days[i];
            //
            //        var dayBlocked = true;
            //
            //        for(var j = 0; j < day.hours.length; j++) {
            //            var hour = day.hours[j];
            //
            //            if(!hour.disabled){
            //                dayBlocked = false;
            //                break;
            //            }
            //        }
            //
            //        if(dayBlocked){
            //            day.disabled = true;
            //        }
            //
            //    }
            //};

            console.log('test');

            //Init the array of objects used to build the days and hours of the week buyer and sellers can choose from.
            (function(){

                var newDays = [];

                for (var i = 0; i < 5; i++) {
                    var day = {
                        name: moment().add(i, 'days').format('dddd').trim(),
                        value: moment().add(i, 'days'),
                        selected: false,
                        hours: []
                    };


                    for (var j = 5; j < 25; j++) {

                        var hour;

                        if(i === 0) {

                            day.name = 'Today';

                            if (moment().isBefore(moment().startOf('day').hours(j))) {

                                 hour = {
                                    name: moment().startOf('day').hours(j).format('ha z').trim(),
                                    value: moment().startOf('day').hours(j),
                                    selected: false
                                };

                                day.hours.push(hour);
                            }
                        } else {

                            hour = {
                                name: moment().add(i, 'days').startOf('day').hours(j).format('ha z').trim(),
                                value: moment().add(i, 'days').startOf('day').hours(j),
                                selected: false
                            };

                            //{
                                //                    name: moment().add(4, 'days').startOf('day').hours(22).format('ha z'),
                                //                    value: moment().add(4, 'days').startOf('day').hours(22),
                                //                    selected: false,
                                //                    disabled: checkIfPreviouslyDeclined(moment().add(4, 'days').startOf('day').hours(22).format())
                                //                }

                            day.hours.push(hour);

                        }
                    }

                    newDays.push(day);
                }

                scope.days = newDays;
            })();
        }
    };
}]);