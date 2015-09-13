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
                    controller: ['authModalFactory', '$state', function(authModalFactory, $state) {
                        authModalFactory.checkEmailModal($state.params);
                    }]
                }
            }

        }).
        state('feed', {
            url: "/feed",
            templateUrl: "js/feed/partials/feed.partial.html",
            controller: "feed.controller"
        }).
        state('feed.splash', {
            url: "/:id",
            controller: 'splashController',
            onEnter: joinRoom,
            onExit: leaveRoom
        }).
        state('forgot', {
            url: '/forgot?msg',
            params: {
                'redirect': null,
                'msg': null
            },
            views: {
                'modal': {
                    controller: ['authModalFactory', '$state', '$rootScope', function(authModalFactory, $state, $rootScope) {
                        if(!$state.params.redirect) {
                            authModalFactory.forgotPasswordModal({'redirect': $rootScope.previousState});
                        } else {
                            authModalFactory.forgotPasswordModal($state.params);
                        }
                    }]
                }
            }
        }).
        state('myposts', {
            url: "/myposts",
            templateUrl: "js/myPosts/partials/myPosts.html",
            controller: 'myPosts.controller'
        }).
        state('myposts.questions', {
            url: "/questions/:postingId",
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'myposts.questions';
                }
            }
        }).
        state('myposts.meetings', {
            url: "/meetings/:postingId",
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'myposts.meetings';
                }
            }
        }).
        state('myposts.splash', {
            url: "/:id",
            controller: 'splashController',
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'myposts.splash';
                }
            }
        }).
        state('notifications', {
            url: "/notifications",
            templateUrl: "js/notifications/partials/notifications.html",
            controller: 'notifications.controller'
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
                loginRequired: loginRequired,
                redirect: function () {
                    return 'profile';
                }
            }
        }).
        state('reset', {
            url: '/reset/:token/',
            views: {
                modals: {
                    controller: ['authModalFactory', '$state', function(authModalFactory, $state) {
                        authModalFactory.resetPasswordModal('signin', $state.params.token);
                    }]
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
            templateUrl: "js/results/partials/results_partial.html"
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
            onExit: leaveRoom
        }).
        state('review', {
            url: "/review/:offerId/:userId",
            views: {
                'root': {
                    controller: 'peerReviewController',
                    templateUrl: 'js/peerReview/partials/peerReview.partial.html'
                }
            }
        }).
        state('root', {
            url: "/",
            onEnter: ['$state', function ($state) {
                $state.go('feed', {}, {location: false});
            }]
        }).
        state('settings', {
            url: "/settings",
            templateUrl: "js/settings/settings_partial.html"
        }).
        state('settings.account', {
            url: "/account",
            templateUrl: "js/settings/account/partials/settings.account_partial.html",
            controller: "settings.account.controller",
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'settings.account';
                }
            }
        }).
        state('settings.password', {
            url: "/password",
            templateUrl: "js/settings/password/partials/settings.password_partial.html",
            controller: "settings.password.controller",
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'settings.password';
                }
            }
        }).
        state('settings.profile', {
            url: "/profile",
            templateUrl: "js/settings/profile/partials/settings.profile_partial.html",
            controller: "settings.profile.controller",
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'settings.profile';
                }
            }
        }).
        state('settings.payment', {
            url: "/payment",
            templateUrl: "js/settings/payment/partials/settings.payment_partial.html",
            controller: "settings.payment.controller",
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'settings.payment';
                }
            }
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
                    controller: ['authModalFactory', '$state', '$rootScope', function(authModalFactory, $state, $rootScope) {
                        if(!$state.params.redirect) {
                            authModalFactory.signInModal({'redirect': $rootScope.previousState});
                        } else {
                            authModalFactory.signInModal($state.params);
                        }
                    }]
                }
            }
        }).
        state('signup', {
            url: '/signup',
            views: {
                'modal': {
                    controller: ['authModalFactory', '$state', '$rootScope', function(authModalFactory, $state, $rootScope) {
                        if(!$state.params.redirect) {
                            authModalFactory.signUpModal({'redirect': $rootScope.previousState});
                        } else {
                            authModalFactory.signUpModal($state.params);
                        }
                    }]
                }
            },
            params: { 'redirect': null }
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
            controller: 'watchlistController'
        }).
        state('watchlist.questions', {
            url: "/questions/:postingId",
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'watchlist.questions';
                }
            }
        }).
        state('watchlist.meetings', {
            url: "/meetings/:postingId",
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'watchlist.meetings';
                }
            }
        }).
        state('watchlist.splash', {
            url: "/:id",
            controller: 'splashController',
            onEnter: joinRoom,
            onExit: leaveRoom,
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'watchlist.splash';
                }
            }
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



htsApp.run(function() {
    FastClick.attach(document.body);
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
        "   <input ng-model='query' type='text' autofocus class='labels-input' placeholder='Filter or Create New Label'/>" +
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

                    console.log('submit submerchant response', response);

                    if (!response.success) {
                        $scope.alerts.push({msg: response.message, type: 'danger'});
                    } else {
                        if (response.merchantAccount.status === "pending") {
                            $scope.alerts.push({
                                msg: 'Congrats! Your seller account is pending approval, but don\'t let this stop you from posting now.',
                                type: 'success'
                            });
                        } else if (response.merchantAccount.status === "active") {
                            $scope.alerts.push({
                                msg: 'Congrats! Your seller account is active.',
                                type: 'success'
                            });
                        }

                        //Update browser session since user now has submerchant account.
                        Session.getUserFromServer().then(function (response) {

                            console.log('getuserfromserverresponse', response);

                            Session.create(response);
                        });

                        if($scope.$dismiss){ //This directive is loaded in a modal and we need to close that modal.
                            $scope.$dismiss("subMerchantModalSuccess", response);
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
angular.module('globalVars', [])

.constant('ENV', {name:'production',htsAppUrl:'https://www.hashtagsell.com',postingAPI:'https://production-posting-api.hashtagsell.com/v1/postings/',userAPI:'https://production-posting-api.hashtagsell.com/v1/users/',utilsApi:'https://www.hashtagsell.com/utils/',realtimePostingAPI:'https://production-realtime-svc.hashtagsell.com/postings',realtimeUserAPI:'https://production-realtime-svc.hashtagsell.com/users',groupingsAPI:'https://production-posting-api.hashtagsell.com/v1/groupings/',annotationsAPI:'https://production-posting-api.hashtagsell.com/v1/annotations',feedbackAPI:'https://www.hashtagsell.com/feedback',paymentAPI:'https://www.hashtagsell.com/payments',notificationAPI:'http://production-notification-svc.hashtagsell.com/v1/queues',precacheAPI:'https://www.hashtagsell.com/precache',facebookAuth:'https://www.hashtagsell.com/auth/facebook',transactionsAPI:'https://www.hashtagsell.com/v1/transactions/',reviewsAPI:'https://www.hashtagsell.com/v1/reviews/',twitterAuth:'https://www.hashtagsell.com/auth/twitter',ebayAuth:'https://www.hashtagsell.com/auth/ebay',ebayRuName:'HashtagSell__In-HashtagS-70ae-4-hkrcxmxws',ebaySignIn:'https://signin.ebay.com/ws/eBayISAPI.dll',fbAppId:'367469320085475'})

.constant('clientTokenPath', 'https://www.hashtagsell.com/payments/client_token')

;
/**
 * Created by braddavis on 12/10/14.
 */
htsApp.factory('authModalFactory', ['Session', '$modal', '$log', '$state', '$rootScope', function (Session, $modal, $log, $state, $rootScope) {

    var factory = {};

    // =====================================
    // Spawns Sign In Modal ================
    // =====================================
    factory.signInModal = function (params) {

        var modalInstance = $modal.open({
            templateUrl: 'js/authModals/modals/signInModal/partials/signIn.html',
            controller: 'signInModalController',
            size: 'sm',
            backdropClass: 'translucent-modal-backdrop',
            resolve: {
                params: function(){
                    return params;
                }
            }
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            console.log(reason);
            if(reason === "signUp") {
                $state.go('signup', {'redirect': params.redirect});
                //factory.signUpModal(params);
            } else if (reason === "forgot") {
                $state.go('forgot', {'redirect': params.redirect});
                //factory.forgotPasswordModal(params);
            } else if (reason === "signIn") {
                $state.go('signin', {'redirect': params.redirect});
                //factory.signInModal(params);
            } else if (reason === "successful login" && params.redirect) {
                $state.go(params.redirect);
            }  else if (reason === "successful login" && !params.redirect) {
                $state.go('feed');
            } else {
                $state.go(params.redirect);
            }
            $log.info('Modal dismissed at: ' + new Date());
        });

        //Hack this closes splash modal when user clicks back button https://github.com/angular-ui/bootstrap/issues/335
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            modalInstance.dismiss('direct');
        });

    };





    // ==========================================================
    // Asks user if they have access code or not ================
    // ==========================================================
    factory.betaCheckModal = function (params) {

        var modalInstance = $modal.open({
            templateUrl: 'js/authModals/modals/betaCheckModal/partials/betaCheck.html',
            controller: 'betaCheckModalController',
            size: 'lg',
            backdropClass: 'translucent-modal-backdrop'
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            if (reason === "signUp") {
                $state.go('signup', {'redirect': params.redirect});
                //factory.signUpModal(params);
            } else if (reason === "subscribe") {
                //factory.subscribeModal(params);
                $state.go('subscribe', {'redirect': params.redirect});
            }
            $log.info('Modal dismissed at: ' + new Date());
        });

        //Hack this closes splash modal when user clicks back button https://github.com/angular-ui/bootstrap/issues/335
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            modalInstance.dismiss('direct');
        });
    };





    // =====================================
    // Spawns Sign Up Modal ================
    // =====================================
    factory.signUpModal = function (params) {

        var modalInstance = $modal.open({
            templateUrl: 'js/authModals/modals/signUpModal/partials/signUp.html',
            controller: 'signupModalController',
            size: 'sm',
            backdropClass: 'translucent-modal-backdrop'
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            if(reason === "success"){
                $state.go('checkemail');
                //factory.checkEmailModal(params);
            } else if (reason === "forgot") {
                $state.go('forgot', {'redirect': params.redirect});
                //factory.forgotPasswordModal(params);
            } else if (reason === "signIn") {
                $state.go('signin', {'redirect': params.redirect});
                //factory.signInModal(params);
            } else if (reason === "subscribe") {
                $state.go('subscribe', {'redirect': params.redirect});
                //factory.subscribeModal(params);
            } else {
                $state.go(params.redirect, {}, { reload: true });
            }
            $log.info('Modal dismissed at: ' + new Date());
        });

        //Hack this closes splash modal when user clicks back button https://github.com/angular-ui/bootstrap/issues/335
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            modalInstance.dismiss('direct');
        });
    };




    // =====================================
    // Spawns Early Subscriber Modal =======
    // =====================================
    factory.subscribeModal = function (params) {

        var modalInstance = $modal.open({
            templateUrl: 'js/authModals/modals/subscribeModal/partials/subscribe.html',
            controller: 'subscribeModalController',
            size: 'sm',
            backdropClass: 'translucent-modal-backdrop'
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            if(reason === "success"){
                $state.go('checkemail');
                //factory.checkEmailModal(params);
            } else if (reason === "signUp") {
                $state.go('signup', {'redirect': params.redirect});
                //factory.signUpModal(params);
            } else if (reason === "signIn") {
                $state.go('signin', {'redirect': params.redirect});
                //factory.signInModal(params);
            }
            $log.info('Modal dismissed at: ' + new Date());
        });

        //Hack this closes splash modal when user clicks back button https://github.com/angular-ui/bootstrap/issues/335
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            modalInstance.dismiss('direct');
        });
    };




    // =====================================
    // Informs user to check email after password reset ================
    // =====================================
    factory.checkEmailModal = function () {

        var modalInstance = $modal.open({
            templateUrl: 'js/authModals/modals/checkEmailModal/partials/checkEmail.html',
            controller: 'checkEmailController',
            size: 'sm',
            backdropClass: 'translucent-modal-backdrop'
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            $log.info('Modal dismissed at: ' + new Date());
        });

        //Hack this closes splash modal when user clicks back button https://github.com/angular-ui/bootstrap/issues/335
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            modalInstance.dismiss('direct');
        });
    };



    // =====================================
    // Spawns Forgot Password Modal ================
    // =====================================
    factory.forgotPasswordModal = function (params) {

        var modalInstance = $modal.open({
            templateUrl: 'js/authModals/modals/forgotPasswordModal/partials/forgotPassword.html',
            controller: 'forgotPasswordController',
            size: 'sm',
            backdropClass: 'translucent-modal-backdrop',
            resolve: {
                params: function () {
                    return params;
                }
            }
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            if(reason === "success"){
                $state.go('checkemail');
                //factory.checkEmailModal(params);
            } else if (reason === "signUp") {
                $state.go('signup', {'redirect': params.redirect});
                //factory.signUpModal(params);
            } else if (reason === "signIn") {
                $state.go('signin', {'redirect': params.redirect});
                //factory.signInModal(params);
            } else {
                $state.go(params.redirect);
            }
            $log.info('Modal dismissed at: ' + new Date());
        });

        //Hack this closes splash modal when user clicks back button https://github.com/angular-ui/bootstrap/issues/335
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            modalInstance.dismiss('direct');
        });

    };


    // =====================================
    // User can change their password if they're not logged in using email recovery token ================
    // =====================================
    factory.resetPasswordModal = function (redirect, token) {

        var modalInstance = $modal.open({
            templateUrl: 'js/authModals/modals/resetPasswordModal/partials/resetPassword.html',
            controller: 'resetPasswordModalController',
            size: 'sm',
            backdropClass: 'translucent-modal-backdrop',
            resolve: {
                token: function () {
                    return token;
                }
            }
        });

        modalInstance.result.then(function (response) {

        }, function (response) {
            console.log(response);
            if(response.success) {
                $state.go('signin', {'redirect': 'feed', email: response.email});
            }
            $log.info('Modal dismissed at: ' + new Date());
        });

        //Hack this closes splash modal when user clicks back button https://github.com/angular-ui/bootstrap/issues/335
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            modalInstance.dismiss('direct');
        });

    };



    return factory;
}]);
//Controller catches the create account process from the create account modal and passes it to our authFactory
htsApp.controller('betaCheckModalController', ['$scope', '$modalInstance', function ($scope, $modalInstance) {

    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);
//Controller catches the sign-in process from the sign-in modal and passes it to our authFactory
htsApp.controller('checkEmailController', ['$scope', '$modalInstance', function ($scope, $modalInstance) {

    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);
//Controller catches forgot password process from the forgot password modal and passes it to our authFactory
htsApp.controller('forgotPasswordController', ['$scope', '$modalInstance', 'authFactory', 'params', function ($scope, $modalInstance, authFactory, params) {

    if(params.msg) {
        $scope.message = "This activation email link has already been used.  Sign in or reset your password.";
    }

    $scope.forgotPassword = function (isValid) {
        if (isValid) {
            var email = $scope.email;

            authFactory.passwordReset(email).then(function (response) {

                if(response.error) {

                    $scope.message = response.error;

                } else if(response.success) {

                    $scope.dismiss("success");

                }

            }, function () {

                $scope.message = "Please contact support.  Sorry for the trouble";

            });
        }

    };


    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);
//Controller catches forgot password process from the forgot password modal and passes it to our authFactory
htsApp.controller('resetPasswordModalController', ['$scope', '$modalInstance', 'authFactory', 'token', function ($scope, $modalInstance, authFactory, token) {
    $scope.resetPassword = function (isValid) {
        if (isValid) {
            var newPassword = $scope.newPassword;


            authFactory.changePassword(newPassword, token).then(function (response) {

                console.log(response);

                if(response.error) {

                    $scope.message = response.error;

                } else if(response.success) {

                    $scope.dismiss(response);

                }

            }, function () {

                $scope.message = "Please contact support.  Sorry for the trouble";

            });
        }

    };


    $scope.dismiss = function (response) {
        $modalInstance.dismiss(response);
    };

}]);
//Controller catches the sign-in process from the sign-in modal and passes it to our authFactory
htsApp.controller('signInModalController', ['$scope', '$modalInstance', '$window', 'authFactory', 'params', function ($scope, $modalInstance, $window, authFactory, params) {

    if (params.email) {
        $scope.email = params.email;
    }

    $scope.loginPassport = function (isValid) {
        if (isValid) {

            var email = $scope.email;
            var password = $scope.password;

            authFactory.login(email, password).then(function (response) {

                if(response.error) {

                    $scope.message = response.error;

                } else if(response.success) {

                    $scope.dismiss("successful login");

                }

            }, function () {

                $scope.message = "Ooops.. Login error, please contact support.";

            });
        }
    };

    //$scope.facebookAuth = function () {
    //    $window.open(ENV.facebookAuth);
    //};
    //
    //
    //$scope.twitterAuth = function () {
    //    $window.open(ENV.twitterAuth);
    //};


    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };


}]);
//Controller catches the create account process from the create account modal and passes it to our authFactory
htsApp.controller('signupModalController', ['$scope', '$modalInstance', 'authFactory', 'Notification', function ($scope, $modalInstance, authFactory, Notification) {
    $scope.signupPassport = function (isValid) {

        if (isValid) {
            var email = $scope.email;
            var password = $scope.password;
            var name = $scope.name;

            //Private Beta
            //var secret = $scope.secret;

            var betaAgreement = $scope.betaAgreement;

            console.log(email, password, name, betaAgreement);

            authFactory.signUp(email, password, name, betaAgreement).then(function (response) {

                console.log(response);

                if(response.error) {

                    $scope.message = response.error;

                } else if(response.success) {

                    $scope.dismiss("success");

                }

            }, function () {

                Notification.error({
                    message: "Appears we're having sign up issues.  Please check back soon.",
                    delay: 10000
                });  //Send the webtoast

            });

        }
    };


    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };


}]);
//Controller catches the create account process from the create account modal and passes it to our authFactory
htsApp.controller('subscribeModalController', ['$scope', '$modalInstance', 'authFactory', 'Notification', function ($scope, $modalInstance, authFactory, Notification) {


    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.subscribe = function (isValid) {

        if (isValid) {

            var email = $scope.email;

            authFactory.subscribe(email).then(function (response) {

                console.log(response);

                if(!response.success) {

                    $scope.alerts.push({ type: 'danger', msg: response.message });

                } else if(response.success) {

                    $scope.done = true;

                    $scope.alerts.push({ type: 'success', msg: response.message });

                }

            }, function () {

                Notification.error({
                    message: "Whoops.. Can't take new subscribers right meow.. We're working on this.",
                    delay: 10000
                });  //Send the webtoast

            });

        }
    };


    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };


}]);
//This factory handles all our ajax posts to the server for sign-in, account creation, password reset, and changing the actual password
htsApp.factory('authFactory', ['$http', 'Session', '$q', '$window', function ($http, Session, $q) {

    var factory = {};

    // =====================================
    // LOGIN ===============================
    // =====================================
    factory.login = function (email, password) {

        var deferred = $q.defer();

        $http.post("/login", { "email": email, "password": password })

            //success
            .then(function (passportResponse) {

                if (passportResponse.data.success) { //We are logged in!!

                    Session.create(passportResponse.data);

                    console.log('PASSPORT RESPONSE', passportResponse);

                    deferred.resolve(passportResponse.data);

                } else { //There was an error logging the user in

                    deferred.resolve(passportResponse.data);

                }

            },
            //error
            function (data, status, headers, config) {
                deferred.reject();

            });

        return deferred.promise;

    };


    // =====================================
    // SIGN UP =============================
    // =====================================
    factory.signUp = function (email, password, name, secret) {

        var deferred = $q.defer();

        $http.post("/signup", { "email": email, "password": password, "name": name, "secret": secret})

            //success
            .then(function (passportResponse) {

                if (passportResponse.data) { //Successful registration

                    deferred.resolve(passportResponse.data);

                }

            },
            //error
            function (data, status, headers, config) {
                deferred.reject();

            });

        return deferred.promise;

    };




    // =====================================
    // EARLY ACCESS SUBSCRIBER =============
    // =====================================
    factory.subscribe = function (email) {

        var deferred = $q.defer();

        $http.post("/subscribe", { "email": email})

            //success
            .then(function (passportResponse) {

                if (passportResponse.data) { //Successful registration

                    deferred.resolve(passportResponse.data);

                }

            },
            //error
            function (data, status, headers, config) {
                deferred.reject();

            });

        return deferred.promise;

    };





    // =====================================
    // FORGOT PASSWORD =====================
    // =====================================
    factory.passwordReset = function (email) {
        var deferred = $q.defer();

        $http.post('/forgot', { "email": email})

            .then(function (passportResponse) {

                if (passportResponse.data) {

                    deferred.resolve(passportResponse.data);

                }
            },            //error
            function (data, status, headers, config) {
                deferred.reject();

            });

        return deferred.promise;

    };


    // =====================================
    // RESETS PASSWORD =====================
    // =====================================
    factory.changePassword = function (password, token) {

        var deferred = $q.defer();

        $http.post('/reset', { "password": password, "token": token})

            .then(function (passportResponse) {

                if (passportResponse.data) {

                    deferred.resolve(passportResponse.data);

                }
            },            //error
            function (data, status, headers, config) {
                deferred.reject();

            });

        return deferred.promise;

    };




    // =====================================
    // UPDATE PASSWORD WHILE LOGGED IN =====
    // =====================================
    factory.updatePassword = function (currentPassword, newPassword) {

        var deferred = $q.defer();

        $http.post('/reset', { "currentPassword": currentPassword, "newPassword": newPassword})

            .then(function (passportResponse) {

                if (passportResponse.data) {

                    deferred.resolve(passportResponse.data);

                }
            },            //error
            function (data, status, headers, config) {
                deferred.reject();

            });

        return deferred.promise;

    };


    return factory;
}]);
htsApp.controller('awesomeBarController', ['$window', '$scope', '$location', 'awesomeBarFactory', 'searchFactory', '$state', function ($window, $scope, $location, awesomeBarFactory, searchFactory, $state) {


    //$scope.clearCity = function () {
    //    console.log('clearing city');
    //    $scope.queryObj.city = null;
    //    $scope.queryObj.locationObj = null;
    //};


    $scope.queryObj = awesomeBarFactory.queryObj;


    $scope.handlePaste = function ($event) {
        $event.preventDefault();
        $scope.queryObj.q = $event.originalEvent.clipboardData.getData('text/plain');
    };

    //Redirects to results page with correct params
    $scope.awesomeBarSubmit = function () {

        console.log('==================== RUNNING AWESOMEBAR SUBMIT ====================');

        $scope.advancedSearch.visible = false; //Hide advanced search

        if($scope.queryObj.q) {

            console.log('before sanatize', $scope.queryObj);

            searchFactory.resetResultsView();

            //cache the entire users search string before we strip it apart and build our query object
            var entireSearchString = $scope.queryObj.q;

            var strippedHTML = strip($scope.queryObj.q);

            console.log('stripped html', strippedHTML);

            var subString = strippedHTML.replace('@' + $scope.queryObj.city, "").trim();

            console.log('trimmed string', subString);

            $scope.queryObj.q = subString;

            console.log('after sanatize', $scope.queryObj);

            $state.go('results', $scope.queryObj, {'reload':true});

            $scope.queryObj.q = entireSearchString;
        }

    };



    function strip(html) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }



    $scope.validateQueryObj = function () {
        if($scope.queryObj.locationObj) {
            if($scope.queryObj.q.indexOf('@') === -1) {
                $scope.queryObj.city = null;
                $scope.queryObj.locationObj = null;
            }
        }
    };



    ////========= @ Places Ment.io trigger =========
    $scope.map = awesomeBarFactory.googleMap;

    $scope.searchPlaces = function (city) {
        if (city) {
            return awesomeBarFactory.predictPlace(city).then(function (results) {

                $scope.cities = results;

                return results.map(function(item){
                    return item;
                });
            });
        }
    };


    $scope.getCityMetaData = function (selectedCity) {

        console.log('selected city: ', selectedCity);
        awesomeBarFactory.getCityMetaData(selectedCity).then(function (cityMetaData) {

            $scope.queryObj.city = selectedCity.description;

            $scope.queryObj.locationObj = cityMetaData;

        });
        return '<span class="mention-highlighter-location" contentEditable="false">@' + selectedCity.description + '</span>';
    };


    $scope.advancedSearch = {
        visible: false
    };

}]);

/**
 * Created by braddavis on 4/26/15.
 */
htsApp.factory('awesomeBarFactory', ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {

    var factory = {};


    factory.queryObj = {
        q: $stateParams.q || "I'm looking for...",
        city: null,
        locationObj: null,
        price:{
            min: null,
            max: null
        }
    };



    factory.googleMap = new google.maps.Map(document.createElement("map-canvas"));


    factory.predictPlace = function (city) {

        //need to set bounds to cornwall/bodmin
        var locationRequest = {
            input: city,
            types: ['(cities)'],
            componentRestrictions: {country: "us"}
        };

        var googlePlacesService = new google.maps.places.AutocompleteService();

        var deferred = $q.defer();

        //Get predictions from google
        googlePlacesService.getPlacePredictions(locationRequest, function (predictions, status) {
            deferred.resolve(predictions);
        });

        return deferred.promise;
    };



    factory.getCityMetaData = function (selectedPlace) {

        var googleMaps = new google.maps.places.PlacesService(factory.googleMap);

        //capture the place_id and send to google maps for metadata about the place
        var request = {
            placeId: selectedPlace.place_id
        };

        var deferred = $q.defer();

        googleMaps.getDetails(request, function (placeMetaData, status) {

            //TODO: Handle status and if google fail

            deferred.resolve(placeMetaData);
        });

        return deferred.promise;
    };

    return factory;

}]);
/**
 * Created by braddavis on 5/1/15.
 */
htsApp.controller('categorySelectorBar', ['$scope',  '$rootScope', '$state', 'Session', 'ivhTreeviewMgr', 'feedFactory', function ($scope, $rootScope, $state, Session, ivhTreeviewMgr, feedFactory) {


    //Any time the user moves to a different page this function is called.
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name === 'feed' || toState.name === 'feed.splash') {
            $scope.showCategorySelectorBar = true;
        } else {
            $scope.showCategorySelectorBar = false;
        }
    });

    //This obj binded to view to create category tree checklist
    $scope.feedCategoryObj = {};

    //Get the users categories they have chosen to watch in their feed.
    $scope.feedCategoryObj.nestedCategories = Session.userObj.user_settings.feed_categories;

    //This function called when user checks or unchecks any item on the category tree.
    $scope.categoryOnChange = function(node, isSelected, tree) {
        console.log('node', node);
        console.log('isSelected', isSelected);
        console.log('tree', tree);
        var stanitizedTree = JSON.parse(angular.toJson(tree));
        console.log('sanitized tree', stanitizedTree);

        //Update the server
        Session.setSessionValue('feed_categories', stanitizedTree, function (response) {
            if (response.status !== 200) {
                alert('could not remove category from user feed.  please notify support.');
            }
        });

        feedFactory.filterFeed(stanitizedTree);
    };

    //If the categoryFilter input experiences a change then expand that entire category tree as user types to filter
    $scope.expandTree = function () {
        ivhTreeviewMgr.expandRecursive($scope.feedCategoryObj.nestedCategories);
    };


    //Watches the category filter input.  If emptied then collapse the category tree
    $scope.$watch('filterCategories', function (newVal, oldVal) {
        if(newVal === '') {
            ivhTreeviewMgr.collapseRecursive($scope.feedCategoryObj.nestedCategories);
        }
    });


}]);
/**
 * Created by braddavis on 12/15/14.
 */
htsApp.controller('feed.controller', ['$scope', 'feedFactory', 'splashFactory', '$state', '$interval', 'socketio', 'geoFactory', 'Session', function ($scope, feedFactory, splashFactory, $state, $interval, socketio, geoFactory, Session) {

    $scope.spinner = feedFactory.spinner;

    //feedFactory.feed.categories = Session.userObj.user_settings.feed_categories;

    $scope.feed = feedFactory.feed;

    $scope.status = {
        error: null
    };

    $scope.currentDate = feedFactory.currentDate;


    var initFeed = function() {

        //While true the hashtagspinner will appear
        feedFactory.spinner.show = true;

        var sanitizedTree = Session.userObj.user_settings.feed_categories;

        if(!geoFactory.userLocation) {
            geoFactory.geolocateUser().then(function (response) {
                geoFactory.userLocation = response;
                initFeed();
            }, function (err) {

                feedFactory.spinner.show = false;

                $scope.status.error = err;

            });
        } else {
            if(!feedFactory.feed.unfiltered.length) {
                feedFactory.latest(geoFactory.userLocation, sanitizedTree).then(function (response) {
                    console.log('heres our most recent posts', response);

                    feedFactory.spinner.show = false;

                    socketio.joinLocationRoom('USA-' + geoFactory.userLocation.freeGeoIp.region_code, function () {

                    });
                }, function (err) {

                    feedFactory.spinner.show = false;

                    $scope.status.error = err;
                });
            } else {
                feedFactory.spinner.show = false;
            }
        }

    };
    initFeed();


    $scope.getScrollPosition = function(startIndex, endIndex){
        console.log('startIndex: ' + startIndex, 'endIndex: ' + endIndex, 'numRows: ' + $scope.feed.filtered.length);
        //if(!$scope.startIndexCached){
        //    $scope.startIndexCached = startIndex;
        //} else {
        //    if(startIndex + 3 < $scope.startIndexCached){
        //        $scope.startIndexCached = startIndex;
        //        alert('scrolling up!');
        //    }
        //}
    };



    //TODO: When user pulls down from top of screen perform poll and reset interval
    //openSplash called when suer clicks on item in feed for more details.
    $scope.openSplash = function(elems){
        splashFactory.result = elems.result;
        console.log(splashFactory.result);
        $state.go('feed.splash', { id: elems.result.postingId });
    };

}]);


//Filter used to calculate and format how long ago each item in the feed was posted.
htsApp.filter('secondsToTimeString', function() {
    return function(seconds) {
        var days = Math.floor(seconds / 86400);
        var hours = Math.floor((seconds % 86400) / 3600);
        var minutes = Math.floor(((seconds % 86400) % 3600) / 60);
        var timeString = '';
        if(days > 0) timeString += (days > 1) ? (days + " days ") : (days + " day ");
        if(hours > 0) timeString += (hours > 1) ? (hours + " hours ") : (hours + " hour ");
        if(minutes >= 0) timeString += (minutes > 1) ? (minutes + " minutes ") : (minutes + " minute ");
        return timeString;
    };
});





//This is called when user changes route. It stops javascript from interval polling in background.
//$scope.$on('$destroy', function () {
//    $interval.cancel(currentTimeInterval);
//
//    console.log('cancelled time updates for feed');
//
//    //socketio.leaveCityRoom(geoFactory.userLocation.cityCode.code, function() {
//    //
//    //});
//});


/**
 * Created by braddavis on 12/15/14.
 */
htsApp.factory('feedFactory', ['$http', '$stateParams', '$location', '$q', '$rootScope', '$timeout', 'Session', 'utilsFactory', 'ENV', function( $http, $stateParams, $location, $q, $rootScope, $timeout, Session, utilsFactory, ENV) {

    var factory = {};

    factory.spinner = {
        show: true
    };


    factory.feed = {
        unfiltered: [],
        filtered: [],
        categories: null,
        newUnreadItems: 0
    };

    factory.currentDate = {
        timestamp: Math.floor(Date.now() / 1000)
    };


    factory.defaultParams = {
        start: 0,
        count: 50,
        filters: {
            mandatory: {
                exact: {}
            },
            optional: {
                exact: {}
            }
        }
    };



    factory.latest = function (userLocationObject, sanitizedTree) {

        var deferred = $q.defer();

        factory.defaultParams.filters.mandatory.exact = {
            'location.state': 'USA-' + userLocationObject.freeGeoIp.region_code
        };

        //factory.defaultParams.filters.optional.exact = {
        //    'categoryCode': 'SELE'
        //};

        console.log('before braketizing url', factory.defaultParams);

        var bracketURL = utilsFactory.bracketNotationURL(factory.defaultParams);
        console.log('final URL', bracketURL);

        $http({
            method: 'GET',
            url: ENV.postingAPI + bracketURL
        }).then(function (response) {


            if(response.data.results.length) {

                for(var i = 0; i < response.data.results.length; i++) {
                    response.data.results[i] = setItemHeight(response.data.results[i]);
                }

                factory.feed.unfiltered = response.data.results;

                factory.filterFeed(sanitizedTree);

                deferred.resolve();
            } else {

                var err = {
                    message: 'Whoops.. We can\'t find any results in ' + userLocationObject.freeGeoIp.city,
                    error: response
                };

                deferred.reject(err);
            }

        }, function (error) {


            var err = {
                message: 'We seem to be having issues.  Hang tight we\'re working to resolve this.',
                error: error
            };

            deferred.reject(err);
        });

        return deferred.promise;

    };


    var setItemHeight = function (item) {

        if (item.images.length === 0) {
            item.feedItemHeight = 179;
        } else if (item.images.length === 1) {
            item.feedItemHeight = 261;
        } else {
            item.feedItemHeight = 420;
        }

        return item;
    };


    factory.updateFeed = function (emit) {

        emit.posting = setItemHeight(emit.posting);

        console.log(emit.posting);

        var tempUnfilteredArray = factory.feed.unfiltered;
        tempUnfilteredArray.unshift(emit.posting);

        factory.feed.unfiltered = tempUnfilteredArray.slice(0, 350);

        if(factory.mustMatchCategoryCode(emit.posting)){

            var scrollTopOffset = jQuery(".inner-container.feed").scrollTop();

            $rootScope.$apply(function() {

                factory.currentDate.timestamp = Math.floor(Date.now() / 1000);

                var tempFilteredArray = factory.feed.filtered;
                tempFilteredArray.unshift(emit.posting);

                factory.feed.filtered = tempFilteredArray.slice(0, 350);

            });

            jQuery(".inner-container.feed").scrollTop(scrollTopOffset + emit.posting.feedItemHeight);
        }

        factory.feed.newUnreadItems++;

    };




    //simplest filters
    factory.mustMatchCategoryCode = function(element, index){

        var visibleStatus = factory.feed.categories.indexOf(element.categoryCode) > -1;

        console.log('Show ' + element.categoryCode + '? ' + visibleStatus);

        return visibleStatus;
    };



    factory.filterFeed = function (sanitizedTree) {

        factory.feed.categories = getVisibleCategories(sanitizedTree);

        var filteredResults = factory.feed.unfiltered.filter(factory.mustMatchCategoryCode);

        factory.generateFeed(filteredResults);

    };


    factory.generateFeed = function(filteredResults) {

        //$rootScope.$apply(function() {

            var temp = [];

            for(var i = 0; i < filteredResults.length; i++) {

                var feedItem = filteredResults[i];

                if (feedItem.images.length === 0) {
                    feedItem.feedItemHeight = 179;
                } else if (feedItem.images.length === 1) {
                    feedItem.feedItemHeight = 261;
                } else {
                    feedItem.feedItemHeight = 420;
                }

                temp.push(feedItem);
            }


            factory.feed.filtered = temp;

            $timeout(function(){
                $rootScope.$broadcast('vsRepeatTrigger');
            }, 10);
        //});
    };


    var getVisibleCategories = function (sanitizedTree) {

        var temp = [];

        for(var i = 0; i < sanitizedTree.length; i++) {
            var parentCategory = sanitizedTree[i];

            for(var j = 0; j < parentCategory.categories.length; j ++) {
                var childCategory = parentCategory.categories[j];

                if(childCategory.selected){
                    temp.push(childCategory.code);
                }
            }
        }

        return temp;
    };


    return factory;
}]);
/**
 * Created by braddavis on 4/28/15.
 */
htsApp.controller('feedbackController', ['$scope', '$state', '$rootScope', 'feedbackFactory', '$http', 'ENV', 'Notification', 'Session', function($scope, $state, $rootScope, feedbackFactory, $http, ENV, Notification, Session) {

    $scope.feedback = feedbackFactory.feedback;

    $scope.userObj = Session.userObj;

    $scope.showFeedbackForm = function () {
        if($scope.userObj.user_settings.loggedIn) {
            $scope.feedback.form.visible = true;
        } else {
            $state.go('signup', {redirect: $rootScope.currentState});
        }
    };

    $scope.hideFeedbackForm = function () {
        if($scope.userObj.user_settings.loggedIn) {
            $scope.feedback.form.visible = false;
        } else {
            $state.go('signup', {redirect: $rootScope.currentState});
        }
    };

    $scope.submitFeedback = function() {

        $scope.feedback.form.user = $scope.userObj.user_settings.name;

        $http.post(ENV.feedbackAPI, $scope.feedback).success(function(response) {

            if(response.success) {
                $scope.feedback.form.visible = false;
                $scope.feedback.form.generalFeedback = null;
                Notification.primary({
                    title: "Feedback Sent!",
                    message: "You'll receive an email shortly.",
                    delay: 6000
                });
            } else if (response.error) {
                Notification.error({
                    title: "Could not submit your feedback",
                    message: response.error,
                    delay: 10000
                });
            }

        }).error(function(err) {
            Notification.error({
                title: "Could not submit your feedback",
                message: "Sorry! Something is big time wrong. Email us at feedback@hashtagsell.com.",
                delay: 10000
            });
        });
    };

}]);
/**
 * Created by braddavis on 4/28/15.
 */
htsApp.factory('feedbackFactory', function () {
   var factory = {};

    factory.feedback = {
        form: {
            user: null,
            generalFeedback: null,
            visible: false
        }
    };

    return factory;
});
htsApp.controller('filterBar', ['$scope', '$rootScope', 'searchFactory', '$timeout', 'sideNavFactory', function ($scope, $rootScope, searchFactory, $timeout, sideNavFactory) {

    //Any time the user moves to a different page this function is called.
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name === 'results' || toState.name === 'results.splash') {
            $scope.showFilterBar = true;
        } else {
            $scope.showFilterBar = false;
        }
    });

    //Filtering
    $scope.filterToggles = searchFactory.filter;

    $scope.$watchGroup(['filterToggles.mustHaveImage', 'filterToggles.mustHavePrice'], function (newValues, oldValues, scope) {
        //searchFactory.imageFilter(value);

        console.log($scope.filterToggles);

        searchFactory.filterArray($scope.views, 'filter');

    });


    //View
    $scope.views = searchFactory.views;

    $scope.$watchGroup(['views.gridView', 'views.showMap'], function () {

        if($rootScope.currentState === "results") {

            $timeout(function () {
                searchFactory.filterArray($scope.views, 'resize');


                if ($scope.views.gridView) { //If grid view enabled don't show css gutters
                    sideNavFactory.sideNav.listView = false;
                } else if (!$scope.views.gridView && $scope.views.showMap) {  //If list view is enabled BUT map is visible don't show css gutters
                    sideNavFactory.sideNav.listView = false;
                } else if (!$scope.views.gridView && !$scope.views.showMap) {  //If list view is enabled AND map is NOT visible then show the css gutters
                    sideNavFactory.sideNav.listView = true;
                }


            }, 1);

        }
    });





    $scope.rangeSlider = searchFactory.priceSlider;
    console.log($scope.rangeSlider);

    $scope.slideDelegate = function (value) {
        console.log(value);
        searchFactory.priceSlider.userSetValue = true;
        console.log(searchFactory.priceSlider);

        searchFactory.filterArray($scope.views, 'filter');
        //searchFactory.priceSlider.rangeValue = value;
    };


    //Adds $ before the price slider values
    $scope.myFormatter = function(value) {
        return "$"+value;
    };



}]);
/**
 * Created by braddavis on 5/18/15.
 */
htsApp.controller('betaAgreementController', ['$scope', 'ENV', function($scope, ENV) {

}]);
/**
 * Created by braddavis on 5/18/15.
 */
htsApp.controller('postingRulesController', ['$scope', 'ENV', function($scope, ENV) {

}]);
/**
 * Created by braddavis on 5/18/15.
 */
htsApp.controller('privacyPolicyController', ['$scope', 'ENV', function($scope, ENV) {

    $scope.legalUrl = {
        privacyPolicy: ENV.htsAppUrl + '/privacy-policy',
        postingRules: ENV.htsAppUrl + '/posting-rules',
        betaAgreement: ENV.htsAppUrl + '/beta-agreement',
        termsOfServiceUrl: ENV.htsAppUrl + '/terms-of-service'
    };

}]);
/**
 * Created by braddavis on 5/18/15.
 */
htsApp.controller('termsOfServiceController', ['$scope', 'ENV', function($scope, ENV) {

    $scope.legalUrl = {
        privacyPolicy: ENV.htsAppUrl + '/privacy-policy',
        postingRules: ENV.htsAppUrl + '/posting-rules',
        betaAgreement: ENV.htsAppUrl + '/beta-agreement',
        termsOfServiceUrl: ENV.htsAppUrl + '/terms-of-service'
    };

}]);
/**
 * Created by braddavis on 1/24/15.
 */
htsApp.controller('mainController', ['$scope', '$rootScope', 'sideNavFactory', '$timeout', 'Session', 'socketio', 'myPostsFactory', 'favesFactory', 'metaFactory', '$window', function ($scope, $rootScope, sideNavFactory, $timeout, Session, socketio, myPostsFactory, favesFactory, metaFactory, $window) {

    $scope.userObj = Session.userObj;

    $scope.sideNav = sideNavFactory.sideNav;

    //toggles sideNav left/right
    $scope.toggleOffCanvasSideNav = function () {
        $scope.sideNav.hidden = !$scope.sideNav.hidden;
    };


    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

        $rootScope.previousState = fromState.name || 'feed';
        $rootScope.currentState = toState.name;

        $rootScope.toParams = toParams;
        $rootScope.fromParams = fromParams;

        $rootScope.event = event;

        console.log("============= State Change Start ==============");
        console.log('State change event', $rootScope.event);
        console.log('Previous state:' + $rootScope.previousState, 'Params', $rootScope.fromParams);
        console.log('Current state:' + $rootScope.currentState, 'Params', $rootScope.toParams);
        console.log("============= State Change Done ==============");

        $timeout(function () {
            metaFactory.metatags.facebook.url = $window.location.href;
        }, 50);


        //Update the sidenav
        sideNavFactory.updateSideNav(toState);
        sideNavFactory.settingsMenu[0].link = $rootScope.previousState;


        if($rootScope.currentState !== 'feed.splash' && $rootScope.currentState !== 'results.splash' && $rootScope.currentState !== 'signup' && $rootScope.currentState !== 'signin' && $rootScope.currentState !== 'forgot' && $rootScope.currentState !== 'checkemail') {
            if ($rootScope.currentState === 'feed') {
                $scope.sideNav.listView = true;
            } else {
                $scope.sideNav.listView = false;
            }
        }

        //Hide the side navigation after user clicks a link
        $scope.sideNav.hidden = true;


        //if (toState.name === 'results' || 'feed') {
        //
        //    $timeout(function () {
        //
        //        //console.log('priming responsive navbar');
        //
        //        var navbar = angular.element(document.getElementsByClassName('navbar-fixed-top'));
        //        var innercontainer = angular.element(document.getElementsByClassName('inner-container'));
        //        var sideBarContainer = angular.element(document.getElementsByClassName('sidebar-container'));
        //
        //        var lastScrollTop = 0,
        //            st,
        //            scrollBarHidden = false;
        //
        //        var scrollingUpTest = function () {
        //
        //            st = innercontainer.scrollTop();
        //
        //            if (st > lastScrollTop) {
        //                lastScrollTop = st;
        //                return false;
        //            } else {
        //                lastScrollTop = st;
        //                return true;
        //            }
        //        };
        //
        //        innercontainer.on('scroll', function () {
        //            var scrollingUp = scrollingUpTest();
        //            var yScroll = innercontainer.scrollTop();
        //
        //            if (scrollBarHidden && scrollingUp) {
        //                navbar.removeClass('hide-navbar');
        //
        //                if(toState.name === 'results') {
        //                    sideBarContainer.removeClass('sidebar-container-roll-up');
        //                } else {
        //                    sideBarContainer.removeClass('sidebar-container-list-view-roll-up');
        //                }
        //
        //                scrollBarHidden = false;
        //                //console.log('ACTION: Showing navbar!');
        //
        //            } else if (yScroll >= 50 && !scrollBarHidden && !scrollingUp) {
        //                navbar.addClass('hide-navbar');
        //
        //                if(toState.name === 'results') {
        //                    sideBarContainer.addClass('sidebar-container-roll-up');
        //                } else {
        //                    sideBarContainer.addClass('sidebar-container-list-view-roll-up');
        //                }
        //
        //                scrollBarHidden = true;
        //                //console.log('ACTION: Hiding navbar!');
        //            }
        //        });
        //
        //    }, 250);
        //
        //} else {
        //
        //    var navbar = angular.element(document.getElementsByClassName('navbar-fixed-top'));
        //    var sideBarContainer = angular.element(document.getElementsByClassName('sidebar-container'));
        //
        //    navbar.removeClass('hide-navbar');
        //    sideBarContainer.removeClass('sidebar-container-roll-up');
        //    sideBarContainer.removeClass('sidebar-container-list-view-roll-up');
        //}
    });



    //RUNS ON PAGE LOAD.
    if ($scope.userObj.user_settings.loggedIn) {

        //Connect to Google Analytics... This will fail if app running in dev env.
        try {
            ga('set', '&uid', 'bdavis');
        } catch (err){
            console.log('Google Analytics not running');
        }

        //Fetches user object from server as soon as page loads
        Session.getUserFromServer().then(function (response) {
            Session.create(response);
        });
    }


    //Geolocate the users ip address
    //geoFactory.geolocateUser().then(function (response) {
    //    Session.userLocation = response;
    //
    //    console.log('Session.userLocation is: ', Session.userLocation);
    //
    //});






    //Joins/Leaves rooms and builds/destroys userobject on login/logout
    $scope.$watch('userObj.user_settings.loggedIn', function(newValue, oldValue) {
        if(newValue){

            socketio.init(Session.userObj.user_settings.name);
            myPostsFactory.getAllUserPosts(Session.userObj.user_settings.name).then(function(response){

                for(var i = 0; i < myPostsFactory.userPosts.data.length; i++){

                    var post = myPostsFactory.userPosts.data[i];

                    socketio.joinPostingRoom(post.postingId, 'postingOwner'); //Join the room of each posting the user owns.

                }

            });


            _.each(favesFactory.currentFavorites, function(favorite) {
                socketio.joinPostingRoom(favorite.postingId, 'inWatchList');
            });

            try {
                ga('set', '&uid', 'bdavis');
            } catch (err){
                console.log('Google Analytics not running');
            }



        } else {
            if(socketio.cachedUsername) { //if the user was previously logged in they will have this value so we must cleanup.
                socketio.closeAllConnections();


                if(myPostsFactory.userPosts.data.length) {

                    for(var i = 0; i < myPostsFactory.userPosts.data.length; i++) {

                        var post = myPostsFactory.userPosts.data[i];

                        socketio.leavePostingRoom(post.postingId, 'postingOwner');
                    }
                }


                _.each(favesFactory.currentFavorites, function(favorite) {
                    socketio.leavePostingRoom(favorite.postingId, 'inWatchList');
                });

            }
        }
    }, true);

}]);
/**
 * Created by braddavis on 4/22/15.
 */
htsApp.controller('metaController', ['$scope', 'metaFactory', function ($scope, metaFactory) {

    $scope.metatags = metaFactory.metatags;

}]);
/**
 * Created by braddavis on 4/22/15.
 */
htsApp.factory('metaFactory', function () {
    var factory = {};


    factory.metatags = {
        page: {
            title: "HashtagSell | Reinventing Online Classifieds",
            description: "HashtagSell is drastically improving how people sell items online. Share your item to eBay, Amazon, Craigslist and more with one click!",
            faviconUrl: "https://static.hashtagsell.com/htsApp/favicon/favicon.ico"
        },
        facebook: {
            title: "HashtagSell | Reinventing Online Classifieds",
            image: "https://static.hashtagsell.com/logos/hts/hi_res/Logo+(Complete).png",
            site_name: "HashtagSell.com",
            description: "HashtagSell is drastically improving how people sell items online. Share your item to eBay, Amazon, Craigslist and more with one click!",
            url: null
        },
        twitter: {
            card: "summary_large_image",
            site: "@hashtagsell",
            description: "HashtagSell is drastically improving how people sell items online. Share your item to eBay, Amazon, Craigslist and more with one click!",
            title: "HashtagSell.com | Reinventing Online Classifieds",
            creator: "@hashtagsell",
            image: "https://static.hashtagsell.com/logos/hts/hi_res/Logo+(Complete).png"
        }
    };


    return factory;
});
/**
 * Created by braddavis on 8/9/15.
 */
htsApp.service('modalConfirmationService', ['$modal', function ($modal) {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'js/modalConfirmation/partials/modalConfirmation.html'
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = ('modalController', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');
                    };
                }]);
            }

            return $modal.open(tempModalDefaults).result;
        };

    }]);

/**
 * Created by braddavis on 2/21/15.
 */
htsApp.controller('myPosts.controller', ['$scope', '$rootScope', '$filter', '$modal', '$window', 'myPostsFactory', 'Session', 'socketio', 'ngTableParams', 'newPostFactory', 'Notification', 'splashFactory', '$state', 'modalConfirmationService', function ($scope, $rootScope, $filter, $modal, $window, myPostsFactory, Session, socketio, ngTableParams, newPostFactory, Notification, splashFactory, $state, modalConfirmationService) {

    $scope.userPosts = myPostsFactory.userPosts;

    $scope.userObj = Session.userObj;

    console.log($scope.userPosts);


    myPostsFactory.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 2000, // include all favorites on page one
        filter: {},         // initial filter
        sorting: {}         // initial sort
    }, {
        counts: [], //hides page sizes
        total: $scope.userPosts.data.length,
        getData: function($defer, params) {
            // use built-in angular filter
            var filteredData = $filter('filter')($scope.userPosts.data, myPostsFactory.filterString);
            var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                filteredData;

            params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

    $scope.tableParams = myPostsFactory.tableParams;

    // Ugh... http://stackoverflow.com/questions/22892908/ng-table-typeerror-cannot-set-property-data-of-null
    $scope.tableParams.settings().$scope = $scope;

    //Declaring filters var so it can be attached to ng-table
    $scope.filters = {
        $: ''
    };


    //Filtering by all fields in table http://plnkr.co/edit/llb5k6?p=preview
    $scope.$watch("filters.$", function (value) {
        myPostsFactory.filterString = value;
        console.log(myPostsFactory.filterString);
        $scope.tableParams.reload();
    });


    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $scope.currentState = toState.name;
        $scope.expandedPostingId = toParams.postingId;
    });




    $scope.newPost = function () {
        var modalInstance = $modal.open({
            templateUrl: 'js/newPost/modals/newPost/partials/newPost.html',
            controller: 'newPostModal',
            size: 'lg',
            keyboard: false,
            backdrop: 'static',
            resolve: {
                mentionsFactory: function () {
                    return newPostFactory;
                }
            }
        });

        modalInstance.result.then(function (dismissObj) {

        }, function (dismissObj) {
            if (dismissObj.reason === "stageOneSuccess") {

                $scope.pushtoExternalService(dismissObj.post);
            }
            console.log('Modal dismissed at: ' + new Date());
        });
    };


    $scope.expandCollapseQuestions = function ($event, post) {
        $event.stopPropagation();

        if($rootScope.currentState !== 'myposts.questions') {
            post.currentlyViewing = {
                questions: true,
                meetings: false
            };
            $state.go('myposts.questions', {postingId: post.postingId});
        } else {
            post.currentlyViewing = {
                questions: false,
                meetings: false
            };
            $state.go('^');
        }
    };


    $scope.expandCollapseMeetingRequests = function ($event,  post) {
        $event.stopPropagation();

        if($rootScope.currentState !== 'myposts.meetings') {
            post.currentlyViewing = {
                questions: false,
                meetings: true
            };
            $state.go('myposts.meetings', {postingId: post.postingId});
        } else {
            post.currentlyViewing = {
                questions: false,
                meetings: false
            };
            $state.go('^');
        }
    };



    $scope.countUnreadQuestions = function(post){

        var unreadQuestionsCount = 0;

        for(var i = 0; i < post.questions.results.length; i++){
            var question = post.questions.results[i];
            if(!question.answers.length){ //if question does not have answer
                unreadQuestionsCount++;
            }
        }

        return unreadQuestionsCount;
    };



    $scope.countUnreadOffers = function(post){

        var unreadOffersCount = 0;

        for(var i = 0; i < post.offers.results.length; i++){
            var offer = post.offers.results[i];

            //unreadOffersCount++;
            //console.log('counting offer', offer);
            //for(var j = 0; j < offer.proposals.length; j++){
            //    var proposedTime = offer.proposals[j];
            //
            //    if(proposedTime.acceptedAt){ //if offer does not have answer
            //        unreadOffersCount--;
            //    }
            //
            //}

            if(!offer.proposals[offer.proposals.length-1].isOwnerReply && !offer.proposals[offer.proposals.length-1].acceptedAt){
                unreadOffersCount++;
            }


        }

        return unreadOffersCount;
    };



    $scope.deletePost = function(post) {

        console.log(post);

        var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'Delete Post',
            headerText: 'Delete Your Post?',
            bodyText: 'Are you sure you want to delete this post?'
        };

        modalConfirmationService.showModal({}, modalOptions).then(function (result) {
            myPostsFactory.deletePost(post).then(function(response){

                if(response.status === 204) {

                    socketio.leavePostingRoom(post.postingId, 'postingOwner');

                    myPostsFactory.getAllUserPosts(Session.userObj.user_settings.name).then(function(response){

                        if(response.status === 200) {

                        } else {

                            Notification.error({
                                title: 'Whoops',
                                message: 'Please notify support.  We coulnd\'t refresh your myPosts list after deleting an item.' ,
                                delay: 10000
                            });  //Send the webtoast

                            alert('could not refresh myPost list after deleting item.  contact support.');

                        }

                    });

                } else {

                    Notification.error({
                        title: 'Whoops',
                        message: 'Please notify support.  We coulnd\'t delete your item for some reason.' ,
                        delay: 10000
                    });  //Send the webtoast

                }

            });
        });
    };



    $scope.editPost = function(post) {

        Notification.error({
            title: 'Coming soon',
            message: 'Please delete and recreate the ad for now.  We\'re rolling out edit functionality soon! :)' ,
            delay: 10000
        });  //Send the webtoast

    };



    //passes properties associated with clicked DOM element to splashFactory for detailed view
    $scope.openSplash = function(post){
        splashFactory.result = post;
        console.log(splashFactory.result);
        $state.go('myposts.splash', { id: post.postingId });
    };




    //FACEBOOK MGMT
    $scope.showFacebookPost = function (post) {
        $window.open("http://facebook.com");
    };

    $scope.removeFacebookPost = function (post) {

    };



    //TWITTER MGMT
    $scope.showTwitterPost = function (post) {
        $window.open("http://twitter.com");
    };

    $scope.removeTwitterPost = function (post) {

    };



    //EBAY MGMT
    $scope.showEbayPost = function (post) {
        $window.open(post.ebay.url);
    };

    $scope.removeEbayPost = function (post) {

    };

}]);
/**
 * Created by braddavis on 3/31/15.
 */
htsApp.factory('myPostsFactory', ['$http', 'ENV', '$q', 'utilsFactory', 'sideNavFactory', 'profileFactory', function ($http, ENV, $q, utilsFactory, sideNavFactory, profileFactory) {

    var factory = {};

    factory.userPosts = {
        data: [],
        updateMyPostsBadgeCount: function () {

            var unreadCount = 0;

            if(this.data.length){

                for(var i = 0; i < this.data.length; i++){

                    var post = this.data[i];

                    if(post.questions.results.length){

                        for (var j = 0; j < post.questions.results.length; j++){

                            var question = post.questions.results[j];

                            if(!question.answers.length){

                                unreadCount++;

                            }

                        }

                    }

                    if(post.offers.results.length){

                        for (var k = 0; k < post.offers.results.length; k++){

                            var offer = post.offers.results[k];



                            //for(var l = 0; l < offer.proposals.length; l++){
                            //    var proposedTime = offer.proposals[l];
                            //
                            //    if(proposedTime.acceptedAt){ //if question does not have answer
                            //        unreadCount--;
                            //    }
                            //
                            //}

                            if(!offer.proposals[offer.proposals.length-1].isOwnerReply && !offer.proposals[offer.proposals.length-1].acceptedAt){
                                unreadCount++;
                            }

                        }

                    }

                }
            }

            sideNavFactory.items[1].alerts = unreadCount;
            return unreadCount;

        }
    };



    factory.getAllUserPosts = function (username) {

        var deferred = $q.defer();

        var params = {
            filters: {
                mandatory: {
                    exact: {
                        username: username
                    }
                }
            }
        };


        $http({
            method: 'GET',
            url: ENV.postingAPI + utilsFactory.bracketNotationURL(params)
        }).then(function (response) {

            var allUserPosts = response.data.results;

            if(allUserPosts.length) {

                if(factory.userPosts.data.length) { //If there are already items on screen then clear it before updating inventory.
                    factory.userPosts.data = [];
                }

                for (var i=0; i < allUserPosts.length; i++) {

                    var post = allUserPosts[i];

                    factory.getPostingIdQuestionsAndOffers(post.postingId).then(function (response) {

                        var postWithQuestionOfferAndProfile = response.data;

                        factory.userPosts.data.push(postWithQuestionOfferAndProfile);

                        factory.userPosts.updateMyPostsBadgeCount();

                        if(factory.userPosts.data.length === allUserPosts.length){ //if we're done caching all posts with questions and offers then resolve so we can update ui.
                            if(factory.tableParams) {
                                factory.tableParams.reload();
                            }

                            console.log(username + ' items for sale:', factory.userPosts);

                            deferred.resolve(response);
                        }

                    });

                }

            } else {

                factory.userPosts.data = [];

                sideNavFactory.items[1].alerts = 0;

            }

        }, function (err) {
            deferred.reject(err);
        });



        return deferred.promise;
    };







    factory.getPostingIdQuestionsAndOffers = function (postingId) {

        var deferred = $q.defer();

        var params = {
            postingId: postingId,
            questions: true,
            offers: true,
            count: 100
        };

        $http({
            method: 'GET',
            url: ENV.postingAPI + postingId + utilsFactory.bracketNotationURL(params)
        }).then(function (response, status, headers, config) {

            if(response.status === 200) {

                //console.log(response);

                //factory.questions.store = response.data.questions.results; //SplashFactory watches this store.
                if(response.data.questions.results.length) {

                    var questionDeferredCount = 0;

                    for(var i = 0; i < response.data.questions.results.length; i++) {

                        profileFactory.getUserProfile(response.data.questions.results[i].username).then(function (profileResponse) { //get user profiles of those who asked questions

                            questionDeferredCount++;

                            if(profileResponse.status === 200){

                                response.data.questions.results[questionDeferredCount-1].userProfile = profileResponse.data.user;

                            }

                            if(questionDeferredCount === response.data.questions.results.length){

                                if(!response.data.offers.results.length) {

                                    deferred.resolve(response);

                                }

                            }

                        });

                    }
                }

                if(response.data.offers.results.length) {

                    var offerDeferredCount = 0;

                    for (var j = 0; j < response.data.offers.results.length; j++) {

                        profileFactory.getUserProfile(response.data.offers.results[j].username).then(function (profileResponse) { //get user profiles of those who asked questions

                            offerDeferredCount++;

                            if (profileResponse.status === 200) {

                                response.data.offers.results[offerDeferredCount - 1].userProfile = profileResponse.data.user;

                            }

                            if (offerDeferredCount === response.data.offers.results.length) {

                                deferred.resolve(response);
                            }

                        });

                    }
                } else {

                    deferred.resolve(response);

                }


            } else {
                deferred.reject(response);
            }

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;

    };




    factory.deletePost = function (post) {

        var deferred = $q.defer();


        $http({
            method: 'DELETE',
            url: ENV.postingAPI + post.postingId
        }).then(function (response, status, headers, config) {

            console.log('delete response: ', response);

            deferred.resolve(response);

        }, function (response, status, headers, config) {

            deferred.reject(response);
        });

        return deferred.promise;
    };


    return factory;

}]);
/**
 * Created by braddavis on 2/22/15.
 */
htsApp.controller('myPosts.meetings.controller', ['$scope', 'meetingsFactory', 'myPostsFactory', 'socketio', '$state', 'Session', 'Notification', 'transactionFactory', function ($scope, meetingsFactory, myPostsFactory, socketio, $state, Session, Notification, transactionFactory) {

    $scope.userObj = Session.userObj;

    $scope.cachedOffers = angular.copy($scope.post.offers.results);

    $scope.acceptedTime = {model :  undefined};

    $scope.errors = {
        message: null
    };

    $scope.counterOffer = function ($index, proposal) {

        var indexOfOfferToUpdate = $index;

        console.log('index of offer to add proposal to:', indexOfOfferToUpdate);

        transactionFactory.proposeDeal($scope.post, indexOfOfferToUpdate);

    };


    $scope.acceptDeal = function ($index, proposal) {

        //console.log($index);
        //
        //console.log(proposal);
        //
        //proposal.when = $scope.acceptedTime.model;
        //
        //console.log(proposal);

        if($scope.acceptedTime.model) {

            var acceptedProposal = {
                acceptedAt: moment().format(),
                price: proposal.price,
                when: $scope.acceptedTime.model,
                where: proposal.where,
                isOwnerReply: true
            };

            var offer = $scope.post.offers.results[$index];

            meetingsFactory.acceptOffer($scope.post, offer, acceptedProposal).then(function (response) {

                if (response.status === 201) {

                    myPostsFactory.getAllUserPosts($scope.userObj.user_settings.name);

                    Notification.primary({
                        title: "Sent Offer Acceptance!",
                        message: "We've notified @" + offer.username + ".  Expect an email shortly.",
                        delay: 7000
                    });

                    var transactionRequirements = {
                        "buyer" : offer.userProfile,
                        "buyerUsername" : offer.username,
                        "offerId" : offer.offerId,
                        "postingId" : $scope.post.postingId,
                        "seller" : {
                            "name": $scope.userObj.user_settings.name,
                            "banner_photo" : $scope.userObj.user_settings.banner_photo,
                            "profile_photo" : $scope.userObj.user_settings.profile_photo
                        },
                        "sellerUsername" : $scope.userObj.user_settings.name
                    };

                    transactionFactory.createTransaction(transactionRequirements).then(function (response) {

                        console.log(response);

                    }, function (err) {

                        Notification.error({
                            title: "Failed to append transaction ID",
                            message: "Please inform support.  Sorry for the trouble.",
                            delay: 7000
                        });

                    });

                } else {

                    console.log(response);

                    Notification.error({title: response.name, message: response.message, delay: 20000});

                }


            }, function (err) {

                console.log(err);

                Notification.error({title: err.data.name, message: err.data.message, delay: 20000});

            });
        } else {

            $scope.errors.message = "Please select a proposed time from above.";

        }

    };

    $scope.deleteOffer = function (offer, post) {

        meetingsFactory.deleteOffer(offer, post).then(function (response) {

            console.log(response);

            if (response.status === 204) {

                var recipient = offer.username;

                if(!isBlank(offer.message)) {

                    socketio.sendMessage(recipient, offer.message);
                } else {

                    socketio.sendMessage(recipient, offer.response);
                }

                myPostsFactory.getAllUserPosts($scope.userObj.user_settings.name);

            } else {

                Notification.error({title: response.name, message: response.message, delay: 20000});

            }


        }, function (err) {

            Notification.error({title: "Contact Support", message: "Failed to decline the offer.  Error:" + err, delay: 20000});

        });

    };


    function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }

}]);



htsApp.directive('constructMyPostsOverlayMessage', function () {
    return {
        scope: {
            offer: '=',
            post: '='
        },
        restrict: 'EA',
        link: function (scope, element, attr) {
            console.log('scope', scope);
            console.log('element', element);
            console.log('attr', attr);
            if(scope.offer.proposals[scope.offer.proposals.length - 1].acceptedAt){
                attr.$set('message', 'Awesome!  We\'ll send you a reminder email with details.');
            } else {
                attr.$set('message', 'Offer sent to @' + scope.offer.username );
            }
        }
    };
});
/**
 * Created by braddavis on 4/1/15.
 */
htsApp.directive("ownerMeetingsMoreInfo", function() {
    return {
        restrict: "E",
        scope: { post: '=' },
        templateUrl: "js/myPosts/meetings/partials/myPosts.meetings.html",
        controller: "myPosts.meetings.controller"
    };
});
/**
 * Created by braddavis on 2/21/15.
 */
htsApp.factory('meetingsFactory', ['$http', '$rootScope', '$q', 'ENV', 'Session', 'utilsFactory', function ($http, $rootScope, $q, ENV, Session, utilsFactory) {

    var factory = {};


    //Socket.io calls this function when new-offer is emitted
    factory.newOfferNotification = function (offer) {

        console.log(
            '%s placed an %s offers on postingId %s to meet @ %s around %s',
            offer.username,
            offer.proposals.length,
            offer.postingId,
            offer.proposals[0].where,
            offer.proposals[0].when
        );

        console.log(offer);
    };





    factory.sendOffer = function (post, offer) {

        console.log('sending this offer', offer);

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ENV.postingAPI + post.postingId + "/offers",
            data: offer
        }).then(function (offerResponse, status, headers, config) {

            console.log('heres our offer response', offerResponse);

            deferred.resolve(offerResponse);

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };


    factory.acceptOffer = function (post, offer, acceptedProposal) {

        var deferred = $q.defer();

        console.log('HERES THE ACCEPTED PROPOSAL', acceptedProposal);
        console.log('HERES THE ACCEPTED POST', post);
        console.log('HERES THE ACCEPTED OFFER', offer);

        $http({
            method: 'POST',
            url: ENV.postingAPI + post.postingId + "/offers/" + offer.offerId + "/accept",
            data: acceptedProposal
        }).then(function (response, status, headers, config) {

            deferred.resolve(response);


        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };



    factory.deleteOffer = function (offer, post) {

        console.log('Deleting offer', post.postingId, offer.offerId);

        var deferred = $q.defer();

        $http({
            method: 'DELETE',
            url: ENV.postingAPI + post.postingId + "/offers/" + offer.offerId
        }).then(function (response, status, headers, config) {

            deferred.resolve(response);


        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };


    factory.getOffers = function (post) {

        console.log('Gettings offers for post: ', post.postingId);

        var deferred = $q.defer();

        var params = {
            postingId: post.postingId,
            questions: false,
            offers: true,
            count: 100
        };

        $http({
            method: 'GET',
            url: ENV.postingAPI + post.postingId + utilsFactory.bracketNotationURL(params)
        }).then(function (response, status, headers, config) {

            deferred.resolve(response);


        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };




    factory.updateOffer = function (post, offer) {

        console.log('Updating offer', post.postingId, offer.offerId);

        var deferred = $q.defer();

        $http({
            method: 'PUT',
            url: ENV.postingAPI + post.postingId + "/offers/" + offer.offerId,
            data: offer
        }).then(function (updatedOfferResponse, status, headers, config) {

            console.log('heres our updated offer response', updatedOfferResponse);

            //var userToEmail;
            //var notifySeller;
            //
            ////check if the most recent offer was proposed by owner or buyer
            //if(updatedOfferResponse.data.proposals[updatedOfferResponse.data.proposals.length - 1].isOwnerReply){//owner sent updated offer
            //    userToEmail = updatedOfferResponse.data.username;
            //    notifySeller = false;
            //} else {
            //    userToEmail = post.username;
            //    notifySeller = true;
            //}
            //
            //var emailObj = {
            //    post: post,
            //    offer: updatedOfferResponse.data,
            //    user: {
            //        notifySeller: notifySeller,
            //        email: userToEmail
            //    }
            //};
            //
            ////Send email to owner of posting and user potential buyer
            //$http.post(ENV.htsAppUrl + '/email/meeting-updated/instant-reminder', {updatedMeeting: emailObj}).success(function(response){
            //
            //
            //}).error(function(data){
            //
            //
            //});


            deferred.resolve(updatedOfferResponse);


        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };


    return factory;
}]);
/**
 * Created by braddavis on 2/24/15.
 */
htsApp.controller('myPosts.questions.controller', ['$scope', 'qaFactory', '$state', 'Notification', 'myPostsFactory', 'Session', function ($scope, qaFactory, $state, Notification, myPostsFactory, Session) {

    $scope.userObj = Session.userObj;

    //Toggles whether the posting owner sees questions they've already answered or not.
    //$scope.showAnswered = false;

    //Drops down menu so posting owner can delete their item for sale.
    $scope.toggled = function(open) {
        console.log('Dropdown is now: ', open);
    };



    $scope.submitAnswer = function (question, index) {

        var answerPayload = {
            username: question.username,
            value: question.givenAnswer
        };


        qaFactory.submitAnswer(question.postingId, question.questionId, answerPayload).then(function (response) {

            if(response.status === 201) {

                console.log(response);

                myPostsFactory.getAllUserPosts($scope.userObj.user_settings.name).then(function (response) {

                });

            } else {

                Notification.error({title: response.name, message: response.message});

            }

        }, function (err) {

            //TODO: Alert status update

        });

    };


    $scope.deleteQuestion = function (postingId, questionId, index) {

        qaFactory.deleteQuestion(postingId, questionId).then(function (response) {

            if(response.status === 204){

                if(!$scope.post.questions.results.length) {
                    $state.go('^');
                }

            } else {

                Notification.error({title: response.name, message: response.message});

            }

        }, function (err) {

            //TODO: Alert status update

        });

    };

    $scope.updateAnswer = function (answerId) {
        $scope.deleteAnswer(answerId);
        $scope.submitAnswer();
    };

    $scope.deleteAnswer = function (answerId) {

        var postingId = $scope.question.postingId;
        var questionId = $scope.question.questionId;

        qaFactory.deleteAnswer(postingId, questionId, answerId).then(function (response) {

            //$state.go('^');

        }, function (err) {

            //TODO: Alert status update

        });
    };

}]);
/**
 * Created by braddavis on 4/1/15.
 */
htsApp.directive("ownerQuestionsMoreInfo", function() {
    return {
        restrict: "E",
        scope: { post: '=' },
        templateUrl: "js/myPosts/questions/partials/myPosts.questions.html",
        controller: "myPosts.questions.controller"
    };
});
/**
 * Created by braddavis on 2/21/15.
 */
htsApp.factory('qaFactory', ['$http', '$rootScope', 'ENV', '$q', 'utilsFactory', function ($http, $rootScope, ENV, $q, utilsFactory) {
    var factory = {};

    //Splash controller binds with this object to update view in realtime.
    factory.questions = {
        store: []
    };



    factory.getPostingIdQuestions = function (postingId) {

        var deferred = $q.defer();

        var params = {
            postingId: postingId,
            questions: true,
            count: 100
        };

        $http({
            method: 'GET',
            url: ENV.postingAPI + postingId + utilsFactory.bracketNotationURL(params)
        }).then(function (response, status, headers, config) {

            if(response.status === 200) {

                factory.questions.store = response.data.questions.results; //SplashFactory watches this store.

                deferred.resolve(response);

            } else {
                deferred.reject(response);
            }

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;

    };



    factory.submitQuestion = function (question, post, username) {

        var deferred = $q.defer();

        var postingId = post.postingId;

        var data = {
            "username": username,
            "value" : question
        };

        $http({
            method: 'POST',
            url: ENV.postingAPI + postingId + '/questions',
            data: data
        }).then(function (response, status, headers, config) {

            if(response.status === 201) {

                factory.questions.store.unshift(response.data);

                console.log('question response', response.data);

                var questionObj = {
                    question: response.data,
                    post: post
                };

                //Send email to owner of posting and user potential buyer
                //$http.post(ENV.htsAppUrl + '/email/question-asked/instant-reminder', {questionAsked: questionObj}).success(function(response){
                //
                //
                //}).error(function(data){
                //
                //
                //});
                //var timestamp = Date.now();
                //
                //var notification = {
                //    posting: post,
                //    question: response.data,
                //    username: username,
                //    timestamp: timestamp
                //};
                //
                //console.log('here is notification', notification);
                //
                //
                //$http.post(ENV.notificationAPI + '/question', notification).success(function(response){
                //
                //    console.log('here is notification response', response);
                //
                //}).error(function(err){
                //
                //    console.log('notification error', err);
                //
                //});


                deferred.resolve(response);

            } else {

                deferred.reject(response);

            }



        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };



    factory.submitAnswer = function (postingId, questionId, payload) {

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ENV.postingAPI + postingId + '/questions/' + questionId + '/answers',
            data: payload
        }).then(function (response, status, headers, config) {

            //factory.getPostingIdQuestions(postingId).then(function (response) {

                deferred.resolve(response);

            //}, function (err) {
            //
            //    deferred.reject(err);
            //
            //});



        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;


    };

    factory.deleteQuestion = function (postingId, questionId) {

        var deferred = $q.defer();

        $http({
            method: 'DELETE',
            url: ENV.postingAPI + postingId + '/questions/' + questionId
        }).then(function (response, status, headers, config) {

            deferred.resolve(response);


        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;

    };


    factory.deleteAnswer = function (postingId, questionId, answerId) {

        var deferred = $q.defer();

        $http({
            method: 'DELETE',
            url: ENV.postingAPI + postingId + '/questions/' + questionId + '/answers/ ' + answerId
        }).then(function (response, status, headers, config) {

            factory.getPostingIdQuestions(postingId).then(function (response) {

                deferred.resolve(response);

            }, function (err) {

                deferred.reject(err);

            });

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };


    return factory;
}]);
htsApp.controller('newPostController', ['$scope', '$modal', '$state', 'newPostFactory', 'Session', 'authModalFactory', 'myPostsFactory', function ($scope, $modal, $state, newPostFactory, Session, authModalFactory, myPostsFactory) {

    $scope.userObj = Session.userObj;

    $scope.newPost = function () {

        var modalInstance = $modal.open({
            templateUrl: 'js/newPost/modals/newPost/partials/newPost.html',
            controller: 'newPostModal',
            size: 'lg',
            keyboard: false,
            backdrop: 'static',
            resolve: {
                mentionsFactory: function () {
                    return newPostFactory;
                }
            }
        });

        modalInstance.result.then(function (dismissObj) {

        }, function (dismissObj) {
            if (dismissObj.reason === "stageOneSuccess") {

                $scope.pushtoExternalService(dismissObj.post);
            }
            console.log('Modal dismissed at: ' + new Date());
        });
    };



    $scope.pushtoExternalService = function (post) {

        var modalInstance = $modal.open({
            templateUrl: 'js/newPost/modals/pushToExternalSources/partials/newPost.pushToExternalSources.html',
            controller: 'pushNewPostToExternalSources',
            keyboard: false,
            backdrop: 'static',
            resolve: {
                newPost : function () {
                    return post;
                }
            }
        });

        modalInstance.result.then(function (dismissObj) {

        }, function (dismissObj) {
            if(dismissObj.reason === "stageTwoSuccess"){
                myPostsFactory.getAllUserPosts(Session.userObj.user_settings.name).then(function (response) { //Have the owner lookup all their items they're selling and the associated questions, meeting requests, etc etc.  The owner app view updates realtime.
                    $state.go('myposts');
                });
            }
            console.log('Modal dismissed at: ' + new Date());
        });
    };




    //$scope.congrats = function (postingObj) {
    //
    //    var modalInstance = $modal.open({
    //        templateUrl: 'js/newPost/modals/congrats/partials/newPost.congrats.html',
    //        controller: 'newPostCongrats',
    //        resolve: {
    //            newPost: function () {
    //                return postingObj;
    //            }
    //        }
    //    });
    //
    //    modalInstance.result.then(function () {
    //
    //    }, function (reason) {
    //        if(reason === "dismiss"){
    //            $state.go('myposts');
    //            console.log('Modal dismissed at: ' + new Date());
    //        }
    //    });
    //};

}]);

/**
 * Created by braddavis on 2/25/15.
 */
htsApp.controller('newPostCongrats', ['$scope', '$modal', '$modalInstance', 'newPost', 'myPostsFactory', 'Session', 'socketio', function ($scope, $modal, $modalInstance, newPost, myPostsFactory, Session, socketio) {

    $scope.newPost = newPost;

    console.log(newPost);

    myPostsFactory.getAllUserPosts(Session.userObj.user_settings.name).then(function () {

        for(var i = 0; i < myPostsFactory.userPosts.data.length; i++){

            var post = myPostsFactory.userPosts.data[i];

            socketio.joinPostingRoom(post.postingId, 'postingOwner'); //Join the room of each posting the user owns.

        }
    });

    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);
/**
 * Created by braddavis on 1/6/15.
 */
htsApp.controller('newPostModal', ['$scope', '$http', '$q', '$modalInstance', '$timeout', '$state', '$modal', '$filter', 'mentionsFactory', '$templateCache', 'ENV', 'Session', 'Notification', 'modalConfirmationService', 'socketio', function ($scope, $http, $q, $modalInstance, $timeout, $state, $modal, $filter, mentionsFactory, $templateCache, ENV, Session, Notification, modalConfirmationService, socketio) {


    $scope.showDemo = false;
    $scope.hideDemo = function () {
        $scope.showDemo = !$scope.showDemo;
        if($scope.showDemo) {
            $scope.img = '//static.hashtagsell.com/tutorialRelated/sell_box_animation_short.gif';

            $timeout(function () {
                $scope.showDemo = false;
            }, 22720);

        } else {
            $scope.img = '//static.hashtagsell.com/tutorialRelated/sell_box_static.png';
        }
        //scope.currentlyPlaying = false;
    };

    $scope.clearPlaceholder = function () {
        if (!$scope.placeholderCleared) {
            console.log("clearing placeholder");
            document.getElementById("htsPost").innerHTML = "";
            $scope.resetAll();
            $scope.placeholderCleared = true;
        } else {
            console.log('placeholder already cleared');
        }
    };

    $scope.toggleExampleVisibility = true;
    $scope.clearExampleReminder = function () {
        $scope.toggleExampleVisibility = false;
    };

    $scope.manualCategorySelect = mentionsFactory.manualCategorySelect;

    $scope.resetAll = function () {
        $scope.jsonObj = mentionsFactory.setJsonTemplate();
        mentionsFactory.alerts = {
            banners: []
        };
    };
    $scope.resetAll();





    //$scope.$watch('jsonObj', function(newValue, oldValue) {
    //        console.log(newValue);
    //        $scope.jsonObjDebug = JSON.stringify(newValue, null, "    ");
    //    }
    //);


    $scope.allCategories = [
        {
            "code": "AAAA",
            "name": "animals",
            "categories": [
                {
                    "code": "APET",
                    "name": "pets"
                },
                {
                    "code": "ASUP",
                    "name": "supplies"
                },
                {
                    "code": "AOTH",
                    "name": "other"
                }
            ]
        },
        {
            "code": "CCCC",
            "name": "community",
            "categories": [
                {
                    "code": "CCNW",
                    "name": "classes and workshops"
                },
                {
                    "code": "COMM",
                    "name": "events"
                },
                {
                    "code": "CGRP",
                    "name": "groups"
                },
                {
                    "code": "CLNF",
                    "name": "lost and found"
                },
                {
                    "code": "CRID",
                    "name": "rideshares"
                },
                {
                    "code": "CVOL",
                    "name": "volunteers"
                },
                {
                    "code": "COTH",
                    "name": "other"
                }
            ]
        },
        {
            "code": "SSSS",
            "name": "for sale",
            "categories": [
                {
                    "code": "SANT",
                    "name": "antiques"
                },
                {
                    "code": "SAPP",
                    "name": "apparel"
                },
                {
                    "code": "SAPL",
                    "name": "appliances"
                },
                {
                    "code": "SANC",
                    "name": "art and crafts"
                },
                {
                    "code": "SKID",
                    "name": "babies and kids"
                },
                {
                    "code": "SBAR",
                    "name": "barters"
                },
                {
                    "code": "SBIK",
                    "name": "bicycles"
                },
                {
                    "code": "SBIZ",
                    "name": "businesses"
                },
                {
                    "code": "SCOL",
                    "name": "collections"
                },
                {
                    "code": "SEDU",
                    "name": "educational"
                },
                {
                    "code": "SELE",
                    "name": "electronics and photo"
                },
                {
                    "code": "SFNB",
                    "name": "food and beverage"
                },
                {
                    "code": "SFUR",
                    "name": "furniture"
                },
                {
                    "code": "SGAR",
                    "name": "garage sales"
                },
                {
                    "code": "SGFT",
                    "name": "gift cards"
                },
                {
                    "code": "SHNB",
                    "name": "health and beauty"
                },
                {
                    "code": "SHNG",
                    "name": "home and garden"
                },
                {
                    "code": "SIND",
                    "name": "industrial"
                },
                {
                    "code": "SJWL",
                    "name": "jewelry"
                },
                {
                    "code": "SLIT",
                    "name": "literature"
                },
                {
                    "code": "SMNM",
                    "name": "movies and music"
                },
                {
                    "code": "SMUS",
                    "name": "musical instruments"
                },
                {
                    "code": "SRES",
                    "name": "restaurants"
                },
                {
                    "code": "SSNF",
                    "name": "sports and fitness"
                },
                {
                    "code": "STIX",
                    "name": "tickets"
                },
                {
                    "code": "STOO",
                    "name": "tools"
                },
                {
                    "code": "STOY",
                    "name": "toys and hobbies"
                },
                {
                    "code": "STVL",
                    "name": "travel"
                },
                {
                    "code": "SWNT",
                    "name": "wanted"
                },
                {
                    "code": "SOTH",
                    "name": "other"
                }
            ]
        },
        {
            "code": "RRRR",
            "name": "real estate",
            "categories": [
                {
                    "code": "RCRE",
                    "name": "commercial real estate"
                },
                {
                    "code": "RHFR",
                    "name": "housing for rent"
                },
                {
                    "code": "RHFS",
                    "name": "housing for sale"
                },
                {
                    "code": "RSUB",
                    "name": "housing sublets"
                },
                {
                    "code": "RSWP",
                    "name": "housing swaps"
                },
                {
                    "code": "RLOT",
                    "name": "lots and land"
                },
                {
                    "code": "RPNS",
                    "name": "parking and storage"
                },
                {
                    "code": "RSHR",
                    "name": "room shares"
                },
                {
                    "code": "RVAC",
                    "name": "vacation properties"
                },
                {
                    "code": "RWNT",
                    "name": "want housing"
                },
                {
                    "code": "ROTH",
                    "name": "other"
                }
            ]
        },
        {
            "code": "SVCS",
            "name": "services",
            "categories": [
                {
                    "code": "SVCC",
                    "name": "creative"
                },
                {
                    "code": "SVCE",
                    "name": "education"
                },
                {
                    "code": "SVCF",
                    "name": "financial"
                },
                {
                    "code": "SVCM",
                    "name": "health"
                },
                {
                    "code": "SVCH",
                    "name": "household"
                },
                {
                    "code": "SVCP",
                    "name": "professional"
                },
                {
                    "code": "SVCO",
                    "name": "other"
                }
            ]
        },
        {
            "code": "ZZZZ",
            "name": "uncategorized",
            "categories": [
                {
                    "code": "ZOTH",
                    "name": "other"
                }
            ]
        },
        {
            "code": "VVVV",
            "name": "vehicles",
            "categories": [
                {
                    "code": "VAUT",
                    "name": "autos"
                },
                {
                    "code": "VMOT",
                    "name": "motorcycles"
                },
                {
                    "code": "VMPT",
                    "name": "motorcycle parts"
                },
                {
                    "code": "VPAR",
                    "name": "parts"
                },
                {
                    "code": "VOTH",
                    "name": "other"
                }
            ]
        },
        {
            "code": "JJJJ",
            "name": "jobs",
            "categories": [
                {
                    "code": "JACC",
                    "name": "accounting"
                },
                {
                    "code": "JADM",
                    "name": "administrative"
                },
                {
                    "code": "JAER",
                    "name": "aerospace and defense"
                },
                {
                    "code": "JANL",
                    "name": "analyst"
                },
                {
                    "code": "JANA",
                    "name": "animals and agriculture"
                },
                {
                    "code": "JARC",
                    "name": "architecture"
                },
                {
                    "code": "JART",
                    "name": "art"
                },
                {
                    "code": "JAUT",
                    "name": "automobile"
                },
                {
                    "code": "JBEA",
                    "name": "beauty"
                },
                {
                    "code": "JBIZ",
                    "name": "business development"
                },
                {
                    "code": "JWEB",
                    "name": "computer and web"
                },
                {
                    "code": "JCST",
                    "name": "construction and facilities"
                },
                {
                    "code": "JCON",
                    "name": "consulting"
                },
                {
                    "code": "JCUS",
                    "name": "customer service"
                },
                {
                    "code": "JDES",
                    "name": "design"
                },
                {
                    "code": "JEDU",
                    "name": "education"
                },
                {
                    "code": "JENE",
                    "name": "energy"
                },
                {
                    "code": "JENG",
                    "name": "engineering"
                },
                {
                    "code": "JENT",
                    "name": "entertainment and media"
                },
                {
                    "code": "JEVE",
                    "name": "events"
                },
                {
                    "code": "JFIN",
                    "name": "finance"
                },
                {
                    "code": "JFNB",
                    "name": "food and beverage"
                },
                {
                    "code": "JGIG",
                    "name": "gigs"
                },
                {
                    "code": "JGOV",
                    "name": "government"
                },
                {
                    "code": "JHEA",
                    "name": "healthcare"
                },
                {
                    "code": "JHOS",
                    "name": "hospitality and travel"
                },
                {
                    "code": "JHUM",
                    "name": "human resources"
                },
                {
                    "code": "JMNT",
                    "name": "installation, maintenance and repair"
                },
                {
                    "code": "JINS",
                    "name": "insurance"
                },
                {
                    "code": "JINT",
                    "name": "international"
                },
                {
                    "code": "JLAW",
                    "name": "law enforcement"
                },
                {
                    "code": "JLEG",
                    "name": "legal"
                },
                {
                    "code": "JMAN",
                    "name": "management and directorship"
                },
                {
                    "code": "JMFT",
                    "name": "manufacturing and mechanical"
                },
                {
                    "code": "JMAR",
                    "name": "marketing, advertising and public relations"
                },
                {
                    "code": "JNON",
                    "name": "non-profit"
                },
                {
                    "code": "JOPS",
                    "name": "operations and logistics"
                },
                {
                    "code": "JPHA",
                    "name": "pharmaceutical"
                },
                {
                    "code": "JPRO",
                    "name": "product, project and program management"
                },
                {
                    "code": "JPUR",
                    "name": "purchasing"
                },
                {
                    "code": "JQUA",
                    "name": "quality assurance"
                },
                {
                    "code": "JREA",
                    "name": "real estate"
                },
                {
                    "code": "JREC",
                    "name": "recreation"
                },
                {
                    "code": "JRES",
                    "name": "resumes"
                },
                {
                    "code": "JRNW",
                    "name": "retail and wholesale"
                },
                {
                    "code": "JSAL",
                    "name": "sales"
                },
                {
                    "code": "JSCI",
                    "name": "science"
                },
                {
                    "code": "JSEC",
                    "name": "security"
                },
                {
                    "code": "JSKL",
                    "name": "skilled trade and general labor"
                },
                {
                    "code": "JTEL",
                    "name": "telecommunications"
                },
                {
                    "code": "JTRA",
                    "name": "transportation"
                },
                {
                    "code": "JVOL",
                    "name": "volunteer"
                },
                {
                    "code": "JWNP",
                    "name": "writing and publishing"
                },
                {
                    "code": "JOTH",
                    "name": "other"
                }
            ]
        }
    ];

    $scope.handlePaste = function ($event) {
        $event.preventDefault();
        $scope.jsonObj.body = $event.originalEvent.clipboardData.getData('text/plain');
    };


    //TODO: Handle auctions
    $scope.macros = {
        'obo': '*Or Best Offer*'
    };

    $scope.isEmpty = function isEmpty(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    };

    $scope.dismiss = function (reason) {

        var modalOptions = {
            closeButtonText: 'No',
            actionButtonText: 'Yes',
            headerText: 'Cancel New Post?',
            bodyText: 'Your new post has not been saved.  Are you sure you want to cancel your new post?'
        };

        modalConfirmationService.showModal({}, modalOptions).then(function () {
            $scope.resetAll();
            $modalInstance.dismiss(reason);
        });
    };

    //Wait until modalinstance initialized then setup dropzone
    $modalInstance.opened.then(function () {

        console.log($scope);

        $scope.dropzoneConfig = {
            'options': { // passed into the Dropzone constructor
                paramName: "file", // The name that will be used to transfer the file
                maxFilesize: 15, // MB
                maxFiles: 10,
                thumbnailWidth: 48,
                thumbnailHeight: 48,
                previewTemplate: $templateCache.get('dropzone-thumbnail.html'),
                acceptedFiles: '.jpeg,.jpg,.png,.gif',
                url: "/upload",
                autoProcessQueue: false,
                uploadMultiple: true,
                parallelUploads: 10,
                clickable: "#imageUpload",
                previewsContainer: "#imgPreviewsContainer",
                dictDefaultMessage: ''
            },
            'eventHandlers': {
                'sendingmultiple': function (file, xhr, formData) {
                    console.log("sending for upload!");
                },
                'successmultiple': function (file, response) {

                    console.log('what is this!', response);

                    var newPost = $scope.jsonObj;

                    newPost.images = response.images;

                    $scope.publishPost();


                },
                'addedfile': function () {
                    console.log("image added");
                    if ($scope.numImages) {
                        $scope.numImages = $scope.numImages+1;
                        $scope.$apply($scope.numImages);
                    } else {
                        $scope.numImages = 1;
                        $scope.$apply($scope.numImages);
                    }
                },
                'removedfile': function () {
                    console.log("image removed");
                    $scope.numImages = $scope.numImages - 1;
                    $scope.$apply($scope.numImages);
                },
                'uploadprogress': function(progress) {
                    //$scope.uploadProgress = progress;
                    //console.log($scope.uploadProgress);
                },
                'totaluploadprogress': function(progress) {
                    if(progress) {
                        $scope.uploadProgress = progress;
                        $scope.$apply($scope.uploadProgress);
                        if (progress < 100) {
                            $scope.uploadMessage = Math.round(progress) + '%';
                            $scope.$apply($scope.uploadProgress);
                        } else if (progress === 100) {
                            $scope.uploadMessage = 'Preparing photos.. please wait.';
                            $scope.$apply($scope.uploadProgress);
                        }
                    }
                }
            },
            'init': {}
        };
    });


    $scope.closeAlert = function(index) {
        $scope.alerts.banners.splice(index, 1);
    };

    $scope.alerts = mentionsFactory.alerts;

    $scope.validatePost = function () {

        $scope.alerts.banners = [];

        var newPost = $scope.jsonObj;

        if (newPost.hashtags.length) {
            if (newPost.category) {
                if (!$scope.isEmpty(newPost.location)) {
                    $scope.processPost();
                } else {
                    $scope.alerts.banners.push({
                        type: 'danger',
                        msg: 'Use the @ symbol in your post to specify where the buyer should pickup the item.'
                    });
                }
            } else {
                $scope.alerts.banners.push({
                    type: 'danger',
                    msg: 'Add more #\'s to describe your item for sale, or manually specify a category.'
                });

                $scope.jsonObj.category_name = "other";
                $scope.jsonObj.category = "ZOTH";
            }
        } else {
            $scope.alerts.banners.push({
                type: 'danger',
                msg: 'Use the # symbol in your post to describe the item you\'re selling.  Hint: You can add more than one hashtag if you want.'
            });
        }

    };


    $scope.processPost = function () {

        if(Session.userObj.user_settings.loggedIn) {

            if ($scope.numImages) {
                $scope.dropzoneConfig.init();
            } else {
                $scope.publishPost();
            }
        } else {

            $state.go('signup');

        }
    };


    //Sellbox directive calls this to update model when a special character is removed
    $scope.cleanModel = function(type, mentionToRemove) {
        mentionsFactory.cleanModel(type, mentionToRemove);
    };


    $scope.publishPost = function () {
        var newPost = $scope.jsonObj;

        newPost.username = Session.userObj.user_settings.name;

        //loop through the hashtags and formulate the heading of post
        newPost.heading = '';
        for (var i = 0; i < newPost.hashtags.length; i++) {
            if (i !== newPost.hashtags.length - 1) {
                newPost.heading += newPost.hashtags[i] + " ";
            } else {
                newPost.heading += newPost.hashtags[i];
            }
            newPost.hashtags[i] = newPost.hashtags[i]; //Remove all the info we used to gather meta-data
        }

        //Josh's posting API
        $http.post(ENV.postingAPI, newPost).
            success(function(posting) {
                console.log("-----Post Complete----");
                console.log(posting);
                $modalInstance.dismiss({reason: "stageOneSuccess", post: posting});

                //Submit for precaching
                $http.post(ENV.precacheAPI, {posting: posting}).success(function(response){
                    console.log('precache success', response);
                }).error(function(err){
                    console.log('precache error:', err);
                });

                //Owner joins the socket.io room
                socketio.joinPostingRoom(posting.postingId, 'postingOwner');

                $scope.resetAll();
            }).
            error(function(data, status, headers, config) {

                console.log(data);

                Notification.error({
                    title: data.name,
                    message: data.message,
                    delay: 10000
                });  //Send the webtoast
            });
    };

    //========= # Products =========
    $scope.searchProducts = function (term) {
        if (term) {
            if(!$scope.alerts.banners.length){
                $scope.alerts.banners.push({
                    type: 'warning',
                    msg: 'Please select a product from the suggestion list'
                });
                //console.log(angular.element(document.querySelector('#mentioMenu')));
                $timeout(function () {
                    $(window).trigger('resize');
                }, 1);
            }
            mentionsFactory.predictProduct(term).then(function (results) {
                $scope.products = results;
                //console.log("Here is scope.products", $scope.products);
            });
        } else {
            $scope.products = [
                {
                    value: "Describe your item for sale",
                    demoText: true
                }
            ];
        }
    };

    $scope.getProductTextRaw = function (product) {
        console.log('============================');
        console.log(product);
        console.log('============================');
        if(!product.demoText) {
            if (mentionsFactory.getProductMetaData(product)) {
                $scope.alerts.banners = [];
                return '<span class="mention-highlighter" contentEditable="false">#' + product.value + '</span>';
            } else {
                //$scope.alerts.banners.push({
                //    type: 'danger',
                //    msg: 'Duplicate hashtags not necessary'
                //});
                $scope.alerts.banners = [];
                return '<span class="mention-highlighter" contentEditable="false">#' + product.value + '</span>';
            }
        }
    };


    //========= @ Places =========
    $scope.map = mentionsFactory.googleMap;

    $scope.searchPlaces = function (term) {

        if (term) {
            if($scope.isEmpty($scope.jsonObj.location)) {
                if(!$scope.alerts.banners.length){
                    $scope.alerts.banners.push({
                        type: 'warning',
                        msg: 'Please select a location from the suggestion list'
                    });
                    $timeout(function () {
                        $(window).trigger('resize');
                    }, 1);
                }
                mentionsFactory.predictPlace(term).then(function (results) {
                    $scope.places = results;
                    //console.log("Here is scope.places", $scope.places);
                });
            }
        } else {
            $scope.places = [
                {
                    description: "Specify a landmark OR address to pick up item",
                    demoText: true
                }
            ];
        }
    };

    $scope.getPlacesTextRaw = function (selectedPlace) {
        if(!selectedPlace.demoText) {
            if (mentionsFactory.getPlaceMetaData(selectedPlace)) {
                $scope.alerts.banners = [];

                return '<span class="mention-highlighter-location" contentEditable="false">@' + selectedPlace.description + '</span>';
            } else {
                $scope.alerts.banners.push({
                    type: 'danger',
                    msg: 'Please only use one @ symbol in your post'
                });
            }
        }
    };

    //========= $ Prices =========
    $scope.searchPrice = function (term) {
        if (term) {
            if($scope.isEmpty($scope.jsonObj.price)) {
                if(!$scope.alerts.banners.length){
                    $scope.alerts.banners.push({
                        type: 'warning',
                        msg: 'Please select a price from the suggestion list'
                    });
                    $timeout(function () {
                        $(window).trigger('resize');
                    }, 1);
                }
                $scope.prices = mentionsFactory.predictPrice(term);
                //console.log("here is scope.prices", $scope.prices);
            }
        } else {
            $scope.prices = [
                {
                    suggestion: "Type your asking price",
                    demoText: true
                }
            ];
        }
    };

    $scope.getPricesTextRaw = function (selectedPrice) {
        if(!selectedPrice.demoText) {
            if (mentionsFactory.getPriceMetaData(selectedPrice)) {
                //if($scope.jsonObj.price_avg) {
                //    if (selectedPrice.value <= Math.floor($scope.jsonObj.price_avg)) {
                //        return '<span class="mention-highlighter-price" contentEditable="false">' + selectedPrice.suggestion + '</span>';
                //    } else {
                //        var message = 'Your price is higher than our calculated average: ' + $filter('currency')(Math.floor($scope.jsonObj.price_avg), '$', 0);
                //        $scope.alerts.banners.push({
                //            type: 'warning',
                //            msg: message
                //        });
                //        return '<span class="mention-highlighter-price mention-highlighter-price-high" tooltip-placement="bottom" tooltip="Higher than average price" tooltip-trigger="mouseenter" contentEditable="false">' + selectedPrice.suggestion + '</span>';
                //    }
                //} else {
                $scope.alerts.banners = [];
                    return '<span class="mention-highlighter-price" contentEditable="false">' + selectedPrice.suggestion + '</span>';
                //}
            } else {
                //$scope.alerts.banners.push({
                //    type: 'danger',
                //    msg: 'Please only use one $ symbol in your post.'
                //});
                $scope.alerts.banners = [];
                console.log('new post Controller sees priceMetaData returned false.');
            }
        }
    };



    //Demo plays to describe how to sell an item
    //(function demo () {
    //    $timeout(function () {
    //        if (!$scope.demoCleared) {
    //            $(".mention-highlighter").triggerHandler('show');
    //        }
    //
    //        $timeout(function () {
    //            if (!$scope.demoCleared) {
    //                $(".mention-highlighter").triggerHandler('hide');
    //                $(".mention-highlighter-price").triggerHandler('show');
    //            }
    //
    //            $timeout(function () {
    //                if (!$scope.demoCleared) {
    //                    $(".mention-highlighter-price").triggerHandler('hide');
    //                    $(".mention-highlighter-location").triggerHandler('show');
    //                }
    //
    //                $timeout(function () {
    //                    if (!$scope.demoCleared) {
    //                        $(".mention-highlighter-location").triggerHandler('hide');
    //                        $(".sellModalButton").triggerHandler('show');
    //                    }
    //
    //                    $timeout(function () {
    //                        $(".sellModalButton").triggerHandler('hide');
    //                    }, 4000);
    //
    //                }, 4000);
    //
    //            }, 4000);
    //
    //        }, 4000);
    //
    //    }, 1000);
    //})();
    //$timeout(function () {
    //    $(".mention-highlighter").triggerHandler('show');
    //    $("div[content='# your item']").css('left', parseInt($("div[content='# your item']").css('left')) - 26 + 'px');
    //    $(".mention-highlighter-price").triggerHandler('show');
    //    $(".mention-highlighter-location").triggerHandler('show');
    //}, 200);

}]);
/**
 * Created by braddavis on 1/6/15.
 */
htsApp.factory('newPostFactory', ['$q', '$http', '$timeout', '$filter', 'ENV', 'utilsFactory', 'Notification', function ($q, $http, $timeout, $filter, ENV, utilsFactory, Notification) {

    var factory = {}; //init the factory

    var tempDiv = document.createElement("DIV"); //Used for stripping html from strings

    factory.alerts = {
        banners: []
    };

    factory.defaultJson = {
        "annotations": [],
        "category": null,
        "category_name": null,
        "category_group": null,
        "category_group_name": null,
        "body": null,
        "images": [],
        "location": {},
        "hashtags": [],
        "price": null,
        "price_avg": null,
        "price_type": null,
        "source": "HSHTG",
    };


    factory.setJsonTemplate = function () {
        factory.jsonTemplate = angular.copy(factory.defaultJson);
        return factory.jsonTemplate;
    };



    factory.annotationsDictionary = new Hashtable();
    factory.annotationsDictionary.put("year", "Year");
    factory.annotationsDictionary.put("condition", "Condition");
    factory.annotationsDictionary.put("make", "Make");
    factory.annotationsDictionary.put("title_status", "Title");
    factory.annotationsDictionary.put("model", "Model");
    factory.annotationsDictionary.put("mileage", "Mileage");
    factory.annotationsDictionary.put("transmission", "Transmission");
    factory.annotationsDictionary.put("drive", "Drive");
    factory.annotationsDictionary.put("paint_color", "Paint");
    factory.annotationsDictionary.put("type", "Type");
    factory.annotationsDictionary.put("fuel", "Fuel");
    factory.annotationsDictionary.put("size", "Size");
    factory.annotationsDictionary.put("bathrooms", "Bath");
    factory.annotationsDictionary.put("no_smoking", "Smoking");
    factory.annotationsDictionary.put("bedrooms", "Rooms");
    factory.annotationsDictionary.put("dogs", "Dogs");
    factory.annotationsDictionary.put("cats", "Cats");
    factory.annotationsDictionary.put("attached_garage", "Garage");
    factory.annotationsDictionary.put("laundry_on_site", "Laundry");
    factory.annotationsDictionary.put("sqft", "Sq Ft");
    factory.annotationsDictionary.put("size_dimensions", "Dimensions");

    //ebay motors annotations
    factory.annotationsDictionary.put("body_type", "Body Type");
    factory.annotationsDictionary.put("drive_type", "Drive Type");
    factory.annotationsDictionary.put("engine", "Engine");
    factory.annotationsDictionary.put("exterior_color", "Exterior Color");
    factory.annotationsDictionary.put("for_sale_by", "Seller Type");
    factory.annotationsDictionary.put("interior_color", "Interior Color");
    factory.annotationsDictionary.put("fuel_type", "Fuel Type");
    factory.annotationsDictionary.put("listing_type", "Listing Type");
    factory.annotationsDictionary.put("number_of_cylinders", "Cylinders");
    factory.annotationsDictionary.put("options", "Options");
    factory.annotationsDictionary.put("power_options", "Power Options");
    factory.annotationsDictionary.put("safety_features", "Safety");
    factory.annotationsDictionary.put("ship_to_location", "Ship To");
    factory.annotationsDictionary.put("trim", "Trim");
    factory.annotationsDictionary.put("vehicle_title", "Title");
    factory.annotationsDictionary.put("vin", "Vin");
    factory.annotationsDictionary.put("warranty", "Warranty");

    //autotrader annotations
    factory.annotationsDictionary.put("bodyStyle", "Body Type");
    factory.annotationsDictionary.put("drivetrain", "Drive Train");
    factory.annotationsDictionary.put("exteriorColor", "Exterior Color");
    factory.annotationsDictionary.put("interiorColor", "Interior Color");


    //amazon annotations
    factory.annotationsDictionary.put("Color", "Color");
    factory.annotationsDictionary.put("Brand", "Brand");
    factory.annotationsDictionary.put("Material Type", "Material Type");
    factory.annotationsDictionary.put("Model", "Model");
    //factory.annotationsDictionary.put("Part Number", "Part Number");
    factory.annotationsDictionary.put("Warranty", "Warranty");
    factory.annotationsDictionary.put("CPU Speed", "Processor Speed");
    factory.annotationsDictionary.put("CPU Type", "Processor Type");
    factory.annotationsDictionary.put("Display Size", "Screen Size");
    factory.annotationsDictionary.put("Operating System", "OS Version");
    //factory.annotationsDictionary.put("Size", "Storage Capacity");
    factory.annotationsDictionary.put("System Memory Size", "Memory");
    factory.annotationsDictionary.put("Department", "Department");


    factory.manualCategorySelect = {
        code: null,
        show: false,
        tooltip: "message",
        init: function () {
            this.code = factory.jsonTemplate.category;
            factory.getProductMetaData();
        }
    };

    factory.predictProduct = function (term) {

        var products = [];
        var userTypedText = {value: term};

        var deferred = $q.defer();

        $http.jsonp('//suggestqueries.google.com/complete/search?callback=?', {
            params: {
                "client": "products-cc",
                "hl": "en",
                "jsonp": "JSON_CALLBACK",
                "gs_rn": 53,
                "gs_ri": "products-cc",
                "ds": "sh",
                "cp": 1,
                "gs_id": 9,
                "q": term,
                "xhr": "t"

            }
        }).success(function (data, status) {

            if (data[1].length > 0) {

                angular.forEach(data[1], function (val, key) {

                    tempDiv.innerHTML = val[0];
                    var strippedHtml = tempDiv.textContent || tempDiv.innerText || "";

                    products.push({"value": strippedHtml});
                });

                if (products[0].value !== userTypedText.value) {
                    products.splice(0, 0, userTypedText);
                }

                if (products.length > 7) {
                    products.length = 7; // prune suggestions list to only 6 items because we add the usersTyped word to top of list
                }

            } else {
                //console.log("nothing found");
                products.push(userTypedText);
            }

            deferred.resolve(products);
        });

        return deferred.promise;
    };




    factory.getProductMetaData = function (selectedProduct) {

        var deferred = $q.defer();


        if(selectedProduct) {
            if(_.indexOf(this.jsonTemplate.hashtags, selectedProduct.value) === -1) {
                this.jsonTemplate.hashtags.push(selectedProduct.value);
            } else {
                return false;
            }
        }

        if(this.jsonTemplate.hashtags.length) {

            var queryString = this.jsonTemplate.hashtags.join(" ");

            factory.getPopularCategory(queryString).then(function(popularCategoryCode){

                factory.jsonTemplate.category = popularCategoryCode;

                factory.getCategoryMetadata(popularCategoryCode).then(function(data){

                    factory.manualCategorySelect.code = null;
                    factory.manualCategorySelect.show = false;

                    factory.jsonTemplate.category_name = data.categories[0].name;
                    factory.jsonTemplate.category_group = data.code;
                    factory.jsonTemplate.category_group_name = data.name;

                    factory.getInternalAnnotations(queryString).then(function(annotationArray){

                        factory.getAmazonAnnotations(queryString, annotationArray).then(function (annotationArray) {

                            if(annotationArray.length) {

                                factory.jsonTemplate.annotations = annotationArray;

                            }
                            //else {
                            //
                            //    Notification.primary({
                            //        title: "Hrmmmmm",
                            //        message: "We didn't recognize that hashtag.  Add more hashtags to help us out."
                            //    });
                            //
                            //}

                            deferred.resolve(factory.jsonTemplate);

                        }, function (err) { //failed to lookup Amazon annotations

                            //Notification.error({
                            //    title: "Ooops",
                            //    message: "Couldn't fetch Amazon data.  We're working on this."
                            //});

                            factory.alerts.banners.push({
                                type: 'danger',
                                msg: "Couldn't fetch Amazon data.  We're working on this.  Please continue with your post."
                            });

                            deferred.reject(err);

                        });

                    }, function (err) {  //failed to lookup internal annotations

                        //Notification.error({
                        //    title: "Ooops",
                        //    message: "Couldn't lookup internal production annotations.  We're working on this."
                        //});

                        factory.alerts.banners.push({
                            type: 'danger',
                            msg: "Couldn't lookup internal production annotations.  We're working on this.  Please continue with your post."
                        });

                    });

                }, function (err) { //failed to lookup category metadata

                    //Notification.error({
                    //    title: "Cannot lookup category metadata",
                    //    message: err.message
                    //});

                    factory.alerts.banners.push({
                        type: 'danger',
                        msg: "We appear to be having issues with out categories API.  Please try again later."
                    });

                });

            }, function () { //Could not determine popular category

                factory.manualCategorySelect.tooltip = "Add more hashtags to your post, or manually select the category";
                factory.manualCategorySelect.show = true;

                factory.jsonTemplate.category = "ZOTH";

                $timeout(function () {
                    $(".category-select").triggerHandler('show');

                    $timeout(function () {
                        $(".category-select").triggerHandler('hide');
                    }, 4000);

                }, 50);

                deferred.reject();

            });

        } else { //User must have deleted hashtag from post while editing.
            factory.manualCategorySelect.show = false;
            this.jsonTemplate.annotations = [];
            this.jsonTemplate.category = null;
            this.jsonTemplate.category_name = null;
            this.jsonTemplate.category_group = null;
            this.jsonTemplate.category_group_name = null;

            deferred.resolve(factory.jsonTemplate);
        }

        return deferred.promise;

    };





    factory.getPopularCategory = function (queryString) {

        var deferred = $q.defer();

        if(!factory.manualCategorySelect.code) {

            $http.get(ENV.groupingsAPI + 'suggested', {
                params: {
                    query: queryString
                }
            }).success(function (data, status) {

                var popularCategories = data;

                if (popularCategories.length) {

                    deferred.resolve(popularCategories[0].code);

                } else {

                    deferred.reject();

                }

            });

        } else {

            deferred.resolve(factory.manualCategorySelect.code);

        }

        return deferred.promise;

    };



    factory.getCategoryMetadata = function (popularCategory) {

        var deferred = $q.defer();

        $http.get(ENV.groupingsAPI + popularCategory).success(function (data, status) {

            deferred.resolve(data);

        }).error(function(err){

            deferred.reject(err);

        });

        return deferred.promise;
    };



    factory.getInternalAnnotations = function (queryString) {

        var deferred = $q.defer();

        var annotationsHashTable = new Hashtable();
        var annotationCount = 0;

        var priceCount = 0;
        var totalPrice = 0;

        //TODO: Follow bug here to remove the comma in future: https://github.com/HashtagSell/posting-api/issues/45
        var defaultParams = {
            start: 0,
            count: 500,
            filters: {
                mandatory: {
                    contains: {
                        heading: queryString
                    }
                },
                optional: {
                    exact: {
                        categoryCode: [factory.jsonTemplate.category, '']
                    }
                }
            },
            geo: {
                coords: ['-122.431297', '37.773972'],
                "min": 0,
                "max": 50000000
            }
        };

        var bracketURL = utilsFactory.bracketNotationURL(defaultParams);


        //FIRST GET ANNOTATIONS FROM OUR INTERNAL DATABASE.
        $http({
            method: 'GET',
            url: ENV.postingAPI + bracketURL
        }).success(function (data) {

            console.log("ANNOTATION Query response: ", data);

            var annotationArray = [];

            if (data.results.length) {

                for (var i = 0; i < data.results.length; i++) {

                    var posting = data.results[i];

                    if (posting.annotations) {

                        var annotationObj = posting.annotations;

                        //console.log(i, annotationObj);
                        for (var key in annotationObj) {
                            if (factory.annotationsDictionary.containsKey(key)) {
                                annotationCount++;
                                if (annotationsHashTable.containsKey(key)) {
                                    var currentCount = annotationsHashTable.get(key);
                                    var plusOne = currentCount + 1;
                                    annotationsHashTable.put(key, plusOne);
                                } else {
                                    annotationsHashTable.put(key, 1);
                                }
                            } else {
                                //console.log("omitting cause", key, "is not in our dictionary");
                            }
                        }
                    } else {
                        //console.log("does not have annotation object", results[i]);
                    }

                    if (posting.askingPrice) {
                        if (posting.askingPrice.value !== undefined) {
                            //console.log(posting.askingPrice.value, ' + ', totalPrice, ' =');
                            priceCount++;
                            totalPrice = parseInt(totalPrice) + parseInt(posting.askingPrice.value);
                            //console.log(totalPrice);
                        }
                    }
                }

                //Caculate average price of all data we retreived.
                if (totalPrice > 0) {
                    factory.jsonTemplate.price_avg = totalPrice / priceCount;
                }

                if (annotationsHashTable.size() > 0) {

                    //Gather our popular annotations
                    console.log("We have ", annotationsHashTable.size(), "unique annotations in : ", annotationCount, "results");
                    var avg_weight = Math.abs(annotationCount / annotationsHashTable.size());

                    console.log("Annotations should weigh more than: ", avg_weight);

                    annotationsHashTable.each(function (key) {

                        var weight = Math.abs(annotationsHashTable.get(key));

                        console.log(key, " has weight of", weight);

                        if (weight >= avg_weight) {

                            annotationArray.push({key: factory.annotationsDictionary.get(key), value: null});

                            console.log(weight, ">=", avg_weight);
                        }
                    });

                    deferred.resolve(annotationArray);

                } else {


                    deferred.resolve(annotationArray);
                }


            } else {

                deferred.resolve(annotationArray);
            }
        });


        return deferred.promise;
    };


    factory.getAmazonAnnotations = function (queryString, annotationArray) {
        var deferred = $q.defer();

        $http.get(ENV.annotationsAPI, {
            params: {
                query: queryString
            }
        }).success(function (data) {

            console.log('Amazon data', data);

            if (data.length) {

                for (var k = 0; k < data.length; k++) {

                    var amazonAnnotation = data[k];

                    var key = amazonAnnotation.name;

                    if (factory.annotationsDictionary.containsKey(key)) {

                        annotationArray.push({
                            key: factory.annotationsDictionary.get(key),
                            value: null
                        });

                    }
                }

                console.log("---------------------------");
                console.log("done adding Amazon annotations!");
                console.log("---------------------------");

                deferred.resolve(annotationArray);

            }

        }).error(function (data) {

            deferred.reject();

        });

        return deferred.promise;
    };









    factory.cleanModel = function (type, valueToRemove) {

        if(type === "#") {

            console.log('HASHTAG TO REMOVE: ', valueToRemove);

            if(valueToRemove) {
                this.jsonTemplate.hashtags = _.without(this.jsonTemplate.hashtags, valueToRemove);

                factory.getProductMetaData();
            } else {
                console.log('hashtag to remove is empty.. not cleaning model');
            }

        } else if (type === "$") {

            console.log('PRICE TO REMOVE: ', valueToRemove);

            if(valueToRemove) {
                this.jsonTemplate.price = null;
                this.jsonTemplate.price_avg = null;
                this.jsonTemplate.price_type = null;
            } else {
                console.log('price is empty, not cleaning model');
            }

        } else if (type === "@") {

            console.log('LOCATION TO REMOVE: ', valueToRemove);

            if(valueToRemove) {
                this.jsonTemplate.location = {};
            } else {
                console.log('location to remove is empty, not cleaning model');
            }

        }

        console.log(this.jsonTemplate);
    };












    //We use google maps as a service
    factory.googleMap = new google.maps.Map(document.createElement("map-canvas"));

    factory.predictPlace = function (term) {

        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(37.79738, -122.52464),
            new google.maps.LatLng(37.68879, -122.36122)
        );

        //need to set bounds to cornwall/bodmin
        var locationRequest = {
            input: term,
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









    factory.getPlaceMetaData = function (selectedPlace) {

        var googleMaps = new google.maps.places.PlacesService(factory.googleMap);

        //capture the place_id and send to google maps for metadata about the place
        var request = {
            placeId: selectedPlace.place_id
        };

        var deferred = $q.defer();

        var city = null;
        var state = null;
        var country = null;
        var zipcode = null;

        //if(!factory.jsonTemplate.location) {

            googleMaps.getDetails(request, function (placeMetaData, status) {

                if (status !== google.maps.places.PlacesServiceStatus.OK) {
                    console.log(status);
                    return;
                }

                placeMetaData.description = selectedPlace.description;

                console.log("here is our extra meta data");
                console.log(placeMetaData);

                var locationObj = {};
                var geo = {};
                geo.location = {};

                if (placeMetaData.formatted_address) {
                    locationObj.formatted_address = placeMetaData.formatted_address;
                }


                if (placeMetaData.geometry.location.lat()) {
                    locationObj.lat = placeMetaData.geometry.location.lat();
                    locationObj.long = placeMetaData.geometry.location.lng();

                    var lat = placeMetaData.geometry.location.lat();
                    var long = placeMetaData.geometry.location.lng();

                    geo.coords = [long, lat];
                }


                if (placeMetaData.address_components) {

                    for (var i = 0; i < placeMetaData.address_components.length; ++i) {

                        //Get State
                        if (placeMetaData.address_components[i].types[0] == "administrative_area_level_1") {
                            state = placeMetaData.address_components[i].short_name;
                            locationObj.state = state;
                            geo.location.state = state;
                        }

                        //Get City
                        if (placeMetaData.address_components[i].types[0] == "locality") {
                            city = placeMetaData.address_components[i].long_name;
                            locationObj.short_name = city;
                            geo.location.city = city;
                        }

                        //Get Country
                        if (placeMetaData.address_components[i].types[0] == "country") {
                            country = placeMetaData.address_components[i].short_name;
                            locationObj.country = country;
                            geo.location.country = country;
                        }

                        //Get Zipcode
                        if (placeMetaData.address_components[i].types[0] == "postal_code") {
                            zipcode = placeMetaData.address_components[i].short_name;
                            locationObj.zipcode = zipcode;
                            geo.location.postalCode = zipcode;
                        }
                    }

                    //Postal code did not come back from intial geocode.. therefore we must reverse geocode to get postal code based on lat long.
                    if (!geo.location.postalCode) {

                        locationObj.formatted_address = placeMetaData.description;

                        $http.get('/utils/reversegeocode', {
                            params: {
                                lat: placeMetaData.geometry.location.lat(),
                                long: placeMetaData.geometry.location.lng()
                            }
                        }).success(function (data, status) {

                            console.log(data);

                            for (j = 0; j < data.results[0].address_components.length; j++) {

                                var adComponent = data.results[0].address_components[j];

                                if (adComponent.types[0] === "postal_code") {
                                    geo.location.postalCode = adComponent.long_name;
                                    break;
                                }
                            }

                        });
                    }

                }

                factory.jsonTemplate.location = locationObj;

                factory.jsonTemplate.geo = geo;

                deferred.resolve(factory.jsonTemplate);
            });

        //} else {
        //    return false;
        //}

        return deferred.promise;
    };








    factory.predictPrice = function (term) {

        var priceSuggestionArray = [];

        term = term.replace(/\D/g,'');

        var formattedPrice = $filter('currency')(term, '$', 0);

        priceSuggestionArray.push({suggestion: formattedPrice, rate: "flat_rate", value: term});
        priceSuggestionArray.push({suggestion: formattedPrice + "/hr", rate: "hourly", value: term});
        priceSuggestionArray.push({suggestion: formattedPrice + "/day", rate: "daily", value: term});
        priceSuggestionArray.push({suggestion: formattedPrice + "/week", rate: "weekly", value: term});
        priceSuggestionArray.push({suggestion: formattedPrice + "/month", rate: "monthly", value: term});
        priceSuggestionArray.push({suggestion: formattedPrice + "/year", rate: "yearly", value: term});
        priceSuggestionArray.push({suggestion: formattedPrice + "/each", rate: "yearly", value: term});

        return priceSuggestionArray;
    };





    factory.getPriceMetaData = function (selectedPrice) {

        console.log('here is what we have in price meta data', this.jsonTemplate.price);

        if(this.jsonTemplate.price === null) {

            this.jsonTemplate.price = selectedPrice.value;
            this.jsonTemplate.price_type = selectedPrice.rate;

            return true;
        } else {
            return false;
        }
    };


    return factory;
}]);
/**
 * Created by braddavis on 2/25/15.
 */
htsApp.controller('pushNewPostToExternalSources', ['$scope', '$modal', '$modalInstance', '$q', '$http', 'newPost', 'Notification', 'facebookFactory', 'ebayFactory', 'twitterFactory', 'subMerchantFactory', 'ENV', function ($scope, $modal, $modalInstance, $q, $http, newPost, Notification, facebookFactory, ebayFactory, twitterFactory, subMerchantFactory, ENV) {

    $scope.currentlyPublishing = {
        publishing: false,
        facebook: false,
        twitter: false,
        amazon: false,
        ebay: false,
        craigslist: false,
        onlinePayment: false
    };

    //Passes the newPost object with the selected external sources to the Josh's api.  Upon success passes resulting post obj to congrats.
    $scope.dismiss = function (reason) {

        $scope.currentlyPublishing.publishing = true;

        $scope.publishToFacebook().then(function(){

            $scope.currentlyPublishing.facebook = false;

            $scope.publishToTwitter().then(function(){

                $scope.currentlyPublishing.twitter = false;

                $scope.publishToEbay().then(function(){

                    $scope.currentlyPublishing.ebay = false;

                   $scope.publishToAmazon().then(function(){

                       $scope.currentlyPublishing.amazon = false;

                       $scope.publishToCraigslist().then(function(){

                           $scope.currentlyPublishing.craigslist = false;

                           $scope.setupOnlinePayment().then(function() {

                               $scope.currentlyPublishing.onlinePayment = false;

                               $modalInstance.dismiss({reason: reason, post: newPost}); //Close the modal and display success!
                           });
                       });
                   });
                });
            });
        });
    };

    $scope.shareToggles = {
        facebook : false,
        twitter: false,
        ebay: false,
        amazon: false,
        craigslist: false
    };

    $scope.onlinePayment = {
        allow: true
    };

    $scope.checkIfFacebookTokenValid = function () {
        if($scope.shareToggles.facebook) {
            facebookFactory.checkIfTokenValid().then(function () {

            }, function (response) {
                $scope.shareToggles.facebook = false;

                Notification.error(response);  //Send the webtoast
            });
        }
    };


    $scope.publishToFacebook = function () {

        var deferred = $q.defer();

        if($scope.shareToggles.facebook) {

            $scope.currentlyPublishing.facebook = true;

            facebookFactory.publishToWall(newPost).then(function (response) {

                newPost = response;

                deferred.resolve();

            }, function (errResponse) {

                Notification.error({
                    title: "Facebook publishing error",
                    message: errResponse.error.message,
                    delay: 10000
                });  //Send the webtoast

                deferred.resolve();
            });

        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };


    $scope.checkIfTwitterTokenValid = function () {
        if($scope.shareToggles.twitter) {
            twitterFactory.checkIfTokenValid().then(function () {

            }, function (response) {
                $scope.shareToggles.twitter = false;

                Notification.error(response);  //Send the webtoast
            });
        }
    };


    $scope.publishToTwitter = function () {

        var deferred = $q.defer();

        if($scope.shareToggles.twitter) {

            $scope.currentlyPublishing.twitter = true;

            twitterFactory.publishToTwitter(newPost).then(function (response) {

                newPost = response;

                deferred.resolve();

            }, function (errResponse) {

                Notification.error({
                    title: "Twitter publishing error",
                    message: errResponse.error.message,
                    delay: 10000
                });  //Send the webtoast

                deferred.resolve();
            });

        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };


    $scope.publishToAmazon = function () {

        var deferred = $q.defer();

        if($scope.shareToggles.amazon) {

            $scope.currentlyPublishing.amazon = true;

            Notification.primary({
                title: "Amazon coming soon",
                message: "Publish to Amazon is almost there!",
                delay: 15000
            });  //Send the webtoast
            deferred.resolve();

        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };


    $scope.checkIfEbayTokenValid = function () {
        if($scope.shareToggles.ebay) {
            ebayFactory.checkIfTokenValid().then(function () {

            }, function (response) {
                $scope.shareToggles.ebay = false;

                Notification.error(response);  //Send the webtoast;
            });
        }
    };


    $scope.publishToEbay = function () {

        var deferred = $q.defer();

        if($scope.shareToggles.ebay) {

            $scope.currentlyPublishing.ebay = true;

            ebayFactory.publishToEbay(newPost).then(function (response) {

                newPost = response;

                deferred.resolve();

            }, function (errResponse) {

                console.log('ebay err', errResponse);

                try {

                    Notification.error({
                        title: 'eBay ' + errResponse.name,
                        message: errResponse.sourceError.details[0].LongMessage[0],
                        delay: 10000
                    });  //Send the webtoast

                }
                catch (err) {

                    Notification.error({
                        title: 'eBay ' + errResponse.name,
                        message: errResponse.message || "Please contact support",
                        delay: 10000
                    });  //Send the webtoast
                }

                deferred.resolve();

            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };



    $scope.publishToCraigslist = function () {

        var deferred = $q.defer();

        if($scope.shareToggles.craigslist) {

            $scope.currentlyPublishing.craigslist = true;

            Notification.error({
                title: "Craigslist publishing error",
                message: "push to craiglist coming soon!",
                delay: 10000
            });  //Send the webtoast
            deferred.resolve();

        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };


    $scope.setupOnlinePayment = function () {

        var deferred = $q.defer();

        if($scope.onlinePayment.allow) {

            $scope.currentlyPublishing.onlinePayment = true;

            subMerchantFactory.validateSubMerchant(newPost).then(function(response){

                console.log(response);

                //var payload = {
                //    payment: response
                //};
                //
                //if (newPost.facebook) {
                //    payload.facebook = newPost.facebook;
                //}
                //
                //if (newPost.amazon) {
                //    payload.amazon = newPost.amazon;
                //}
                //
                //if (newPost.craigslist) {
                //    payload.craigslist = newPost.craigslist;
                //}
                //
                //$http.post(ENV.postingAPI + newPost.postingId + '/publish', payload).success(function (response) {
                //
                //    deferred.resolve(response);
                //
                //}).error(function (response) {
                //
                //    deferred.reject(response);
                //});

                deferred.resolve(response);

            }, function (err) {

                console.log('error', err);

                deferred.resolve();
            });

        } else {
            deferred.resolve();
        }

        return deferred.promise;

    };

}]);
/**
 * Created by braddavis on 1/21/15.
 */
htsApp.controller('notifications.controller', ['$scope', function ($scope) {
    $scope.items = {
        collection: getRegularArray(1000)
    };


    function getRegularArray(size){
        var res = [];
        for(var i=0;i<size;i++){
            res.push({
                text: i,
                size: ~~(Math.random()*100 + 50)
            });
        }
        return res;
    }
}]);
/**
 * Created by braddavis on 5/9/15.
 */
htsApp.controller('paymentController', ['$scope', '$http', '$stateParams', 'ENV', function($scope, $http, $stateParams, ENV) {

    (function(){

        var postingId = $stateParams.postingId;
        var offerId = $stateParams.offerId;

        //Lookup details about the item about to be sold.
        $http.get(ENV.postingAPI + postingId, {
            params: {
                offers: true
            }
        }).success(function (posting){

            $scope.posting = posting;
            //console.log('here is our posting Obj', posting);

            //Lookup seller profile details
            $http.get(ENV.htsAppUrl + '/getProfile', {
                params: {
                    username: posting.username
                }
            }).success(function(sellerProfile){
                $scope.sellerProfile = sellerProfile;
                //console.log('sellers profile', sellerProfile);
            }).error(function(err){
                alert('could not lookup sellers profile.  please inform support');
            });



            //var offerObj = _.where(posting.offers.results, {'offerId': offerId});

            var offerObj;
            for(var i = 0; i < posting.offers.results.length; i++) {

                var offer = posting.offers.results[i];
                console.log(offer.offerId + '===' + offerId);

                if(offer.offerId === offerId){
                    offerObj = posting.offers.results[i];
                    break;
                }
            }



            //console.log('here is our offer obj', offerObj);


            //Lookup buyer profile details
            $http.get(ENV.htsAppUrl + '/getProfile', {
                params: {
                    username: offerObj.username
                }
            }).success(function(buyerProfile){
                $scope.buyerProfile = buyerProfile;
                //console.log('buyersProfile', buyerProfile);
            }).error(function(err){
                alert('could not lookup buyers profile.  please inform support');
            });


        }).error(function (err){
            alert('We could not find your transaction. Please note the url you have been directed to and contact support.  Sorry for inconvenience.');
        });
    })();



    $scope.dropinOptions = {
        paymentMethodNonceReceived: function(e, nonce) {
            e.preventDefault();

            $http.post(ENV.htsAppUrl + '/payments/purchase', {
                postingId: $stateParams.postingId,
                offerId: $stateParams.offerId,
                payment_method_nonce: nonce
            }).success(function (response) {
                if(response.success){
                    if(response.result.success){
                        $scope.alerts.push({ type: 'success', msg: 'Your payment has been sent!  Thanks for using HashtagSell!' });
                    } else {

                        var reloadURL = "/payment/" + $stateParams.postingId + "/" + $stateParams.offerId;
                        $scope.alerts.push({ type: 'danger', msg: response.result.message + ". <a href=" + reloadURL + " target='_self'>Try Again?</a>" });

                    }
                }
            }).error(function (err) {
                $scope.alerts.push({ type: 'danger', msg: err.message });
            });
        }
    };

    $scope.alerts = [];

}]);
/**
 * Created by braddavis on 5/10/15.
 */
/**
 * Created by braddavis on 5/9/15.
 */
htsApp.controller('peerReviewController', ['$scope', '$http', '$stateParams', 'ENV', function($scope, $http, $stateParams, ENV) {

    (function(){

        var offerId = $stateParams.offerId;
        var userId = $stateParams.userId;

        $scope.reviewForm = {
            isBuyer: null,
            username: null,
            transactionId: null,
            rating: 0,
            comment: null
        };

        //Lookup transaction details
        $http.get(ENV.transactionsAPI + offerId).success(function(transaction){
            $scope.transaction = transaction;
            console.log('transaction', transaction);

            if(transaction.seller.id) {
                if (transaction.seller.id === userId) {
                    $scope.reviewee = transaction.seller;
                    $scope.reviewForm.isBuyer = false;
                    $scope.reviewForm.username = transaction.sellerUsername;
                    $scope.reviewForm.transactionId = transaction.transactionId;
                } else {
                    $scope.reviewee = transaction.buyer;
                    $scope.reviewForm.isBuyer = true;
                    $scope.reviewForm.username = transaction.buyerUsername;
                    $scope.reviewForm.transactionId = transaction.transactionId;
                }
            } else if(transaction.buyer.id) {
                if(transaction.buyer.id === userId) {
                    $scope.reviewee = transaction.buyer;
                    $scope.reviewForm.isBuyer = true;
                    $scope.reviewForm.username = transaction.buyerUsername;
                    $scope.reviewForm.transactionId = transaction.transactionId;
                } else {
                    $scope.reviewee = transaction.seller;
                    $scope.reviewForm.isBuyer = false;
                    $scope.reviewForm.username = transaction.sellerUsername;
                    $scope.reviewForm.transactionId = transaction.transactionId;
                }
            }

        }).error(function(err){
            alert('could not lookup transaction profile.  please inform support');
        });
    })();


    $scope.alerts = [];

    $scope.submitReview = function () {

        console.log($scope.reviewForm);

        //Submit Review details
        $http.post(ENV.reviewsAPI, $scope.reviewForm).success(function(review){

            console.log(review);
            $scope.alerts.push(
                { type: 'success', msg: 'Wooo hoo! Thanks for using HashtagSell.' }
            );

        }).error(function(err){

            console.log(err);

            $scope.alerts.push(
                { type: 'error', msg: err }
            );
        });

    };
}]);
/**
 * Created by braddavis on 4/5/15.
 */
htsApp.controller('profile.controller', ['$scope', 'profileFactory', function ($scope, profileFactory) {

    $scope.nav = profileFactory.nav;

}]);
/**
 * Created by braddavis on 4/2/15.
 */

htsApp.factory('profileFactory', ['$http', '$location', '$q', 'ENV', function ($http, $location, $q, ENV) {

    var factory = {};


    factory.messages = {
        private: {
            sent: [],
            received: []
        }
    };



    factory.nav = [
        {
            title: 'Messages',
            link: 'profile.messages',
            data: factory.messages
        },
        {
            title: 'Reviews',
            link: 'profile.reviews',
            data: []
        }
    ];








    factory.getUserProfile = function (username) {

        var deferred = $q.defer();

        var url = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/getprofile?username=" + username;

        $http({method: 'GET', url: url}).
            then(function (response, status, headers, config) {

                deferred.resolve(response);

            }, function (response, status, headers, config) {

                deferred.reject(response);
            });

        return deferred.promise;

    };




    return factory;

}]);
htsApp.controller('results.controller', ['$scope', '$state', '$stateParams', 'searchFactory', 'splashFactory', 'uiGmapGoogleMapApi', 'uiGmapIsReady', function ($scope, $state, $stateParams, searchFactory, splashFactory, uiGmapGoogleMapApi, uiGmapIsReady) {

    //While true the hashtagspinner will appear
    $scope.status = searchFactory.status;

    //Tracks state of grid visible or not
    $scope.views = searchFactory.views;

    $scope.queryObj = $stateParams;


    //passes properties associated with clicked DOM element to splashFactory for detailed view
    $scope.openSplash = function(elems){
        splashFactory.result = elems.result;
        $state.go('results.splash', { id: elems.result.postingId });
    };


    //updateFeed is triggered on interval and performs polling call to server for more items
    var paginate = function (page) {

        searchFactory.paginate(page).then(function (response) {

            if (response.status !== 200) {

                searchFactory.status.pleaseWait = false;
                searchFactory.status.loading = false;
                searchFactory.status.error.message = ":( Oops.. Something went wrong.";
                searchFactory.status.error.trace = response.data.error;

            } else if (response.status === 200) {

                if(response.data.results.length) { //If we have results

                    if (!$scope.results) { //If there are not results on the page yet, this is our first query

                        searchFactory.filterArray($scope.views, 'pagination');

                        //Function passed into onVsIndexChange Directive
                        $scope.infiniteScroll = function (startIndex, endIndex) {
                            console.log('startIndex: ' + startIndex, 'endIndex: ' + endIndex, 'numRows: ' + $scope.results.gridRows.length);
                            if (!searchFactory.status.loading && endIndex >= $scope.results.gridRows.length - 3) {
                                console.log("paginating");
                                searchFactory.status.loadingMessage = "Fetching more awesome...";
                                searchFactory.status.loading = true;
                                page = page + 1;
                                paginate(page);
                            }
                        };

                    } else { //If there are already results on the page then add them to the bottom of the array and filter

                        searchFactory.filterArray($scope.views, 'pagination');

                    }

                    $scope.results = searchFactory.results;

                    searchFactory.status.pleaseWait = false;
                    searchFactory.status.loading = false;

                } else if (!response.data.results.length && page === 0) { //No results found on the first search

                    searchFactory.status.pleaseWait = false;
                    searchFactory.status.loading = false;
                    searchFactory.status.error.message = "¯\\_(ツ)_/¯  Nothing found.  Keep your searches simple.";

                } else if (!response.data.results.length && page > 0) { //No results found after pagination

                    searchFactory.status.pleaseWait = false;
                    searchFactory.status.loadingMessage = "No more results.  Sell your next item with us to increase our inventory.";

                }

            }
        }, function (response) {

            searchFactory.status.pleaseWait = false;
            searchFactory.status.loading = false;
            searchFactory.status.error.message = "(゜_゜) Oops.. Something went wrong.";
            searchFactory.status.error.trace = response.data.error;

        });
    };
    paginate(0);


    uiGmapGoogleMapApi.then(function(maps) {
        $scope.map = searchFactory.map;
    });

}]);







htsApp.directive('onVsIndexChange', ['$parse', function ($parse) {
    return function ($scope, $element, $attrs) {
        var expr = $parse($attrs.onVsIndexChange);
        var fn = function () {
            expr($scope);
        };
        $scope.$watch('startIndex', fn);
        $scope.$watch('endIndex', fn);
    };
}]);








htsApp.directive('resizeGrid', ['$rootScope', '$window', 'searchFactory', function ($rootScope, $window, searchFactory) {
    return {
        restrict: 'A',
        link: function postLink($scope, element) {

            searchFactory.getInnerContainerDimensions = function () {
                return {
                    w: element.width(),
                    h: element.height()
                };
            };

            angular.element($window).bind('resize', function () {

                if($scope.views.gridView) {
                    searchFactory.filterArray($scope.views, 'resize');
                }

                $scope.$apply();
            });
        }
    };
}]);
/**
 * Created by braddavis on 12/14/14.
 */
htsApp.factory('searchFactory', ['$http', '$stateParams', '$location', '$q', '$log', '$timeout', 'utilsFactory', 'ENV', function ($http, $stateParams, $location, $q, $log, $timeout, utilsFactory, ENV) {

    var factory = {};

    factory.results = {
        gridRows: [],
        unfiltered: []
    };

    factory.filter = {
        mustHaveImage : false,
        mustHavePrice: false
    };

    factory.sort = {
        distance: true,
        price: false,
        datePosted: false
    };

    factory.priceSlider = {
        min: 0,
        max: 0,
        step: 1,
        rangeValue : [0,0],
        userSetValue: false
    };

    factory.views = {
        gridView: true,
        showMap: false
    };

    factory.status = {
        pleaseWait: true,
        error: {}
    };


    factory.getInnerContainerDimensions = function () {
        return 'function re-defined via resizeGrid directive';
    };


    factory.paginate = function (page) {

        var deferred = $q.defer();

        if (page === 0) {
            factory.getPopularCategories().then(function (response) {

                if(response.status === 200) {

                    if (response.data.length) {

                        var winningCategories = [];
                        var total = 0;

                        for (var i = 0; i < response.data.length; i++) {

                            var firstCategory = response.data[i];

                            total = total + firstCategory.count;

                        }

                        var avg = (total / response.data.length);

                        //console.log('total: ', total, ' divided by number of categories: ', response.data.length, ' equals: ', avg);

                        for (var j = 0; j < response.data.length; j++) {

                            var secondCategory = response.data[j];

                            //console.log('total number of items: ', total);
                            //console.log('number of items in category: ', secondCategory.code, ' is: ', secondCategory.count);
                            var percentage = (secondCategory.count/total) * 100;
                            //console.log('Percentage weight for category: ', secondCategory.code, ' is: ', percentage);


                            if (percentage >= 10) {
                                winningCategories.push(secondCategory.code);
                            }

                        }

                        if (winningCategories.length > 1) {
                            factory.defaultParams.filters.optional = {
                                exact: {
                                    categoryCode: winningCategories.join(",")
                                }
                            };
                        } else if (winningCategories.length === 1) {
                            factory.defaultParams.filters.optional = {
                                exact: {
                                    categoryCode: [winningCategories[0], '']
                                }
                            };
                        } else if (!winningCategories.length && response.data.length){
                            factory.defaultParams.filters.optional = {
                                exact: {
                                    categoryCode: [response.data[0].code, '']
                                }
                            };
                        }
                    }
                }

            }).then(function () {

                console.log('state params are: ', $stateParams);

                factory.defaultParams.filters.mandatory.contains.heading = $stateParams.q;

                if($stateParams.locationObj) {
                    if ($stateParams.locationObj.geometry) {

                        factory.defaultParams.geo.lookup = false;

                        var lat = $stateParams.locationObj.geometry.location.lat();
                        var lon = $stateParams.locationObj.geometry.location.lng();

                        factory.defaultParams.geo.coords = [lon, lat];
                    }
                }

                if($stateParams.price){
                    if($stateParams.price.min){
                        factory.priceSlider.userSetValue = true;
                        factory.priceSlider.rangeValue[0] = parseInt($stateParams.price.min);
                    }

                    if($stateParams.price.max){
                        factory.priceSlider.userSetValue = true;
                        factory.priceSlider.rangeValue[1] = parseInt($stateParams.price.max);
                    }
                    console.log('manually set pricesliders', factory.priceSlider);
                }

                factory.query(page).then(function (response) {

                    deferred.resolve(response);

                });
            });
        } else {

            factory.query(page).then(function (response) {

                deferred.resolve(response);

            });
        }

        return deferred.promise;
    };



    factory.getPopularCategories = function () {

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: ENV.groupingsAPI + 'popular',
            params: {'query' : $stateParams.q}
        }).then(function (response) {

            //console.log('weighted categories: ', response);

            deferred.resolve(response);

        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;

    };



    factory.query = function (page) {

        var deferred = $q.defer();

        console.log('before braketizing url', factory.defaultParams);

        var bracketURL = utilsFactory.bracketNotationURL(factory.defaultParams);
        console.log('final URL', bracketURL);

        $http({
            method: 'GET',
            url: ENV.postingAPI + bracketURL
        }).then(function (response) {

            //console.log('search results: ', response);

            if(response.data.results.length) {

                factory.defaultParams = {
                    start: (page + 1) * response.data.options.count,
                    count: response.data.options.count,
                    filters: response.data.options.filters,
                    geo: {
                        coords: response.data.options.geo.coords,
                        //min: response.data.results[response.data.results.length - 1].geo.distance,
                        min: response.data.options.geo.min,
                        max: response.data.options.geo.max
                    },
                    sort: {}
                };

                factory.results.unfiltered = factory.results.unfiltered.concat(response.data.results);
            }

            deferred.resolve(response);

        }, function (err) {
            deferred.reject(err);
        });



        return deferred.promise;

    };


    factory.defaultParams = {
        start: 0,
        count: 35,
        filters: {
            mandatory: {
                contains: {
                    heading: null
                }
            }
        },
        geo: {
            lookup: true,
            min: 0,
            max: 50000000 // 8000 miles in meters
        }
    };




    factory.map = {
        bounds: {},
        center: {
            latitude: 0,
            longitude: 0
        },
        zoom: 8,
        markers: [],
        options : {
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.RIGHT_TOP
            },
            panControl: false,
            mapTypeControl: false,
            maxZoom: 22,
            minZoom: 0,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
            }
        },
        clusterOptions: {
            gridSize: 35,
            maxZoom: 22,
            minZoom: 0,
            zoomOnClick: true,
            averageCenter: true,
            minimumClusterSize: 1,
            styles: [
                {
                    textColor: 'white',
                    fontFamily: 'Open Sans, Helvetica, Arial, sans-serif',
                    url: 'https://static.hashtagsell.com/htsApp/map-elements/cluster1.png',
                    height: 35,
                    width: 35
                },
                {
                    textColor: 'white',
                    fontFamily: 'Open Sans, Helvetica, Arial, sans-serif',
                    url: 'https://static.hashtagsell.com/htsApp/map-elements/cluster2.png',
                    height: 35,
                    width: 35
                },
                {
                    textColor: 'white',
                    fontFamily: 'Open Sans, Helvetica, Arial, sans-serif',
                    url: 'https://static.hashtagsell.com/htsApp/map-elements/cluster2.png',
                    height: 35,
                    width: 35
                }
            ]
        },
        refresh : false
    };

    factory.cachedColumnCalculation = null;



    //Evaluates the width of the browser and builds array with array of rows.
    factory.generateRows = function (results, reason, views) {

        //console.log('generate rows', results, reason, views);

        var numColumns;

        //If user has gridView enabled calculate columns, else build list view.
        if (views.gridView) {
            var dimensions = factory.getInnerContainerDimensions();
            var itemWidth = 290;
            //console.log('width: ' + dimensions.w + '/' + itemWidth + ' equals...');
            numColumns = Math.floor(dimensions.w / itemWidth);
            factory.results.gridPercentageWidth = 100 / numColumns;
            //console.log("Calculated " + numColumns + " columns at " + factory.results.gridPercentageWidth + "% width.");
        } else {
            numColumns = 1;
            //console.log("List View: " + numColumns + " columns!");
        }



        if (numColumns !== factory.cachedColumnCalculation || reason === 'filter' || reason === 'pagination') {

            factory.cachedColumnCalculation = numColumns;

            //TODO: Don't clear all items just clear necessary ones??
            factory.results.gridRows = [];

            //Calculate the number of results with images and add up scroll height. This is used for virtual scrolling
            for (var i = 0; i < results.length; i++) {

                var rowHeight;

                //If gridview is turned on they height is always 350
                if (views.gridView) {
                    rowHeight = 390;
                } else { //else the user is in list view.  Height depends on whether result contains 2 or more images.
                    if(results[i].images.length === 0) {
                        rowHeight = 179;
                    } else if (results[i].images.length === 1) {
                        rowHeight = 261;
                    } else {
                        rowHeight = 420;
                    }
                }


                if (i % numColumns === 0) {
                    var row = {
                        rowHeight: rowHeight,
                        rowContents: []
                    };

                    for (var j = 0; j < numColumns; j++) {

                        if (i + j < results.length) {
                            //console.log(i + j);


                            //if (results[i + j].askingPrice.value) {
                            //    factory.updatePriceSlider(results[i + j].askingPrice.value);
                            //}


                            row.rowContents.push(results[i + j]);
                        }
                    }

                    factory.results.gridRows.push(row);

                    i = i + j - 1;
                    //console.log('Finshed row! New index is: ' + i);
                }
            }

            var maxPrice = factory.priceSlider.max;

            if (maxPrice < 100) {
                factory.priceSlider.step = 1;
            } else if (maxPrice > 100 && maxPrice < 500) {
                factory.priceSlider.step = 5;
            } else if (maxPrice > 500 && maxPrice < 2000) {
                factory.priceSlider.step = 10;
            } else if (maxPrice > 2000 && maxPrice < 10000) {
                factory.priceSlider.step = 50;
            } else if (maxPrice > 10000) {
                factory.priceSlider.step = 50;
            }


            console.log('Grid Rows: ', factory.results.gridRows);

        }

    };







    factory.updatePriceSlider = function (itemPrice) {

        console.log(itemPrice);

        if (parseInt(itemPrice) > parseInt(factory.priceSlider.max)) {

            factory.priceSlider.max = parseInt(itemPrice);

            if (!factory.priceSlider.userSetValue) {
                factory.priceSlider.rangeValue[1] = parseInt(itemPrice);
            }
        }
    };




    factory.markerMaker = function (result, index, visibleStatus) {

        var marker = {
            id: result.postingId,
            coords: {
                latitude: result.geo.coordinates[1],
                longitude: result.geo.coordinates[0]
            },
            title: result.heading,
            options: {
                visible: visibleStatus
            }
        };


        if(factory.views.showMap) {
            if (factory.map.markers[index]) {
                factory.map.markers[index].options.visible = visibleStatus;
            } else {
                factory.map.markers[index] = marker;
            }
        }
    };






    //simplest filters
    factory.mustHaveImage = function(element, index){

        var visibleStatus = Boolean(element.images.length);

        factory.updatePriceSlider(element.askingPrice.value);

        factory.markerMaker(element, index, visibleStatus);

        return visibleStatus;
    };


    factory.mustHavePrice = function(element, index){

        var visibleStatus = Boolean(element.askingPrice.value);

        factory.updatePriceSlider(element.askingPrice.value);

        factory.markerMaker(element, index, visibleStatus);

        return visibleStatus;
    };

    //Does not filter out free items!!!
    factory.mustFitPriceRange = function(element, index){

        var visibleStatus = Boolean(!element.askingPrice.value || element.askingPrice.value >= factory.priceSlider.rangeValue[0] && element.askingPrice.value <= factory.priceSlider.rangeValue[1]);

        factory.updatePriceSlider(element.askingPrice.value);

        factory.markerMaker(element, index, visibleStatus);

        return visibleStatus;
    };

    //Image filter possibilities
    factory.mustHaveImageAndPrice = function(element, index){

        var visibleStatus = Boolean(element.images.length && element.askingPrice.value);

        factory.updatePriceSlider(element.askingPrice.value);

        factory.markerMaker(element, index, visibleStatus);

        return visibleStatus;
    };


    factory.mustHaveImageAndMustFitPriceRange = function(element, index){

        var visibleStatus = Boolean(element.images.length && element.askingPrice.value >= factory.priceSlider.rangeValue[0] && element.askingPrice.value <= factory.priceSlider.rangeValue[1]);

        factory.updatePriceSlider(element.askingPrice.value);

        factory.markerMaker(element, index, visibleStatus);

        return visibleStatus;
    };


    //Price filter possibilites
    factory.mustHavePriceAndMustFitPriceRange = function(element, index){

        var visibleStatus = Boolean(element.askingPrice.value && element.askingPrice.value >= factory.priceSlider.rangeValue[0] && element.askingPrice.value <= factory.priceSlider.rangeValue[1]);

        factory.updatePriceSlider(element.askingPrice.value);

        factory.markerMaker(element, index, visibleStatus);

        return visibleStatus;
    };


    //All filters combined
    factory.mustHavePriceAndMustHaveImageAndMustFitPriceRange = function(element, index){

        var visibleStatus = Boolean(element.images.length && element.askingPrice.value && element.askingPrice.value >= factory.priceSlider.rangeValue[0] && element.askingPrice.value <= factory.priceSlider.rangeValue[1]);

        factory.updatePriceSlider(element.askingPrice.value);

        factory.markerMaker(element, index, visibleStatus);

        return visibleStatus;
    };



    factory.filterArray = function (views, reason) {
        //console.log('filterArray view view type: ', views, factory.filter);
        //console.log('filterArray view reason: ', reason);

        var filterToggles = factory.filter;
        var priceSliderRange = factory.priceSlider;

        var filteredResults;

        //Must have price and must have image and must fit price range
        if (filterToggles.mustHavePrice && filterToggles.mustHaveImage && priceSliderRange.userSetValue) {
            filteredResults = factory.results.unfiltered.filter(factory.mustHavePriceAndMustHaveImageAndMustFitPriceRange);

            factory.generateRows(filteredResults, reason, views);

            //Must have image and price RANGE
        } else if (filterToggles.mustHaveImage && priceSliderRange.userSetValue) {
            filteredResults = factory.results.unfiltered.filter(factory.mustHaveImageAndMustFitPriceRange);

            factory.generateRows(filteredResults, reason, views);

            //Must have price and must fit price range
        } else if (filterToggles.mustHavePrice && priceSliderRange.userSetValue) {
            filteredResults = factory.results.unfiltered.filter(factory.mustHavePriceAndMustFitPriceRange);

            factory.generateRows(filteredResults, reason, views);

            //Must Have Image and Must have Price
        } else if (filterToggles.mustHaveImage && filterToggles.mustHavePrice) {
            filteredResults = factory.results.unfiltered.filter(factory.mustHaveImageAndPrice);

            factory.generateRows(filteredResults, reason, views);

            //Must have image
        } else if (filterToggles.mustHaveImage) {

            filteredResults = factory.results.unfiltered.filter(factory.mustHaveImage);

            factory.generateRows(filteredResults, reason, views);

            //Must have price
        } else if (filterToggles.mustHavePrice) {
            filteredResults = factory.results.unfiltered.filter(factory.mustHavePrice);

            factory.generateRows(filteredResults, reason, views);

            //Must fit in price RANGE
        } else if (priceSliderRange.userSetValue) {
            filteredResults = factory.results.unfiltered.filter(factory.mustFitPriceRange);

            factory.generateRows(filteredResults, reason, views);

            //All filters turned off, just generate rows
        } else {

            for (i = 0; i < factory.results.unfiltered.length; i++ ) {

                factory.updatePriceSlider(factory.results.unfiltered[i].askingPrice.value);

                factory.markerMaker(factory.results.unfiltered[i], i, true);
            }

            factory.generateRows(factory.results.unfiltered, reason, views);
        }

        //TODO: This is a hack because clustered markers are not properly binded in angular-google-maps.  see here: https://github.com/angular-ui/angular-google-maps/issues/813

        if(factory.views.showMap) {
            refreshMap();
        }
    };


    var refreshMap = function () {
        factory.map.refresh = true;
        $timeout(function () {
            factory.map.refresh = false;
        }, 100);
    };



    factory.resetResultsView = function () {
        factory.results.gridRows = [];
        factory.results.unfiltered = [];

        factory.priceSlider.min = 0;
        factory.priceSlider.max = 0;
        factory.priceSlider.step = 1;
        factory.priceSlider.rangeValue = [0,0];
        factory.priceSlider.userSetValue = false;

        factory.filter.mustHaveImage = false;
        factory.filter.mustHavePrice = false;

        factory.views.gridView = true;
        factory.views.showMap = false;

        factory.map.markers = [];

        factory.status.pleaseWait = true;
        factory.status.error = {};

        factory.defaultParams = {
            start: 0,
            count: 35,
            filters: {
                mandatory: {
                    contains: {
                        heading: null
                    }
                }
            },
            geo: {
                lookup: true,
                min: 0,
                max: 50000000
            }
        };
    };



    return factory;
}]);
//This service is getter and setter for user settings, favorites, logged in status etc.
htsApp.service('Session', ['$window', '$http', '$q', '$state', function ($window, $http, $q, $state) {

    this.defaultUserObj = {
        loggedIn: false,
        profile_photo: '//static.hashtagsell.com/htsApp/placeholders/user-placeholder.png',
        banner_photo: '//static.hashtagsell.com/htsApp/placeholders/header-placeholder.png',
        safe_search: true,
        linkedAccounts: [],
        email_provider: [
            {
                name : "Always Ask",
                value: "ask"
            }
        ],
        favorites: [],
        feed_categories:[{
            "code": "SSSS",
            "name": "For Sale",
            "categories": [{
                "code": "SANT",
                "name": "Antiques",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SAPP",
                "name": "Apparel",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SAPL",
                "name": "Appliances",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SANC",
                "name": "Art And Crafts",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SKID",
                "name": "Babies And Kids",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SBAR",
                "name": "Barters",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SBIK",
                "name": "Bicycles",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SBIZ",
                "name": "Businesses",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SCOL",
                "name": "Collections",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SEDU",
                "name": "Educational",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SELE",
                "name": "Electronics And Photo",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SFNB",
                "name": "Food And Beverage",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SFUR",
                "name": "Furniture",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SGAR",
                "name": "Garage Sales",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SGFT",
                "name": "Gift Cards",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SHNB",
                "name": "Health And Beauty",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SHNG",
                "name": "Home And Garden",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SIND",
                "name": "Industrial",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SJWL",
                "name": "Jewelry",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SLIT",
                "name": "Literature",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SMNM",
                "name": "Movies And Music",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SMUS",
                "name": "Musical Instruments",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SRES",
                "name": "Restaurants",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SSNF",
                "name": "Sports And Fitness",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "STIX",
                "name": "Tickets",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "STOO",
                "name": "Tools",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "STOY",
                "name": "Toys And Hobbies",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "STVL",
                "name": "Travel",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SWNT",
                "name": "Wanted",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SOTH",
                "name": "Other",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }],
            "selected": true,
            "__ivhTreeviewIndeterminate": false,
            "__ivhTreeviewExpanded": true
        }, {
            "code": "RRRR",
            "name": "Real Estate",
            "categories": [{
                "code": "RCRE",
                "name": "Commercial Real Estate",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "RHFR",
                "name": "Housing For Rent",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "RHFS",
                "name": "Housing For Sale",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "RSUB",
                "name": "Housing Sublets",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "RSWP",
                "name": "Housing Swaps",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "RLOT",
                "name": "Lots And Land",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "RPNS",
                "name": "Parking And Storage",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "RSHR",
                "name": "Room Shares",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "RVAC",
                "name": "Vacation Properties",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "RWNT",
                "name": "Want Housing",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "ROTH",
                "name": "Other",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }],
            "selected": true,
            "__ivhTreeviewIndeterminate": false,
            "__ivhTreeviewExpanded": true
        }, {
            "code": "VVVV",
            "name": "Vehicles",
            "categories": [{
                "code": "VAUT",
                "name": "Autos",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "VMOT",
                "name": "Motorcycles",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "VMPT",
                "name": "Motorcycle Parts",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "VPAR",
                "name": "Parts",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "VOTH",
                "name": "Other",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }],
            "selected": true,
            "__ivhTreeviewIndeterminate": false,
            "__ivhTreeviewExpanded": true
        }]
    };


    this.userObj = {
        user_settings : JSON.parse($window.localStorage.getItem("hts_storage")) || this.defaultUserObj
    };


    //Call this function when user updates HTML5 Session Storage.  Keeps server in sync.
    this.updateServer = function (callback) {

        console.log("updating server");

        var deferred = $q.defer();

        $http.post('/updateUserSettings', { "userSettings": this.userObj.user_settings})

            .then(function (response) {

                if (response.data.success) {

                    if (callback) {
                        callback(response);
                    }

                    console.log('UPDATE SERVER DONE');

                    deferred.resolve();


                } else {

                    console.log(response);
                }
            },            //error
            function (data, status, headers, config) {
                deferred.reject();

            });

        return deferred.promise;

    };

    //Adds all users setting to HTML5 session storage
    this.create = function (data) {

        console.log('CREATE START');

        console.log('Updating local storage with', data);
        data.user_settings.loggedIn = true;
        this.userObj.user_settings = data.user_settings; //ONLY ADD USER_SETTING PROPERTY TO OBJECT OTHERWISE BINDING FAILS AND UI DOES NOT LIVE UPDATE.

        console.log('data about to be written to local storage', this.userObj);

        $window.localStorage.hts_storage = angular.toJson(this.userObj.user_settings);

        console.log('CREATE DONE');
    };

    //Clears all users settings from HTML5 session storage on logout
    this.destroy = function () {
        console.log('clearing user obj');
        this.userObj.user_settings = this.defaultUserObj;

        console.log("Destroying HTML5 Session");
        $window.localStorage.removeItem("hts_storage");

        $state.go('feed');
    };

    //Get a particular user setting from HTML5 session storage
    this.getSessionValue = function (key) {
        if (this.userObj.user_settings[key]) {
            return this.userObj.user_settings[key];
        }else if (this.userObj.user_settings.linkedAccounts[key]) {
            return this.userObj.user_settings.linkedAccounts[key];
        } else {
            return false;
        }
    };

    //Set a particular user setting in HTML5 session storage then update the server
    this.setSessionValue = function (key, value, callback) {
        console.log("set " + key + " in HTML5 user settings to ", value);

        if (this.userObj.user_settings[key]) {
            this.userObj.user_settings[key] = value;
        } else if (this.userObj.user_settings.linkedAccounts[key]) {
            this.userObj.user_settings.linkedAccounts[key] = value;
        }

        this.create(this.userObj);
        this.updateServer(callback);
    };


    this.getUserFromServer = function () {

        var deferred = $q.defer();

        $http.get('/getUserSettings')

            .then(function (response) {

                var data = {};
                data.user_settings = response.data;

                deferred.resolve(data);

            },            //error
            function (data, status, headers, config) {
                deferred.reject();
            });

        return deferred.promise;
    };


    this.deleteAccount = function () {

        var deferred = $q.defer();

        $http({
            url: '/user',
            method: 'DELETE'
        }).then(function (response) {

                deferred.resolve(response);

            },            //error
            function (response, status, headers, config) {

                deferred.reject(response);
            });

        return deferred.promise;

    };


    return this;
}]);
/**
 * Created by braddavis on 11/29/14.
 */
htsApp.controller('settings.account.controller', ['$scope', '$timeout', '$window', 'Session', 'ebayFactory', 'facebookFactory', 'twitterFactory', 'Notification', 'modalConfirmationService', function ($scope, $timeout, $window, Session, ebayFactory, facebookFactory, twitterFactory, Notification, modalConfirmationService) {

    //$scope.userObj = Session.userObj;

    //$scope.options = {
    //    safeSearch: ['On', 'Off'],
    //    defaultEmail: [
    //        {name : "Always Ask", value: "ask"},
    //        {name : "Gmail", value : "gmail"},
    //        {name : "Yahoo", value : "yahoo"},
    //        {name : "Hotmail", value : "hotmail"},
    //        {name : "AOL", value : "aol"},
    //        {name : "Use Default Mail Client", value : "mailto"}
    //    ],
    //    location: ['Approximate', 'Exact']
    //};
    //
    //$scope.defaultEmail = Session.userObj.user_settings.email_provider[0].value;

    //$scope.getSafeSearch = function(){
    //    //var value = Session.getSessionValue('safe_search');
    //    if (Session.userObj.user_settings.safe_search){
    //        return $scope.options.safeSearch[0];
    //    } else {
    //        return $scope.options.safeSearch[1];
    //    }
    //};
    //$scope.safeSearch = $scope.getSafeSearch();
    //$scope.setSafeSearch = function(selection){
    //
    //    if(selection === "On"){
    //        Session.setSessionValue('safe_search', true, function(){
    //            $scope.safeSearchUpdated = true;
    //
    //            $timeout(function () {
    //
    //                $scope.safeSearchUpdated = false;
    //            }, 3000);
    //        });
    //    } else if (selection === "Off") {
    //        Session.setSessionValue('safe_search', false, function(){
    //            $scope.safeSearchUpdated = true;
    //
    //            $timeout(function () {
    //
    //                $scope.safeSearchUpdated = false;
    //            }, 3000);
    //        });
    //    }
    //
    //};


    //var buildDefaultEmail = function (selection) {
    //    //var value = Session.getSessionValue('email_provider');
    //    switch (selection) {
    //        case 'ask':
    //            return [{name : "Always Ask", value: "ask"}];
    //        case 'gmail':
    //            return [{name : "Gmail", value : "gmail"}];
    //        case 'yahoo':
    //            return [{name : "Yahoo", value : "yahoo"}];
    //        case 'hotmail':
    //            return [{name : "Hotmail", value : "hotmail"}];
    //        case 'aol':
    //            return [{name : "AOL", value : "aol"}];
    //        case 'mailto':
    //            return [{name : "Use Default Mail Client", value : "mailto"}];
    //    }
    //};
    //
    //
    //$scope.setDefaultEmail = function(selection){
    //
    //    selection = buildDefaultEmail(selection);
    //
    //    Session.setSessionValue('email_provider', selection, function () {
    //        $scope.defaultEmailUpdated = true;
    //
    //        $timeout(function () {
    //            $scope.defaultEmailUpdated = false;
    //        }, 3000);
    //    });
    //
    //};
    //
    //
    //
    //$scope.getLocation = function(){
    //    //var value = Session.getSessionValue('location_type');
    //    switch (Session.userObj.user_settings.location_type) {
    //        case 'Approximate':
    //            return $scope.options.location[0];
    //        case 'Exact':
    //            return $scope.options.location[1];
    //    }
    //};
    //$scope.location = $scope.getLocation();
    //$scope.setLocation = function(selection){
    //    Session.setSessionValue('location_type', selection, function(){
    //        $scope.locationUpdated = true;
    //
    //        $timeout(function () {
    //
    //            $scope.locationUpdated = false;
    //        }, 3000);
    //    });
    //};




    $scope.getEbaySessionID = function () {

        $scope.ebay = {};


        ebayFactory.getEbaySessionID().then(function (response) {
            Session.setSessionValue('ebay', response.data.ebay, function () {});
        }, function(errResponse) {
            $scope.ebay.sessionId = errResponse.data.sessionId;
            $scope.ebay.err = errResponse.data.ebay.Errors.LongMessage;

            Notification.error({
                title: 'Ebay auth failed',
                message: 'Please try again.',
                delay: 10000
            });  //Send the webtoast
        });

    };


    $scope.disconnectFacebook = function () {
        facebookFactory.disconnectFacebook();
    };


    $scope.disconnectTwitter = function () {
        twitterFactory.disconnectTwitter();
    };


    $scope.disconnectEbay = function () {
        ebayFactory.disconnectEbay();
    };

    $scope.disconnectAmazon = function () {
        Session.setSessionValue('amazon', {}, function () {
            console.log('amazon account disconnected!');
        });
    };


    $scope.deleteAccount = function () {


        var modalOptions = {
            closeButtonText: 'No',
            actionButtonText: 'Yes',
            headerText: 'Delete Account?',
            bodyText: 'Are you sure you want to delete your HashtagSell account?  This action is permanent.'
        };

        modalConfirmationService.showModal({}, modalOptions).then(function (result) {

            Session.deleteAccount().then(function (response) {

                console.log(response);

                Session.destroy();

            }, function (err) {

                console.log(err);

            });

        });
    };

}]);
/**
 * Created by braddavis on 4/16/15.
 */
htsApp.controller('settings.password.controller', ['$scope', 'authFactory', function ($scope, authFactory) {

    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };


    $scope.updatePassword = function (isValid) {
        if (isValid) {

            var currentPassword = $scope.currentPassword;
            var newPassword = $scope.newPassword;

            authFactory.updatePassword(currentPassword, newPassword).then(function (response) {

                if(response.error) {

                    $scope.alerts.push({ type: 'danger', msg: response.error });

                } else if(response.success) {

                    $scope.alerts.push({ type: 'success', msg: 'Success! Password updated.' });

                }


            }, function () {

                $scope.alerts.push({ type: 'danger', msg: 'Whoops.. Try again or contact support.'});

            });
        }

        $scope.currentPassword = null;
        $scope.newPassword = null;
        $scope.verifyNewPassword = null;
    };

}]);
/**
 * Created by braddavis on 11/29/14.
 */
htsApp.controller('settings.payment.controller', ['$scope', function ($scope) {
    //alert("payment controller");
}]);
/**
 * Created by braddavis on 11/29/14.
 */
htsApp.controller('settings.profile.controller', ['$scope', 'Session', '$templateCache', function ($scope, Session, $templateCache) {

    $scope.userObj = Session.userObj;

    $scope.bindingObj = {
        currentlyUploadingProfilePhoto: false,
        currentlyUploadingBannerPhoto: false,
        requireUpdate: true
    };


    $scope.profileDropzoneConfig = {
        'options': { // passed into the Dropzone constructor
            paramName: "profilePhoto", // The name that will be used to transfer the file
            maxFilesize: 10, // MB
            acceptedFiles: '.jpeg,.jpg,.png,.gif',
            url: "/upload",
            autoProcessQueue: true,
            uploadMultiple: false,
            addRemoveLinks: false,
            thumbnailWidth: 90,
            thumbnailHeight: 90,
            previewsContainer: "#profilePreview",
            previewTemplate: $templateCache.get('profileUploadTemplate.tpl'),
            clickable: ".triggerProfileImageUpload",
            dictDefaultMessage: ''
        },
        'eventHandlers': {
            'addedfile': function () {
                $scope.$apply(function(){
                    $scope.bindingObj.currentlyUploadingProfilePhoto = true;
                });
            },
            'success': function (response) {

                var S3response = JSON.parse(response.xhr.response);

                console.log(S3response);

                Session.setSessionValue('profile_photo', S3response.url, $scope.$apply(function () {
                    $scope.bindingObj.currentlyUploadingProfilePhoto = false;
                }));
            },
            'complete' : function () {
                console.log('complete');
            }
        }
    };




    $scope.bannerDropzoneConfig = {
        'options': { // passed into the Dropzone constructor
            paramName: "bannerPhoto", // The name that will be used to transfer the file
            maxFilesize: 10, // MB
            acceptedFiles: '.jpeg,.jpg,.png,.gif',
            url: "/upload",
            autoProcessQueue: true,
            uploadMultiple: false,
            addRemoveLinks: false,
            thumbnailWidth: 180,
            thumbnailHeight: 120,
            previewsContainer: "#bannerPreview",
            previewTemplate: $templateCache.get('bannerUploadTemplate.tpl'),
            clickable: ".triggerBannerImageUpload",
            dictDefaultMessage: ''
        },
        'eventHandlers': {
            'addedfile': function () {
                $scope.$apply(function(){
                    $scope.bindingObj.currentlyUploadingBannerPhoto = true;
                });
            },
            'success': function (response) {

                var S3response = JSON.parse(response.xhr.response);

                console.log(S3response);

                Session.setSessionValue('banner_photo', S3response.url, $scope.$apply(function () {
                    $scope.bindingObj.currentlyUploadingBannerPhoto = false;
                }));
            },
            'complete' : function () {
                console.log('complete');
            }
        }
    };



    $scope.requireUpdate = function () {
        $scope.bindingObj.requireUpdate = false;
    };

    $scope.submitUpdatedProfile = function () {
        Session.setSessionValue('biography', $scope.userObj.user_settings.biography, function () {
            $scope.bindingObj.requireUpdate = true;
        });
    };

}]);
htsApp.controller('sideNav.controller', ['$scope', 'sideNavFactory', 'splashFactory', function ($scope, sideNavFactory, splashFactory) {

    $scope.sideNav = sideNavFactory;

    $scope.result = splashFactory.result;

}]);
/**
 * Created by braddavis on 11/29/14.
 */
htsApp.factory('sideNavFactory', function () {

    var factory = {};

    //DEFAULT MENU
    factory.defaultMenu = [{
        name: "Feed",
        alerts: null,
        link: "feed",
        active: false
    }, {
        name: "My Posts",
        alerts: null,
        link: "myposts",
        active: false
    }, {
        name: "Watch List",
        alerts: null,
        link: "watchlist",
        active: false
    }, {
        name: "Notify Me",
        alerts: null,
        link: "notifications",
        active: false
    }];

    factory.items = factory.defaultMenu;




    //SETTINGS MENU
    factory.settingsMenu = [{
        name: "Back",
        alerts: null,
        link: null,
        active: false
    }, {
        name: "Account",
        alerts: null,
        link: "settings.account",
        active: false
    }, {
        name: "Password",
        alerts: null,
        link: "settings.password",
        active: false
    }, {
        name: "Profile",
        alerts: null,
        link: "settings.profile",
        active: false
    }, {
        name: "Payment & Shipping",
        alerts: null,
        link: "settings.payment",
        active: false
    }];


    //This function called by ui-router as moves through application.  Updates choice in side nav dynamically.
    factory.updateSideNav = function (toState) {

        switch (toState.name) {
            //Settings Menu
            case 'settings':
                factory.settingsMenu[0].active = false;
                factory.settingsMenu[1].active = false;
                factory.settingsMenu[2].active = false;
                factory.settingsMenu[3].active = false;
                factory.settingsMenu[4].active = false;
                factory.items = factory.settingsMenu;
                break;
            case 'settings.account':
                factory.settingsMenu[0].active = false;
                factory.settingsMenu[1].active = true;
                factory.settingsMenu[2].active = false;
                factory.settingsMenu[3].active = false;
                factory.settingsMenu[4].active = false;
                factory.items = factory.settingsMenu;
                break;
            case 'settings.password':
                factory.settingsMenu[0].active = false;
                factory.settingsMenu[1].active = false;
                factory.settingsMenu[2].active = true;
                factory.settingsMenu[3].active = false;
                factory.settingsMenu[4].active = false;
                factory.items = factory.settingsMenu;
                break;
            case 'settings.profile':
                factory.settingsMenu[0].active = false;
                factory.settingsMenu[1].active = false;
                factory.settingsMenu[2].active = false;
                factory.settingsMenu[3].active = true;
                factory.settingsMenu[4].active = false;
                factory.items = factory.settingsMenu;
                break;
            case 'settings.payment':
                factory.settingsMenu[0].active = false;
                factory.settingsMenu[1].active = false;
                factory.settingsMenu[2].active = false;
                factory.settingsMenu[3].active = false;
                factory.settingsMenu[4].active = true;
                factory.items = factory.settingsMenu;
                break;



            //Default Menu
            case 'feed':
                factory.defaultMenu[0].active = true;
                factory.defaultMenu[1].active = false;
                factory.defaultMenu[2].active = false;
                factory.defaultMenu[3].active = false;
                factory.items = factory.defaultMenu;
                break;
            case 'myposts':
                factory.defaultMenu[0].active = false;
                factory.defaultMenu[1].active = true;
                factory.defaultMenu[2].active = false;
                factory.defaultMenu[3].active = false;
                factory.items = factory.defaultMenu;
                break;
            case 'watchlist':
                factory.defaultMenu[0].active = false;
                factory.defaultMenu[1].active = false;
                factory.defaultMenu[2].active = true;
                factory.defaultMenu[3].active = false;
                factory.items = factory.defaultMenu;
                break;
            case 'notifications':
                factory.defaultMenu[0].active = false;
                factory.defaultMenu[1].active = false;
                factory.defaultMenu[2].active = false;
                factory.defaultMenu[3].active = true;
                factory.items = factory.defaultMenu;
                break;
            case 'results':
                factory.defaultMenu[0].active = false;
                factory.defaultMenu[1].active = false;
                factory.defaultMenu[2].active = false;
                factory.defaultMenu[3].active = false;
                factory.items = factory.defaultMenu;
                break;
            case 'profile':
                factory.defaultMenu[0].active = false;
                factory.defaultMenu[1].active = false;
                factory.defaultMenu[2].active = false;
                factory.defaultMenu[3].active = false;
                factory.items = factory.defaultMenu;
                break;
        }
    };


    factory.sideNav = {
        hidden: true,
        listView: true
    };


    return factory;

});
htsApp.controller('sideProfile', ['$scope', 'Session', '$templateCache', function ($scope, Session, $templateCache) {

    $scope.userObj = Session.userObj;


    $scope.checkDefaultBanner = function(){
        return $scope.userObj.user_settings.banner_photo === '/images/userMenu/header-placeholder.png';
    };


    $scope.checkDefaultProfilePhoto = function(){
        return $scope.userObj.user_settings.profile_photo === '/images/userMenu/user-placeholder.png';
    };



    $scope.profileDropzoneConfig = {
        'options': { // passed into the Dropzone constructor
            paramName: "profilePhoto", // The name that will be used to transfer the file
            maxFilesize: 10, // MB
            acceptedFiles: '.jpeg,.jpg,.png,.gif',
            url: "/upload",
            autoProcessQueue: true,
            uploadMultiple: false,
            previewTemplate : '<div style="display:none"></div>',
            clickable: ".sideNavTriggerProfileImageUpload",
            dictDefaultMessage: ''
        },
        'eventHandlers': {
            'success': function (response) {

                var S3response = JSON.parse(response.xhr.response);

                console.log(S3response);

                Session.setSessionValue('profile_photo', S3response.url, function () {
                    console.log('done sidenav profile photo upload');
                });
            },
            'complete' : function () {
                console.log('complete');
            }
        }
    };




    $scope.bannerDropzoneConfig = {
        'options': { // passed into the Dropzone constructor
            paramName: "bannerPhoto", // The name that will be used to transfer the file
            maxFilesize: 10, // MB
            acceptedFiles: '.jpeg,.jpg,.png,.gif',
            url: "/upload",
            autoProcessQueue: true,
            uploadMultiple: false,
            previewTemplate : '<div style="display:none"></div>',
            clickable: ".sideNavTriggerBannerImageUpload",
            dictDefaultMessage: ''
        },
        'eventHandlers': {
            'success': function (response) {

                var S3response = JSON.parse(response.xhr.response);

                console.log(S3response);

                Session.setSessionValue('banner_photo', S3response.url, $scope.$apply(function () {
                    console.log('done sidenav banner photo upload');
                }));
            },
            'complete' : function () {
                console.log('complete');
            }
        }
    };

}]);
/**
 * Created by braddavis on 1/25/15.
 */
htsApp.factory('socketio', ['ENV', 'myPostsFactory', 'Notification', 'favesFactory', 'feedFactory', function (ENV, myPostsFactory, Notification, favesFactory, feedFactory) {

    var socketio = {
        postingSocket: io(ENV.realtimePostingAPI),
        userSocket: io(ENV.realtimeUserAPI),
        postings: [],
        usersViewing: []
    };



    socketio.joinPostingRoom = function (postingId, reason, callback) {

        //reason can be postingOwner, toggleSplash, inWatchList
        var permissionLevel = 0;
        if(reason === "toggleSplash") {
            permissionLevel = 1;
        } else if (reason === "inWatchList") {
            permissionLevel = 2;
        } else if (reason === "postingOwner") {
            permissionLevel = 3;
        }

        var handleRequest = false;

        if(socketio.postings.length) {
            for (var i = 0; i < socketio.postings.length; i++) {

                var previouslyJoinedRoom = socketio.postings[i];

                if (previouslyJoinedRoom.postingId === postingId) { //If the user is requesting to join a room they have already joined
                    if(previouslyJoinedRoom.permissionLevel < permissionLevel){ //If join request has a higher permission level than the room they have already joined
                        socketio.postings.splice(i, 1); //Remove the room with inferior permission from list of rooms user has access too.

                        handleRequest = true;

                        reason = socketio.cachedUsername + ' is joining posting room: ' + postingId + ' because requested permission level ' + permissionLevel + ' is greater than ' + previouslyJoinedRoom.permissionLevel;

                        break;
                    }
                } else { //this requested room to join is unique

                    if(i === socketio.postings.length - 1) { //if we have completed checking all rooms the user is currently subscribed too.

                        handleRequest = true;

                        reason = socketio.cachedUsername + ' is joining posting room: ' + postingId + ' for first time with permission level ' + permissionLevel;
                    }

                }
            }
        } else {//The user is not subscribed to any current posting rooms so add their first one.

            handleRequest = true;

            reason = socketio.cachedUsername + ' is joining posting room: ' + postingId + ' with permission level ' + permissionLevel + ' as their first room ';
        }


        if (handleRequest) {

            socketio.postings.push({'postingId': postingId, 'permissionLevel': permissionLevel});

            socketio.postingSocket.emit('join-room', {
                username: socketio.cachedUsername,
                roomId: postingId
            });

        } else {

            reason = socketio.cachedUsername + ' already joined posting room: ' + postingId + ' with higher permission level than ' + permissionLevel;

        }

        if(callback){
            callback();
        }

    };



    socketio.joinUserRoom = function (userRoomToJoin, visitor, callback) {
        socketio.usersViewing.push(visitor);

        console.log(visitor + ' is joining ' + userRoomToJoin + '\'s room: ');

        socketio.userSocket.emit('join-room', {
            username : visitor,
            roomId : userRoomToJoin
        });

        if(callback){
            callback();
        }
    };


    socketio.joinLocationRoom = function(metroCode, callback) {

        console.log(socketio.cachedUsername + ' is joining ' + metroCode + '\'s room: ');

        socketio.postingSocket.emit('join-room', {
            username : socketio.cachedUsername,
            roomId : metroCode
        });

        if(callback){
            callback();
        }

    };



    //Leave all rooms when user logs out.
    socketio.closeAllConnections = function (callback) { //called by main.controller.js

        socketio.leaveUserRoom(socketio.cachedUsername);

        socketio.cachedUsername = null;

        if(callback){
            callback();
        }
    };


    socketio.leavePostingRoom = function (postingId, reason, callback) {

        //reason can be postingOwner, splashToggle, inWatchList
        var permissionLevel = 0;
        if(reason === "toggleSplash") {
            permissionLevel = 1;
        } else if (reason === "inWatchList") {
            permissionLevel = 2;
        } else if (reason === "postingOwner") {
            permissionLevel = 3;
        }

        var handleRequest = false;

        if(socketio.postings.length) {
            for (var i = 0; i < socketio.postings.length; i++) {

                var previouslyJoinedRoom = socketio.postings[i];

                if (previouslyJoinedRoom.postingId === postingId) { //If the user is requesting to leave a room they have already joined
                    if(previouslyJoinedRoom.permissionLevel <= permissionLevel){ //If join request has a higher permission level than the room they have already joined

                        socketio.postings.splice(i, 1); //Remove the room with inferior permission from list of rooms user has access too.

                        handleRequest = true;

                        reason = socketio.cachedUsername + ' is leaving posting room: ' + postingId + ' because requested permission level ' + permissionLevel + ' is greater than or equal to ' + previouslyJoinedRoom.permissionLevel;

                        break;
                    } else {

                        reason = socketio.cachedUsername + ' is NOT leaving posting room: ' + postingId + ' because requested permission level ' + permissionLevel + ' is less than ' + previouslyJoinedRoom.permissionLevel;

                    }
                } else { //the requested room to leave is unique

                    if(i === socketio.postings.length - 1) { //if we have completed checking all rooms the user is currently subscribed too.

                        reason = socketio.cachedUsername + ' is requesting to leave posting room: ' + postingId + ' which they have not joined?';
                    }
                }
            }
        } else {//The user is not subscribed to any current posting rooms so add their first one.

            reason = socketio.cachedUsername + ' is requesting to leave posting room: ' + postingId + ' when they havent joined any rooms?';
        }


        if (handleRequest) {

            socketio.postingSocket.emit('leave-room', postingId);

        }

        if(callback){
            callback();
        }
    };


    socketio.leaveUserRoom = function (username, callback) {

        socketio.usersViewing.splice(socketio.usersViewing.indexOf(username), 1);

        console.log('leaving user room: ' + username);

        socketio.userSocket.emit('leave-room', username);

        if(callback){
            callback();
        }
    };



    socketio.leaveLocationRoom = function (metroCode, callback) {

        console.log('leaving metro code room: ' + metroCode);

        socketio.userSocket.emit('leave-room', metroCode);

        if(callback){
            callback();
        }
    };




    socketio.sendMessage = function (recipient, messageText) {
        socketio.userSocket.emit('private-message', {
            message : messageText,
            recipient: recipient,
            username : socketio.cachedUsername
        });
    };



    // listen for messages
    socketio.userSocket.on('private-message', function(pm){

        console.log('emitted private message', pm);

        Notification.primary({title: 'New message from @' + pm.username, message: pm.message, delay: 10000});  //Send the webtoast
    });


    // listen for meeting requests
    socketio.postingSocket.on('make-offer', function (emit) {

        console.log('emitted make-offer request', emit);

        //TODO: Need the offer object to include the sellers username
        if(emit.username === socketio.cachedUsername) { //If currently logged in user is the user who caused the emit then inform them the their meeting request is sent

            favesFactory.checkFave(emit.posting, function (favorited) {

                if(favorited){ //The user sending the meeting request already has the item in their watchlist

                    favesFactory.updateFavorite(emit, function(){

                        var url = '"/watchlist/meetings/' + emit.posting.postingId + '"';

                        Notification.primary({
                            title: '<a href=' + url + '>Offer Sent!</a>',
                            message: '<a href=' + url + '>This watchlist item has been updated. You\'ll be notified when the seller responds.</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });

                } else { //The user sending the meeting request does not have this item in their watchlist.

                    favesFactory.addFave(emit.posting, function(){

                        var url = '"/watchlist/meetings/' + emit.posting.postingId + '"';

                        Notification.primary({
                            title: '<a href=' + url + '>Offer Sent!</a>',
                            message: '<a href=' + url + '>This item has been added to your watchlist. You\'ll be notified when the seller responds.</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });

                }

            });



        } else if(emit.posting.username === socketio.cachedUsername) { //If the currently logged in user owns the item the meeting request was placed on

            //Update owners meeting request and notify them.
            myPostsFactory.getAllUserPosts(socketio.cachedUsername).then(function (response) { //Have the owner lookup all their items they're selling and the associated questions, meeting requests, etc etc.  The owner app view updates realtime.

                var url = '"/myposts/meetings/' + emit.posting.postingId + '"';

                Notification.primary({
                    title: '<a href=' + url + '>New Offer</a>',
                    message: '<a href=' + url + '>@' + emit.username + ' has placed an offer on your item!</a>',
                    delay: 10000
                });  //Send the webtoast

            });

        } else { //update all the users who have the item in their wishlist

            favesFactory.updateFavorite(emit, function(){

                var url = '"/wishlist/meetings/' + emit.posting.postingId + '"';

                Notification.primary({
                    title: '<a href=' + url + '>'+  emit.posting.heading +' may go fast!</a>',
                    message: '<a href=' + url + '>Just letting you know other people are interested in an item you\'re watching. *wink *wink</a>',
                    delay: 10000
                });  //Send the webtoast

            });

        }

        console.log(
            '%s has placed an offer %s regarding postingId: "%s"',
            emit.username,
            emit.proposals,
            emit.posting.postingId
        );
    });




    // listen for meeting requests
    socketio.postingSocket.on('update-offer', function (emit) {

        console.log('emitted update-offer request', emit);

        if(!emit.offer.proposals[emit.offer.proposals.length - 1].acceptedAt) {

            //TODO: Need the offer object to include the sellers username
            if (emit.username === socketio.cachedUsername) { //If currently logged in user is the user who caused the emit then inform them the their meeting request is sent

                favesFactory.checkFave(emit.posting, function (favorited) {

                    if (favorited) { //The user sending the meeting request already has the item in their watchlist

                        if (emit.offer.proposals[emit.offer.proposals.length - 1].isOwnerReply) {

                            favesFactory.updateFavorite(emit, function () {

                                var url = '"/watchlist/meetings/' + emit.posting.postingId + '"';

                                Notification.primary({
                                    title: '<a href=' + url + '>Counter Offer Received</a>',
                                    message: '<a href=' + url + '>The seller has responded with a counter offer</a>',
                                    delay: 10000
                                });  //Send the webtoast

                            });

                        } else {

                            favesFactory.updateFavorite(emit, function () {

                                var url = '"/watchlist/meetings/' + emit.posting.postingId + '"';

                                Notification.primary({
                                    title: '<a href=' + url + '>Counter Offer Sent!</a>',
                                    message: '<a href=' + url + '>This watchlist item has been updated. You\'ll be notified when the seller responds.</a>',
                                    delay: 10000
                                });  //Send the webtoast

                            });
                        }

                    } else { //The user sending the meeting request does not have this item in their watchlist.

                        favesFactory.addFave(emit.posting, function () {

                            var url = '"/watchlist/meetings/' + emit.posting.postingId + '"';

                            Notification.primary({
                                title: '<a href=' + url + '>Counter Offer Sent!</a>',
                                message: '<a href=' + url + '>This item has been added to your watchlist. You\'ll be notified when the seller responds.</a>',
                                delay: 10000
                            });  //Send the webtoast

                        });

                    }

                });


            } else if (emit.posting.username === socketio.cachedUsername) { //If the currently logged in user owns the item the meeting request was placed on


                if (emit.offer.proposals[emit.offer.proposals.length - 1].isOwnerReply) {

                    //Update owners meeting request and notify them.
                    myPostsFactory.getAllUserPosts(socketio.cachedUsername).then(function (response) { //Have the owner lookup all their items they're selling and the associated questions, meeting requests, etc etc.  The owner app view updates realtime.

                        var url = '"/myposts/meetings/' + emit.posting.postingId + '"';

                        Notification.primary({
                            title: '<a href=' + url + '>Counter Offer Sent</a>',
                            message: '<a href=' + url + '>You\'ll be notified when the buyer responds.</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });

                } else {

                    //Update owners meeting request and notify them.
                    myPostsFactory.getAllUserPosts(socketio.cachedUsername).then(function (response) { //Have the owner lookup all their items they're selling and the associated questions, meeting requests, etc etc.  The owner app view updates realtime.

                        var url = '"/myposts/meetings/' + emit.posting.postingId + '"';

                        Notification.primary({
                            title: '<a href=' + url + '>Counter Offer Received</a>',
                            message: '<a href=' + url + '>@' + emit.username + ' has updated their offer.</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });
                }

            }

            console.log(
                '%s sent a counter offer %s regarding postingId: "%s"',
                emit.username,
                emit.proposals,
                emit.posting.postingId
            );
        }
    });




    // listen for questions
    socketio.postingSocket.on('question', function (emit) {

        console.log('emitted question', emit);

        if(emit.username === socketio.cachedUsername) { //If currently logged in user is the user who caused the emit then inform them their message will be sent


            favesFactory.checkFave(emit.posting, function (favorited) {

                if(favorited){ //This user asking the question already has the item in their watchlist

                    favesFactory.updateFavorite(emit, function(){

                        var url = '"/watchlist/questions/' + emit.posting.postingId + '"';

                        Notification.primary({
                            title: '<a href=' + url + '>Question Sent!</a>',
                            message: '<a href=' + url + '>This watchlist item has been updated. You\'ll be notified when the seller responds.</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });

                } else { //The user asking the question does not have this item in their watchlist.

                    favesFactory.addFave(emit.posting, function(){

                        var url = '"/watchlist/questions/' + emit.posting.postingId + '"';

                        Notification.primary({
                            title: '<a href=' + url + '>Question Sent!</a>',
                            message: '<a href=' + url + '>This item has been added to your watchlist. You\'ll be notified when the seller responds.</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });

                }

            });


        } else if (emit.posting.username === socketio.cachedUsername) { //if currently logged in users owns the posting the emitted question relates to

            //Update owners questions and notify them
            myPostsFactory.getAllUserPosts(socketio.cachedUsername).then(function (response) { //Have the owner lookup all their items they're selling and the associated questions, meeting requests, etc etc.  The owner app view updates realtime.

                var url = '"/myposts/questions/' + emit.question.postingId + '"';

                Notification.primary({
                    title: '<a href=' + url + '>New Question</a>',
                    message: '<a href=' + url + '>' + emit.question.value + '</a>',
                    delay: 10000
                });  //Send the webtoast

            });


        } else {  //This user is ALSO watching the same item but did not ask the question itself and does the own the item they are watching.. THEREFORE, silently update their watchlist.

            favesFactory.updateFavorite(emit, function(){
                console.log('silently updated watchlist');
            });
        }

        console.log(
            '%s asked a question on postingId %s : "%s"',
            emit.question.username,
            emit.posting.postingId,
            emit.question.value
        );
    });


    // listen for answers
    socketio.postingSocket.on('answer', function (emit) {

        console.log('emitted answer', emit);

        //TODO: Updates qaFactory.questions.store which causes splash to update.

        if(emit.username === socketio.cachedUsername){ //If the user who asked this question is logged in then notify them


            favesFactory.updateFavorite(emit, function(){

                var url =  '"/watchlist/questions/' + emit.posting.postingId + '"';
                Notification.primary({title: '<a href=' + url + '>Question has been answered</a>', message: '<a href=' + url + '>' + emit.answer.value + '</a>', delay: 10000});  //Send the webtoast

            });

        } else if (emit.username !== emit.posting.username){ //if the owner of the posting is not the same person who asked the question (aka all the other people with this item in their watchlist). then update.

            favesFactory.updateFavorite(emit, function(){

            });
        }

        console.log(
            '%s answered a question on postingId %s : "%s"',
            emit.posting.username,
            emit.posting.postingId,
            emit.answer.value
        );

    });


    socketio.postingSocket.on('accept-offer', function (emit) {
        console.log('emitted meeting acceptance', emit);


        if(emit.offer.proposals[emit.offer.proposals.length - 1].isOwnerReply) {

            if (emit.username === socketio.cachedUsername) { //if currently logged in same user who placed the accepted meeting request

                favesFactory.updateFavorite(emit, function () {
                    console.log('silently updated watchlist');
                });

                //TODO: open posting in splash screen.
                var url = '"/watchlist/meetings/' + emit.posting.postingId + '"';

                Notification.primary({
                    title: '<a href=' + url + '>@' + emit.posting.username + ' accepted your offer.</a>',
                    message: '<a href=' + url + '>Congrats! The seller has accepted your offer.  We\'ll send you a reminder email your way.</a>',
                    delay: 10000
                });  //Send the webtoast

            } else if (emit.username !== emit.posting.username) { //if the owner of the posting is not the same person who accepted the offer then update.

                //Update owners my posts and notify them
                myPostsFactory.getAllUserPosts(socketio.cachedUsername).then(function (response) { //Have the owner lookup all their items they're selling and the associated questions, meeting requests, etc etc.  The owner app view updates realtime.


                });

            }
            console.log(
                'OWNER accepted meeting request on postingId %s',
                emit.posting.username,
                emit.posting.postingId
            );

        } else {

            if (emit.username === socketio.cachedUsername) { //if currently logged in same user who placed the accepted meeting request

                favesFactory.updateFavorite(emit, function () {
                    console.log('silently updated watchlist');
                });

                //TODO: open posting in splash screen.
                //var url = '"/watchlist/meetings/' + emit.posting.postingId + '"';
                //
                //Notification.primary({
                //    title: '<a href=' + url + '>@' + emit.posting.username + ' accepted your offer.</a>',
                //    message: '<a href=' + url + '>Congrats! Your meeting request has been accepted.  We\'ll send you a reminder email you way.</a>',
                //    delay: 10000
                //});  //Send the webtoast

                //alert("I'm the buyer");

            } else if (emit.username !== emit.posting.username) { //if the owner of the posting is not the same person who accepted the offer then update.

                //Update owners my posts and notify them
                myPostsFactory.getAllUserPosts(socketio.cachedUsername).then(function (response) { //Have the owner lookup all their items they're selling and the associated questions, meeting requests, etc etc.  The owner app view updates realtime.

                    var url = '"/myposts/meetings/' + emit.posting.postingId + '"';

                    Notification.primary({
                        title: '<a href=' + url + '>@' + emit.username + ' accepted your offer.</a>',
                        message: '<a href=' + url + '>Congrats! The buyer has accepted your offer.  We\'ll send you a reminder email your way.</a>',
                        delay: 10000
                    });  //Send the webtoast

                });

                //alert("I'm the owner");

            }
            console.log(
                'OWNER accepted meeting request on postingId %s',
                emit.posting.username,
                emit.posting.postingId
            );
        }

    });


    socketio.postingSocket.on('decline-offer', function (emit) {

        if(emit.username === socketio.cachedUsername) { //If currently logged in user is the user who caused the emit then inform them the their meeting request is sent

            favesFactory.checkFave(emit.posting, function (favorited) {

                if(favorited){ //The user sending the meeting request already has the item in their watchlist

                    favesFactory.updateFavorite(emit, function(){

                        var url = '"/watchlist/meetings/' + emit.posting.postingId + '"';

                        Notification.primary({
                            title: '<a href=' + url + '>Offer Cancelled!</a>',
                            message: '<a href=' + url + '>The seller has been notified</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });

                }

            });



        } else if(emit.posting.username === socketio.cachedUsername) { //If the currently logged in user owns the item the meeting request was placed on

            //Update owners meeting request and notify them.
            myPostsFactory.getAllUserPosts(socketio.cachedUsername).then(function (response) { //Have the owner lookup all their items they're selling and the associated questions, meeting requests, etc etc.  The owner app view updates realtime.

                var url = '"/myposts/meetings/' + emit.posting.postingId + '"';

                Notification.primary({
                    title: '<a href=' + url + '>Offer Cancelled</a>',
                    message: '<a href=' + url + '>@' + emit.username + ' Had tocancel their offer.</a>',
                    delay: 10000
                });  //Send the webtoast

            });

        } else { //update all the users who have the item in their wishlist

            favesFactory.updateFavorite(emit, function(){

            });

        }

        console.log(
            '%s cancelled %s regarding postingId: "%s"',
            emit.username,
            emit.proposals,
            emit.posting.postingId
        );
    });


    socketio.postingSocket.on('delete-question', function (emit) {

        if(emit.username === socketio.cachedUsername) { //If currently logged in user is the user who caused the emit then inform them their message will be sent


            favesFactory.checkFave(emit.posting, function (favorited) {

                if(favorited){ //This user asking the question already has the item in their watchlist

                    favesFactory.updateFavorite(emit, function(){

                    });

                }

            });


        } else if (emit.posting.username === socketio.cachedUsername) { //if currently logged in users owns the posting the emitted question relates to

            //Update owners questions and notify them
            myPostsFactory.getAllUserPosts(socketio.cachedUsername).then(function (response) { //Have the owner lookup all their items they're selling and the associated questions, meeting requests, etc etc.  The owner app view updates realtime.

            });


        } else {  //This user is ALSO watching the same item but did not ask the question itself and does the own the item they are watching.. THEREFORE, silently update their watchlist.

            favesFactory.updateFavorite(emit, function(){
                console.log('silently updated watchlist');
            });
        }

    });


    socketio.postingSocket.on('posting', function (emit) {
        feedFactory.updateFeed(emit);
    });


    // capture any hiccups in the connection and re-init as needed
    socketio.userSocket.on('reconnect', socketio.init);
    socketio.postingSocket.on('reconnect', socketio.init);



    socketio.init = function (username) { //called by main.controller.js
        if(username) {
            socketio.cachedUsername = username;

            var userRoomToJoin = username;
            var visitor = username;

            socketio.joinUserRoom(userRoomToJoin, visitor);
        }
    };


    return socketio;
}]);
/**
 * Created by braddavis on 11/15/14.
 */
htsApp.controller('splashController', ['$scope', '$rootScope', '$modal', '$state', 'splashFactory', 'metaFactory', function ($scope, $rootScope, $modal, $state, splashFactory, metaFactory) {

    var metaCache = angular.copy(metaFactory.metatags);
    console.log(metaCache);

    var splashInstanceCtrl = ['$scope', '$filter', 'sideNavFactory', 'uiGmapGoogleMapApi', 'favesFactory', 'qaFactory', 'transactionFactory', 'Session', 'socketio', 'authModalFactory', function ($scope, $filter, sideNavFactory, uiGmapGoogleMapApi, favesFactory, qaFactory, transactionFactory, Session, socketio, authModalFactory) {

        $scope.userObj = Session.userObj;
        $scope.result = splashFactory.result;

        console.log($scope.result);


        function strip(html){
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }

        if($scope.result.heading) {
            metaFactory.metatags.page.title = $scope.result.heading;
            metaFactory.metatags.facebook.title = $scope.result.heading;
            metaFactory.metatags.twitter.title = $scope.result.heading;
        }

        if($scope.result.body) {
            var plainTextBody = strip($scope.result.body);
            metaFactory.metatags.page.description = plainTextBody;
            metaFactory.metatags.facebook.description = plainTextBody;
            metaFactory.metatags.twitter.description = plainTextBody;
        }

        if($scope.result.images.length) {
            metaFactory.metatags.facebook.image = $scope.result.images[0].full || $scope.result.images[0].thumb || $scope.result.images[0].images;
            metaFactory.metatags.twitter.image = $scope.result.images[0].full || $scope.result.images[0].thumb || $scope.result.images[0].images;
        }


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
                $state.go('signup', {redirect: $rootScope.currentState});
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

        $scope.qamodule = {
            question: ''
        };

        $scope.submitQuestion = function(question) {

            var loggedIn = $scope.userObj.user_settings.loggedIn;

            if (loggedIn) {

                var post = $scope.result;
                var username = $scope.userObj.user_settings.name;

                socketio.joinPostingRoom(post.postingId, 'inWatchList', function(){

                    qaFactory.submitQuestion(question, post, username).then(function (response) {

                        console.log(response);

                        $scope.qamodule.question = '';

                    }, function (err) {
                        console.log(err);
                    });

                });

            } else {
                $state.go('signup', {redirect: $rootScope.currentState});
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
            transactionFactory.proposeDeal(result);
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
            templateUrl: "js/splash/partials/splash_content.html",
            windowTemplateUrl: "js/splash/partials/splash_window.html",
            controller: splashInstanceCtrl
        });


        splashInstance.result.then(function (selectedItem) {
            //console.log(selectedItem);
        }, function (direct) {
            if(!direct) {
                //alert('not direct');
                $state.go('^');
            }
        });


        //Hack this closes splash modal when user clicks back button https://github.com/angular-ui/bootstrap/issues/335
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

            metaFactory.metatags.page = metaCache.page;
            metaFactory.metatags.facebook = metaCache.facebook;
            metaFactory.metatags.twitter = metaCache.twitter;

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
        controller : ['$scope', '$element', function ($scope, $element) {

            //console.log(scope.result.images[0]);

            if($scope.result.external.source.code === 'HSHTG') {

                var username = $scope.result.username;

                splashFactory.getUserProfile(username).then(function (response) {

                    if (response.status !== 200) {

                        var error = response.data.error;
                        console.log(error);

                    } else if (response.status === 200) {

                        var sellerProfileDetails = response.data.user;

                        $scope.result.user = sellerProfileDetails;

                        var bannerElement = angular.element($element[0].querySelector('.profile'));
                        bannerElement.css({
                            'background-image': "url(" + sellerProfileDetails.banner_photo + ")",
                            'background-size': "cover"
                        });

                        var profilePhotoElement = angular.element($element[0].querySelector('.bs-profile-image'));
                        profilePhotoElement.css({
                            'background-image': "url(" + sellerProfileDetails.profile_photo + ")",
                            'background-size': "cover"
                        });

                        var username = angular.element($element[0].querySelector('.splash-bs-username'));
                        username.html('@' + sellerProfileDetails.name);
                    }
                }, function (response) {

                    console.log(response);

                    //TODO: Use modal service to notify users

                });
            } else {

                var bannerElement = angular.element($element[0].querySelector('.profile'));

                if ($scope.result.images.length) {

                    var photoIndex = $scope.result.images.length - 1;
                    var lastImage = $scope.result.images[photoIndex].thumb || $scope.result.images[photoIndex].images || $scope.result.images[photoIndex].full;

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

                var usernamePlaceholder = angular.element($element[0].querySelector('.splash-bs-username'));
                var sourceIcon = angular.element($element[0].querySelector('.bs-profile-image'));
                if ($scope.result.external.source.code === "APSTD") {

                    sourceIcon.css({
                        'background-image': "url(https://static.hashtagsell.com/logos/marketplaces/apartments_com_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@apartments.com');

                } else if ($scope.result.external.source.code === "AUTOD") {

                    sourceIcon.css({
                        'background-image': "url(https://static.hashtagsell.com/logos/marketplaces/autotrader_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@autotrader.com');

                } else if ($scope.result.external.source.code === "BKPGE") {

                    sourceIcon.css({
                        'background-image': "url(https://static.hashtagsell.com/logos/marketplaces/backpage_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@backpage.com');

                } else if ($scope.result.external.source.code === "CRAIG") {

                    sourceIcon.css({
                        'background-image': "url(https://static.hashtagsell.com/logos/marketplaces/craigslist_splash_v2.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@craigslist.com');

                } else if ($scope.result.external.source.code === "EBAYM") {

                    sourceIcon.css({
                        'background-image': "url(https://static.hashtagsell.com/logos/marketplaces/ebay_motors_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@ebaymotors.com');

                } else if ($scope.result.external.source.code === "E_BAY") {

                    sourceIcon.css({
                        'background-image': "url(https://static.hashtagsell.com/logos/marketplaces/ebay_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@ebay.com');
                }

            }
        }]
    };
}]);
/**
 * Created by braddavis on 11/15/14.
 */
htsApp.factory('splashFactory', ['$http', '$location', '$q', 'ENV', function ($http, $location, $q, ENV) {

    var annotationsDictionary = new Hashtable();

    //CL annotations
    annotationsDictionary.put("source_neighborhood","Neighborhood");
    annotationsDictionary.put("year","Year");
    annotationsDictionary.put("condition","Condition");
    annotationsDictionary.put("make","Make");
    annotationsDictionary.put("title_status","Title");
    annotationsDictionary.put("model","Model");
    annotationsDictionary.put("mileage","Mileage");
    annotationsDictionary.put("transmission","Transmission");
    annotationsDictionary.put("drive","Drive");
    annotationsDictionary.put("paint_color","Paint");
    annotationsDictionary.put("type","Type");
    annotationsDictionary.put("fuel","Fuel");
    annotationsDictionary.put("size","Size");
    annotationsDictionary.put("bathrooms","Bath");
    annotationsDictionary.put("available","Available");
    annotationsDictionary.put("no_smoking","Smoking");
    annotationsDictionary.put("bedrooms","Rooms");
    annotationsDictionary.put("dogs","Dogs");
    annotationsDictionary.put("cats","Cats");
    annotationsDictionary.put("attached_garage","Garage");
    annotationsDictionary.put("laundry_on_site","Laundry");
    annotationsDictionary.put("sqft","Sq Ft");
    annotationsDictionary.put("size_dimensions","Dimensions");


    //TODO: Remove after svnt
    //annotationsDictionary.put("Hard Drive (Gb)","Hard Drive");
    //annotationsDictionary.put("Memory (Gb)","Memory");
    //annotationsDictionary.put("Screen (inches)","Screen");
    //annotationsDictionary.put("Warranty","Warranty");


    //ebay annotations
    //annotationsDictionary.put("listingtype","Listing Type");

    //ebay motors annotations
    annotationsDictionary.put("body_type","Body Type");
    annotationsDictionary.put("drive_type","Drive Type");
    annotationsDictionary.put("engine","Engine");
    annotationsDictionary.put("exterior_color","Exterior Color");
    annotationsDictionary.put("for_sale_by","Seller Type");
    annotationsDictionary.put("interior_color","Interior Color");
    annotationsDictionary.put("fuel_type","Fuel Type");
    annotationsDictionary.put("listing_type","Listing Type");
    annotationsDictionary.put("number_of_cylinders","Cylinders");
    annotationsDictionary.put("options","Options");
    annotationsDictionary.put("power_options","Power Options");
    annotationsDictionary.put("safety_features","Safety");
    annotationsDictionary.put("ship_to_location","Ship To");
    annotationsDictionary.put("trim","Trim");
    annotationsDictionary.put("vehicle_title","Title");
    annotationsDictionary.put("vin","Vin");
    annotationsDictionary.put("warranty","Warranty");

    //autotrader annotations
    annotationsDictionary.put("bodyStyle","Body Type");
    annotationsDictionary.put("drivetrain","Drive Train");
    annotationsDictionary.put("exteriorColor","Exterior Color");
    annotationsDictionary.put("interiorColor","Interior Color");
    annotationsDictionary.put("seller","Seller Type");

    //amazon annotations
    annotationsDictionary.put("Year", "Year");
    annotationsDictionary.put("Color", "Color");
    annotationsDictionary.put("Brand", "Brand");
    annotationsDictionary.put("Material Type", "Material Type");
    annotationsDictionary.put("Model", "Model");
    //annotationsDictionary.put("Part Number", "Part Number");
    annotationsDictionary.put("Warranty", "Warranty");
    annotationsDictionary.put("CPU Speed", "Processor Speed");
    annotationsDictionary.put("CPU Type", "Processor Type");
    annotationsDictionary.put("Display Size", "Screen Size");
    annotationsDictionary.put("Operating System", "OS Version");
    //annotationsDictionary.put("Size", "Storage Capacity");
    annotationsDictionary.put("System Memory Size", "Memory");
    annotationsDictionary.put("Department", "Department");

    var factory = {};

    factory.sanitizeAnnotations = function (annoationsObj) {

        var sanitizedAnnotationsObj = {};
        //console.log(annoationsObj);
        angular.forEach(annoationsObj, function(value, key) {

            if(typeof key === 'string') {
                console.log('we are om jere');
                var validatedKey = annotationsDictionary.get(key);

                if (validatedKey) {
                    sanitizedAnnotationsObj[validatedKey] = value;
                }
            } else {  //TODO: Fix me, HSHTG items format annotation differently
                console.log('hashtag annotaion', value);

                var hshtgAnnotation = value;

                if(hshtgAnnotation.value) {

                    var hshtgvalidatedKey = annotationsDictionary.get(hshtgAnnotation.key);

                    if (hshtgvalidatedKey) {

                        sanitizedAnnotationsObj[hshtgvalidatedKey] = hshtgAnnotation.value;

                    }
                }

            }


        });

        return sanitizedAnnotationsObj;
    };


    factory.getUserProfile = function (username) {

        var deferred = $q.defer();

        var url = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/getprofile?username=" + username;

        $http({method: 'GET', url: url}).
            then(function (response, status, headers, config) {

                deferred.resolve(response);

            }, function (response, status, headers, config) {

                deferred.reject(response);
            });

        return deferred.promise;

    };


    factory.lookupItemDetails = function (postingId) {

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: ENV.postingAPI + postingId
        }).then(function (response, status, headers, config) {

                deferred.resolve(response);

            }, function (response, status, headers, config) {

                deferred.reject(response);
            });

        return deferred.promise;
    };

    return factory;
}]);
/**
 * Created by braddavis on 5/24/15.
 */
htsApp.factory('subMerchantFactory', ['$q', '$http', '$modal', '$log', 'ENV', 'Session', function ($q, $http, $modal, $log, ENV, Session) {

    var factory = {};

    factory.validateSubMerchant = function (newPost) {

        var deferred = $q.defer();

        var merchantAccount = Session.getSessionValue('merchantAccount');

        console.log('here is merchant account info', merchantAccount);

        if(merchantAccount.response.status === 'active' || merchantAccount.response.status === 'pending') {

            deferred.resolve(merchantAccount);

        } else { //Sub-merchant account is not active .. open modal and get sub-merchant details.

            var modalInstance = $modal.open({
                templateUrl: 'js/submerchant/modals/partials/submerchant.modal.partial.html',
                controller: ['$scope', '$modalInstance', 'modalConfirmationService', function ($scope, $modalInstance, modalConfirmationService) {
                    $scope.close = function () {
                        var modalOptions = {
                            closeButtonText: 'Connect my Venmo',
                            actionButtonText: 'I only accept cash',
                            headerText: 'Accept Cash Only?',
                            bodyText: 'HashtagSell uses Venmo for free online transactions. To accept Venmo payments you need to set up an account.'
                        };

                        modalConfirmationService.showModal({}, modalOptions).then(function (result) {
                            $modalInstance.dismiss('abortSubMerchantModal');
                        });
                    };
                }]
            });

            modalInstance.result.then(function (reason, subMerchantResponse) {

            }, function (reason, subMerchantResponse) {
                if(reason === "subMerchantModalSuccess") {
                    console.log('successful merchant setup.  here is response', subMerchantResponse);
                    deferred.resolve(subMerchantResponse);
                } else if (reason === "abortSubMerchantModal"){
                    console.log('use clicked close button');
                    deferred.reject();
                }
                $log.info('Modal dismissed at: ' + new Date());
            });


        }

        return deferred.promise;
    };



    factory.registerPostForOnlinePayment = function (newPost) {

        var deferred = $q.defer();



        return deferred.promise;

    };


    return factory;

}]);
/**
 * Created by braddavis on 1/3/15.
 */
htsApp.directive('transactionButtons', function () {
    return {
        restrict: 'E',
        scope: {
            result: '='
        },
        templateUrl: 'js/transactionButtons/partials/transactionButtons.partial.html',
        controller: ['$scope', 'transactionFactory', function ($scope, transactionFactory) {

            $scope.quickCompose = function () {
                transactionFactory.quickCompose($scope.result);
            };


            $scope.displayPhone = function () {
                transactionFactory.displayPhone($scope.result);
            };

            //CL item does not have phone and email so we open splash detailed view.
            $scope.openSplash = function () {
                transactionFactory.openSplash($scope.result);
            };


            //Ebay item.  Button links to item on ebay
            $scope.placeBid = function () {
                transactionFactory.placeBid($scope.result);
            };


            //HTS item.  Gathers date and time to propose for pickup.
            $scope.placeOffer = function () {
                transactionFactory.placeOffer($scope.result);
            };

        }]
    };
});
/**
 * Created by braddavis on 1/10/15.
 */
htsApp.factory('transactionFactory', ['Session', '$modal', '$rootScope', '$log', '$state', 'authModalFactory', 'quickComposeFactory', 'splashFactory', '$window', '$http', '$q', 'ENV', function (Session, $modal, $rootScope, $log, $state, authModalFactory, quickComposeFactory, splashFactory, $window, $http, $q, ENV) {

    var transactionFactory = {};

    //transactionFactory.quickCompose = function (result) {
    //    console.log('item we clicked on', result);
    //
    //    if (!Session.userObj.user_settings.loggedIn) {
    //
    //        $state.go('signup', {redirect: $rootScope.currentState});
    //
    //    } else {
    //
    //        if (Session.userObj.user_settings.email_provider[0].value === "ask") {  //If user needs to pick their email provider
    //
    //            var modalInstance = $modal.open({
    //                templateUrl: 'js/transactionButtons/modals/email/partials/transactionButtons.modal.email.partial.html',
    //                controller: 'quickComposeController',
    //                resolve: {
    //                    result: function () {
    //                        return result;
    //                    }
    //                }
    //            });
    //
    //            modalInstance.result.then(function (reason) {
    //
    //            }, function (reason) {
    //                console.log(reason);
    //                if (reason === "signUp") {
    //                    authModalFactory.signUpModal();
    //                }
    //                $log.info('Modal dismissed at: ' + new Date());
    //            });
    //
    //        } else {  //User already set their default email provider
    //
    //            quickComposeFactory.generateMailTo(Session.userObj.user_settings.email_provider[0].value, result);
    //
    //        }
    //    }
    //
    //};
    //
    //
    //transactionFactory.displayPhone = function (result) {
    //
    //    if (!Session.userObj.user_settings.loggedIn) {
    //
    //        $state.go('signup', {redirect: $rootScope.currentState});
    //
    //    } else {
    //
    //        var modalInstance = $modal.open({
    //            templateUrl: 'js/transactionButtons/modals/phone/partials/transactionButtons.modal.phone.partial.html',
    //            controller: 'phoneModalController',
    //            resolve: {
    //                result: function () {
    //                    return result;
    //                }
    //            }
    //        });
    //
    //        modalInstance.result.then(function (reason) {
    //
    //        }, function (reason) {
    //            console.log(reason);
    //            if (reason === "signUp") {
    //                authModalFactory.signUpModal();
    //            }
    //            $log.info('Modal dismissed at: ' + new Date());
    //        });
    //    }
    //
    //};
    //
    ////CL item does not have phone and email so we open splash detailed view.
    //transactionFactory.openSplash = function (result) {
    //    splashFactory.result = result;
    //    $state.go('results.splash', {id: result.external.source.url});
    //};
    //
    //
    ////Ebay item.  Button links to item on ebay
    //transactionFactory.placeBid = function (result) {
    //
    //    if (!Session.userObj.user_settings.loggedIn) {
    //
    //        $state.go('signup', {redirect: $rootScope.currentState});
    //
    //    } else {
    //
    //        $window.open(result.external.source.url);
    //    }
    //};


    transactionFactory.showOriginal = function (result) {

        if (!Session.userObj.user_settings.loggedIn) {

            $state.go('signup', {redirect: $rootScope.currentState});

        } else {

            $window.open(result.external.source.url);
        }

    };


    //HTS item.  Gathers date and time to propose for pickup.
    transactionFactory.placeOffer = function (result) {
        if(Session.userObj.user_settings.loggedIn) {  //If user logged In

            var modalInstance = $modal.open({
                templateUrl: 'js/transactionButtons/modals/placeOffer/partials/transactionButtons.modal.placeOffer.partial.html',
                controller: 'placeOfferController',
                resolve: {
                    result: function () {
                        return result;
                    }
                }
            });

            modalInstance.result.then(function (reason) {

            }, function (reason) {
                console.log(reason);
                if (reason === "signUp") {
                    authModalFactory.signUpModal();
                }
                $log.info('Modal dismissed at: ' + new Date());
            });

        } else {  //User is not logged in.

            $state.go('signup', {redirect: $rootScope.currentState});

        }
    };


    //HTS item.  Gathers price and location to propose for pickup.
    transactionFactory.proposeDeal = function (result, offerIndex) {
        if(Session.userObj.user_settings.loggedIn) {  //If user logged In

            var modalInstance = $modal.open({
                templateUrl: 'js/transactionButtons/modals/proposeDeal/partials/transactionButtons.modal.proposeDeal.partial.html',
                controller: 'proposeDealController',
                resolve: {
                    result: function () {
                        return result;
                    },
                    offerIndex: function () {
                        return offerIndex;
                    }
                }
            });

            modalInstance.result.then(function (reason) {

            }, function (reason) {
                console.log(reason);
                if (reason === "signUp") {
                    authModalFactory.signUpModal();
                }
                $log.info('Modal dismissed at: ' + new Date());
            });

        } else {  //User is not logged in.

            $state.go('signup', {redirect: $rootScope.currentState});

        }
    };



    transactionFactory.buyNow = function(result) {

        if(!Session.userObj.user_settings.loggedIn) {

            $state.go('signup', {redirect: $rootScope.currentState});

        } else {

            var modalInstance = $modal.open({
                templateUrl: 'js/transactionButtons/modals/buyNow/partials/transactionButtons.modal.buyNow.partial.html',
                controller: 'buyNowModalController',
                resolve: {
                    result: function () {
                        return result;
                    }
                }
            });

            modalInstance.result.then(function (reason) {

            }, function (reason) {
                console.log(reason);
                if(reason === 'venmo'){

                    var venmoUrl = "https://venmo.com/?txn=pay&recipients=" + result.user.merchantAccount.details.funding.email + "&amount=" + result.askingPrice.value + "&note=" + result.heading + "&audience=private";
                    $window.open(venmoUrl);

                } else if (reason === 'meetingRequest') {

                    console.log('closing modal');

                    //transactionFactory.placeOffer(result);
                    transactionFactory.proposeDeal(result);

                }
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
    };



    transactionFactory.createTransaction = function (newTransactionRequirements) {

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ENV.transactionsAPI,
            data: newTransactionRequirements
        }).then(function (response, status, headers, config) {

            deferred.resolve(response);


        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;

    };

    return transactionFactory;
}]);
/**
 * Created by braddavis on 1/4/15.
 */
htsApp.controller('buyNowModalController', ['$scope', '$modalInstance', 'result', function ($scope, $modalInstance, result) {

    $scope.result = result;

    $scope.yes = function() {
        $modalInstance.dismiss('venmo');
    };

    $scope.no = function() {
        $modalInstance.dismiss('meetingRequest');
    };

    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);
htsApp.controller('quickComposeController', ['$scope', '$modalInstance', 'quickComposeFactory', 'Session', '$window', 'result', function ($scope, $modalInstance, quickComposeFactory, Session, $window, result) {

    $scope.userObj = Session.userObj;

    $scope.emailOptionsObject = [
        {name : "Use Default Mail Client", value : "mailto"},
        {name : "Gmail", value : "gmail"},
        {name : "Yahoo", value : "yahoo"},
        {name : "Hotmail", value : "hotmail"},
        {name : "AOL", value : "aol"}
    ];

    $scope.selected = "mailto";

    $scope.qcEmail = function () {

        if($scope.setDefaultEmailProvider){ //User requested we save their setting as default email provider
            quickComposeFactory.setDefaultEmailProvider($scope.selected);
        }


        quickComposeFactory.generateMailTo($scope.selected, result);


        $modalInstance.dismiss("auto-compose complete");
    };


    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);



htsApp.factory('quickComposeFactory', ['Session', '$window', function(Session, $window) {

    var newQuickCompose = {};

    //Open pre-filled out compose message window
    newQuickCompose.generateMailTo = function (provider, result) {

        var mailLink = "";

        if(!result.length) { //If only one result then append to TO: field.

            switch (provider) {
                case "gmail":
                    mailLink = "https://mail.google.com/mail/?view=cm&fs=1&to=" + result.annotations.source_account + "&su=" + result.heading + "&body=" + result.external.source.url;
                    $window.open(mailLink);
                    break;
                case "yahoo":
                    mailLink = "http://compose.mail.yahoo.com/?to=" + result.annotations.source_account + "&subject=" + result.heading + "&body=" + result.external.source.url;
                    $window.open(mailLink);
                    break;
                case "hotmail":
                    mailLink = "https://mail.live.com/default.aspx?rru=compose&to=" + result.annotations.source_account + "&subject=" + result.heading + "&body=" + result.external.source.url;
                    $window.open(mailLink);
                    break;
                case "aol":
                    mailLink = "http://mail.aol.com/mail/compose-message.aspx?to=" + result.annotations.source_account + "&subject=" + result.heading + "&body=" + result.external.source.url;
                    $window.open(mailLink);
                    break;
                case "mailto":
                    mailLink = 'mailto:' + result.annotations.source_account + '?Subject=' + result.heading + '&body=' + result.external.source.url;
                    $window.open(mailLink);
                    break;
            }

        } else { //If multiple results then add comma delimited string to bcc field

            var bccString = "";

            for(i=0; i<result.length; i++) {
                if(result[i].annotations.source_account){
                    bccString += result[i].annotations.source_account+',';
                }
            }

            switch(provider){
                case "gmail":
                    mailLink = "https://mail.google.com/mail/?view=cm&fs=1&bcc="+bccString+"&su="+"I'd like to buy your item..."+"&body="+"HashtagSell.com - Re-thinking Online Classifieds";
                    $window.open(mailLink);
                    break;
                case "yahoo":
                    mailLink = "http://compose.mail.yahoo.com/?bcc="+bccString+"&subject="+"I'd like to buy your item..."+"&body="+"HashtagSell.com - Re-thinking Online Classifieds";
                    $window.open(mailLink);
                    break;
                case "hotmail":
                    mailLink = "https://mail.live.com/default.aspx?rru=compose&bcc="+bccString+"&subject="+"I'd like to buy your item..."+"&body="+"HashtagSell.com - Re-thinking Online Classifieds";
                    $window.open(mailLink);
                    break;
                case "aol":
                    mailLink = "http://mail.aol.com/mail/compose-message.aspx?bcc="+bccString+"&subject="+"I'd like to buy your item..."+"&body="+"HashtagSell.com - Re-thinking Online Classifieds";
                    $window.open(mailLink);
                    break;
                case "mailto":
                    mailLink = 'mailto:?bcc='+bccString+'&subject='+"I'd like to buy your item..."+'&body='+"HashtagSell.com - Re-thinking Online Classifieds";
                    $window.open(mailLink);
                    break;
            }
        }
    };



    //Saves the user email provider selection as default
    newQuickCompose.setDefaultEmailProvider = function(selectedProvider){

        var defaultEmail;

        switch (selectedProvider) {
            case 'ask':
                defaultEmail =  [{name : "Always Ask", value: "ask"}];
                break;
            case 'gmail':
                defaultEmail =  [{name : "Gmail", value : "gmail"}];
                break;
            case 'yahoo':
                defaultEmail =  [{name : "Yahoo", value : "yahoo"}];
                break;
            case 'hotmail':
                defaultEmail =  [{name : "Hotmail", value : "hotmail"}];
                break;
            case 'aol':
                defaultEmail =  [{name : "AOL", value : "aol"}];
                break;
            case 'mailto':
                defaultEmail =  [{name : "Use Default Mail Client", value : "mailto"}];
                break;
        }


        Session.setSessionValue("email_provider", defaultEmail, function () {
            console.log('default email updated');
        });
    };


    return newQuickCompose;
}]);
/**
 * Created by braddavis on 1/4/15.
 */
htsApp.controller('phoneModalController', ['$scope', '$modalInstance', 'Session', 'result', function ($scope, $modalInstance, Session, result) {

    $scope.userObj = Session.userObj;

    $scope.result = result;

    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);
/**
 * Created by braddavis on 1/4/15.
 */
htsApp.controller('placeOfferController', ['$scope', '$modalInstance', 'Session', 'result', 'ENV', '$filter', 'meetingsFactory', 'favesFactory', 'socketio', function ($scope, $modalInstance, Session, result, ENV, $filter, meetingsFactory, favesFactory, socketio) {

    //Logged in user details
    $scope.userObj = Session.userObj;

    //Item details
    $scope.result = result;

    //User must add proposal times before they are allowed to submit.
    $scope.disableSubmission = true;

    $scope.offer = {
        "proposedTimes": [],
        "username": $scope.userObj.user_settings.name
    };


    //Fired when user completes selecting time and date.
    $scope.onTimeSet = function (newDate, oldDate) {
        $scope.dropDownStatus.isOpen = false; //Closes date/time picker

        newDate = $filter('date')(newDate, "yyyy-MM-ddTHH:mm:ssZ");

        $scope.addProposedTime(newDate);

        //Clear the input field
        $scope.data.dateDropDownInput = null;

        console.log(newDate);
    };


    //Track the date/time picker dropdown status: open or closed
    $scope.dropDownStatus = {
        isOpen: false
    };


    //When offer modal is dismissed
    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

    $scope.addProposedTime = function (newDate) {
        $scope.offer.proposedTimes.push({
            'when': newDate,
            'where': result.external.threeTaps.location.formatted
        });

        $scope.disableSubmission = $scope.validateProposal();
    };

    $scope.removeProposedTime = function (index) {
        $scope.offer.proposedTimes.splice(index, 1);

        $scope.disableSubmission = $scope.validateProposal();
    };


    $scope.validateProposal = function () {
        return $scope.offer.proposedTimes.length < 1;
    };



    $scope.sendOffer = function () {

        socketio.joinPostingRoom($scope.result.postingId, 'inWatchList', function(){

            meetingsFactory.sendOffer($scope.result, $scope.offer).then(function (response) {

                $scope.dismiss("offer sent");

            }, function (err) {

                $scope.dismiss("error");

                alert(err);

            });

        }); //Join the room of each posting the user places an offer on.

    };

}]);
/**
 * Created by braddavis on 1/4/15.
 */
htsApp.controller('proposeDealController', ['$scope', '$modalInstance', '$q', 'Session', 'result', 'offerIndex', 'ENV', '$filter', 'meetingsFactory', 'favesFactory', 'socketio', 'Notification', function ($scope, $modalInstance, $q, Session, result, offerIndex, ENV, $filter, meetingsFactory, favesFactory, socketio, Notification) {

    //Logged in user details
    $scope.userObj = Session.userObj;

    //Item details
    $scope.result = result;

    //Double binded to deal box in UI
    $scope.deal = {
        item: null,
        price: null,
        location: null,
        comment: null,
        when: null,
        declinedTimes: []
    };

    //All the existing offers cached here.  New proposals are pushed onto this the proposals array then sent to server.
    $scope.offers = {
        proposals: [],
        username: null
    };

    $scope.slots = [
        {start: 300, stop: 420, day: 1},
        {start: 60, stop: 120, day: 1}
    ];

    $scope.error = {
        price: null,
        when: null,
        where: null
    };

    $scope.button = {
        text: "Send offer"
    };

    var updateOffer = false;  //POST a new offer or UPDATE an existing offer proposal


    meetingsFactory.getOffers($scope.result).then(function (response) {

        if (offerIndex === undefined) { //if we don't have the index of the offer we are updating then this is either first offer the user is sending or we need to check

            for (var i = 0; i < response.data.offers.results.length; i++) {
                var offers = response.data.offers.results[i];

                if (offers.username === $scope.userObj.user_settings.name) {

                    $scope.button.text = "Send counter offer";

                    $scope.offers = offers;

                    console.log('The logged in user has already placed and offer on this item');

                    updateOffer = true;

                    $scope.deal.item = $scope.result.heading;
                    $scope.deal.price = $scope.offers.proposals[$scope.offers.proposals.length - 1].price.value;
                    $scope.deal.location = $scope.offers.proposals[$scope.offers.proposals.length - 1].where;
                    $scope.deal.comment = $scope.offers.proposals[$scope.offers.proposals.length - 1].comment || '';
                    $scope.deal.when = $scope.offers.proposals[$scope.offers.proposals.length - 1].when;

                    break;
                }
            }

            if (!updateOffer) {

                console.log('The logged in user has NEVER placed an offer on this item.');

                $scope.deal.item = $scope.result.heading;
                $scope.deal.price = $scope.result.askingPrice.value;
                $scope.deal.location = $scope.result.external.threeTaps.location.formatted;
                $scope.deal.when = null;
            }

        } else { //Since the index of the offer is already supplied we will be pushing new proposal to this offer

            console.log('The owner of this item is supplying a counter offer.');

            $scope.button.text = "Send counter offer";

            $scope.offers = response.data.offers.results[offerIndex];

            updateOffer = true;

            $scope.deal.item = $scope.result.heading;
            $scope.deal.price = $scope.offers.proposals[$scope.offers.proposals.length - 1].price.value;
            $scope.deal.location = $scope.offers.proposals[$scope.offers.proposals.length - 1].where;
            $scope.deal.when = $scope.offers.proposals[$scope.offers.proposals.length - 1].when;

        }

    }, function (err) {

        Notification.error({
            title: "Failed to lookup offers on this post",
            message: err.message,
            delay: 10000
        });  //Send the webtoast

    });



    //When offer modal is dismissed
    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };


    $scope.counterOffer = function () {

        console.log('heres our proposal', $scope.deal);

        if(!$scope.deal.price) {
            $scope.error.price = "Please propose a price";

        } else if(!$scope.deal.when) {
            $scope.error.when = "Please propose a day and time";

        } else if(!$scope.deal.location) {
            $scope.error.where = "Please propose a meeting location";

        } else {

            if (offerIndex === undefined) { //if we don't have the index of the offer we are updating then this is either first offer the user is sending or we need to check
                socketio.joinPostingRoom($scope.result.postingId, 'inWatchList', function () {

                    $scope.offers.proposals.push({
                        "comment": $scope.deal.comment,
                        "price": {
                            "currency": $scope.result.askingPrice.currency,
                            "value": $scope.deal.price
                        },
                        "when": $scope.deal.when,
                        "where": $scope.deal.location
                    });

                    $scope.offers.username = $scope.userObj.user_settings.name;

                    if (!updateOffer) { //The logged in user has NEVER placed an offer on this item.

                        console.log('Here is the updated offer we are about to submit', $scope.offers);

                        meetingsFactory.sendOffer($scope.result, $scope.offers).then(function (response) {

                            $scope.dismiss("offer sent");

                        }, function (err) {

                            $scope.dismiss("error");

                            alert(err);

                        });

                    } else {

                        console.log('New offer we are about to submit', $scope.offers);

                        meetingsFactory.updateOffer($scope.result, $scope.offers).then(function (response) {

                            $scope.dismiss("offer sent");

                        }, function (err) {

                            $scope.dismiss("error");

                            alert(err);

                        });

                    }
                });
            } else { //Since the index of the offer is already supplied we will be pushing new proposal to this offer

                if ($scope.result.username === $scope.userObj.user_settings.name) {

                    $scope.offers.proposals.push({
                        "comment": $scope.deal.comment,
                        "isOwnerReply": true,
                        "price": {
                            "currency": $scope.result.askingPrice.currency,
                            "value": $scope.deal.price
                        },
                        "when": $scope.deal.when,
                        "where": $scope.deal.location
                    });

                    //"2015-02-03T10:00:00Z"

                    console.log('Updated offer with the owners reply', $scope.offers);

                } else {

                    $scope.offers.proposals.push({
                        "comment": $scope.deal.comment,
                        "isOwnerReply": false,
                        "price": {
                            "currency": $scope.result.askingPrice.currency,
                            "value": $scope.deal.price
                        },
                        "when": $scope.deal.when,
                        "where": $scope.deal.location
                    });

                    //"2015-02-03T10:00:00Z"

                    console.log('Updated offer with the buyers reply', $scope.offers);
                }

                meetingsFactory.updateOffer($scope.result, $scope.offers).then(function (response) {

                    $scope.dismiss("offer sent");

                }, function (err) {

                    $scope.dismiss("error");

                    alert(err);

                });
            }
        }

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



    $scope.setAddressComponents = function (placesObj){

        $scope.deal.location = placesObj.description;
        //var googleMaps = new google.maps.places.PlacesService(new google.maps.Map(document.createElement("map-canvas")));

        //capture the place_id and send to google maps for metadata about the place
        //var request = {
        //    placeId: placesObj.place_id
        //};

        //googleMaps.getDetails(request, function (placeMetaData, status) {
        //
        //    console.log(placeMetaData);
        //
        //    $scope.$apply(function () {
        //        $scope.deal.location = placeMetaData.formatted_address;
        //    });
        //
            console.log('here is our deal', $scope.deal);

            //for(var i = 0; i < placeMetaData.address_components.length; i++){
            //    var component = placeMetaData.address_components[i];
            //
            //    console.log(component);
            //
            //    for(var j = 0; j < component.types.length; j++){
            //        var componentType = component.types[j];
            //
            //        console.log($scope.subMerchant);
            //
            //        if(componentType === "locality"){
            //            $scope.subMerchant[type].address.locality = component.long_name;
            //            break;
            //        } else if(componentType === "administrative_area_level_1"){
            //            $scope.subMerchant[type].address.region = component.short_name;
            //            break;
            //        } else if(componentType === "route") {
            //            street = component.long_name;
            //            break;
            //        } else if(componentType === "postal_code") {
            //            $scope.subMerchant[type].address.postalCode = component.long_name;
            //            break;
            //        } else if(componentType === "street_number") {
            //            street_number = component.long_name;
            //            break;
            //        }
            //    }
            //}
            //
            //$scope.subMerchant[type].address.streetAddress = street_number + ' ' + street;

        //});

    };

}]);
/**
 * Created by braddavis on 10/17/14.
 */
//Controller catches the sign-in process from the sign-in modal and passes it to our authFactory
htsApp.controller('userMenu', ['$scope', 'Session', 'authModalFactory', '$modal', 'newPostFactory', function ($scope, Session, authModalFactory, $modal, newPostFactory) {

    $scope.userObj = Session.userObj;

    $scope.logout = function () {

        Session.destroy();

    };


    $scope.newPost = function () {

        var modalInstance = $modal.open({
            templateUrl: '/js/newPost/modals/newPost/partials/newpost.html',
            controller: 'newPostModal',
            size: 'lg',
            resolve: {
                mentionsFactory: function () {
                    return newPostFactory;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.modalContent.selected = selectedItem;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };


}]);
/**
 * Created by braddavis on 2/16/15.
 */

htsApp.factory('utilsFactory', ['ENV', function (ENV) {

    var factory = {};

    //Converts objects to bracket notation string.
    factory.bracketNotationURL = function (params, bracketURL, urlParts) {

        urlParts = urlParts || [];
        var index = 0;

        for (var prop in params) {

            index++;
            //console.log('index Counter: ',index);

            if(params.hasOwnProperty(prop)) {

                //console.log('prop: ', prop);
                //console.log('parms[prop]: ', params[prop]);
                //console.log('urlParts.length:', urlParts.length);
                //console.log('bracketURL Before: ', bracketURL);

                if (!bracketURL && !urlParts.length) {
                    bracketURL = '?' + prop;
                } else if (index > 1 && urlParts.length && bracketURL.indexOf('[')===-1) {
                    bracketURL = '&' + prop;
                } else if (index > 1 && urlParts.length && bracketURL.indexOf('[')!==-1) {
                    bracketURL = bracketURL.replace(/\[(.+?)\]/g, "["+prop+"]");
                } else {
                    bracketURL += '[' + prop + ']';
                }

                //console.log('bracketURL After: ', bracketURL);


                if (typeof params[prop] === "object" && params[prop] !== null && params[prop].constructor !== Array) {

                    //console.log('RECURSING!');
                    //console.log('~~~~~~~~~~~~~~~~~~~');

                    factory.bracketNotationURL(params[prop], bracketURL, urlParts);

                } else {

                    var finalBracketURL = bracketURL;

                    if(params[prop].constructor === Array) {
                        finalBracketURL += '=' + params[prop].join();
                    } else {
                        finalBracketURL += '=' + params[prop];
                    }

                    urlParts.push(finalBracketURL);

                    //console.log(urlParts);
                    //console.log('~~~~~~~~~~~~~~~~~~~');

                }
            }
        }

        return urlParts.join('');

    };


    return factory;
}]);
/**
 * Created by braddavis on 5/1/15.
 */

//Gets all the categories from groupings api
htsApp.factory('categoryFactory', ['$http', '$q', 'ENV', function ($http, $q, ENV) {
    var factory = {};

    factory.lookupCategories = function () {

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: ENV.groupingsAPI
        }).then(function (response, status, headers, config) {

            console.log('reference api response', response);

            deferred.resolve(response);

        }, function (response, status, headers, config) {

            deferred.reject(response);
        });

        return deferred.promise;
    };


    return factory;
}]);
/**
 * Created by braddavis on 4/23/15.
 */
htsApp.factory('ebayFactory', ['$q', '$http', '$window', '$rootScope', '$timeout',  '$interval', 'ENV', 'Session', 'Notification', function ($q, $http, $window, $rootScope, $timeout, $interval, ENV, Session, Notification) {

    var factory = {};


    factory.publishToEbay = function (newPost) {

        var deferred = $q.defer();

        var ebay = Session.getSessionValue('ebay');

        var payload = {
            "ebay": {
                "token": ebay.eBayAuthToken
            }
        };

        if (newPost.facebook) {
            payload.facebook = newPost.facebook;
        }

        if (newPost.twitter) {
            payload.twitter = newPost.twitter;
        }

        if (newPost.amazon) {
            payload.amazon = newPost.amazon;
        }

        if (newPost.craigslist) {
            payload.craigslist = newPost.craigslist;
        }

        if (newPost.payment) {
            payload.payment = newPost.payment;
        }

        $http.post(ENV.postingAPI + newPost.postingId + '/publish', payload).
            success(function (response) {
                deferred.resolve(response);
            }).
            error(function (response) {

                deferred.reject(response);

            });

        return deferred.promise;
    };



    factory.getEbaySessionID = function () {

        var deferred = $q.defer();

        var w = $window.open(ENV.htsAppUrl + "/ebayauth", "", "width=1020, height=500");

        $http({
            method: 'GET',
            url: ENV.ebayAuth + '/sessionId'
        }).then(function (response) {

            var sessionId = response.data.GetSessionIDResponse.SessionID;
            var ebaySignInPage = ENV.ebaySignIn + '?SignIn&RUName=' + ENV.ebayRuName + '&SessID=' + sessionId;
            w.location = ebaySignInPage;

            var attemptCount = 0;

            var fetchTokenInterval = $interval(function () {
                if(!w.closed) {
                    $http({
                        method: 'GET',
                        url: ENV.ebayAuth + '/fetchToken',
                        params: {'sessionId': sessionId}
                    }).then(function (response) {

                        console.log(response);

                        if (response.data.success) {

                            w.close();

                            $interval.cancel(fetchTokenInterval);
                            deferred.resolve(response);

                        } else if (attemptCount === 30) {

                            $interval.cancel(fetchTokenInterval);

                            w.close();

                            response.data.sessionId = sessionId;

                            deferred.reject({
                                message: "Ebay login timed out.  Please try again.",
                                delay: 10000
                            });

                        } else {

                            attemptCount++;
                            console.log(attemptCount);

                        }

                    });
                } else {

                    $interval.cancel(fetchTokenInterval);
                    deferred.reject({
                        message: "Looks like you closed the Ebay login window.  Please try again.",
                        delay: 10000
                    });
                }
            }, 2000);

            //deferred.resolve(response);

        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    };


    factory.disconnectEbay = function () {
        Session.setSessionValue('ebay', {}, function () {
            console.log('ebay account disconnected!');
        });
    };



    factory.checkIfTokenValid = function () {

        var deferred = $q.defer();

        var ebay = Session.getSessionValue('ebay');

        //We already have ebay token for user.. just push to ebay
        if(factory.isEmpty(ebay)){

            factory.getEbaySessionID().then(function (response) {
                Session.setSessionValue('ebay', response.data.ebay, function () {

                });
            }, function(errResponse) {

                deferred.reject(errResponse);
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };


    // Speed up calls to hasOwnProperty
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    factory.isEmpty = function(obj) {

        // null and undefined are "empty"
        if (obj === null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }

        return true;
    };



    return factory;

}]);
/**
 * Created by braddavis on 4/23/15.
 */
htsApp.factory('facebookFactory', ['$q', 'ENV', '$http', 'Session', 'ezfb', function ($q, ENV, $http, Session, ezfb) {

    var factory = {};

    factory.publishToWall = function (newPost) {

        var deferred = $q.defer();

        var facebook = Session.getSessionValue('facebook');

        //Strips HTML from string.
        function strip(html){
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }


        var bodyElem = $('<div>' + newPost.body + '</div>');

        $(bodyElem.find('.mention-highlighter')).each(function(i){
            var text = $(this).text();
            text = text.replace(/ /g,'');
            $(this).text(text);
        });


        $(bodyElem.find('.mention-highlighter-location')).each(function(i){
            var text = $(this).text();
            text = text.replace('@','at ');
            $(this).text(text);
        });


        newPost.plainTextBody = strip(bodyElem.html());

        var fbPost = null;

        if(newPost.images.length) {
            fbPost = {
                message: newPost.plainTextBody + ENV.htsAppUrl + '/feed/' + newPost.postingId,
                picture: newPost.images[0].full || newPost.images[0].thumbnail,
                access_token: facebook.token
            };
        } else {
            fbPost = {
                message: newPost.plainTextBody + ENV.htsAppUrl + '/feed/' + newPost.postingId,
                link: ENV.htsAppUrl + '/feed/' + newPost.postingId,
                access_token: facebook.token
            };
        }

        console.log('here is our fb post object: ', fbPost);


        ezfb.api('/me/feed', 'post', fbPost, function (response) {

            if (response.error) {

                deferred.reject(response);

            } else {

                console.log('here is our facebook success response: ', response);

                var payload = {
                    facebook: response
                };

                if (newPost.twitter) {
                    payload.twitter = newPost.twitter;
                }

                if (newPost.amazon) {
                    payload.amazon = newPost.amazon;
                }

                if (newPost.ebay) {
                    payload.ebay = newPost.ebay;
                }

                if (newPost.craigslist) {
                    payload.craigslist = newPost.craigslist;
                }

                if (newPost.payment) {
                    payload.payment = newPost.payment;
                }

                $http.post(ENV.postingAPI + newPost.postingId + '/publish', payload).success(function (response) {

                        deferred.resolve(response);

                }).error(function (response) {

                        deferred.reject(response);
                });

            }
        });

        return deferred.promise;
    };


    //Clears facebook token and creds from server permanently.
    factory.disconnectFacebook = function () {
        Session.setSessionValue('facebook', {}, function () {
            console.log('facebook account disconnected!');
        });
    };




    factory.checkIfTokenValid = function () {

        var deferred = $q.defer();

        var facebook = Session.getSessionValue('facebook');

        console.log('facebook tokens', facebook);

        var currentDate = new Date();
        //WE already have facebook token for user.. just post to facebook.
        if((!factory.isEmpty(facebook)  &&  facebook.tokenExpiration > currentDate) || (!factory.isEmpty(facebook)  &&  !facebook.tokenExpiration)) {

        } else {
            ezfb.login(function (res) { //login to facebook with scope email, and publish_actions
                console.log('res AuthResponse', res);

                if (res.authResponse) {
                    if(res.authResponse.grantedScopes === 'email,contact_email,publish_actions,public_profile') {
                        var t = new Date();
                        t.setSeconds(res.authResponse.expiresIn);

                        var facebookCreds = {
                            id: res.authResponse.userID,
                            token: res.authResponse.accessToken,
                            tokenExpiration: t
                        };

                        ezfb.api('/me', function (res) {  //Get email address from user now that we are authenticated
                            if (!res || res.error) {
                                deferred.reject({
                                    message: "Facebook failed to hand back user credentials",
                                    delay: 10000
                                });
                            } else {
                                console.log('apiMe', res);

                                facebookCreds.email = res.email;
                                facebookCreds.name = res.first_name + ' ' + res.last_name;

                                console.log(facebookCreds);

                                Session.setSessionValue('facebook', facebookCreds, function () { //persist the facebook token in database so we don't have to do this again
                                    deferred.resolve();
                                });
                            }
                        });
                    } else {
                        deferred.reject({
                            message: "Need correct Facebook permissions to publish",
                            delay: 10000
                        });
                    }
                } else {  //user cancelled
                    deferred.reject({
                        message: "Could not complete Facebook login.",
                        delay: 10000
                    });
                }
            }, {
                scope: 'email, publish_actions',
                return_scopes: true
            });
        }

        return deferred.promise;
    };





    // Speed up calls to hasOwnProperty
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    factory.isEmpty = function(obj) {

        // null and undefined are "empty"
        if (obj === null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }

        return true;
    };



    return factory;

}]);
/**
 * Created by braddavis on 7/9/15.
 */
htsApp.factory('geoFactory', ['$q', '$http', 'ENV', function ($q, $http, ENV) {

    var factory = {};

    factory.geolocateUser = function () {

        var deferred = $q.defer();

        $http.get(ENV.utilsApi + 'geolocate').success(function (response) {

            deferred.resolve(response);

        }).error(function (response) {

            var err = {
                message: 'Whoops.. We can\'t find any results in ' + userLocationObject.freeGeoIp.city,
                error: response
            };

            deferred.reject(err);
        });


        return deferred.promise;

    };

    return factory;

}]);
/**
 * Created by braddavis on 4/23/15.
 */
htsApp.factory('twitterFactory', ['$q', '$http', '$window', '$interval', 'ENV', 'Session', function ($q, $http, $window, $interval, ENV, Session) {

    var factory = {};

    factory.publishToTwitter = function (newPost) {

        var deferred = $q.defer();

        var twitter = Session.getSessionValue('twitter');

        //Strips HTML from string.
        function strip(html){
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }


        var bodyElem = $('<div>' + newPost.body + '</div>');

        $(bodyElem.find('.mention-highlighter')).each(function(i){
            var text = $(this).text();
            text = text.replace(/ /g,'');
            $(this).text(text);
        });


        $(bodyElem.find('.mention-highlighter-location')).each(function(i){
            var text = $(this).text();
            text = text.replace('@','at ');
            $(this).text(text);
        });


        newPost.plainTextBody = strip(bodyElem.html());

        $http({
            method: 'POST',
            url: ENV.htsAppUrl + '/publishTweet',
            data: {
                'posting': newPost,
                'token': twitter.token,
                'tokenSecret': twitter.tokenSecret
            }
        }).then(function (response) {

            var payload = {
                twitter: {
                    id: response.data.id
                }
            };

            if (newPost.facebook) {
                payload.facebook = newPost.facebook;
            }

            if (newPost.amazon) {
                payload.amazon = newPost.amazon;
            }

            if (newPost.ebay) {
                payload.ebay = newPost.ebay;
            }

            if (newPost.craigslist) {
                payload.craigslist = newPost.craigslist;
            }

            if (newPost.payment) {
                payload.payment = newPost.payment;
            }

            $http.post(ENV.postingAPI + newPost.postingId + '/publish', payload).success(function (response) {

                deferred.resolve(response);

            }).error(function (response) {

                deferred.reject(response);
            });

        }, function (err) {

            deferred.reject(err);

        });

        return deferred.promise;
    };


    //Clears Twitter token and creds from server permanently.
    factory.disconnectTwitter = function () {
        Session.setSessionValue('twitter', {}, function () {
            console.log('twitter account disconnected!');
        });
    };


    factory.checkIfTokenValid = function () {

        var deferred = $q.defer();

        var twitter = Session.getSessionValue('twitter');

        if(factory.isEmpty(twitter)) { //No twitter token for user.

            var w = $window.open(ENV.htsAppUrl + "/auth/twitter", "", "width=1020, height=500");

            var attemptCount = 0;

            var fetchTokenInterval = $interval(function () {
                if(!w.closed) {
                    Session.getUserFromServer().then(function (response) {

                        console.log(response);

                        if (response.user_settings.linkedAccounts.twitter.token) {

                            $interval.cancel(fetchTokenInterval);

                            w.close();

                            Session.create(response);

                        } else if (attemptCount === 30) {

                            $interval.cancel(fetchTokenInterval);

                            w.close();

                            deferred.reject({
                                message: "Twitter login timed out.  Please try again.",
                                delay: 10000
                            });

                        } else {

                            attemptCount++;
                            console.log(attemptCount);

                        }

                    });
                } else {

                    $interval.cancel(fetchTokenInterval);
                    deferred.reject({
                        message: "Looks like you closed the Twitter login window.  Please try again.",
                        delay: 10000
                    });

                }

            }, 2000);
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };


    // Speed up calls to hasOwnProperty
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    factory.isEmpty = function(obj) {

        // null and undefined are "empty"
        if (obj === null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }

        return true;
    };



    return factory;

}]);
/**
 * Created by braddavis on 10/29/14.
 */
htsApp.controller('watchlistController', ['$scope', '$rootScope', 'favesFactory', 'splashFactory', '$state', 'ngTableParams', '$filter', 'Session', 'quickComposeFactory', '$modal', '$log', 'modalConfirmationService', function($scope, $rootScope, favesFactory, splashFactory, $state, ngTableParams, $filter, Session, quickComposeFactory, $modal, $log, modalConfirmationService) {

    $scope.currentFaves = Session.userObj.user_settings.favorites;

    favesFactory.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 2000, // include all favorites on page one
        filter: {},         // initial filter
        sorting: {}         // initial sort
    }, {
        counts: [], //hides page sizes
        total: $scope.currentFaves.length, // length of data
        getData: function($defer, params) {
            // use build-in angular filter
            var filteredData = $filter('filter')($scope.currentFaves, favesFactory.filterString);
            var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                filteredData;

            params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

    //Sets up ng-table params
    $scope.tableParams = favesFactory.tableParams;

    // Ugh... http://stackoverflow.com/questions/22892908/ng-table-typeerror-cannot-set-property-data-of-null
    $scope.tableParams.settings().$scope = $scope;


    //More info directives evaluate these values and display sent offers and questions about items
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $scope.currentState = toState.name;
        $scope.expandedPostingId = toParams.postingId;
    });



    //Called when user clicks on remove button next to favorite
    $scope.removeFave = function(item){

        var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'Remove',
            headerText: 'Remove from Watch List?',
            bodyText: 'You will no longer receive notifications relating to this item.'
        };

        modalConfirmationService.showModal({}, modalOptions).then(function (result) {
            favesFactory.removeFave(item, function () {
                favesFactory.refreshTable();
            });
        });
    };

    //Uncheck all the checkboxes by default
    $scope.checkboxes = { checked : false, items: {} };


    // watch for data checkboxes
    $scope.$watch('checkboxes.items', function(values) {
        if (!$scope.currentFaves) {
            return;
        }
        var checked = 0, unchecked = 0;
        totalFaves = $scope.currentFaves.length;
        angular.forEach($scope.currentFaves, function(favorite) {
            checked   +=  ($scope.checkboxes.items[favorite.postingId]) || 0;
            unchecked += (!$scope.checkboxes.items[favorite.postingId]) || 0;
        });

        console.log("checked: ", checked, "unchecked: ", unchecked);

        if ((unchecked === 0) && totalFaves !== 0 || (checked === 0) && totalFaves !== 0) {
            $scope.checkboxes.masterCheck = (checked == totalFaves);
        }
        if(checked === 0 || totalFaves === 0){
            $scope.checkboxes.checked = false;
        } else {
            $scope.checkboxes.checked = true;
        }
        angular.element(document.getElementById("select_all")).prop("indeterminate", (checked !== 0 && unchecked !== 0));
    }, true);

    // watch for master checkbox
    $scope.$watch('checkboxes.masterCheck', function(value) {
        angular.forEach($scope.currentFaves, function(favorite) {
            if (angular.isDefined(favorite.postingId)) {
                $scope.checkboxes.items[favorite.postingId] = value;
            }
        });
    });

    //Declaring filters var so it can be attached to ng-table
    $scope.filters = {
        $: ''
    };

    //Filtering by all fields in table http://plnkr.co/edit/llb5k6?p=preview
    $scope.$watch("filters.$", function (value) {
        favesFactory.filterString = value;
        console.log(favesFactory.filterString);
        $scope.tableParams.reload();
//        favesFactory.tableParams.page(1);
    });


    //Takes a list of all the selected items and removes them from user favorites
    $scope.batchRemoveFaves = function(checkedItems) {
        favesFactory.batchRemoveFaves(checkedItems);
        $scope.checkboxes = { checked : false, items: {} }; //Uncheck all the favorites
    };

    //Takes a list of all the selected items and creates and email with address in BCC field
    $scope.batchEmail = function(checkedItems) {


        var currentFavorites = $scope.currentFaves;

        var results = [];

        angular.forEach(checkedItems.items, function(selectedStatus, id) { //loop through all the favorites and find the ones that are checked
            if(selectedStatus) {  //Make sure the favorite is checked
                console.log('this item selected', selectedStatus, id);
                for(i=0; i<currentFavorites.length; i++){ //loop through each favorites metadata
                    if(currentFavorites[i].postingId == id){  //Match the id of checked favorite and get the rest of metadata from localstorage
                        results.push(currentFavorites[i]);
                    }
                }
            }
        });

        console.log(results);


        if(Session.userObj.user_settings.email_provider[0].value === "ask") {  //If user needs to pick their email provider

            var modalInstance = $modal.open({
                templateUrl: '/js/transactionButtons/modals/email/partials/transactionButtons.modal.email.partial.html',
                controller: 'quickComposeController',
                resolve: {
                    result: function () {
                        return results;
                    }
                }
            });

            modalInstance.result.then(function (reason) {

            }, function (reason) {
                console.log(reason);
                if (reason === "signUp") {
                    authModalFactory.signUpModal();
                }
                $log.info('Modal dismissed at: ' + new Date());
            });

        } else {  //User already set their default email provider

            quickComposeFactory.generateMailTo(Session.userObj.user_settings.email_provider[0].value, results);

        }
    };

    $scope.UserLabels = favesFactory.getUserLabels(); //Gets all the users custom labels for the labels dropdown
    $scope.selected_labels = []; //Stores which labels are checked or not
    $scope.preselected = {name : []};  //Labels that should be pre-checked when user drops down labels menu


    //passes properties associated with clicked DOM element to splashFactory for detailed view
    $scope.openSplash = function(favorite){
        splashFactory.result = favorite;
        console.log(splashFactory.result);
        $state.go('watchlist.splash', { id: favorite.postingId });
    };


    $scope.expandCollapseQuestions = function ($event, post) {
        $event.stopPropagation();

        if($rootScope.currentState !== 'watchlist.questions') {
            post.currentlyViewing = {
                questions: true,
                meetings: false
            };
            $state.go('watchlist.questions', {postingId: post.postingId});
        } else {
            post.currentlyViewing = {
                questions: false,
                meetings: false
            };
            $state.go('^');
        }
    };


    $scope.expandCollapseMeetingRequests = function ($event,  post) {
        $event.stopPropagation();

        if($rootScope.currentState !== 'watchlist.meetings') {
            post.currentlyViewing = {
                questions: false,
                meetings: true
            };
            $state.go('watchlist.meetings', {postingId: post.postingId});
        } else {
            post.currentlyViewing = {
                questions: false,
                meetings: false
            };
            $state.go('^');
        }
    };

}]);
htsApp.factory('favesFactory', ['Session', 'myPostsFactory', function (Session, myPostsFactory) {

    //Init favesFactory Object
    var favesFactory = {};

    //Get the users current favorites
    favesFactory.currentFavorites = Session.userObj.user_settings.favorites;


    //Takes in a item and adds it to users favorites list or removes if already there
    favesFactory.addFave = function (item, callback) {

        var alreadyFavorited = _.some(Session.userObj.user_settings.favorites, function (favorite) {
                return (favorite.postingId === item.postingId);
            });


        if(!alreadyFavorited) { //check to make sure the item is not already favorited.

            if(item.external.source.code === "HSHTG") {

                myPostsFactory.getPostingIdQuestionsAndOffers(item.postingId).then(function (response) {

                    var postWithQuestionOfferAndProfile = response.data;

                    Session.userObj.user_settings.favorites.push(postWithQuestionOfferAndProfile);

                    Session.setSessionValue("favorites", Session.userObj.user_settings.favorites, callback);

                });

            } else {

                Session.userObj.user_settings.favorites.push(item);

                Session.setSessionValue("favorites", Session.userObj.user_settings.favorites, callback);

            }

        }

    };


    favesFactory.removeFave = function (item, callback) {
        var currentFavorites = Session.userObj.user_settings.favorites;

        //We use this array to store index of items that user may have ALREADY favorited
        var matchingIndexes = [];

        //If the new favorite's ID matching an existing favorite then note the index of that item
        _.some(currentFavorites, function(oldFav) {
            if(oldFav.postingId == item.postingId){
                matchingIndexes.push(currentFavorites.indexOf(oldFav));
            }
        });

        //If we have index of matching item then remove the favorite.  If we do not have index of existing favorite than add it.
        if(matchingIndexes.length > 0) {
            currentFavorites.splice(matchingIndexes[0],1);

            Session.setSessionValue("favorites", currentFavorites, callback);
        }
    };





    //Socketio passes emit object and we update the wishlist items.
    favesFactory.updateFavorite = function (emit, callback) {
        var currentFavorites = Session.userObj.user_settings.favorites;

        console.log('emitted favorite object', emit);

        console.log('currentFavorites', currentFavorites);

        var matchingIndex;

        for(var i = 0; i < currentFavorites.length; i++){
            var oldFavorite = currentFavorites[i];

            console.log(oldFavorite.postingId, emit.posting.postingId);

            if(oldFavorite.postingId === emit.posting.postingId){
                matchingIndex = i;
                break;
            }
        }

        console.log('done with loop');

        if (matchingIndex >= 0) {
            console.log('here is matching favorite');
            console.log(currentFavorites[matchingIndex]);


            myPostsFactory.getPostingIdQuestionsAndOffers(emit.posting.postingId).then(function (response) {

                var postWithQuestionOfferAndProfile = response.data;

                console.log('before', Session.userObj.user_settings.favorites[matchingIndex]);
                Session.userObj.user_settings.favorites[matchingIndex] = postWithQuestionOfferAndProfile;
                console.log('after', Session.userObj.user_settings.favorites[matchingIndex]);

                try {
                    favesFactory.refreshTable();
                } catch(err){
                    console.log(err);
                } finally {
                    Session.setSessionValue("favorites", Session.userObj.user_settings.favorites, callback);
                }

            });


        }
    };




    favesFactory.checkFave = function (item, callback) {
        var currentFavorites = Session.userObj.user_settings.favorites;

        //We use this array to store index of items that user may have ALREADY favorited
        var matchingIndexes = [];

        //If the new favorite's ID matching an existing favorite then note the index of that item
        _.some(currentFavorites, function(oldFav) {
            if(oldFav.postingId == item.postingId){
                matchingIndexes.push(currentFavorites.indexOf(oldFav));
            }
        });

        //If we have index of matching item then remove the favorite.  If we do not have index of existing favorite than add it.
        if(matchingIndexes.length > 0){
            callback(true);
        } else {
            callback(false);
        }
    };


    //Refreshes ng-table in the favorites pane
    favesFactory.refreshTable = function(){
        console.log("refreshing favorites table");
        //favesFactory.currentFavorites = Session.getSessionValue('favorites');
        favesFactory.tableParams.reload();
    };


    favesFactory.filterString = '';


    favesFactory.batchRemoveFaves = function(checkedItems){
        console.log(checkedItems);
        angular.forEach(checkedItems.items, function(checked, id) {
            console.log("checked: ", checked, "id: ", id);
            if(checked) {
                var tempObj = {};
                tempObj.postingId = id;
                favesFactory.removeFave(tempObj, function () {
                    favesFactory.refreshTable();
                });
            }
        });
    };


    favesFactory.addFavoriteLabel = function(newLabel){
        var sessionObj = Session.userObj;

        if(!sessionObj.user_settings.user_labels){ //user_labels was not part of original schema.  This protorypes array if doesn't exist.
            sessionObj.user_settings.user_labels = [];
        }

        sessionObj.user_settings.user_labels.push(newLabel);
        Session.setSessionValue("user_labels", sessionObj.user_settings.user_labels);
    };




    favesFactory.removeFavoriteLabel = function(labelToRemove, callback){

        var sessionObj = Session.userObj; //Get entire session object
        sessionObj.user_settings.user_labels = _.without(sessionObj.user_settings.user_labels, _.findWhere(sessionObj.user_settings.user_labels, labelToRemove)); //find the user label and remove it from session object


        Session.setSessionValue("user_labels", sessionObj.user_settings.user_labels); //Remove user label from server

        var cleanFavorites = [];  //Temporarily store the users favorites with the label removed from all items

        _.each(sessionObj.user_settings.favorites, function(favorite) {
            favorite.labels = _.without(favorite.labels, _.findWhere(favorite.labels, labelToRemove.name));  //loop through all the users favorites and remove the label each item
            cleanFavorites.push(favorite);
        });

        sessionObj.user_settings.favorites = cleanFavorites;

        Session.setSessionValue("favorites", sessionObj.user_settings.favorites, callback);
    };

    favesFactory.getUserLabels = function(){
        return Session.getSessionValue("user_labels");
    };



    return favesFactory;

}]);
/**
 * Created by braddavis on 2/22/15.
 */
htsApp.controller('watchlist.meetings.controller', ['$scope', '$element', 'Session', 'meetingsFactory', 'Notification', 'favesFactory', 'transactionFactory', 'profileFactory', function ($scope, $element, Session, meetingsFactory, Notification, favesFactory, transactionFactory, profileFactory) {

    $scope.userObj = Session.userObj;

    //Drops down menu so posting owner can delete their item for sale.
    $scope.toggled = function(open) {
        console.log('Dropdown is now: ', open);
    };

    console.log('here is watchlist meeting post', $scope.post);

    if($scope.post.external.source.code === 'HSHTG') {
        $scope.cachedOffers = angular.copy($scope.post.offers.results);
    }

    $scope.acceptedTime = {model :  undefined};

    $scope.errors = {
        message: null
    };

    $scope.counterOffer = function ($index, proposal) {

        var indexOfOfferToUpdate = $index;

        console.log('index of offer to add proposal to:', indexOfOfferToUpdate);

        transactionFactory.proposeDeal($scope.post, indexOfOfferToUpdate);

    };





    $scope.acceptDeal = function ($index, proposal) {


        if($scope.acceptedTime.model) {

            var acceptedProposal = {
                acceptedAt: moment().format(),
                price: proposal.price,
                when: $scope.acceptedTime.model,
                where: proposal.where,
                isOwnerReply: false
            };

            var offer = $scope.post.offers.results[$index];

            meetingsFactory.acceptOffer($scope.post, offer, acceptedProposal).then(function (response) {

                if (response.status === 201) {

                    //myPostsFactory.getAllUserPosts(Session.userObj.user_settings.name);

                    Notification.primary({
                        title: "Sent Offer Acceptance!",
                        message: "We've notified @" + offer.username + ".  Expect an email shortly.",
                        delay: 7000
                    });

                    profileFactory.getUserProfile($scope.post.username).then(function (response) {

                        var transactionRequirements = {
                            "buyer" : {
                                "name": $scope.userObj.user_settings.name,
                                "banner_photo" : $scope.userObj.user_settings.banner_photo,
                                "profile_photo" : $scope.userObj.user_settings.profile_photo
                            },
                            "buyerUsername" : $scope.userObj.user_settings.name,
                            "offerId" : offer.offerId,
                            "postingId" : $scope.post.postingId,
                            "seller" : response.data.user,
                            "sellerUsername" : $scope.post.username
                        };


                        transactionFactory.createTransaction(transactionRequirements).then(function (response) {

                            console.log(response);

                        }, function (err) {

                            Notification.error({
                                title: "Failed to append transaction ID",
                                message: "Please inform support of your.  Sorry for the trouble.",
                                delay: 7000
                            });

                        });


                    }, function (err) {

                        Notification.error({
                            title: "Failed to lookup seller profile",
                            message: "Please inform support.  Sorry for the trouble.",
                            delay: 7000
                        });

                    });


                } else {

                    console.log(response);

                    Notification.error({title: response.name, message: response.message, delay: 20000});

                }


            }, function (err) {

                console.log(err);

                Notification.error({title: err.data.name, message: err.data.message, delay: 20000});

            });

        } else {

            $scope.errors.message = "Please select a proposed time from above.";

        }

    };





    $scope.cancelOffer = function (offer, post) {

        meetingsFactory.deleteOffer(offer, post).then(function (response) {

            if (response.status === 204) {

                //alert('deleted');

            } else {

                Notification.error({title: response.name, message: response.message, delay: 20000});

            }


        }, function (err) {

            console.log(err);

            Notification.error({title: err.data.name, message: err.data.message, delay: 20000});

        });

    };

}]);


htsApp.directive('constructWishListOverlayMessage', function () {
    return {
        scope: {
            offer: '=',
            post: '='
        },
        restrict: 'EA',
        link: function (scope, element, attr) {
            console.log('scope', scope);
            console.log('element', element);
            console.log('attr', attr);
            if(scope.offer.proposals[scope.offer.proposals.length - 1].acceptedAt){
                attr.$set('message', 'Awesome!  We\'ll send you a reminder email with details.');
            } else {
                attr.$set('message', 'Offer sent to @' + scope.post.username );
            }
        }
    };
});
/**
 * Created by braddavis on 4/1/15.
 */
htsApp.directive("senderMeetingsMoreInfo", function() {
    return {
        restrict: "E",
        scope: { post: '=' },
        templateUrl: "js/watchlist/meetings/partials/watchlist.meetings.html",
        controller: "watchlist.meetings.controller"
    };
});
/**
 * Created by braddavis on 2/24/15.
 */
htsApp.controller('watchlist.questions.controller', ['$scope', 'qaFactory', '$state', 'Notification', 'myPostsFactory', 'Session', function ($scope, qaFactory, $state, Notification, myPostsFactory, Session) {

    console.log('watchlist.questions.controller');

    $scope.userObj = Session.userObj;

    //Toggles whether the posting owner sees questions they've already answered or not.
    $scope.showAnswered = false;

    //Drops down menu so posting owner can delete their item for sale.
    $scope.toggled = function(open) {
        console.log('Dropdown is now: ', open);
    };


    $scope.deleteQuestion = function (postingId, questionId) {

        console.log(postingId, questionId);

        qaFactory.deleteQuestion(postingId, questionId).then(function (response) {

            if(response.status === 204){


            } else {

                Notification.error({title: response.name, message: response.message});

            }

        }, function (err) {

            //TODO: Alert status update

        });

    };

}]);
/**
 * Created by braddavis on 4/1/15.
 */
htsApp.directive("senderQuestionsMoreInfo", function() {
    return {
        restrict: "E",
        scope: { post: '=' },
        templateUrl: "js/watchlist/questions/partials/watchlist.questions.html",
        controller: "watchlist.questions.controller"
    };
});
/**
 * Created by braddavis on 2/21/15.
 */
htsApp.factory('watchlistQuestionsFactory', ['$http', '$rootScope', 'ENV', '$q', 'utilsFactory', function ($http, $rootScope, ENV, $q, utilsFactory) {
    var factory = {};

    //Splash controller binds with this object to update view in realtime.
    factory.questions = {
        store: []
    };



    factory.getPostingIdQuestions = function (postingId) {

        var deferred = $q.defer();

        var params = {
            postingId: postingId,
            questions: true,
            count: 100
        };

        $http({
            method: 'GET',
            url: ENV.postingAPI + postingId + utilsFactory.bracketNotationURL(params)
        }).then(function (response, status, headers, config) {

            if(response.status === 200) {

                factory.questions.store = response.data.questions.results; //SplashFactory watches this store.

                deferred.resolve(response);

            } else {
                deferred.reject(response);
            }

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;

    };


    factory.submitQuestion = function (question, post, username) {

        var deferred = $q.defer();

        var postingId = post.postingId;

        var data = {
            "username": username,
            "value" : question
        };

        $http({
            method: 'POST',
            url: ENV.postingAPI + postingId + '/questions',
            data: data
        }).then(function (response, status, headers, config) {

            factory.getPostingIdQuestions(postingId).then(function (response) {

                deferred.resolve(response);

            }, function (err) {

                deferred.reject(err);

            });

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };



    factory.deleteQuestion = function (postingId, questionId) {

        //mailboxFactory.mail.questions.sent.data = [];
        //mailboxFactory.mail.questions.received.data = [];

        var deferred = $q.defer();

        $http({
            method: 'DELETE',
            url: ENV.postingAPI + postingId + '/questions/' + questionId
        }).then(function (response, status, headers, config) {

            factory.getPostingIdQuestions(postingId).then(function (response) {

                deferred.resolve(response);

            }, function (err) {

                deferred.reject(err);

            });

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;

    };


    factory.deleteAnswer = function (postingId, questionId, answerId) {

        //mailboxFactory.mail.questions.sent.data = [];
        //mailboxFactory.mail.questions.received.data = [];

        var deferred = $q.defer();

        $http({
            method: 'DELETE',
            url: ENV.postingAPI + postingId + '/questions/' + questionId + '/answers/ ' + answerId
        }).then(function (response, status, headers, config) {

            factory.getPostingIdQuestions(postingId).then(function (response) {

                deferred.resolve(response);

            }, function (err) {

                deferred.reject(err);

            });

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };


    return factory;
}]);angular.module('htsApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('js/404/partials/404.html',
    "<!DOCTYPE html>\n" +
    "<html lang=\"en\">\n" +
    "<head>\n" +
    "    <meta charset=\"utf-8\">\n" +
    "    <title>Page Not Found :(</title>\n" +
    "    <style>\n" +
    "        ::-moz-selection {\n" +
    "            background: #b3d4fc;\n" +
    "            text-shadow: none;\n" +
    "        }\n" +
    "\n" +
    "        ::selection {\n" +
    "            background: #b3d4fc;\n" +
    "            text-shadow: none;\n" +
    "        }\n" +
    "\n" +
    "        html {\n" +
    "            padding: 30px 10px;\n" +
    "            font-size: 20px;\n" +
    "            line-height: 1.4;\n" +
    "            color: #737373;\n" +
    "            background: #f0f0f0;\n" +
    "            -webkit-text-size-adjust: 100%;\n" +
    "            -ms-text-size-adjust: 100%;\n" +
    "        }\n" +
    "\n" +
    "        html,\n" +
    "        input {\n" +
    "            font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n" +
    "        }\n" +
    "\n" +
    "        body {\n" +
    "            max-width: 500px;\n" +
    "            _width: 500px;\n" +
    "            padding: 30px 20px 50px;\n" +
    "            border: 1px solid #b3b3b3;\n" +
    "            border-radius: 4px;\n" +
    "            margin: 0 auto;\n" +
    "            box-shadow: 0 1px 10px #a7a7a7, inset 0 1px 0 #fff;\n" +
    "            background: #fcfcfc;\n" +
    "        }\n" +
    "\n" +
    "        h1 {\n" +
    "            margin: 0 10px;\n" +
    "            font-size: 50px;\n" +
    "            text-align: center;\n" +
    "        }\n" +
    "\n" +
    "        h1 span {\n" +
    "            color: #bbb;\n" +
    "        }\n" +
    "\n" +
    "        h3 {\n" +
    "            margin: 1.5em 0 0.5em;\n" +
    "        }\n" +
    "\n" +
    "        p {\n" +
    "            margin: 1em 0;\n" +
    "        }\n" +
    "\n" +
    "        ul {\n" +
    "            padding: 0 0 0 40px;\n" +
    "            margin: 1em 0;\n" +
    "        }\n" +
    "\n" +
    "        .container {\n" +
    "            max-width: 380px;\n" +
    "            _width: 380px;\n" +
    "            margin: 0 auto;\n" +
    "        }\n" +
    "\n" +
    "        /* google search */\n" +
    "\n" +
    "        #goog-fixurl ul {\n" +
    "            list-style: none;\n" +
    "            padding: 0;\n" +
    "            margin: 0;\n" +
    "        }\n" +
    "\n" +
    "        #goog-fixurl form {\n" +
    "            margin: 0;\n" +
    "        }\n" +
    "\n" +
    "        #goog-wm-qt,\n" +
    "        #goog-wm-sb {\n" +
    "            border: 1px solid #bbb;\n" +
    "            font-size: 16px;\n" +
    "            line-height: normal;\n" +
    "            vertical-align: top;\n" +
    "            color: #444;\n" +
    "            border-radius: 2px;\n" +
    "        }\n" +
    "\n" +
    "        #goog-wm-qt {\n" +
    "            width: 220px;\n" +
    "            height: 20px;\n" +
    "            padding: 5px;\n" +
    "            margin: 5px 10px 0 0;\n" +
    "            box-shadow: inset 0 1px 1px #ccc;\n" +
    "        }\n" +
    "\n" +
    "        #goog-wm-sb {\n" +
    "            display: inline-block;\n" +
    "            height: 32px;\n" +
    "            padding: 0 10px;\n" +
    "            margin: 5px 0 0;\n" +
    "            white-space: nowrap;\n" +
    "            cursor: pointer;\n" +
    "            background-color: #f5f5f5;\n" +
    "            background-image: -webkit-linear-gradient(rgba(255,255,255,0), #f1f1f1);\n" +
    "            background-image: -moz-linear-gradient(rgba(255,255,255,0), #f1f1f1);\n" +
    "            background-image: -ms-linear-gradient(rgba(255,255,255,0), #f1f1f1);\n" +
    "            background-image: -o-linear-gradient(rgba(255,255,255,0), #f1f1f1);\n" +
    "            -webkit-appearance: none;\n" +
    "            -moz-appearance: none;\n" +
    "            appearance: none;\n" +
    "            *overflow: visible;\n" +
    "            *display: inline;\n" +
    "            *zoom: 1;\n" +
    "        }\n" +
    "\n" +
    "        #goog-wm-sb:hover,\n" +
    "        #goog-wm-sb:focus {\n" +
    "            border-color: #aaa;\n" +
    "            box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);\n" +
    "            background-color: #f8f8f8;\n" +
    "        }\n" +
    "\n" +
    "        #goog-wm-qt:hover,\n" +
    "        #goog-wm-qt:focus {\n" +
    "            border-color: #105cb6;\n" +
    "            outline: 0;\n" +
    "            color: #222;\n" +
    "        }\n" +
    "\n" +
    "        input::-moz-focus-inner {\n" +
    "            padding: 0;\n" +
    "            border: 0;\n" +
    "        }\n" +
    "    </style>\n" +
    "</head>\n" +
    "<body>\n" +
    "<div class=\"container\">\n" +
    "    <h1>Not found <span>:(</span></h1>\n" +
    "    <p>Sorry, but the page you were trying to view does not exist.</p>\n" +
    "    <p>It looks like this was the result of either:</p>\n" +
    "    <ul>\n" +
    "        <li>a mistyped address</li>\n" +
    "        <li>an out-of-date link</li>\n" +
    "    </ul>\n" +
    "    <!--<script>-->\n" +
    "        <!--var GOOG_FIXURL_LANG = (navigator.language || '').slice(0,2),GOOG_FIXURL_SITE = location.host;-->\n" +
    "    <!--</script>-->\n" +
    "    <!--<script src=\"//linkhelp.clients.google.com/tbproxy/lh/wm/fixurl.js\"></script>-->\n" +
    "</div>\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('js/authModals/modals/betaCheckModal/partials/betaCheck.html',
    "<style>\n" +
    "    .bike-background {\n" +
    "        background: url(\"//static.hashtagsell.com/htsApp/backdrops/flyingPigeon_dark_compressed.jpg\") no-repeat center center fixed;\n" +
    "        background-size: cover;\n" +
    "        border-radius: 5px 5px 0px 0px;\n" +
    "        height: 100%;\n" +
    "        width: 100%;\n" +
    "    }\n" +
    "\n" +
    "\n" +
    "    @media (min-width: 992px) {\n" +
    "        .modal-lg {\n" +
    "            width: 80%;\n" +
    "        }\n" +
    "    }\n" +
    "</style>\n" +
    "\n" +
    "<div class=\"modal-header bike-background\">\n" +
    "    <h2 style=\"text-align: center; color: white; margin-top: 100px; margin-bottom: 100px;\">Join <img src=\"//static.hashtagsell.com/logos/hts/HashtagSell_Logo_80px.svg\" style=\"top: -5px; position: relative; height: 80px;\"/><sup>Beta</sup></h2>\n" +
    "</div>\n" +
    "<div class=\"modal-body\" style=\"background-color: #F5F5F5; border-radius: 0px 0px 4px 4px;\">\n" +
    "    <div class=\"row\">\n" +
    "        <button type=\"button\" class=\"btn btn-default btn-lg raised col-md-4 col-md-offset-1 col-xs-10 col-xs-offset-1\" ng-click=\"dismiss('signUp')\">I have a beta code</button>\n" +
    "        <div class=\"col-md-2 col-xs-hidden\"></div>\n" +
    "        <button type=\"button\" class=\"btn btn-default btn-lg raised col-md-4 col-md-offset-0 col-xs-10 col-xs-offset-1\" ng-click=\"dismiss('subscribe')\">I want a beta code</button>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('js/authModals/modals/checkEmailModal/partials/checkEmail.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head lang=\"en\">\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title></title>\n" +
    "</head>\n" +
    "<body>\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h3 style=\"text-align: center;\">Verification Email Sent</h3>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <p>Please acknowledge the activation email we've just sent you.</p>\n" +
    "        <p>Thanks for making HashtagSell a great community to buy and sell used goods!</p>\n" +
    "    </div>\n" +
    "    <!--<div class=\"modal-footer\">-->\n" +
    "        <!--<a href=\"mailto:\" target=\"_self\" class=\"btn btn-default\">Go to inbox</a>-->\n" +
    "    <!--</div>-->\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('js/authModals/modals/forgotPasswordModal/partials/forgotPassword.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head lang=\"en\">\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title></title>\n" +
    "</head>\n" +
    "<body>\n" +
    "\n" +
    "    <form id=\"forgotPasswordForm\" name=\"forgotPasswordForm\" class=\"form-horizontal\" ng-submit=\"forgotPassword(forgotPasswordForm.$valid)\" novalidate>\n" +
    "        <div class=\"modal-header\">\n" +
    "            <h3 id=\"myModalLabel\" style=\"text-align: center;\">Password Recovery</h3>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "            <div class=\"controls\">\n" +
    "                <input class=\"form-control\" type=\"email\" name=\"recoveryId\" ng-model=\"email\" placeholder=\"Email\" required>\n" +
    "                <!--<br>-->\n" +
    "                <small class=\"text-danger\">\n" +
    "                    {{message}}\n" +
    "                </small>\n" +
    "                <br>\n" +
    "                <a href ng-click=\"dismiss('signUp')\">\n" +
    "                    <small>Create Account</small>\n" +
    "                </a>\n" +
    "                <small> | </small>\n" +
    "                <a href ng-click=\"dismiss('signIn')\">\n" +
    "                    <small>Sign In</small>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <input class=\"btn btn-success\" type=\"submit\" value=\"Send recovery email\" ng-disabled=\"forgotPasswordForm.$invalid\">\n" +
    "            <!--<button class=\"btn btn-default\" ng-click=\"dismiss()\">Close</button>-->\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('js/authModals/modals/resetPasswordModal/partials/resetPassword.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head lang=\"en\">\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title></title>\n" +
    "</head>\n" +
    "<body>\n" +
    "\n" +
    "    <form id=\"resetPasswordForm\" name=\"resetPasswordForm\" class=\"form-horizontal\" ng-submit=\"resetPassword(resetPasswordForm.$valid)\" novalidate>\n" +
    "        <div class=\"modal-header\">\n" +
    "            <h3 id=\"myModalLabel\" style=\"text-align: center;\">Reset Password</h3>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "            <div class=\"controls\">\n" +
    "                <input class=\"form-control\" type=\"password\" name=\"newPassword\" ng-model=\"newPassword\" placeholder=\"New password\" ng-minlength=\"4\" ng-maxlength=\"30\" ng-pattern=\"/^[a-zA-Z0-9.!@#$%&*~+=-_]*$/\" required>\n" +
    "                <!--<br>-->\n" +
    "                <small class=\"text-danger\">\n" +
    "                    {{message}}\n" +
    "                </small>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <button class=\"btn btn-success\" type=\"submit\" ng-class=\"resetPasswordForm.$invalid ? 'btn-warning' : 'btn-success'\" ng-disabled=\"resetPasswordForm.$invalid\">\n" +
    "                <span ng-show=\"resetPasswordForm.newPassword.$error.minlength\">Password is too short.</span>\n" +
    "                <span ng-show=\"resetPasswordForm.newPassword.$error.pattern\">Remove spaces in password.</span>\n" +
    "                <span ng-show=\"!resetPasswordForm.newPassword.$error.minlength &&\n" +
    "                    !resetPasswordForm.newPassword.$error.pattern &&\n" +
    "                    resetPasswordForm.$invalid\"\n" +
    "                        >Type password</span>\n" +
    "                <span ng-show=\"!resetPasswordForm.newPassword.$error.minlength &&\n" +
    "                    !resetPasswordForm.newPassword.$error.pattern &&\n" +
    "                    !resetPasswordForm.$invalid\"\n" +
    "                        >Submit new password</span>\n" +
    "            </button>\n" +
    "            <!--<button class=\"btn btn-default\" ng-click=\"dismiss()\">Close</button>-->\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('js/authModals/modals/signInModal/partials/signIn.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head lang=\"en\">\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title>HashtagSell Sign In</title>\n" +
    "    <style>\n" +
    "        /*----- Genral Classes start ------*/\n" +
    "        hr{\n" +
    "            margin: 30px 20px;\n" +
    "            border-top:2px solid #1C1E26 ;\n" +
    "            border-bottom:2px solid #38404D;\n" +
    "        }\n" +
    "        .list-unstyled {\n" +
    "            padding-left: 0;\n" +
    "            list-style: none;\n" +
    "        }\n" +
    "        .list-inline li {\n" +
    "            display: inline-block;\n" +
    "            padding-right: 5px;\n" +
    "            padding-left: 5px;\n" +
    "            margin-bottom: 10px;\n" +
    "        }\n" +
    "        /*---- General classes end -------*/\n" +
    "\n" +
    "        /*Change icons size here*/\n" +
    "        .social-icons .fa {\n" +
    "            font-size: 1.8em;\n" +
    "        }\n" +
    "        /*Change icons circle size and color here*/\n" +
    "        .social-icons .fa {\n" +
    "            width: 50px;\n" +
    "            height: 50px;\n" +
    "            line-height: 50px;\n" +
    "            text-align: center;\n" +
    "            color: #FFF;\n" +
    "            color: rgba(255, 255, 255, 0.8);\n" +
    "            -webkit-transition: all 0.3s ease-in-out;\n" +
    "            -moz-transition: all 0.3s ease-in-out;\n" +
    "            -ms-transition: all 0.3s ease-in-out;\n" +
    "            -o-transition: all 0.3s ease-in-out;\n" +
    "            transition: all 0.3s ease-in-out;\n" +
    "        }\n" +
    "\n" +
    "        .social-icons.icon-circle .fa{\n" +
    "            border-radius: 50%;\n" +
    "        }\n" +
    "        .social-icons.icon-rounded .fa{\n" +
    "            border-radius:5px;\n" +
    "        }\n" +
    "        .social-icons.icon-flat .fa{\n" +
    "            border-radius: 0;\n" +
    "        }\n" +
    "\n" +
    "        .social-icons .fa:hover, .social-icons .fa:active {\n" +
    "            color: #FFF;\n" +
    "            -webkit-box-shadow: 1px 1px 3px #333;\n" +
    "            -moz-box-shadow: 1px 1px 3px #333;\n" +
    "            box-shadow: 1px 1px 3px #333;\n" +
    "        }\n" +
    "        .social-icons.icon-zoom .fa:hover, .social-icons.icon-zoom .fa:active {\n" +
    "            -webkit-transform: scale(1.1);\n" +
    "            -moz-transform: scale(1.1);\n" +
    "            -ms-transform: scale(1.1);\n" +
    "            -o-transform: scale(1.1);\n" +
    "            transform: scale(1.1);\n" +
    "        }\n" +
    "\n" +
    "        .social-icons .fa-facebook,.social-icons .fa-facebook-square{background-color:#3C599F;}\n" +
    "        .social-icons .fa-twitter,.social-icons .fa-twitter-square{background-color:#32CCFE;}\n" +
    "\n" +
    "    </style>\n" +
    "</head>\n" +
    "<body>\n" +
    "\n" +
    "    <form name=\"loginForm\" id=\"loginForm\" class=\"form-horizontal\" ng-submit=\"loginPassport(loginForm.$valid)\" novalidate>\n" +
    "        <div class=\"modal-header\">\n" +
    "            <h3 id=\"myModalLabel\" style=\"text-align: center;\">Welcome Back!</h3>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "            <!--<ul class=\"social-icons icon-circle icon-zoom list-unstyled list-inline\">-->\n" +
    "                <!--<li> <a href=\"/auth/facebook\" target=\"_self\"><i class=\"fa fa-facebook\"></i></a></li>-->\n" +
    "                <!--<li> <a href=\"/auth/twitter\" target=\"_self\"><i class=\"fa fa-twitter\"></i></a></li>-->\n" +
    "            <!--</ul>-->\n" +
    "\n" +
    "            <div class=\"controls\">\n" +
    "                <input class=\"form-control\" type=\"email\" id=\"email\" ng-model=\"email\" placeholder=\"Email\" required>\n" +
    "            </div>\n" +
    "            <br>\n" +
    "            <div class=\"controls\">\n" +
    "                <input class=\"form-control\" type=\"password\" id=\"password\" ng-model=\"password\" placeholder=\"Password\" required>\n" +
    "                <small class=\"text-danger\">\n" +
    "                    {{message}}\n" +
    "                </small>\n" +
    "                <br>\n" +
    "                <a href ng-click=\"dismiss('signUp')\">\n" +
    "                    <small>Create Account</small>\n" +
    "                </a>\n" +
    "                <small> | </small>\n" +
    "                <a href ng-click=\"dismiss('forgot')\">\n" +
    "                    <small>Forgot Your Password?</small>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <input class=\"btn btn-success\" type=\"submit\" value=\"Log In\" id=\"submit\" ng-disabled=\"loginForm.$invalid\">\n" +
    "            <!--<button class=\"btn btn-default\" ng-click=\"dismiss('dismiss')\">Close</button>-->\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('js/authModals/modals/signUpModal/partials/signUp.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head lang=\"en\">\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title></title>\n" +
    "</head>\n" +
    "<body>\n" +
    "\n" +
    "        <form name=\"RegisterFormV2\" id=\"RegisterFormV2\" class=\"form-horizontal\" ng-submit=\"signupPassport(RegisterFormV2.$valid)\" novalidate>\n" +
    "            <div class=\"modal-header\">\n" +
    "                <h3 style=\"text-align: center;\">Create Your Account</h3>\n" +
    "                <div style=\"text-align: center;\">\n" +
    "                    <small>\n" +
    "                        <a href ng-click=\"dismiss('signIn')\">\n" +
    "                            Sign in to my existing account.\n" +
    "                        </a>\n" +
    "                    </small>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"modal-body\">\n" +
    "\n" +
    "                <div class=\"controls\">\n" +
    "                    <input class=\"form-control\" type=\"email\" id=\"email\" name=\"email\" ng-model=\"email\" placeholder=\"Email\" required=\"true\"/>\n" +
    "                </div>\n" +
    "\n" +
    "                <br>\n" +
    "\n" +
    "\n" +
    "                <div class=\"controls\">\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <span class=\"input-group-addon\">@</span>\n" +
    "                        <input class=\"form-control\" type=\"text\" id=\"username\" name=\"username\" ng-model=\"name\" ng-minlength=\"3\" ng-maxlength=\"22\" ng-pattern=\"/^[a-zA-Z0-9]*$/\" placeholder=\"Username\" required=\"true\"/>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "\n" +
    "                <br>\n" +
    "\n" +
    "                <div class=\"controls\">\n" +
    "                    <input class=\"form-control\" type=\"password\" id=\"password\" name=\"password\" ng-model=\"password\" ng-minlength=\"4\" ng-maxlength=\"30\" ng-pattern=\"/^[a-zA-Z0-9.!@#$%&*~+=^-_]*$/\" placeholder=\"Password\" required=\"true\"/>\n" +
    "                </div>\n" +
    "\n" +
    "                <br>\n" +
    "\n" +
    "                <!--<div class=\"controls\">-->\n" +
    "                    <!--<input class=\"form-control\" type=\"text\" id=\"secret\" placeholder=\"Early Access Code\" name=\"secret\" ng-model=\"secret\" required=\"true\"/>-->\n" +
    "                    <!--<span>-->\n" +
    "                        <!--<a href ng-click=\"dismiss('subscribe')\" style=\"position: relative; top: 3px;\">-->\n" +
    "                            <!--<small>I don't have an access code</small>-->\n" +
    "                        <!--</a>-->\n" +
    "                    <!--</span>-->\n" +
    "                <!--</div>-->\n" +
    "\n" +
    "                <!--<br/>-->\n" +
    "\n" +
    "                <div class=\"controls\">\n" +
    "\n" +
    "                        <input id=\"betaAgreement\" name=\"betaAgreement\" type=\"checkbox\" ng-model=\"betaAgreement\" required=\"true\"> I agree to the\n" +
    "                        <a ui-sref=\"betaAgreement\" target=\"_blank\" required>Beta Agreement</a>\n" +
    "\n" +
    "                    <br>\n" +
    "                    <small class=\"text-danger\">{{message}}</small>\n" +
    "                </div>\n" +
    "\n" +
    "\n" +
    "            </div>\n" +
    "            <div class=\"modal-footer\">\n" +
    "                <button id=\"submit-create-account\" class=\"btn\" ng-class=\"RegisterFormV2.$invalid ? 'btn-warning' : 'btn-success'\" type=\"submit\" ng-disabled=\"RegisterFormV2.$invalid\">\n" +
    "                    <span ng-show=\"RegisterFormV2.username.$error.minlength\">Username too short</span>\n" +
    "                    <span ng-show=\"RegisterFormV2.username.$error.maxlength\">Username too long</span>\n" +
    "                    <span ng-show=\"RegisterFormV2.username.$error.pattern\">Remove special chars in username</span>\n" +
    "                    <span ng-show=\"RegisterFormV2.password_verify.$error.match\">Passwords do not match</span>\n" +
    "                    <span ng-show=\"RegisterFormV2.password.$error.minlength\">Password too short</span>\n" +
    "                    <span ng-show=\"RegisterFormV2.password.$error.pattern\">Remove spaces in password</span>\n" +
    "                    <span ng-show=\"!RegisterFormV2.username.$error.minlength &&\n" +
    "                    !RegisterFormV2.username.$error.maxlength &&\n" +
    "                    !RegisterFormV2.username.$error.pattern &&\n" +
    "                    !RegisterFormV2.password_verify.$error.match &&\n" +
    "                    !RegisterFormV2.password.$error.minlength &&\n" +
    "                    !RegisterFormV2.password.$error.pattern &&\n" +
    "                    RegisterFormV2.$invalid\"\n" +
    "                            >Almost there</span>\n" +
    "                    <span ng-show=\"!RegisterFormV2.username.$error.minlength &&\n" +
    "                    !RegisterFormV2.username.$error.maxlength &&\n" +
    "                    !RegisterFormV2.username.$error.pattern &&\n" +
    "                    !RegisterFormV2.password_verify.$error.match &&\n" +
    "                    !RegisterFormV2.password.$error.minlength &&\n" +
    "                    !RegisterFormV2.password.$error.pattern &&\n" +
    "                    !RegisterFormV2.$invalid\"\n" +
    "                            >Create Account</span>\n" +
    "                </button>\n" +
    "                <!--<button class=\"btn btn-default\" ng-click=\"dismiss('dismiss')\">Close</button>-->\n" +
    "            </div>\n" +
    "        </form>\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('js/authModals/modals/subscribeModal/partials/subscribe.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head lang=\"en\">\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title></title>\n" +
    "</head>\n" +
    "<body>\n" +
    "\n" +
    "    <form id=\"betaSubscriberForm\" name=\"betaSubscriberForm\" class=\"form-horizontal\" ng-submit=\"subscribe(betaSubscriberForm.$valid)\" novalidate>\n" +
    "        <div class=\"modal-header\">\n" +
    "            <h3 id=\"myModalLabel\" style=\"text-align: center;\" ng-show=\"!done\">Request Early Access</h3>\n" +
    "            <h3 id=\"myModalLabel\" style=\"text-align: center;\" ng-show=\"done\">Tell Your Friends!</h3>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "            <div class=\"controls\">\n" +
    "\n" +
    "                <alert ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\" close=\"closeAlert($index)\">{{alert.msg}}</alert>\n" +
    "\n" +
    "                <input class=\"form-control\" type=\"email\" name=\"subscriberEmail\" ng-model=\"email\" placeholder=\"Email\" ng-show=\"!done\" required>\n" +
    "                <span ng-show=\"!done\">\n" +
    "                    <br>\n" +
    "                    <a href ng-click=\"dismiss('signUp')\">\n" +
    "                        <small>Create Account</small>\n" +
    "                    </a>\n" +
    "                    <small> | </small>\n" +
    "                    <a href ng-click=\"dismiss('signIn')\">\n" +
    "                        <small>Sign In</small>\n" +
    "                    </a>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <input class=\"btn btn-success\" type=\"submit\" value=\"I want early access!\" ng-disabled=\"betaSubscriberForm.$invalid\" ng-show=\"!done\">\n" +
    "            <!--<button class=\"btn btn-default\" ng-click=\"dismiss()\">Close</button>-->\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('js/bookingSystem/partials/bookingSystem.html',
    "<div class=\"btn-group\" role=\"group\" ng-show=\"!selectedDay\">\n" +
    "    <label class=\"btn btn-default btn-lg\" disabled=\"true\" style=\"background-color: #eee;\"><i class=\"fa fa-clock-o\"></i></label>\n" +
    "    <!--<label class=\"btn btn-default btn-lg\" ng-repeat=\"day in days\" ng-click=\"daySelected($index)\" ng-show=\"!{{day.disabled}}\">{{day.name}}</label>-->\n" +
    "    <label class=\"btn btn-default btn-lg\" ng-repeat=\"day in days\" ng-click=\"daySelected($index)\">{{day.name}}</label>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "<div ng-show=\"selectedDay\">\n" +
    "    <h4 style=\"text-align: center; cursor: pointer;\" ng-click=\"back()\">\n" +
    "        <i class=\"fa fa-arrow-left\"></i>{{selectedDay.name}}\n" +
    "    </h4>\n" +
    "    <div>\n" +
    "        <!--<label class=\"btn btn-default\" ng-repeat=\"hour in selectedHours\" ng-model=\"hour.selected\" ng-change=\"getAllProposedTimes()\" btn-checkbox ng-show=\"!{{hour.disabled}}\">{{hour.name}}</label>-->\n" +
    "        <label class=\"btn btn-default\" ng-repeat=\"hour in selectedHours\" ng-model=\"hour.selected\" ng-change=\"getAllProposedTimes()\" btn-checkbox >{{hour.name}}</label>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('js/feed/partials/feed.partial.html',
    "<div ui-view></div>\n" +
    "\n" +
    "<div ng-show=\"status.error.message\" class=\"background-instructions\">\n" +
    "    <div class=\"inset-background-text\" ng-bind-html=\"status.error.message\">\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"outer-container col-xs-12\">\n" +
    "    <spinner ng-if=\"spinner.show\" class=\"spinner-container\" spinner-text=\"Finding recently posted items around you\"></spinner>\n" +
    "\n" +
    "    <div vs-repeat class=\"inner-container feed row\" vs-size=\"feedItemHeight\" vs-offset-before=\"77\" vs-excess=\"10\" on-vs-index-change=\"getScrollPosition(startIndex, endIndex)\">\n" +
    "        <div class=\"list-item\" ng-repeat=\"result in feed.filtered\" ng-click=\"openSplash(this)\">\n" +
    "            <div class=\"thumbnail\">\n" +
    "\n" +
    "                <ribbon-list ng-if=\"!!result.askingPrice.value\">{{::result.askingPrice.value | currency : $ : 0}}</ribbon-list>\n" +
    "\n" +
    "                <!--Has NO image-->\n" +
    "                <div ng-if=\"!result.images.length\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"caption\">\n" +
    "                            <h3 class=\"noImage-heading\" ng-bind-html=\"result.heading | cleanHeading\"></h3>\n" +
    "                            <hts-fave-toggle class=\"carousel-starPositioning\"></hts-fave-toggle>\n" +
    "                            <p class=\"noImage-body\" ng-bind-html=\"result.body |cleanBodyExcerpt\"></p>\n" +
    "                            <div class=\"pull-left carousel-timestamp\">\n" +
    "                                <small>Posted {{(currentDate.timestamp - result.external.threeTaps.timestamp) | secondsToTimeString}} ago.</small>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "\n" +
    "                <!--Has ONE image-->\n" +
    "                <div ng-if=\"result.images.length == 1\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-lg-5 col-md-6 col-sm-6 col-xs-6\">\n" +
    "                            <img ng-src=\"{{::result.images[0].full || result.images[0].thumb || result.images[0].images}}\" class=\"img-rounded singleImage-Image\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-lg-7 col-md-6 col-sm-6 col-xs-6 singleImage-TextContainer\">\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"caption\">\n" +
    "                                    <h3 class=\"singleImage-heading\" ng-bind-html=\"result.heading | cleanHeading\"></h3>\n" +
    "                                    <hts-fave-toggle class=\"singleImage-starPositioning\"></hts-fave-toggle>\n" +
    "                                    <p class=\"singleImage-body\" ng-bind-html=\"result.body |cleanBodyExcerpt\"></p>\n" +
    "                                    <div class=\"pull-left singleImage-timestamp\">\n" +
    "                                        <small>Posted {{(currentDate.timestamp - result.external.threeTaps.timestamp) | secondsToTimeString}} ago.</small>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "\n" +
    "                <!--Has MULTIPLE images-->\n" +
    "                <div ng-if=\"result.images.length > 1\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-lg-12\">\n" +
    "                            <slick data=\"result.images\" lazy-load='progressive' init-onload=true dots=true infinite=true slides-to-scroll=1 speed=100 variable-width=true center-mode=false next-arrow=\".next-arrow-ctl{{$index}}\" prev-arrow=\".prev-arrow-ctl{{$index}}\">\n" +
    "\n" +
    "\n" +
    "                                <button ng-click=\"$event.stopPropagation();\" type=\"button\" data-role=\"none\" class=\"slick-prev prev-arrow-ctl{{$index}}\" aria-label=\"previous\" style=\"display: block;\">Previous</button>\n" +
    "\n" +
    "                                <button ng-click=\"$event.stopPropagation();\" type=\"button\" data-role=\"none\" class=\"slick-next next-arrow-ctl{{$index}}\" aria-label=\"next\" style=\"display: block;\">Next</button>\n" +
    "\n" +
    "                                <div ng-repeat=\"image in result.images\">\n" +
    "                                    <img data-lazy=\"{{image.thumb || image.thumbnail || image.images || image.full}}\"/>\n" +
    "                                </div>\n" +
    "                            </slick>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"caption\">\n" +
    "                            <h3 class=\"carousel-heading\" ng-bind-html=\"result.heading | cleanHeading\"></h3>\n" +
    "                            <hts-fave-toggle class=\"carousel-starPositioning\"></hts-fave-toggle>\n" +
    "                            <p class=\"carousel-body\" ng-bind-html=\"result.body |cleanBodyExcerpt\"></p>\n" +
    "                            <div class=\"pull-left carousel-timestamp\">\n" +
    "                                <small>Posted {{(currentDate.timestamp - result.external.threeTaps.timestamp) | secondsToTimeString}} ago.</small>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('js/legal/betaAgreement/partials/betaAgreement.partial.html',
    "<style>\n" +
    "    body, html {\n" +
    "        background-color: #ECF0F5;\n" +
    "        overflow-y: auto;\n" +
    "        overflow-x: hidden;\n" +
    "        font-weight: 200;\n" +
    "    }\n" +
    "</style>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "    <h3>HashtagSell Beta Agreement</h3>\n" +
    "    <p>Last Updated on May 15th, 2015</p>\n" +
    "\n" +
    "    <p>Effective as of May 15th, 2015</p>\n" +
    "\n" +
    "    <p>This Beta Agreement (the “Agreement”) contains the exclusive terms and conditions between HashtagSell, Inc., a California corporation (“Company”) and you (“You”) and it governs Your testing, evaluation and use of the beta version of the Services, any related software and website to which Company gives You access (“Services”). By accessing the Services for the evaluation purposes described herein You are consenting to be bound by and are becoming a party to the terms and conditions of this Agreement. If You do not agree to all of the terms of this Agreement, You must not access the Services.</p>\n" +
    "    <p>1. Evaluation.</p>\n" +
    "    <p>During the time period permitted by Company (the “Term”) You may access the Services and test the functionality and other features of the Services, but only to evaluate the Services for their intended purpose. From time to time as requested by Company You agree to participate in the feedback programs administered by Company.</p>\n" +
    "    <p>This Agreement does not entitle You to any technical support with respect to the Services, but any such support provided by Company in its sole discretion shall be subject to this Agreement. If You are under the age of 18, You shall not access, browse or use the Services, and by using the Services, You represent and warrant that You are at least 18 years of age.</p>\n" +
    "    <p>2. Third Party Services.</p>\n" +
    "    <p>The Services may also allow You to access services provided by third parties or you may use third party services to access the Services. You acknowledge that Company is not responsible nor liable for such services, and that Your use of such services may be subject to separate terms between You and the company providing those services.</p>\n" +
    "    <p>3. Restrictions; Ownership.</p>\n" +
    "    <p>You may not, directly or indirectly: copy, distribute, rent, lease, timeshare, operate a service bureau with, use for the benefit of a third party, reverse engineer, disassemble, decompile, attempt to discover the source code or structure, sequence and organization of, or remove any proprietary notices from, the Services. You shall not:</p>\n" +
    "    <p>*(a) use the Services to abuse, harass, threaten, intimidate or otherwise violate the legal rights (including intellectual property rights or rights of privacy and publicity) of others; *(b) use the Services for any unauthorized purpose or in violation of any applicable laws; *(c) transmit any content that You do not have a right to transmit under any law or under contractual or fiduciary relationships; *(d) interfere with or disrupt the Services. As between the parties, title, ownership rights, and intellectual property rights in and to the Services, and any copies or portions thereof, shall remain in Company and its suppliers or licensors.</p>\n" +
    "    <p>4. Confidentiality; Feedback.</p>\n" +
    "    <p>Your acknowledge that, in the course of evaluating the Services, You will obtain information relating to the Company and the Services which is confidential in nature (“Confidential Information”). You agree that You will not use or disclose Confidential Information without the prior written consent of Company unless such Confidential Information becomes part of the public domain. Further, if You provide Company any feedback, ideas, concepts or suggestions about the Company’s Services, business, technology or Confidential Information (“Feedback”), You grant Company, without charge, the fully paid-up, irrevocable right and license to use, share, commercialize and otherwise fully exercise and exploit Your Feedback and all related rights (and to allow others to do so) in any way and for any purpose. These rights survive termination of this agreement in perpetuity.</p>\n" +
    "    <p>5. Term/Termination.</p>\n" +
    "    <p>This Agreement will commence on the date that You first accept the terms of this Agreement by clicking “Accept” below (or otherwise create an account) and shall continue for the Term. Sections 2-9 of this Agreement will survive any expiration or termination of this Agreement. All rights You are granted herein shall immediately terminate upon expiration or termination of this Agreement and You shall immediately return to Company or destroy all Confidential Information (including all Software). In addition to any other rights set forth herein, Company may in its sole discretion restrict, suspend or terminate Your access to the Services, in whole or in part and without notice.</p>\n" +
    "    <p>6. Disclaimer.</p>\n" +
    "    <p>The parties acknowledge that the Services are experimental in nature and that the Services are provided “AS IS.” COMPANY DISCLAIMS ALL WARRANTIES RELATING TO THE SUBJECT MATTER HEREOF, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>\n" +
    "    <p>7. Limitation of Remedies and Damages. COMPANY SHALL NOT BE RESPONSIBLE OR LIABLE WITH RESPECT TO ANY SUBJECT MATTER OF THIS AGREEMENT OR TERMS AND CONDITIONS RELATED THERETO UNDER ANY CONTRACT, NEGLIGENCE, STRICT LIABILITY OR OTHER THEORY (A) FOR LOSS OR INACCURACY OF DATA OR, COST OF PROCUREMENT OF SUBSTITUTE GOODS, SERVICES OR TECHNOLOGY, (B) FOR ANY INDIRECT, INCIDENTAL OR CONSEQUENTIAL DAMAGES INCLUDING, BUT NOT LIMITED TO LOSS OF REVENUES AND LOSS OF PROFITS, OR (C) ANY AMOUNT IN THE AGGREGATE IN EXCESS OF THE AMOUNTS YOU HAVE PAID COMPANY IN THE LAST SIX (6) MONTHS, OR, IF GREATER, FIFTY DOLLARS ($50). COMPANY SHALL NOT BE RESPONSIBLE FOR ANY MATTER BEYOND ITS REASONABLE CONTROL.</p>\n" +
    "    <p>8. Equitable Relief.</p>\n" +
    "    <p>You acknowledge and agree that due to the unique nature of Company’s Confidential Information, there can be no adequate remedy at law for any breach of Your obligations hereunder, that any such breach may allow You or third parties to unfairly compete with Company resulting in irreparable harm to Company, and therefore, that upon any such breach or threat thereof, Company shall be entitled to injunctions and other appropriate equitable relief in addition to whatever remedies it may have at law.</p>\n" +
    "    <p>9. Miscellaneous.</p>\n" +
    "    <p>In the event that any of the provisions of this Agreement shall be held by a court or other tribunal of competent jurisdiction to be unenforceable, such provisions shall be limited or eliminated to the minimum extent necessary so that this Agreement shall otherwise remain in full force and effect and enforceable. This Agreement constitutes the entire agreement between the parties pertaining to the subject matter hereof, and any and all written or oral agreements previously existing between the parties are expressly cancelled. Neither the rights nor the obligations arising under this Agreement are assignable or transferable by You, and any such attempted assignment or transfer shall be void and without effect. This Agreement shall be governed by and construed in accordance with the laws of the State of California without regard to the conflicts of laws provisions therein.</p>\n" +
    "    <p>Last Modified: 15th May 2015<br>\n" +
    "    © 2015 HashtagSell, Inc.</p>\n" +
    "</div>"
  );


  $templateCache.put('js/legal/postingRules/partials/postingRules.partial.html',
    "<style>\n" +
    "    body, html {\n" +
    "        background-color: #ECF0F5;\n" +
    "        overflow-y: auto;\n" +
    "        overflow-x: hidden;\n" +
    "        font-weight: 200;\n" +
    "    }\n" +
    "</style>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "    <h3>HashtagSell Posting Rules</h3>\n" +
    "    <p>Last Updated on May 15th, 2015</p>\n" +
    "\n" +
    "    <p>Effective as of May 15th, 2015</p>\n" +
    "\n" +
    "    <p>We categorize any ads posted on HashtagSell. Here are some general rules to follow when posting and replying to an ad:</p>\n" +
    "    <ol><li>You are responsible for ensuring compliance with all applicable laws relating to items that you list, buy or sell on HashtagSell.</li>\n" +
    "        <li>Ads that are on our prohibited items list are not permitted.</li>\n" +
    "        <li>Ads or replies that contain any text that violates the spirit of HashtagSell, contains inappropriate or discriminatory language in ads, and/or &quot;hate speech&quot; directed at individuals or groups, is threatening or abusive, infringes on another user&#39;s privacy, or could disturb, harm, or offend our users, may be rejected.</li>\n" +
    "        <li>It is prohibited to post an item or service not located in the U.S.</li>\n" +
    "        <li>It is prohibited to post a duplicate or similar ad for the same item or service.</li>\n" +
    "        <li>Ads that are intentionally misleading, deceptive, deceitful, misinformative, or found to be using &quot;bait and switch&quot; tactics are not permitted.</li>\n" +
    "        <li>You can only post one ad for an item in the area that the item is actually located.</li>\n" +
    "        <li>We generally allow links under the following conditions:</li>\n" +
    "        <ul>\n" +
    "            <li>Link to additional product information/pictures</li>\n" +
    "        </ul>\n" +
    "        <li>Posting an ad for a unique item</li>\n" +
    "        <li>Sole purpose of link is not to direct more traffic to your website</li>\n" +
    "        <li>You do not post links to another classified site</li>\n" +
    "        <li>Your ad must comply with all other site policies.</li>\n" +
    "        <li>It is prohibited to use multiple accounts to post.</li>\n" +
    "        <li>It is prohibited to post pornography, nudity, or other related material that is obscene or adult in nature.</li>\n" +
    "        <li>It is prohibited to post ads relating to personals, dating or adult themed events or services, missed connections, or adult services.</li>\n" +
    "        <li>It is prohibited to infringe upon the rights of third parties. This includes, but is not limited to, infringing upon intellectual property rights such as copyright and trademark.</li>\n" +
    "        <li>It is prohibited to post ads that serve no other purpose than to send traffic to another web site. Ads must describe a specific item or service in order to be allowed on the site. If you include HTML code in your ad it will not work and your ad could be removed.</li>\n" +
    "        <li>It is prohibited to post keywords in your ad for the purpose of increasing its visibility in search results.</li>\n" +
    "        <li>Use of content and/or functionality of HashtagSell to send unsolicited emails, or make unsolicited contact of any kind with its users is strictly prohibited.</li>\n" +
    "        <li>Rules may change periodically to reflect HashtagSell&#39;s ongoing commitment to providing the safest and best user experience possible. We reserve the right to enforce these rules at our discretion and change these rules at any time. HashtagSell reserves the right to remove any ad at any time at our discretion. By posting an ad on the site you understand and have agreed to these rules.</li></ol>\n" +
    "    <h4>HashtagSell Prohibited Items List</h4>\n" +
    "    <p>The list below details a partial list of what can&#39;t be posted on HashtagSell. HashtagSell reserves the right to remove an ad at our discretion, and to alter this list at any time:</p>\n" +
    "    <ul>\n" +
    "        <li>Ads asking for donations unless from a registered charity</li>\n" +
    "        <li>Ads offering or looking for human adoption</li>\n" +
    "        <li>Ads that are adult in nature (including, but not limited to: adult toys, adult magazines, adult services, escort services, adult massages, adult job postings, dating websites, and personal ads)</li>\n" +
    "        <li>Airline tickets that restrict transfer and tickets of any kind which you are not authorized to sell</li>\n" +
    "        <li>Alcoholic Beverages</li>\n" +
    "        <li>Animals/pets</li>\n" +
    "        <li>Animals traps that could be deemed inhumane</li>\n" +
    "        <li>Blood, Bodily Fluids and Body Parts</li>\n" +
    "        <li>Burglary Tools</li>\n" +
    "        <li>Counterfeit Products, replicas or knock-off brand name goods</li>\n" +
    "        <li>Coupons or gift cards that restrict transfer, and coupons or gift cards which you are not authorized to sell</li>\n" +
    "        <li>Electronically delivered gift cards or electronic &quot;scanned&quot; coupons</li>\n" +
    "        <li>Cribs (new and used) unless they meet the new federal safety standards issued by the CPSC. Only cribs that were manufactured in 2011 or later are permitted. If your crib was manufactured in 2011 or later and meets the required safety standards, you must specifically state in your listing that the crib was manufactured in 2011 or later and does meet these standards (please visit the CPSC website for more information)</li>\n" +
    "        <li>Electronic Surveillance Equipment designed or used primarily to illegally intercept/record the private actions or interactions of others without their knowledge or permission</li>\n" +
    "        <li>Embargoed Goods</li>\n" +
    "        <li>Endangered or protected species, or any part of any endangered or protected species (including bone/ivory, taxidermy, shell, pelts, etc)</li>\n" +
    "        <li>Food and food products</li>\n" +
    "        <li>Fireworks, Destructive Devices and Explosives</li>\n" +
    "        <li>Gift cards of any kind</li>\n" +
    "        <li>Government and Transit Badges, Uniforms, IDs, Documents and Licenses</li>\n" +
    "        <li>Hazardous Materials including but not limited to radioactive, toxic and explosive materials</li>\n" +
    "        <li>Identity Documents, Personal Financial Records &amp; Personal Information</li>\n" +
    "        <li>Illegal Drugs, controlled substances, substances and items used to manufacture controlled substances and drugs, &amp; drug paraphernalia</li>\n" +
    "        <li>Illegal telecommunication and electronics equipment such as access cards, password swiffers, any type of jamming device, traffic signal control devices, satellite/cable descrambler, or any device prohibited by the FCC</li>\n" +
    "        <li>Items issued to United States Armed Forces that have not been disposed of in accordance with Department of Defense demilitarization policies</li>\n" +
    "        <li>Items marketed inappropriately with an intolerant regard toward religion, sexual orientation, race, or ethnic background</li>\n" +
    "        <li>Items that restrict transfer (such as tickets or coupons) and items you are not authorized to sell</li>\n" +
    "        <li>Items which encourage or facilitate illegal activity</li>\n" +
    "        <li>Liquor licenses</li>\n" +
    "        <li>Lottery Tickets, Sweepstakes Entries and Slot Machines that requires money to operate</li>\n" +
    "        <li>Material, artwork, and/or photographs that are obscene, contain nudity (partial or full), pornographic, adult in nature, or harmful to minors</li>\n" +
    "        <li>Material that infringes copyright, including but not limited to software or other digital goods which you are not authorized to sell</li>\n" +
    "        <li>Modded gaming items and modification services</li>\n" +
    "        <li>Nonprescription drugs, drugs that make false or misleading treatment claims, or treatment claims that require FDA approval</li>\n" +
    "        <li>Offensive Material</li>\n" +
    "        <li>Pesticides or hazardous materials</li>\n" +
    "        <li>Pictures or images that contain nudity</li>\n" +
    "        <li>Plants and insects that are restricted or regulated</li>\n" +
    "        <li>Prescription Drugs and Devices</li>\n" +
    "        <li>Products being sold by representatives of companies that violate our jobs/services policies</li>\n" +
    "        <li>Prostitution or ads that offer sex, sexual favors or sexual actions in exchange for anything</li>\n" +
    "        <li>Recalled items (please visit the US recall information website for more information)</li>\n" +
    "        <li>Stocks and Other Securities</li>\n" +
    "        <li>Stolen Property</li>\n" +
    "        <li>Tobacco and Related Products (including, but not limited to: nicotine patches, nicotine gum, e-cigarettes, etc)</li>\n" +
    "        <li>Used bedding and clothing, unless sanitized in accordance with law (used undergarments, swimwear and socks are never permitted)</li>\n" +
    "        <li>Used cosmetics or toiletries (items must be new and sealed)</li>\n" +
    "        <li>Weapons and related items (including, but not limited to firearms, magazines and all parts and accessories, ammunition, BB and pellet guns, tear gas, tasers, stun guns, knives, swords, airsoft guns and all accessories, crossbows, archery bows, and martial arts weapons)</li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <p>Last Modified: 15th May 2015<br>\n" +
    "    © 2015 HashtagSell, Inc.</p>\n" +
    "</div>"
  );


  $templateCache.put('js/legal/privacyPolicy/partials/privacyPolicy.partial.html',
    "<style>\n" +
    "    body, html {\n" +
    "        background-color: #ECF0F5;\n" +
    "        overflow-y: auto;\n" +
    "        overflow-x: hidden;\n" +
    "        font-weight: 200;\n" +
    "    }\n" +
    "</style>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "    <h3>HashtagSell Privacy Policy</h3>\n" +
    "\n" +
    "    <p>Last Updated on May 15th, 2015</p>\n" +
    "\n" +
    "    <p>Effective as of May 15th, 2015</p>\n" +
    "\n" +
    "    <p>HashtagSell, Inc., the company behind HashtagSell.com (hereafter “HashtagSell”, “our,” “we,” or “us”) has created this Privacy Policy to explain how your information is collected and used. This Privacy Policy applies to our web site. </p>\n" +
    "\n" +
    "    <p>By visiting and using the web site, you consent to our Terms of Use, which is incorporated by reference including applicable terms regarding limitations on liability and the resolution of disputes. You acknowledge our use of your information per the terms of this Privacy Policy. We reserve the right to modify this Privacy Policy in the future. You can always review the most current version at <a ui-sref=\"privacyPolicy\" target=\"_blank\">{{legalUrl.privacyPolicy}}</a></p>\n" +
    "\n" +
    "    <h4>Data Collected From You.</h4>\n" +
    "\n" +
    "    <p>1. Information Submitted by You. HashtagSell receives, stores, and processes information that you provide when using our Platform, including: </p>\n" +
    "\n" +
    "    <p>1.1. information you submit to the Platform, such as when you register or update the details of your account, information and any payment information you submit to the Platform such as credit card number, expiration, and security codes, or digital payment system account;</p>\n" +
    "\n" +
    "    <p>1.2. information you post in order to sell any product on the Platform, including any photographs, written descriptions and your location (“Offers”), as well as any bids you make on Offers through the Platform; and</p>\n" +
    "\n" +
    "    <p>1.3. any reviews or comments you make using the Platform, all correspondence or communications with another user conducted using the Platform, or if you contact or communicate with us, whether through written or verbal communications.</p>\n" +
    "\n" +
    "    <p>2. Information from Third Parties. HashtagSell may, from time to time, supplement the information we collect about you through our Platform with outside records from third parties in order to enhance our ability to serve you, to tailor our content to you and to offer you opportunities to purchase products or services that we believe may be of interest to you. HashtagSell may also receive information from Facebook, or any other social media site or other third party service which HashtagSell may support in the future, should you elect to log on to the Platform using such social media sites. We may combine the information we receive from those sources with information we collect through the Platform. In those cases, we will apply this Privacy Policy to any Personal Information received, unless we have disclosed otherwise. </p>\n" +
    "\n" +
    "    <p>3. Internet/Mobile Data and Metadata. When you use the Platform, we receive, store and process a variety of information about your location (e.g. IP address, GPS coordinates), your device (e.g. make, model and specifications of your device, OS, UDID), metadata (e.g. time, date and location of when a post was made) and other similar data, to the extent sent by your computer or mobile device or generated as part of the data communications with the Platform. </p>\n" +
    "\n" +
    "    <p>4. Tracking Technologies; Advertising. </p>\n" +
    "\n" +
    "    <p>4.1. HashtagSell uses, or may use, cookies, tracking pixels, embedded scripts and other similar tracking technologies on the Platform and may, without further consultation with you, and may permit its partners to do the same. By accessing or using the Platform, you will provide or make available certain information to us and to our partners. HashtagSell will track your activities if you click on advertisements for our services on third party platforms such as search engines and social networks, and do use analytics to track what you do in response to those advertisements. All information which could reasonably be used to identify you personally (e.g. your name, e-mail address, location, IP address) are hereafter (“Personal Information”).</p>\n" +
    "\n" +
    "    <p>4.2. HashtagSell does not currently offer targeted advertising through the Platform, though we reserve the right to do or allow our partners to do so in the future without further consultation from you. We do not currently support any browser based Do Not Track (DNT) settings or participate in any DNT frameworks, and we do not assign any meaning to any potential DNT track signals you may send or alter any of our data collection or use practices in response to such signals.  </p>\n" +
    "\n" +
    "    <h4>Use of Collected Data.</h4>\n" +
    "\n" +
    "    <p>5. General Uses. HashtagSell uses and processes the collected information, including Personal Information, for the following uses: </p>\n" +
    "\n" +
    "    <p>5.1. to enable you to access and use the Platform and to optimize the type of classified posts presented to you when you use the Platform;</p>\n" +
    "\n" +
    "    <p>5.2. to enable any identification programs we may institute and which you elect to participate, such as verifying your identity and address, and to conduct checks against various publically available databases;</p>\n" +
    "\n" +
    "    <p>5.3. to operate, protect, improve and optimize the Platform, our business, and our users’ experience, such as to perform analytics, conduct research, and for advertising and marketing; </p>\n" +
    "\n" +
    "    <p>5.4. to help create and maintain a trusted and safer environment on the Platform including detection and prevention of fraud, unauthorized access, intrusion, and service interruption </p>\n" +
    "\n" +
    "    <p>5.5. to conduct investigations and to respond to disputes between users, refund requests and other similar customer support service; </p>\n" +
    "\n" +
    "    <p>5.6. to send you service, support and administrative messages, reminders, technical notices, updates, security alerts, and information requested by you; </p>\n" +
    "\n" +
    "    <p>5.7. where we have your consent, to send you our newsletter, marketing and promotional messages and other information that may be of interest to you, including HashtagSell&#39;s newsletter and other information sent on behalf of our business partners that we think you may find interesting; and </p>\n" +
    "\n" +
    "    <p>5.8. to comply with our legal obligations or requests from law enforcement agencies, resolve any disputes that we may have with any of our users, and enforce our agreements with third parties.</p>\n" +
    "\n" +
    "    <p>6. Payment.HashtagSell uses or intends to use a third party credit card processing company to handle credit card payments made on the Platform. As part of this process, your name and other credit card information will be sent to third parties for processing. </p>\n" +
    "\n" +
    "    <p>7. Use of Communications. HashtagSell will review, scan, or analyze your communications made via the Platform or with us for fraud prevention, risk assessment, legal/regulatory compliance, investigation, product development, research and customer support purposes. We may also scan, review or analyze messages for research and product development purposes to help make search, and user communications more efficient and effective, as well as to improve our product and service offerings.</p>\n" +
    "\n" +
    "    <p>8. Limitation on Use. HashtagSell will not review, scan, or analyze your communications for sending third party marketing messages to you, nor will to use any of your credit card or payment information as part of our advertising or marketing campaigns.</p>\n" +
    "\n" +
    "    <p>9. Opting Out. You will be able to unsubscribe or opt-out from receiving certain marketing and promotional messages and communications by by clicking the “unsubscribe” link in any promotional email we send to you.</p>\n" +
    "\n" +
    "    <h4>Disclosure of Your Information.</h4>\n" +
    "\n" +
    "    <p>10. Platform Disclosure. Your Personal Information may be disclosed on the Platform as follows: </p>\n" +
    "\n" +
    "    <p>10.1. Certain information from your HashtagSell account will be made available to the public on the Platform, including your user name, picture (if one is provided), the date you created your HashtagSell account. In addition to your information, your public profile will also display other users who may have “followed” you and your rating on HashtagSell. Billing information will never be shared with another user. </p>\n" +
    "\n" +
    "    <p>10.2. HashtagSell may ask you to review the other HashtagSell users. If you choose to provide a review, your comments may be made public on the Platform.</p>\n" +
    "\n" +
    "    <p>11. Social Media. You may link your account on a third party social media site to your HashtagSell account. We refer to a person’s contacts on these third party sites as “Friends.” When you create this link: </p>\n" +
    "\n" +
    "    <p>11.1. information you provide to us from the linking of your accounts may be published on your HashtagSell account profile; </p>\n" +
    "\n" +
    "    <p>11.2. your activities on the Platform may be displayed to your Friends on the Platform and/or the third party site; </p>\n" +
    "\n" +
    "    <p>11.3. other HashtagSell users may be able to see any common Friends that you may have with them, or that you are a Friend of their Friend if applicable; </p>\n" +
    "\n" +
    "    <p>11.4. other HashtagSell users may be able to see any information you have provided on the linked social networking site(s); and</p>\n" +
    "\n" +
    "    <p>11.5. the information you provide to us from the linking of your accounts may be stored, processed and transmitted for fraud prevention and risk assessment purposes. The publication and display of information that you provide to HashtagSell through this linkage is subject to your settings and authorizations on the Platform and the third party site.</p>\n" +
    "\n" +
    "    <p>12.  Disclosures to Partners, Affiliates </p>\n" +
    "\n" +
    "    <p>12.1. HashtagSell may distribute parts of the Platform (including your posts, communications or offers) for display on sites operated by HashtagSell&#39;s business partners or on social media you have linked to your HashtagSell account. If and when your posts, communications or offers are displayed on a partner’s site or on a social media site, information from your public profile page may also be displayed. </p>\n" +
    "\n" +
    "    <p>12.2. We may allow our related entities such as our subsidiaries, and their employees, to use and process your Personal Information in the same way and to the same extent that we are permitted to under this Privacy Policy. These related entities comply with the same obligations that we have to protect your Personal Information under this Privacy Policy.</p>\n" +
    "\n" +
    "    <p>12.3. You acknowledge, consent and agree that HashtagSell may access, preserve and disclose your information, including all Personal Information, if required to do so by law or in a good faith belief that such access, preservation or disclosure is reasonably necessary to (a) respond to claims asserted against HashtagSell; (b) to comply with legal process (for example, court orders, subpoenas and warrants); (c) to enforce and administer our agreements with users, such as the <a href=\"mailto:contact@hashtagsell.com\" target=\"_blank\">contact us</a> and enter your request for cancellation. Please also note that any reviews, forum postings and similar materials posted by you may continue to be publicly available on the Platform in association with your account name, even after your HashtagSell account is cancelled. </p>\n" +
    "\n" +
    "    <h4>Security of Your Personal Information.</h4>\n" +
    "\n" +
    "    <p>15. All communication between the Platform to HashtagSell&#39;s servers is encrypted using 128-bit SSL. We have also sought to use other reasonable administrative, technical, and physical security measures to protect your Personal Information and other information against the unauthorized access, destruction or alteration of your information. However, no method of transmission over the Internet, and no method of storing electronic information, can be 100% secure. HashtagSell cannot guarantee the absolute security of your transmissions to us and of your Personal Information that we store. </p>\n" +
    "\n" +
    "    <p>16. If you become aware of a security issue, please provide us with details regarding the security issue <a href=\"mailto:contact@hashtagsell.com\" target=\"_blank\">contact us</a> . We will work with you to address the security issues you have encountered. </p>\n" +
    "\n" +
    "    <h4>Third Party Websites.</h4>\n" +
    "\n" +
    "    <p>17. The Platform will contain links to other websites not owned or controlled by HashtagSell. These other websites may place their own cookies, web beacons or other files on your device, or collect and solicit Personal Information from you. These third parties will have their own rules about the collection, use and disclosure of Personal Information. HashtagSell encourages you to read the terms of use and privacy policies of the other websites and mobile applications that you visit. </p>\n" +
    "\n" +
    "    <p>18. The Platform utilizes Google Maps API(s) to give other users the approximate location of the goods you post for sale. Your use of Google Maps/Earth is subject to <a href=\"http://www.google.com/intl/en_us/help/terms_maps.html\" target=\"_blank\">Google’s terms of use</a> and <a href=\"http://www.google.com/privacy\">Google’s privacy policy</a> as may be amended by Google from time to time. </p>\n" +
    "\n" +
    "    <p>19. The Platform utilizes Facebook Connect API(s) to allow you to log on to the Platform using your Facebook account. Your use of Facebook is subject to <a href=\"https://www.facebook.com/policies/\">Facebook’s terms and policies</a>, as may be amended by Facebook from time to time. </p>\n" +
    "\n" +
    "    <p>20. HashtagSell, Inc. uses Braintree, a division of PayPal, Inc. (Braintree) for payment processing services. By using the Braintree payment processing services you agree to the Braintree Payment Services Agreement available at <a href=\"https://www.braintreepayments.com/legal/gateway-agreement\">https://www.braintreepayments.com/legal/gateway-agreement</a>, and the applicable bank agreement available at <a href=\"https://www.braintreepayments.com/legal/cea-wells\">https://www.braintreepayments.com/legal/cea-wells</a>. </p>\n" +
    "\n" +
    "    <h4>Amendments.</h4>\n" +
    "\n" +
    "    <p>21. HashtagSell may change how we collect and then use Personal Information at any time, at our sole discretion. </p>\n" +
    "\n" +
    "    <p>22. We may change this Privacy Policy at any time. If we make material changes to the Privacy Policy, we will notify you either by posting the changed Privacy Policy on the Platform or by sending an e-mail to you. We will also update the “Last Updated Date” and the “Effective Date” at the top of this Privacy Policy. If we let you know of changes through an email communication, then the date on which the e-mail is sent shall be the deemed to be the date of your receipt of that email. </p>\n" +
    "\n" +
    "    <p>23. It’s important that you review the changed Privacy Policy. If you do not wish to agree to the changed Privacy Policy, then we will not be able to continue providing the Platform to you, and your only option will be to stop accessing the Platform and deactivate your HashtagSell account. </p>\n" +
    "\n" +
    "    <h4>Applicable Law.</h4>\n" +
    "\n" +
    "    <p>24. International Users. If you are located anywhere outside of the United States, please be aware that information we collect, including, Personal Information, will be transferred to, processed and stored in the United States. The data protection laws in the United States may differ from those of the country in which you are located, and your Personal Information may be subject to access requests from governments, courts, or law enforcement in the United States according to laws of the United States. By using the Platform or providing us with any information, you consent to this transfer, processing and storage of your information in the United States. </p>\n" +
    "\n" +
    "    <p>25. Notice to California Residents. Under California Civil Code Section 1798.83 (known as the “Shine the Light” law), HashtagSell customers who are residents of California may request certain information regarding the disclosure of your Personal Information during the immediate prior calendar year to third parties for their direct marketing purposes. To make such a request, please write to us at the following address: </p>\n" +
    "\n" +
    "    <p>HashtagSell, Inc.<br>\n" +
    "    Customer Service<br>\n" +
    "    1819 Polk Street #323<br>\n" +
    "    San Francisco, Ca 94109</p>\n" +
    "\n" +
    "    <p>or send us your request electronically <a href=\"mailto:contact@hashtagsell.com\" target=\"_blank\">contact us</a> .</p>\n" +
    "\n" +
    "    <p>Questions and Comments.</p>\n" +
    "\n" +
    "    <p>If you’d like to provide feedback to us about this Privacy Policy, or if you have any questions, please <a href=\"mailto:contact@hashtagsell.com\" target=\"_blank\">contact us</a> . </p>\n" +
    "\n" +
    "    <p>Last Modified: 15th May 2015<br>\n" +
    "    © 2015 HashtagSell, Inc.</p>\n" +
    "</div>"
  );


  $templateCache.put('js/legal/termsOfService/partials/termsOfService.partial.html',
    "<style>\n" +
    "    body, html {\n" +
    "        background-color: #ECF0F5;\n" +
    "        overflow-y: auto;\n" +
    "        overflow-x: hidden;\n" +
    "        font-weight: 200;\n" +
    "    }\n" +
    "</style>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "    <h3>HashtagSell Terms of Service</h3>\n" +
    "    <p>Last Updated on May 15th, 2015</p>\n" +
    "\n" +
    "    <p>Effective as of May 15th, 2015</p>\n" +
    "    <p>Use of the Services. We grant you the nonexclusive right to use the Services only for your personal use, subject to these terms. You are solely responsible for all content and other information that you post or submit via the Services (including your listings and any communications you make through the Services with us or other users) and any consequences that may result from your content and other information. You must comply with applicable third party terms of agreement when using the Services (e.g. your wireless data service agreement). Your right to use the Services will terminate immediately if you violate any provision of these terms.</p>\n" +
    "    <p>Restrictions on Use. As a condition of your use of the Services you agree that you will not:</p>\n" +
    "    <ul>\n" +
    "        <li>modify, copy, publish, license, sell, or otherwise commercialize the Services or any information or software associated with the Services;</li>\n" +
    "        <li>rent, lease or otherwise transfer rights to the Services;</li>\n" +
    "        <li>use the Services in any manner that could impair any of our websites or applications in any way or interfere with any party’s use or enjoyment of any such site or application;</li>\n" +
    "        <li>violate any laws;</li>\n" +
    "        <li>violate our <a ui-sref=\"postingRules\">posting rules</a>;\n" +
    "        <li>post any threatening, abusive, defamatory, obscene or indecent material;</li>\n" +
    "        <li>be false or misleading;</li>\n" +
    "        <li>infringe any third-party right;</li>\n" +
    "        <li>distribute or contain spam, chain letters, or pyramid schemes;</li>\n" +
    "        <li>impose an unreasonable load on our infrastructure or interfere with the proper working of the Services;</li>\n" +
    "        <li>copy, modify, or distribute any other person’s content without their consent;</li>\n" +
    "        <li>use any robot spider, scraper or other automated means to access the Services and collect content for any purpose without our express written permission;</li>\n" +
    "        <li>harvest or otherwise collect information about others, including email addresses, without their consent; and/or</li>\n" +
    "        <li>bypass measures used to prevent or restrict access to the Services.</li>\n" +
    "    </ul>\n" +
    "    <p>Abusing the Services. Please report problems, offensive content and policy breaches to us.</p>\n" +
    "    <p>Without limiting other remedies, we may issue warnings, limit or terminate the Services, remove hosted content and take technical and legal steps to keep users off the Services if we think that they are creating problems or acting inconsistently with the letter or spirit of our policies. However, whether we decide to take any of these steps, remove hosted content or keep a user off the Services or not, we do not accept any liability for monitoring the Services or for unauthorized or unlawful content on the Services or use of the Services by users. You also recognize and accept that we are not under any obligation to monitor any content or other information that is communicated through or available on the Services.</p>\n" +
    "    <p>Global Marketplace. Some of our features may display your ad on other sites that are part of the global HashtagSell community, like on eBay Classifieds or our classifieds sites in other countries. By using the Services, you agree that your ads can be displayed on these other sites. The terms for our other sites are similar to these terms, but you may be subject to additional laws or other restrictions in the countries where your ad is posted. When you choose to post your ad on another site, you may be responsible for ensuring that it does not violate our other site policies. We may remove your ad if it is reported on any our sites, or if we believe it causes problems or violates any law or policy.</p>\n" +
    "    <p>Fees and Services. Using the Services is generally free, but we sometimes charge a fee for certain Services. If the Service you use incurs a fee, you’ll be able to review and accept terms that will be clearly disclosed at the time you post your ad. Our fees are quoted in US Dollars, and we may change them from time to time. We’ll notify you of changes to our fee policy by posting such changes on the site. We may choose to temporarily change our fees for promotional events or new services; these changes are effective when we announce the promotional event or new service.</p>\n" +
    "    <p>Our fees are non-refundable, and you are responsible for paying them when they’re due. If you do not, we may limit your ability to use the Services. If your payment method fails or your account is past due, we may collect fees owed using other collection mechanisms.</p>\n" +
    "    <p>Intellectual Property &amp; Content. We own, or are the licensee to, all right, title and interest in and to the Services, including all rights under patent, copyright, trade secret, trademark, or unfair competition law, and any and all other proprietary rights, including all applications, renewals, extensions and restorations thereof. You will not modify, adapt, translate, prepare derivative works from, decompile, reverse-engineer, disassemble or otherwise attempt to derive source code from the Services and you will not remove, obscure or alter our copyright notice, trademarks or other proprietary rights notices affixed to, contained within or accessed in conjunction with or by the Services.</p>\n" +
    "    <p>Our Services contain content from us, you, and other users. Content displayed on or via the Services is protected as a collective work and/or compilation, pursuant to copyrights laws and international conventions. You agree not to copy, distribute, modify, reproduce, copy, sell, resell, or exploit for any purposes any aspect of the Services (other than your own content) without our express written consent.</p>\n" +
    "    <p>When providing us with content or causing content to be posted using our Services, you grant us a non-exclusive, worldwide, perpetual, irrevocable, royalty-free, sublicensable (through multiple tiers) right to exercise any and all copyright, publicity, trademarks, database rights and other intellectual property rights you have in the content, in any media known now or developed in the future. Further, to the fullest extent permitted under applicable law, you waive your moral rights and promise not to assert such rights or any other intellectual property or publicity rights against us, our sublicensees, or our assignees.</p>\n" +
    "    <p>Infringement. Do not post content that infringes the rights of third parties, This includes, but is not limited to, content that infringes on intellectual property rights such as copyright and trademark (e.g. offering counterfeit items for sale). A large number of very varied products are offered on the Services by private individuals. Entitled parties, in particular the owners of copyright, trademark rights or other rights owned by third parties can report any offers which many infringe on their rights, and submit a request for this offer to be removed. If a legal representative of the entitled party reports this to us in the correct manner, products infringing on the intellectual property rights will be removed by us.</p>\n" +
    "    <p>Braintree Service. HashtagSell, Inc. uses Braintree, a division of PayPal, Inc. (Braintree) for payment processing services. By using the Braintree payment processing services you agree to the Braintree Payment Services Agreement available at <a href=\"https://www.braintreepayments.com/legal/gateway-agreement\" target=\"_blank\">https://www.<wbr>braintreepayments.com/legal/<wbr>gateway-agreement</a>, and the applicable bank agreement available at <a href=\"https://www.braintreepayments.com/legal/cea-wells\" target=\"_blank\">https://www.<wbr>braintreepayments.com/legal/<wbr>cea-wells</a>.</p>\n" +
    "    <p>Reporting Intellectual Property Infringements (HashtagSell Notice and Take Down Program)</p>\n" +
    "    <p>If you have a good faith belief that your work has been copied in a way that constitutes copyright infringement, or that your intellectual property rights have been otherwise violated, please provide our designated agent with the following information:</p>\n" +
    "    <ol>\n" +
    "        <li>a physical or electronic signature of the person authorized to act on behalf of the owner of the copyright or other intellectual property interest that is allegedly infringed;</li>\n" +
    "        <li>identification or description of the copyrighted work or other intellectual property that you claim has been infringed. If you are asserting infringement of an intellectual property right other than copyright, please specify the intellectual property right at issue (for example, trademark or patent);</li>\n" +
    "        <li>identification or description of where the material that you claim is infringing is located within the Services, with enough detail that we may find it;</li>\n" +
    "        <li>your address, telephone number, and email address;</li>\n" +
    "        <li>a statement by you that you have a good faith belief that the use of the material complained of is not authorized by the copyright or intellectual property owner, its agent, or the law;</li>\n" +
    "        <li>a statement by you, made under penalty of perjury, that the information in your notice is accurate and that you are the copyright or intellectual property owner or authorized to act on the copyright or intellectual property owner&#39;s behalf. Our agent designated to receive claims of copyright or other intellectual property infringement may be contacted as follows:</li>\n" +
    "    </ol>\n" +
    "    <p>By mail:<br>\n" +
    "        Attn: HashtagSell<br>\n" +
    "        1819 Polk Street #323<br>\n" +
    "        San Francisco, Ca  94109</p>\n" +
    "    <p>By phone: (415)-662-8809</p>\n" +
    "    <p>By email: <a href=\"mailto:copyright@hashtagsell.com\" target=\"_blank\">copyright@hashtagsell.com</a></p>\n" +
    "    <p>We have adopted and implemented a policy that provides for the termination in appropriate circumstances of the accounts of users who repeatedly infringe copyrights or other intellectual property rights of ours and/or others.</p>\n" +
    "    <p>Other Users; Release. You agree not to hold us responsible for things other users post or do. We do not review users’ postings and (except as may be expressly set out in these terms) are not involved in the actual transactions between users. As most of the content on the Services comes from other users, we do not guarantee the accuracy of postings or user communications or the quality, safety, or legality of what’s offered. If you have a dispute with one or more users, you release us (and our affiliates and subsidiaries, and our and their respective officers, directors, employees and agents) from claims, demands and damages (actual and consequential) of every kind and nature, known and unknown, arising out of or in any way connected with such disputes. In entering into this release you expressly waive any protections (whether statutory or otherwise) that would otherwise limit the coverage of this release to include only those claims which you may know or suspect to exist in your favor at the time of agreeing to this release.</p>\n" +
    "    <p>Disclaimer of Warranties. WE DISCLAIM RESPONSIBILITY FOR ANY HARM RESULTING FROM YOUR USE OF THE SERVICES. THE SERVICES, INCLUDING OTHER SERVICE(S) ACCESSED BY THE APPLICATION ARE PROVIDED “AS IS” AND “AS AVAILABLE”. WE EXPRESSLY DISCLAIM TO THE FULLEST EXTENT PERMITTED BY LAW ALL EXPRESS, IMPLIED AND STATUTORY WARRANTIES, INCLUDING WITHOUT LIMITATION THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT OF PROPRIETARY RIGHTS, AND ANY WARRANTIES REGARDING THE SECURITY, RELIABILITY, TIMELINESS AND PERFORMANCE OF THE SERVICES. YOU DOWNLOAD THE APPLICATION AND USE THE SERVICES AT YOUR OWN DISCRETION AND RISK, AND YOU ARE SOLELY RESPONSIBLE FOR ANY DAMAGES TO YOUR HARDWARE DEVICE(S) OR LOSS OF DATA THAT RESULTS FROM THE DOWNLOAD OF THE APPLICATION OR USE OF THE SERVICES. WE CANNOT GUARANTEE CONTINUOUS, ERROR-FREE OR SECURE ACCESS TO THE SERVICES OR THAT DEFECTS IN THE SERVICES WILL BE CORRECTED. NOTIFICATION FUNCTIONALITY IN THE APPLICATION MAY NOT OCCUR IN REAL TIME. SUCH FUNCTIONALITY IS SUBJECT TO DELAYS BEYOND OUR CONTROL, INCLUDING WITHOUT LIMITATION, DELAYS OR LATENCY DUE TO YOUR PHYSICAL LOCATION OR YOUR WIRELESS DATA SERVICE PROVIDER’S NETWORK.</p>\n" +
    "    <p>Limitation of Liability. We are not liable to you or any user for any use or misuse of the Services. This exclusion: (a) includes direct, indirect, incidental, consequential, special, exemplary and punitive damages, whether such claim is based on warranty, contract, tort or otherwise (even if we have been advised of the possibility of such damages); (b) applies whether damages arise from use or misuse of and reliance on the Services, from inability to use the Services, or from the interruption, suspension, or termination of the Services (including any damages incurred by third parties); and (c) applies notwithstanding a failure of the essential purpose of any limited remedy and to the fullest extent permitted by law.</p>\n" +
    "    <p>Despite the previous paragraph, if we are found to be liable, our liability to you or any third party (whether based on contract, tort, negligence, strict liability or otherwise) is limited to the greater of (a) the total fees you pay to us in the 12 months prior to the action giving rise to liability, and (b) 100 US dollars.</p>\n" +
    "    <p>Some jurisdictions do not allow the disclaimer of warranties or exclusion of damages, so the disclaimers in the preceding section and the above limitations and exclusions of liability may not apply to you.</p>\n" +
    "    <p>Indemnification. You will indemnify and hold harmless us (and our affiliates and subsidiaries, and our and their respective officers, directors, employees, agents) against and from any claim or demand, including reasonable legal fees, made by any third party due to or arising out of your conduct, your use of the Services, any alleged violation of these terms, and any alleged violation of any applicable law or regulation. We reserve the right, at our own expense, to assume the exclusive defense and control of any matter subject to indemnification by you, but doing so will not excuse your indemnity obligations. Security. We reserve the right at our discretion to take whatever action we find necessary to preserve the security, integrity and reliability of our network and back-office applications.</p>\n" +
    "    <p>Changes to the Services or Terms of Use. We reserve the right to make changes to the Services and/or these terms from time to time. Any material changes will take effect when you next use the Services or after 30 days, whichever is sooner. If you do not agree to any change, please uninstall the Application and discontinue your use of the Services. No other amendment to these terms will be effective unless made in writing, signed by users and by us.</p>\n" +
    "    <p>Compliance with Certain Laws. You are responsible for complying with trade regulations and both foreign and domestic laws. You represent and warrant that you are not located in a country that is subject to a US Government embargo, or that has been designated by the US Government as a “terrorist supporting” country and you are not listed on any US Government list of prohibited or restricted parties. Our Application or its underlying technology may not be downloaded to or exported or re-exported: (a) into (or to a resident or national of) Cuba, Iraq, Iran, Libya, North Korea, Syria or any other country subject to United States embargo; (b) to anyone on the US Treasury Department’s list of Specially Designated Nationals or on the US Commerce Department’s Denied Party or Entity List; and (c) you will not export or re-export this Application to any prohibited country, person, end-user or entity specified by US Export Laws.</p>\n" +
    "    <p>Miscellaneous Provisions. These terms and the other policies posted on or accessed by the Services constitute the entire agreement between you and us regarding the subject matter of these terms, superseding any prior agreements relating to that subject matter. To the extent permitted by applicable law, these terms shall be governed and construed in all respects by the laws of the State of California without regard to its conflict of law provisions. You agree that any claim or dispute you may have against us must be resolved by the courts of the United States, and you and we both agree to submit to the non-exclusive jurisdiction of San Francisco, California. If we do not enforce any particular provision, we are not waiving our right to do so later. If a court strikes down any of these terms, the remaining terms will survive. We may automatically assign these terms in our sole discretion in accordance with the notice provision below. Except for notices relating to illegal or infringing content, your notices to us must be sent by registered mail to:</p>\n" +
    "    <p>HashtagSell<br>\n" +
    "    1819 Polk Street #323<br>\n" +
    "    San Francisco, Ca  94109</p>\n" +
    "    <p>We will send notices to you via the email address you provide, or by registered mail. Notices sent by registered mail will be deemed received five days following the date of mailing.</p>\n" +
    "    <p>Last Modified: 15th May 2015<br>\n" +
    "    © 2015 HashtagSell, Inc.</p>\n" +
    "</div>"
  );


  $templateCache.put('js/modalConfirmation/partials/modalConfirmation.html',
    "<div class=\"modal-header\">\n" +
    "    <h3>{{modalOptions.headerText}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <p>{{modalOptions.bodyText}}</p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn\"\n" +
    "            data-ng-click=\"modalOptions.close()\">{{modalOptions.closeButtonText}}</button>\n" +
    "    <button class=\"btn btn-primary\"\n" +
    "            data-ng-click=\"modalOptions.ok();\">{{modalOptions.actionButtonText}}</button>\n" +
    "</div>"
  );


  $templateCache.put('js/myPosts/meetings/partials/myPosts.meetings.html',
    "<div ng-repeat=\"offer in post.offers.results\">\n" +
    "\n" +
    "    <div style=\"border: 1px solid; border-color: #e5e6e9 #dfe0e4 #d0d1d5; margin-bottom: 20px; padding: 0px;\" class=\"col-md-10 col-xs-12\" ng-class=\"{ 'proposal-sent': offer.proposals[cachedOffers[$index].proposals.length - 1].isOwnerReply, 'proposal-accepted': offer.proposals[cachedOffers[$index].proposals.length - 1].acceptedAt }\" ng-class=\"{ 'proposal-sent': offer.proposals[cachedOffers[$index].proposals.length - 1].isOwnerReply, 'proposal-accepted': offer.proposals[cachedOffers[$index].proposals.length - 1].acceptedAt }\" construct-my-posts-overlay-message offer=\"offer\" post=\"post\" message=\"css content string dynamically added\">\n" +
    "        <div style=\"background-color: #ffffff; padding: 10px;\">\n" +
    "            <div>\n" +
    "                <img ng-src=\"{{offer.userProfile.profile_photo}}\" height=\"40\" style=\"position: relative; top: -12px;\">\n" +
    "                <div style=\"display: inline-block\">\n" +
    "                    <div>\n" +
    "                        @{{offer.username}}\n" +
    "                    </div>\n" +
    "                    <div>\n" +
    "                        {{offer.modifiedAt | date:\"MMMM d 'at' h:mma\"}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "\n" +
    "                    <div>\n" +
    "                        <span ng-show=\"offer.proposals[cachedOffers[$index].proposals.length - 1].comment\"><i>\"{{offer.proposals[cachedOffers[$index].proposals.length - 1].comment}}\"</i></span>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <br>\n" +
    "\n" +
    "                    <div class=\"controls\">\n" +
    "                        <div class=\"input-group input-group-lg\">\n" +
    "                            <span class=\"input-group-addon\">$</span>\n" +
    "                            <input class=\"form-control\" type=\"text\" id=\"price\" name=\"price\" ng-model=\"offer.proposals[offer.proposals.length - 1].price.value\" ng-disabled=\"true\"/>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <br>\n" +
    "\n" +
    "                    <div class=\"controls\">\n" +
    "                        <div class=\"input-group input-group-lg\">\n" +
    "                            <span class=\"input-group-addon\">@</span>\n" +
    "                            <input class=\"form-control\" type=\"text\" id=\"location\" name=\"location\" ng-model=\"offer.proposals[offer.proposals.length - 1].where\" ng-disabled=\"true\"/>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <br>\n" +
    "\n" +
    "                    <div class=\"btn-group\" role=\"group\">\n" +
    "                        <label class=\"btn btn-default btn-lg\" disabled=\"true\"><i class=\"fa fa-clock-o\"></i></label>\n" +
    "                        <label class=\"btn btn-default btn-lg\" ng-repeat=\"proposedTime in offer.proposals[offer.proposals.length - 1].when\" btn-radio=\"proposedTime\" ng-model=\"acceptedTime.model\" ng-change=\"errors.message = null\">{{proposedTime | date:'MMM d, h:mm a'}}</label>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div ng-show=\"errors.message\">\n" +
    "                        <span class=\"text-danger\">{{errors.message}}</span>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"read-question\">\n" +
    "\n" +
    "            <div style=\"display: inline-block; position: relative;\">\n" +
    "                <button class=\"btn btn-primary\" ng-click=\"counterOffer($index, offer.proposals[offer.proposals.length - 1])\">Send Counter Offer</button>\n" +
    "            </div>\n" +
    "\n" +
    "            <div style=\"display: inline-block; position: relative;\">\n" +
    "                <button class=\"btn btn-success\" ng-click=\"acceptDeal($index, offer.proposals[offer.proposals.length - 1])\">Accept Offer</button>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"col-xs-12\">\n" +
    "    <span ng-show=\"!post.offers.results.length\">Buyer's offers will appear here.</span>\n" +
    "</div>"
  );


  $templateCache.put('js/myPosts/partials/myPosts.html',
    "<div ui-view></div>\n" +
    "\n" +
    "<div class=\"outer-container-myposts custom-myposts-well\">\n" +
    "\n" +
    "    <div ng-show=\"!userPosts.data.length\" class=\"background-instructions\">\n" +
    "        <div class=\"inset-background-text\">\n" +
    "            :( Awww... You're not selling anything.  <span ng-click=\"newPost();\" style=\"cursor: pointer; color: rgb(66, 139, 202);\">Try it out?</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div ng-show=\"userPosts.data.length\">\n" +
    "        <table class=\"table table-striped table-hover\" ng-table=\"tableParams\">\n" +
    "            <thead>\n" +
    "                <tr>\n" +
    "                    <th>\n" +
    "                        <!--<input type=\"text\" ng-model=\"filters.$\" placeholder=\"Search Favorites\" style=\"width:98%; margin:0px;\"/>-->\n" +
    "                    </th>\n" +
    "                    <th>\n" +
    "                        <input class=\"form-control\" ng-model=\"filters.$\" placeholder=\"Filter posts\" />\n" +
    "                    </th>\n" +
    "                </tr>\n" +
    "            </thead>\n" +
    "        </table>\n" +
    "\n" +
    "        <div class=\"inner-myposts-container\">\n" +
    "            <div class=\"myposts-container\">\n" +
    "\n" +
    "                <table class=\"table table-striped table-hover\" ng-show=\"userPosts.data.length\" ng-table=\"tableParams\">\n" +
    "                    <thead>\n" +
    "\n" +
    "                    </thead>\n" +
    "                    <tbody>\n" +
    "\n" +
    "                        <!--TODO: Open splash on click-->\n" +
    "                        <tr ng-repeat-start=\"post in $data\" style=\"cursor: pointer\" ng-click=\"openSplash(post)\">\n" +
    "\n" +
    "                            <td style=\"width:1px;\">\n" +
    "                                <img ng-show=\"post.images.length\" ng-src=\"{{post.images[0].thumbnail || post.images[0].full}}\" style=\"height:70px; width: 70px;\">\n" +
    "                                <div ng-show=\"!post.images.length\" class=\"myPosts-noImage-Placeholder\"></div>\n" +
    "                            </td>\n" +
    "\n" +
    "                            <td>\n" +
    "                                <h4>\n" +
    "                                    {{::post.heading | cleanHeading}} - {{::post.askingPrice.value | currency : $ : 0}}\n" +
    "                                    <span ng-show=\"post.facebook\" class=\"label label-primary\" ng-click=\"showFacebookPost(post); $event.stopPropagation();\" tooltip=\"Show Facebook post\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"bottom\" style=\"font-weight: inherit;\">Facebook</span>\n" +
    "                                    <span ng-show=\"post.twitter\" class=\"label label-info\" ng-click=\"showTwitterPost(post); $event.stopPropagation();\" tooltip=\"Show Twitter Post\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"bottom\" style=\"font-weight: inherit;\">Twitter</span>\n" +
    "                                    <span ng-show=\"post.ebay\" class=\"label label-warning\" ng-click=\"showEbayPost(post); $event.stopPropagation();\" tooltip=\"Show Ebay Post\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"bottom\" style=\"font-weight: inherit;\">Ebay</span>\n" +
    "                                </h4>\n" +
    "\n" +
    "                                <!--<div ng-bind-html=\"post.body\"/>-->\n" +
    "\n" +
    "                                <div style=\"float: left;\">\n" +
    "                                    <button class=\"btn btn-default\" type=\"button\" ng-init=\"unreadQuestionsCount = countUnreadQuestions(post);\" ng-click=\"expandCollapseQuestions($event, post)\">\n" +
    "                                        <i class=\"fa\" ng-class=\"post.currentlyViewing.questions ? 'fa-chevron-down' : 'fa-chevron-right'\"></i> Questions <span ng-if=\"unreadQuestionsCount > 0\" class=\"badge\">{{unreadQuestionsCount}}</span>\n" +
    "                                    </button>\n" +
    "\n" +
    "                                    <button class=\"btn btn-default\" type=\"button\" ng-init=\"unreadOffersCount = countUnreadOffers(post);\" ng-click=\"expandCollapseMeetingRequests($event, post)\">\n" +
    "                                        <i class=\"fa\" ng-class=\"post.currentlyViewing.meetings ? 'fa-chevron-down' : 'fa-chevron-right'\"></i> Offers <span ng-if=\"unreadOffersCount > 0\" class=\"badge\">{{unreadOffersCount}}</span>\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div style=\"float: right;\">\n" +
    "                                    <i class=\"fa fa-trash-o fa-2x\" ng-click=\"deletePost(post); $event.stopPropagation();\" style=\"margin-right: 20px;\" tooltip=\"Delete post\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"left\"></i>\n" +
    "                                    <i class=\"fa fa-pencil-square-o fa-2x\" ng-click=\"editPost(post); $event.stopPropagation();\" style=\"margin-right: 20px;\" tooltip=\"Edit post\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"left\"></i>\n" +
    "                                </div>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "\n" +
    "                        <tr ng-show=\"currentState === 'myposts.questions' && expandedPostingId === post.postingId\" style=\"background-color: rgb(253, 253, 253);\">\n" +
    "                            <td colspan=\"2\" style=\"background-color: rgb(253, 253, 253);\">\n" +
    "                                <owner-questions-more-info post=\"post\"></owner-questions-more-info>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "\n" +
    "                        <tr ng-repeat-end ng-show=\"currentState === 'myposts.meetings' && expandedPostingId === post.postingId\" style=\"background-color: rgb(253, 253, 253);\">\n" +
    "                            <td colspan=\"2\" style=\"background-color: rgb(253, 253, 253);\">\n" +
    "                                <owner-meetings-more-info post=\"post\"></owner-meetings-more-info>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('js/myPosts/questions/partials/myPosts.questions.html',
    "<div ng-repeat=\"question in post.questions.results\">\n" +
    "    <div style=\"border: 1px solid; border-color: #e5e6e9 #dfe0e4 #d0d1d5; margin-bottom: 20px; padding: 0px;\" class=\"col-md-10 col-xs-12\">\n" +
    "        <div style=\"background-color: #ffffff; padding: 10px;\">\n" +
    "            <div>\n" +
    "                <img ng-src=\"{{question.userProfile.profile_photo}}\" height=\"40\" style=\"position: relative; top: -12px;\">\n" +
    "                <div style=\"display: inline-block\">\n" +
    "                    <div>\n" +
    "                        @{{question.username}}\n" +
    "                    </div>\n" +
    "                    <div>\n" +
    "                        {{question.modifiedAt | date:\"MMMM d 'at' h:mma\"}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    <div class=\"dropdown\" dropdown on-toggle=\"toggled(open)\" style=\"position: absolute; top: 10px; right: 15px;\">\n" +
    "                      <a href class=\"dropdown-toggle\" dropdown-toggle><i class=\"fa fa-chevron-down\"></i></a>\n" +
    "                      <ul class=\"dropdown-menu dropdown-menu-right\">\n" +
    "                          <li>\n" +
    "                              <a href ng-click=\"deleteQuestion(question.postingId, question.questionId, $index)\">Delete Question</a>\n" +
    "                          </li>\n" +
    "                      </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    Q: {{question.value}}\n" +
    "                </div>\n" +
    "                <div ng-show=\"question.answers.length\">\n" +
    "                    <div ng-repeat=\"answer in question.answers\">\n" +
    "                        A: {{answer.value}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-class=\"question.answers.length ? 'read-question' : 'unread-question'\">\n" +
    "            <img ng-src={{userObj.user_settings.profile_photo}} height=\"32\">\n" +
    "            <div style=\"display: inline-block; width: 70%; position: relative; top: 5px;\">\n" +
    "                <input class=\"col-md-7 col-xs-12 form-control\" height=\"32\" style=\"position: relative; top: 8px;\" ng-keyup=\"$event.keyCode == 13 && submitAnswer(question, $index)\" placeholder=\"Add answer\" ng-model=\"question.givenAnswer\"/>\n" +
    "            </div>\n" +
    "            <button class=\"btn btn-primary\" ng-click=\"submitAnswer(question, $index)\">Send</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"col-xs-12\">\n" +
    "    <!--<a ng-show=\"showAnswered && post.questions.results.length\" ng-click=\"showAnswered = !showAnswered\">Hide questions already answered?</a>-->\n" +
    "    <!--<a ng-show=\"!showAnswered && post.questions.results.length\" ng-click=\"showAnswered = !showAnswered\">Show questions already answered?</a>-->\n" +
    "    <span ng-show=\"!post.questions.results.length\">Buyer's questions about your {{post.heading | capitalize}} will appear here.</span>\n" +
    "</div>"
  );


  $templateCache.put('js/newPost/modals/congrats/partials/newPost.congrats.html',
    "<div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <div style=\"text-align: center\">\n" +
    "            <i class=\"fa fa-check-circle fa-5x\" style=\"color:#428bca\"></i>&nbsp;<span style=\"font-size: 36px;\">Congratulations!</span>\n" +
    "            <br>\n" +
    "            <!--<h5>You can edit or modify your post <a ui-sref=\"selling\">here</a> or share this link with others-->\n" +
    "                <!--<a ng-href=\"https://www.hashtagsell.com/#/{{newPost.postingId}}\">www.HashtagSell.com/#/{{newPost.postingId}}</a>.-->\n" +
    "            <!--</h5>-->\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button class=\"btn btn-default\" ng-click=\"dismiss('dismiss')\">Done</button>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('js/newPost/modals/newPost/partials/newPost.html',
    "<div class=\"modal-header hts-post-title\">\n" +
    "    <!--<span class=\"pull-left hover-pointer\" ng-click=\"alert('fullscreen zen editor soon.')\">-->\n" +
    "        <!--<i class=\"fa fa-arrows-alt\"></i>-->\n" +
    "    <!--</span>-->\n" +
    "    <span ng-show=\"!jsonObj.category_name  && !manualCategorySelect.show\">Create New Post</span>\n" +
    "    <select ng-show=\"jsonObj.category_name || manualCategorySelect.show\" ng-change=\"manualCategorySelect.init()\" class=\"btn btn-mini category-select\" ng-model=\"jsonObj.category\" tooltip-placement=\"bottom\" tooltip=\"{{manualCategorySelect.tooltip}}\" tooltip-trigger=\"show\">\n" +
    "        <optgroup ng-repeat=\"category in allCategories\" label=\"{{category.name}}\">\n" +
    "            <option ng-repeat=\"childCategory in category.categories\" value=\"{{childCategory.code}}\">{{childCategory.name | capitalize}}</option>\n" +
    "        </optgroup>\n" +
    "    </select>\n" +
    "    <span ng-show=\"jsonObj.category_name\" class=\"drop-down-caret\">\n" +
    "        <i class=\"fa fa-angle-down\"></i>\n" +
    "    </span>\n" +
    "\n" +
    "    <span class=\"close-sell-box\" ng-click=\"dismiss('cancel post')\">\n" +
    "        <i class=\"fa fa-close\" style=\"font-size: 1.5em;\"></i>\n" +
    "    </span>\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"modal-body dropzone hts-post-modal-body\" dropzone=\"dropzoneConfig\">\n" +
    "\n" +
    "    <alert type=\"info\" style=\"font-size: 17px;\" close=\"clearExampleReminder()\" ng-show=\"toggleExampleVisibility\">\n" +
    "        <b>Example: </b>\n" +
    "        \"<i>I'm selling my <span class=\"mention-highlighter\" contenteditable=\"false\">#item name</span>&nbsp;\n" +
    "        for  <span  class=\"mention-highlighter-price\" contenteditable=\"false\">$item price</span>&nbsp;\n" +
    "        <span class=\"mention-highlighter-location\" contenteditable=\"false\">@meeting location</span>&nbsp;\"</i>\n" +
    "        <br>\n" +
    "        <br>\n" +
    "        <small>Pro tip: Multiple hashtags make our product prediction smarter!  Also, don't include a price if you're listing an item for free.</small>\n" +
    "        <br>\n" +
    "        <br>\n" +
    "        <button ng-show=\"!showDemo\" class=\"btn btn-primary\" ng-click=\"hideDemo()\">Show video example</button>\n" +
    "        <button ng-show=\"showDemo\" class=\"btn btn-primary\" ng-click=\"hideDemo()\">Stop video</button>\n" +
    "    </alert>\n" +
    "\n" +
    "    <alert ng-repeat=\"banner in alerts.banners\" type=\"{{banner.type}}\" close=\"closeAlert($index)\">{{banner.msg}}</alert>\n" +
    "\n" +
    "    <!--<pre>-->\n" +
    "        <!--{{jsonObj}}-->\n" +
    "    <!--</pre>-->\n" +
    "\n" +
    "    <img class='sell-box-image img-responsive' ng-src='{{img}}' ng-show=\"showDemo\"/>\n" +
    "\n" +
    "    <div class=\"sell-box\" ng-show=\"!showDemo\">\n" +
    "        <div class=\"row remove-row-margins\">\n" +
    "            <div class=\"hts-input-container\">\n" +
    "                <div id=\"htsPost\"\n" +
    "                     ng-class=\"jsonObj.category_name ? 'col-md-10' : 'col-md-12' \"\n" +
    "                     class=\"hts-input needsclick\" style=\"clear:both;\"\n" +
    "                     mentio\n" +
    "                     contenteditable\n" +
    "                     sellbox\n" +
    "                     ng-paste=\"handlePaste($event)\"\n" +
    "                     ng-focus=\"clearPlaceholder()\"\n" +
    "                     mentio-require-leading-space=\"false\"\n" +
    "                     mentio-macros=\"macros\"\n" +
    "                     mentio-id=\"'hashtag'\"\n" +
    "                     mentio-typed-term=\"typedTerm\"\n" +
    "                     ng-model=\"jsonObj.body\">\n" +
    "                    <span>Try it yourself, begin typing here...</span>\n" +
    "                </div>\n" +
    "\n" +
    "                <div ng-class=\"{ 'hts-annotations-container' : jsonObj.category_name}\">\n" +
    "                    <div ng-show=\"jsonObj.annotations.length\" ng-repeat=\"annotation in jsonObj.annotations\">\n" +
    "                        <input ng-model=\"jsonObj.annotations[$index].value\" placeholder=\"{{annotation.key}}\" class=\"hts-annotation-input\">\n" +
    "                    </div>\n" +
    "                    <div ng-show=\"!jsonObj.annotations.length && jsonObj.category_name\">\n" +
    "                        <div class=\"spinner\">\n" +
    "                            <div class=\"bounce1\"></div>\n" +
    "                            <div class=\"bounce2\"></div>\n" +
    "                            <div class=\"bounce3\"></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row remove-row-margins\">\n" +
    "            <div class=\"inset-toolbar\">\n" +
    "                <div>\n" +
    "                    <div style=\"position: absolute; bottom: 15px;\">\n" +
    "                        <button id=\"imageUpload\" class=\"btn btn-primary needsclick\" style=\"height: 45px; border-radius: 0px 0px 0px 4px;\">\n" +
    "                            <i class=\"fa fa-camera\"></i> Add photo\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <progressbar value=\"uploadProgress\" id=\"imgPreviewsContainer\" class=\"dz-preview-container progress-striped active\">{{uploadMessage}}</progressbar>\n" +
    "\n" +
    "                    <div style=\"position: absolute; right: 15px; bottom: 15px;\" class=\"sellModalButton\" popover-placement=\"left\" popover=\"Publish on Amazon, eBay, Craigslist, and HashtagSell!\" popover-trigger=\"show\">\n" +
    "                        <button class=\"btn btn-primary\" ng-click=\"validatePost()\" style=\"height: 45px; border-radius: 0px 0px 4px 0px;\">\n" +
    "                            <i class=\"fa fa-slack\"></i> Sell It\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<!--ng-TEMPLATES-->\n" +
    "\n" +
    "<mentio-menu id=\"mentioMenu\" class=\"mentioMenuProducts\"\n" +
    "        mentio-for=\"'hashtag'\"\n" +
    "        mentio-trigger-char=\"'#'\"\n" +
    "        mentio-items=\"products\"\n" +
    "        mentio-template-url=\"/product-mentions.tpl\"\n" +
    "        mentio-search=\"searchProducts(term)\"\n" +
    "        mentio-select=\"getProductTextRaw(item)\">\n" +
    "</mentio-menu>\n" +
    "\n" +
    "<mentio-menu id=\"mentioMenu\" class=\"mentioMenuPlaces\"\n" +
    "        mentio-for=\"'hashtag'\"\n" +
    "        mentio-trigger-char=\"'@'\"\n" +
    "        mentio-items=\"places\"\n" +
    "        mentio-template-url=\"/place-mentions.tpl\"\n" +
    "        mentio-search=\"searchPlaces(term)\"\n" +
    "        mentio-select=\"getPlacesTextRaw(item)\">\n" +
    "</mentio-menu>\n" +
    "\n" +
    "<mentio-menu id=\"mentioMenu\" class=\"mentioMenuPrices\"\n" +
    "        mentio-for=\"'hashtag'\"\n" +
    "        mentio-trigger-char=\"'$'\"\n" +
    "        mentio-items=\"prices\"\n" +
    "        mentio-template-url=\"/price-mentions.tpl\"\n" +
    "        mentio-search=\"searchPrice(term)\"\n" +
    "        mentio-select=\"getPricesTextRaw(item)\">\n" +
    "</mentio-menu>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"/product-mentions.tpl\">\n" +
    "    <ul class=\"list-group user-search demo-scrollable-menu\">\n" +
    "        <li mentio-menu-item=\"product\" ng-repeat=\"product in items\" class=\"list-group-item\">\n" +
    "\n" +
    "            <span class=\"text-primary\" ng-bind-html=\"product.value | mentioHighlight:typedTerm:'menu-highlighted' | unsafe\"></span>\n" +
    "\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</script>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"/place-mentions.tpl\">\n" +
    "    <ul class=\"list-group user-search demo-scrollable-menu\">\n" +
    "        <li mentio-menu-item=\"place\" ng-repeat=\"place in items\" class=\"list-group-item\">\n" +
    "\n" +
    "            <span class=\"text-primary\" ng-bind-html=\"place.description | mentioHighlight:typedTerm:'menu-highlighted' | unsafe\"></span>\n" +
    "\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</script>\n" +
    "\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"/price-mentions.tpl\">\n" +
    "    <ul class=\"list-group user-search demo-scrollable-menu\">\n" +
    "        <li mentio-menu-item=\"price\" ng-repeat=\"price in items\" class=\"list-group-item\">\n" +
    "\n" +
    "            <span class=\"text-primary\" ng-bind-html=\"price.suggestion | mentioHighlight:typedTerm:'menu-highlighted' | unsafe\"></span>\n" +
    "\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</script>\n" +
    "\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"dropzone-thumbnail.html\">\n" +
    "        <div class=\"dz-preview\">\n" +
    "            <img data-dz-thumbnail />\n" +
    "            <i data-dz-remove class=\"fa fa-times dz-remove\"></i>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <strong class=\"error text-danger\" data-dz-errormessage></strong>\n" +
    "        </div>\n" +
    "</script>\n"
  );


  $templateCache.put('js/newPost/modals/pushToExternalSources/partials/newPost.pushToExternalSources.html',
    "<div class=\"modal-header\">\n" +
    "    <h3 class=\"modal-title\" style=\"text-align: center\">Share To</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "    <!--<div class=\"component\">-->\n" +
    "        <div class=\"icon icon-mono facebook\" ng-class=\"{ 'hold': shareToggles.facebook}\" ng-click=\"shareToggles.facebook = !shareToggles.facebook; checkIfFacebookTokenValid();\">\n" +
    "            <div ng-show=\"currentlyPublishing.facebook\" class=\"circ-spinner\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"icon icon-mono twitter\" ng-class=\"{ 'hold': shareToggles.twitter}\" ng-click=\"shareToggles.twitter = !shareToggles.twitter; checkIfTwitterTokenValid()\">\n" +
    "            <div ng-show=\"currentlyPublishing.twitter\" class=\"circ-spinner\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"icon icon-mono ebay\" ng-class=\"{ 'hold': shareToggles.ebay}\" ng-click=\"shareToggles.ebay = !shareToggles.ebay; checkIfEbayTokenValid()\">\n" +
    "            <div ng-show=\"currentlyPublishing.ebay\" class=\"circ-spinner\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"icon icon-mono amazon\" ng-class=\"{ 'hold': shareToggles.amazon}\" ng-click=\"shareToggles.amazon = !shareToggles.amazon\">\n" +
    "            <div ng-show=\"currentlyPublishing.amazon\" class=\"circ-spinner\"></div>\n" +
    "        </div>\n" +
    "        <!--<div class=\"icon icon-mono online-payment\" ng-class=\"{ 'hold': onlinePayment.allow}\" ng-click=\"onlinePayment.allow = !onlinePayment.allow\">-->\n" +
    "            <!--<div ng-show=\"currentlyPublishing.onlinePayment\" class=\"circ-spinner\"></div>-->\n" +
    "        <!--</div>-->\n" +
    "    <!--</div>-->\n" +
    "\n" +
    "    <h3 id=\"instructions\">Boost your post's visibility and allow online payment.</h3>\n" +
    "    <h3 id=\"facebookBlurb\">Share to your facebook timeline for friends to see.</h3>\n" +
    "    <h3 id=\"twitterBlurb\">Share to your twitter timeline for friends to see.</h3>\n" +
    "    <h3 id=\"ebayBlurb\">Share to your existing Ebay account.</h3>\n" +
    "    <h3 id=\"amazonBlurb\">Coming soon!  Share to Amazon.</h3>\n" +
    "    <!--<h3 id=\"onlinePaymentBlurb\">Allow buyer to send online payment.</h3>-->\n" +
    "\n" +
    "    <!--{{shareToggles}}-->\n" +
    "    <!--{{onlinePayment}}-->\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn\" ng-class=\"currentlyPublishing.publishing ? 'btn-warning' : 'btn-primary'\" ng-click=\"dismiss('stageTwoSuccess')\" ng-disabled=\"{{currentlyPublishing.publishing}}\">\n" +
    "        <span ng-show=\"!currentlyPublishing.publishing && shareToggles.facebook ||\n" +
    "         !currentlyPublishing.publishing && shareToggles.twitter ||\n" +
    "         !currentlyPublishing.publishing && shareToggles.ebay ||\n" +
    "         !currentlyPublishing.publishing && shareToggles.amazon\">Share</span>\n" +
    "\n" +
    "\n" +
    "        <span ng-show=\"!currentlyPublishing.publishing && !shareToggles.facebook && !shareToggles.twitter && !shareToggles.ebay && !shareToggles.amazon\">Continue without sharing</span>\n" +
    "\n" +
    "        <span ng-show=\"currentlyPublishing.publishing\">Please wait</span>\n" +
    "    </button>\n" +
    "</div>"
  );


  $templateCache.put('js/notifications/partials/notifications.html',
    "<!--<div class=\"background-instructions\">-->\n" +
    "    <!--<div class=\"inset-background-text\">-->\n" +
    "        <!--Coming soon!  We'll notify you when items you're looking for appear online. :)-->\n" +
    "    <!--</div>-->\n" +
    "<!--</div>-->\n" +
    "\n" +
    "<div class=\"outer-container-myposts custom-myposts-well\">\n" +
    "\n" +
    "    <div ng-show=\"!userPosts.data.length\" class=\"background-instructions\">\n" +
    "        <div class=\"inset-background-text\">\n" +
    "            Coming soon!  Tell us what you're looking for and we'll send you notifications.\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<!--<div class=\"outer-container\">-->\n" +
    "    <!--<div class=\"inner-container\" vs-repeat vs-offset-before=\"200\" vs-excess=\"100\">-->\n" +
    "\n" +
    "        <!--<div class=\"well notification-item\" ng-repeat=\"item in items.collection\">-->\n" +
    "            <!--<div class=\"col-lg-12\">-->\n" +
    "                <!--<span>{{$index}} - {{item.text}}</span>-->\n" +
    "            <!--</div>-->\n" +
    "        <!--</div>-->\n" +
    "\n" +
    "    <!--</div>-->\n" +
    "<!--</div>-->"
  );


  $templateCache.put('js/payment/partials/payment.partial.html',
    "<style>\n" +
    "    .top-level {\n" +
    "        height: 100%;\n" +
    "    }\n" +
    "\n" +
    "    .body-main {\n" +
    "        background: url(\"//static.hashtagsell.com/htsApp/backdrops/flyingPigeon_dark_compressed.jpg\") no-repeat center center fixed;\n" +
    "        background-size: cover;\n" +
    "        height: 100%;\n" +
    "        width: 100%;\n" +
    "    }\n" +
    "\n" +
    "    .root {\n" +
    "        position: absolute;\n" +
    "        top: 0;\n" +
    "        bottom: 0;\n" +
    "        left: 0;\n" +
    "        right: 0;\n" +
    "        overflow-y: auto;\n" +
    "        overflow-x: hidden;\n" +
    "    }\n" +
    "</style>\n" +
    "\n" +
    "\n" +
    "<!--TODO: Test on iphone, handle if images are not present, overflow y scroll testing-->\n" +
    "<div class=\"payment-container col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-xs-12\" style=\"position: relative\">\n" +
    "\n" +
    "    <div class=\"inner-payment-container\">\n" +
    "\n" +
    "        <div class=\"payment-logo-container\">\n" +
    "            <img src=\"//static.hashtagsell.com/logos/hts/HTS_Logo_White_512w.png\" class=\"payment-hts-logo\">\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <div style=\"text-align: center; margin-top: 10px; margin-bottom: 10px;\" ng-if=\"posting.images[0].thumbnail || posting.images[0].full\">\n" +
    "            <img ng-show=\"sellerProfile.user.profile_photo\" ng-src=\"{{sellerProfile.user.profile_photo}}\" class=\"img-circle\" style=\"height: 80px; border: 5px solid #fff; display: inline-block; position: relative; right: -50px;\">\n" +
    "            <img ng-show=\"posting.images[0].thumbnail || posting.images[0].full\" ng-src=\"{{posting.images[0].thumbnail || posting.images[0].full}}\" class=\"img-thumbnail\" style=\"max-height: 120px;\">\n" +
    "            <img ng-show=\"buyerProfile.user.profile_photo\" ng-src=\"{{buyerProfile.user.profile_photo}}\" class=\"img-circle\" style=\"height: 80px; border: 5px solid #fff; display: inline-block; position: relative; left: -50px;\">\n" +
    "        </div>\n" +
    "\n" +
    "        <div style=\"text-align: center; margin-top: 10px; margin-bottom: 10px;\" ng-if=\"!posting.images[0].thumbnail || !posting.images[0].full\">\n" +
    "            <img ng-show=\"sellerProfile.user.profile_photo\" ng-src=\"{{sellerProfile.user.profile_photo}}\" class=\"img-circle\" style=\"height: 80px; border: 5px solid #fff; display: inline-block;\">\n" +
    "            <div style=\"font-weight: 200!important; font-size: 36px; color: white\">{{posting.heading}}</div>\n" +
    "            <img ng-show=\"buyerProfile.user.profile_photo\" ng-src=\"{{buyerProfile.user.profile_photo}}\" class=\"img-circle\" style=\"height: 80px; border: 5px solid #fff; display: inline-block;\">\n" +
    "        </div>\n" +
    "\n" +
    "        <alert ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\" close=\"closeAlert($index)\">\n" +
    "            <span ng-bind-html=\"alert.msg\"></span>\n" +
    "        </alert>\n" +
    "\n" +
    "        <form action=\"/payments/purchase\" method=\"post\" ng-show=\"!alerts.length\">\n" +
    "\n" +
    "            <braintree-dropin options=\"dropinOptions\">\n" +
    "                Loading payment form...\n" +
    "            </braintree-dropin>\n" +
    "\n" +
    "            <input type=\"hidden\" name=\"token\" value=\"{{posting.postingId}}\"/>\n" +
    "\n" +
    "            <button type=\"submit\" class=\"btn btn-lg btn-primary btn-block\">Send {{posting.askingPrice.value| currency : $}} to {{posting.username}}</button>\n" +
    "\n" +
    "        </form>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('js/peerReview/partials/peerReview.partial.html',
    "<style>\n" +
    "    .top-level {\n" +
    "        height: 100%;\n" +
    "    }\n" +
    "\n" +
    "    .body-main {\n" +
    "        background: url(\"//static.hashtagsell.com/htsApp/backdrops/flyingPigeon_dark_compressed.jpg\") no-repeat center center fixed;\n" +
    "        background-size: cover;\n" +
    "        height: 100%;\n" +
    "        width: 100%;\n" +
    "    }\n" +
    "\n" +
    "    .root {\n" +
    "        position: absolute;\n" +
    "        top: 0;\n" +
    "        bottom: 0;\n" +
    "        left: 0;\n" +
    "        right: 0;\n" +
    "        overflow-y: auto;\n" +
    "        overflow-x: hidden;\n" +
    "    }\n" +
    "\n" +
    "    .glyphicon-star, .glyphicon-star-empty {\n" +
    "        font-size: 3em;\n" +
    "        color: gold;\n" +
    "    }\n" +
    "\n" +
    "    .peer-review-container {\n" +
    "        background: rgba(255, 255, 255, 0.9);\n" +
    "        border-radius: 4px;\n" +
    "        text-align: center;\n" +
    "        font-weight: 100 !important;\n" +
    "        padding: 20px 10px 20px 10px;\n" +
    "        position: relative;\n" +
    "        top: -40px;\n" +
    "    }\n" +
    "\n" +
    "    .reviewee-photo-container{\n" +
    "        text-align: center;\n" +
    "        margin-top: 10px;\n" +
    "        margin-bottom: 10px;\n" +
    "        position: relative;\n" +
    "        z-index: 1;\n" +
    "    }\n" +
    "\n" +
    "    .reviewee-photo {\n" +
    "        height: 80px;\n" +
    "        border: 5px solid #fff;\n" +
    "        display: inline-block;\n" +
    "    }\n" +
    "\n" +
    "    .submit-button{\n" +
    "        position: relative;\n" +
    "        top: -30px;\n" +
    "    }\n" +
    "</style>\n" +
    "\n" +
    "\n" +
    "<div class=\"review-container col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12\" style=\"position: relative\">\n" +
    "\n" +
    "    <div class=\"inner-review-container\">\n" +
    "\n" +
    "        <div class=\"review-logo-container\">\n" +
    "            <img src=\"//static.hashtagsell.com/logos/hts/HTS_Logo_White_512w.png\" class=\"payment-hts-logo\">\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"reviewee-photo-container\">\n" +
    "            <img ng-show=\"reviewee.profile_photo\" ng-src=\"{{reviewee.profile_photo}}\" class=\"img-circle reviewee-photo\">\n" +
    "        </div>\n" +
    "\n" +
    "        <alert ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\" close=\"closeAlert($index)\">{{alert.msg}}</alert>\n" +
    "\n" +
    "        <div ng-show=\"!alerts.length\">\n" +
    "            <form class=\"peer-review-container\">\n" +
    "\n" +
    "                <h3>How was your experience?</h3>\n" +
    "                <div ng-init=\"review.rating = 0\">\n" +
    "                    <rating ng-model=\"reviewForm.rating\" max=\"5\" state-on=\"'glyphicon-star'\" state-off=\"'glyphicon-star-empty'\"></rating>\n" +
    "                </div>\n" +
    "\n" +
    "                <textarea ng-model=\"reviewForm.comment\" class=\"form-control\" rows=\"5\" placeholder=\"Optional Feedback\"></textarea>\n" +
    "\n" +
    "            </form>\n" +
    "            <button type=\"submit\" class=\"btn btn-lg btn-primary btn-block submit-button\" ng-click=\"submitReview()\">Submit</button>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('js/profile/partials/profile.partial.html',
    "<div class=\"outer-container\">\n" +
    "    <div class=\"inner-container-padding\">\n" +
    "        <tabset>\n" +
    "            <tab ng-repeat=\"tab in nav\" heading=\"{{tab.title}}\" active=\"tab.active\" disabled=\"tab.disabled\">\n" +
    "                {{tab.data}}\n" +
    "            </tab>\n" +
    "        </tabset>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('js/results/partials/results_partial.html',
    "<div ui-view></div>\n" +
    "\n" +
    "<div ng-show=\"status.error.message\" class=\"background-instructions\">\n" +
    "    <div class=\"inset-background-text\" ng-bind-html=\"status.error.message\">\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"outer-container\">\n" +
    "    <spinner ng-if=\"status.pleaseWait\" class=\"spinner-container\" spinner-text='Finding \"searchTerm\" for sale around you...' spinner-attribute=\"{{queryObj.q}}\"></spinner>\n" +
    "    <div class=\"results-container\" resize-grid ng-class=\"{ 'split-results-container' : views.showMap }\">\n" +
    "        <!--GRID VIEW-->\n" +
    "        <div vs-repeat class=\"inner-container\" vs-size=\"rowHeight\" vs-offset-before=\"77\" vs-excess=\"5\" on-vs-index-change=\"infiniteScroll(startIndex, endIndex)\" ng-show=\"views.gridView\">\n" +
    "            <div ng-repeat=\"row in results.gridRows\" style=\"width: 100%;\">\n" +
    "                <div ng-repeat=\"result in row.rowContents\"\n" +
    "                     ng-click=\"openSplash(this)\"\n" +
    "                     class=\"grid-item\"\n" +
    "                     style=\"width: {{results.gridPercentageWidth}}%;\"\n" +
    "                        >\n" +
    "                    <div class=\"thumbnail\" style=\"cursor: pointer\">\n" +
    "                        <div ng-show=\"result.external.source.code === 'HSHTG'\" class=\"hshtg-ribbon\"><span>HashtagSell</span></div>\n" +
    "                        <ribbon-grid ng-if=\"result.askingPrice.value\">{{result.askingPrice.value | currency : $ : 0}}</ribbon-grid>\n" +
    "                        <hts-fave-toggle class=\"starPositioning\"></hts-fave-toggle>\n" +
    "                        <!--<div style=\"background: url({{result.images[0].full || result.images[0].thumb || result.images[0].images}}) no-repeat center center fixed; height: 172px; webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover;\"></div>-->\n" +
    "                        <img ng-if=\"result.images.length\" ng-src=\"{{::result.images[0].full || result.images[0].thumb || result.images[0].images}}\" class=\"fitImage\">\n" +
    "                        <div ng-if=\"!result.images.length\" class=\"grid-noImage-Placeholder\"></div>\n" +
    "                        <div class=\"caption\">\n" +
    "                            <h4 class=\"heading\" ng-bind-html=\"result.heading | cleanHeading\"></h4>\n" +
    "                            <p class=\"body\" ng-bind-html=\"result.body | cleanBodyExcerpt\"></p>\n" +
    "                            <span class=\"distance\">\n" +
    "                                <i class=\"fa fa-location-arrow\" style=\"color: #777777;\"></i>&nbsp;{{::result.geo.distance* 0.00062137 | number:0}} mi.\n" +
    "                            </span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "        <!--LIST VIEW-->\n" +
    "        <!--{{views.showMap}}-->\n" +
    "        <div vs-repeat class=\"inner-container\" vs-excess=\"7\" vs-size=\"rowHeight\" vs-offset-before=\"77\" ng-show=\"!views.gridView\">\n" +
    "            <div ng-repeat=\"row in results.gridRows\" ng-class=\"views.showMap ? 'list-item-map-view':'list-item'\">\n" +
    "                <div style=\"cursor: pointer;\" ng-repeat=\"result in row.rowContents\" ng-click=\"openSplash(this)\">\n" +
    "\n" +
    "                    <div class=\"thumbnail\">\n" +
    "                        <ribbon-list ng-if=\"!!result.askingPrice.value\" >{{::result.askingPrice.value | currency : $ : 0}}</ribbon-list>\n" +
    "\n" +
    "                        <!--Has NO image-->\n" +
    "                        <div ng-if=\"!result.images.length\">\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"caption\">\n" +
    "                                    <h3 class=\"noImage-heading\" ng-bind-html=\"result.heading | cleanHeading\"></h3>\n" +
    "                                    <hts-fave-toggle class=\"carousel-starPositioning\"></hts-fave-toggle>\n" +
    "                                    <p class=\"noImage-body\" ng-bind-html=\"result.body |cleanBodyExcerpt\"></p>\n" +
    "                                    <div class=\"pull-left carousel-timestamp\">\n" +
    "                                        <small>Posted {{(currentDate - result.external.threeTaps.timestamp) | secondsToTimeString}} ago.</small>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "\n" +
    "                        <!--Has ONE image-->\n" +
    "                        <div ng-if=\"result.images.length == 1\">\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-lg-5 col-md-6 col-sm-6 col-xs-6\">\n" +
    "                                    <img ng-src=\"{{::result.images[0].full || result.images[0].thumb || result.images[0].images}}\" class=\"img-responsive img-rounded singleImage-Image\">\n" +
    "                                </div>\n" +
    "                                <div class=\"col-lg-7 col-md-6 col-sm-6 col-xs-6 singleImage-TextContainer\">\n" +
    "                                    <div class=\"row\">\n" +
    "                                        <div class=\"caption\">\n" +
    "                                            <h3 class=\"singleImage-heading\" ng-bind-html=\"result.heading | cleanHeading\"></h3>\n" +
    "                                            <hts-fave-toggle class=\"singleImage-starPositioning\"></hts-fave-toggle>\n" +
    "                                            <p class=\"singleImage-body\" ng-bind-html=\"result.body |cleanBody\"></p>\n" +
    "                                            <div class=\"pull-left singleImage-timestamp\">\n" +
    "                                                <small><i class=\"fa fa-location-arrow\"></i>&nbsp;{{::result.geo.distance* 0.00062137 | number:0}} mi.</small>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "\n" +
    "                        <!--Has MULTIPLE images-->\n" +
    "                        <div ng-if=\"result.images.length > 1\">\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-lg-12\">\n" +
    "                                    <slick data=\"result.images\" lazy-load='progressive' init-onload=true dots=true infinite=true slides-to-scroll=1 speed=100 variable-width=true center-mode=false next-arrow=\".next-arrow-ctl{{result.postingId}}\" prev-arrow=\".prev-arrow-ctl{{result.postingId}}\">\n" +
    "\n" +
    "                                        <button ng-click=\"$event.stopPropagation();\" type=\"button\" data-role=\"none\" class=\"slick-prev prev-arrow-ctl{{result.postingId}}\" aria-label=\"previous\" style=\"display: block;\">Previous</button>\n" +
    "\n" +
    "                                        <button ng-click=\"$event.stopPropagation();\" type=\"button\" data-role=\"none\" class=\"slick-next next-arrow-ctl{{result.postingId}}\" aria-label=\"next\" style=\"display: block;\">Next</button>\n" +
    "\n" +
    "                                        <div ng-repeat=\"image in result.images\">\n" +
    "                                            <img data-lazy=\"{{image.thumb || image.thumbnail || image.images || image.full}}\"/>\n" +
    "                                        </div>\n" +
    "                                    </slick>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"caption\">\n" +
    "                                    <h3 class=\"carousel-heading\" ng-bind-html=\"result.heading | cleanHeading\"></h3>\n" +
    "                                    <hts-fave-toggle class=\"carousel-starPositioning\"></hts-fave-toggle>\n" +
    "                                    <p class=\"carousel-body\" ng-bind-html=\"result.body |cleanBodyExcerpt\"></p>\n" +
    "                                    <div class=\"pull-left carousel-timestamp\">\n" +
    "                                        <small><i class=\"fa fa-location-arrow\"></i>&nbsp;{{::result.geo.distance* 0.00062137 | number:0}} mi.<small>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <spinner ng-show=\"status.loading\" class=\"spinner-container\" spinner-text={{status.loadingMessage}} style=\"  top: -170px; z-index: 1; background: linear-gradient(to top, rgba(194, 202, 213, 1), rgba(194, 202, 213, 0)); width: 100%; text-align: center; pointer-events: none;\"></spinner>\n" +
    "        <!--<div class=\"loadingMore\" ng-show=\"status.loading\">-->\n" +
    "            <!--&lt;!&ndash;<img src=\"https://static.hashtagsell.com/htsApp/spinners/ajax-loader.gif\">&nbsp;&ndash;&gt;-->\n" +
    "            <!--{{status.loadingMessage}}-->\n" +
    "            <!--&lt;!&ndash;blah blah blah&ndash;&gt;-->\n" +
    "\n" +
    "        <!--</div>-->\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <div class=\"map-container\" ng-class=\"{ 'show-map' : views.showMap }\" ng-if=\"views.showMap\">\n" +
    "        <ui-gmap-google-map center=\"map.center\" zoom=\"map.zoom\" bounds=\"map.bounds\" draggable=\"true\" options=\"map.options\">\n" +
    "            <ui-gmap-markers models=\"map.markers\" options=\"'options'\" coords=\"'coords'\" fit=\"true\" doCluster=\"true\" clusterOptions=\"map.clusterOptions\" doRebuildAll=\"map.refresh\">\n" +
    "            </ui-gmap-markers>\n" +
    "        </ui-gmap-google-map>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('js/settings/account/partials/settings.account_partial.html',
    "<div>\n" +
    "    <div class=\"settings-header\">\n" +
    "        <h3>Account</h3>\n" +
    "        <h4>Manage your account settings</h4>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "    <form class=\"form-horizontal\">\n" +
    "        <!--<div class=\"form-group has-feedback\" ng-class=\"safeSearchUpdated ? 'has-success' : ''\">-->\n" +
    "            <!--<label class=\"col-sm-2 control-label\">Safe Search</label>-->\n" +
    "            <!--<div class=\"col-sm-2\">-->\n" +
    "                <!--<select class=\"form-control\" ng-model=\"safeSearch\" ng-options=\"opt for opt in options.safeSearch\" ng-change=\"setSafeSearch(safeSearch)\"></select>-->\n" +
    "                <!--<span ng-show=\"safeSearchUpdated\" class=\"glyphicon glyphicon-ok form-control-feedback\" aria-hidden=\"true\"></span>-->\n" +
    "                <!--&lt;!&ndash;<i ng-show=\"safeSearchUpdated\" class=\"fa fa-check-circle fa-2x safeSearch-checkmark\"></i>&ndash;&gt;-->\n" +
    "            <!--</div>-->\n" +
    "        <!--</div>-->\n" +
    "\n" +
    "        <!--<div class=\"form-group has-feedback\" ng-class=\"defaultEmailUpdated ? 'has-success' : ''\">-->\n" +
    "            <!--<label class=\"col-sm-2 control-label\">Default Email</label>-->\n" +
    "            <!--<div class=\"col-sm-2\">-->\n" +
    "                <!--<select class=\"form-control\" ng-model=\"defaultEmail\" ng-options=\"opt.value as opt.name for opt in options.defaultEmail\" ng-change=\"setDefaultEmail(defaultEmail)\"></select>-->\n" +
    "                <!--<span ng-show=\"defaultEmailUpdated\" class=\"glyphicon glyphicon-ok form-control-feedback\" aria-hidden=\"true\"></span>-->\n" +
    "                <!--&lt;!&ndash;<i ng-show=\"defaultEmailUpdated\" class=\"fa fa-check-circle fa-2x defaultEmail-checkmark\"></i>&ndash;&gt;-->\n" +
    "            <!--</div>-->\n" +
    "        <!--</div>-->\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "\n" +
    "            <label class=\"col-sm-2 control-label\">Facebook</label>\n" +
    "            <div class=\"col-sm-5\" ng-show=\"!userObj.user_settings.linkedAccounts.facebook.id\">\n" +
    "                <a href=\"/auth/facebook\" target=\"_self\" class=\"btn btn-primary btn-sm\"><span class=\"fa fa-facebook\"></span> Link Facebook</a>\n" +
    "            </div>\n" +
    "            <div class=\"col-sm-5\" ng-show=\"userObj.user_settings.linkedAccounts.facebook.id\">\n" +
    "                <!--<img ng-src=\"http://graph.facebook.com/v2.3/{{userObj.user_settings.linkedAccounts.facebook.id}}/picture\">-->\n" +
    "                <a ng-click=\"disconnectFacebook()\" class=\"btn btn-primary btn-sm\">Disconnect my Facebook</a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">Twitter</label>\n" +
    "            <div class=\"col-sm-5\" ng-show=\"!userObj.user_settings.linkedAccounts.twitter.id\">\n" +
    "                <a href=\"/auth/twitter\" target=\"_self\" class=\"btn btn-info btn-sm\"><span class=\"fa fa-twitter\"></span> Link Twitter</a>\n" +
    "            </div>\n" +
    "            <div class=\"col-sm-5\" ng-show=\"userObj.user_settings.linkedAccounts.twitter.id\">\n" +
    "                <a ng-click=\"disconnectTwitter()\" class=\"btn btn-info btn-sm\">Disconnect my Twitter</a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">eBay</label>\n" +
    "            <div class=\"col-sm-5\" ng-show=\"!userObj.user_settings.linkedAccounts.ebay.eBayAuthToken\">\n" +
    "                <a ng-click=\"getEbaySessionID()\" target=\"_self\" class=\"btn btn-warning btn-sm\"> Link Ebay</a>\n" +
    "                <div>\n" +
    "                    <small ng-show=\"ebay.err\" class=\"text-danger\">{{ebay.err}}</small>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-sm-5\" ng-show=\"userObj.user_settings.linkedAccounts.ebay.eBayAuthToken\">\n" +
    "                <a ng-click=\"disconnectEbay()\" class=\"btn btn-warning btn-sm\">Disconnect my eBay</a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">Delete Account</label>\n" +
    "            <div class=\"col-sm-5\">\n" +
    "                <a ng-click=\"deleteAccount()\" target=\"_self\" class=\"btn btn-danger btn-sm\"> Delete Entire Account</a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </form>\n" +
    "</div>\n"
  );


  $templateCache.put('js/settings/password/partials/settings.password_partial.html',
    "<div>\n" +
    "    <div class=\"settings-header\">\n" +
    "        <h3>Password</h3>\n" +
    "        <h4>Change your password</h4>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "    <form id=\"updatePasswordForm\" name=\"updatePasswordForm\" class=\"form-horizontal\" ng-submit=\"updatePassword(updatePasswordForm.$valid)\" novalidate>\n" +
    "\n" +
    "       <div class=\"form-group\" ng-show=\"alerts.length\">\n" +
    "           <label class=\"col-md-2 control-label\"></label>\n" +
    "\n" +
    "           <div class=\"col-md-3\">\n" +
    "               <alert ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\" close=\"closeAlert($index)\">{{alert.msg}}</alert>\n" +
    "           </div>\n" +
    "       </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-md-2 control-label\">Current Password</label>\n" +
    "            <div class=\"col-md-3\">\n" +
    "\n" +
    "                <div class=\"controls\">\n" +
    "                    <input class=\"form-control\" type=\"password\" name=\"currentPassword\" ng-model=\"currentPassword\" required>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-md-2 control-label\">New Password</label>\n" +
    "\n" +
    "            <div class=\"col-md-3\">\n" +
    "                <input class=\"form-control\" type=\"password\" ng-minlength=\"4\" ng-maxlength=\"30\" ng-pattern=\"/^[a-zA-Z0-9.!@#$%&*~+=-_]*$/\" name=\"newPassword\" ng-model=\"newPassword\" required>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-md-2 control-label\">Verify Password</label>\n" +
    "\n" +
    "            <div class=\"col-md-3\">\n" +
    "                <input class=\"form-control\" type=\"password\" name=\"veryifyNewPassword\" ng-model=\"verifyNewPassword\" matchinput=\"newPassword\" required>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <!-- Button -->\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-md-2 control-label\" for=\"submit\"></label>\n" +
    "            <div class=\"col-md-3\">\n" +
    "                <!--<button id=\"submit\" name=\"submit\" class=\"btn btn-primary\"  ng-disabled=\"updatePasswordForm.$invalid\">Submit</button>-->\n" +
    "                <button class=\"btn btn-primary\" ng-show=\"!currentPassword && !newPassword && !verifyNewPassword\">Change password</button>\n" +
    "\n" +
    "                <button id=\"submit\" class=\"btn\" ng-show=\"currentPassword || newPassword || verifyNewPassword\" type=\"submit\" ng-class=\"updatePasswordForm.$invalid ? 'btn-warning' : 'btn-success'\" ng-disabled=\"updatePasswordForm.$invalid\">\n" +
    "                    <span ng-show=\"updatePasswordForm.newPassword.$error.minlength\">Password is too short.</span>\n" +
    "\n" +
    "                    <span ng-show=\"updatePasswordForm.newPassword.$error.pattern\">Remove spaces in password.</span>\n" +
    "\n" +
    "                    <span ng-show=\"updatePasswordForm.veryifyNewPassword.$error.match\">Passwords do not match.</span>\n" +
    "\n" +
    "                    <span ng-show=\"!updatePasswordForm.newPassword.$error.minlength &&\n" +
    "                        !updatePasswordForm.newPassword.$error.pattern &&\n" +
    "                        !updatePasswordForm.veryifyNewPassword.$error.match &&\n" +
    "                        updatePasswordForm.$invalid\"\n" +
    "                            >Keep going</span>\n" +
    "\n" +
    "                    <span ng-show=\"!updatePasswordForm.newPassword.$error.minlength &&\n" +
    "                        !updatePasswordForm.newPassword.$error.pattern &&\n" +
    "                        !updatePasswordForm.veryifyNewPassword.$error.match &&\n" +
    "                        !updatePasswordForm.$invalid\"\n" +
    "                            >Change password</span>\n" +
    "                </button>\n" +
    "\n" +
    "\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </form>\n" +
    "</div>"
  );


  $templateCache.put('js/settings/payment/partials/settings.payment_partial.html',
    "<div>\n" +
    "    <div class=\"settings-header\">\n" +
    "        <h3>Payment & Shipping Settings</h3>\n" +
    "        <h4>Payment</h4>\n" +
    "    </div>\n" +
    "\n" +
    "    <sub-merchant></sub-merchant>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <div class=\"settings-header\">\n" +
    "        <h4>Shipping</h4>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"container\">\n" +
    "        <form class=\"form-horizontal\">\n" +
    "            <fieldset>\n" +
    "\n" +
    "                <!-- Select Basic -->\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-md-8\">\n" +
    "                        <h4>Yep, we're building in shipping support, and it's going to be awesome!</h4>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </fieldset>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('js/settings/profile/partials/settings.profile_partial.html',
    "<div>\n" +
    "    <div class=\"settings-header\">\n" +
    "        <h3>Profile Settings</h3>\n" +
    "        <h4>Manage your profile</h4>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "    <form class=\"form-horizontal\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">Profile Photo</label>\n" +
    "            <div class=\"col-sm-5\">\n" +
    "\n" +
    "                <div ng-hide=\"bindingObj.currentlyUploadingProfilePhoto\" style=\"cursor: pointer\">\n" +
    "                    <img class='triggerProfileImageUpload needsclick' ng-src={{userObj.user_settings.profile_photo}} width=\"90px;\"/>\n" +
    "                </div>\n" +
    "\n" +
    "                <div ng-show=\"bindingObj.currentlyUploadingProfilePhoto\" id=\"profilePreview\" dropzone=\"profileDropzoneConfig\">\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">Banner Photo</label>\n" +
    "\n" +
    "            <div class=\"col-sm-5\">\n" +
    "                <div ng-hide=\"bindingObj.currentlyUploadingBannerPhoto\" style=\"cursor: pointer\">\n" +
    "                    <img class='triggerBannerImageUpload img-rounded needsclick' ng-src={{userObj.user_settings.banner_photo}} width=\"190px;\"/>\n" +
    "                </div>\n" +
    "\n" +
    "                <div ng-show=\"bindingObj.currentlyUploadingBannerPhoto\" id=\"bannerPreview\" dropzone=\"bannerDropzoneConfig\">\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">About me</label>\n" +
    "\n" +
    "            <div class=\"col-sm-2\">\n" +
    "                <textarea class=\"form-control\" ng-model=\"userObj.user_settings.biography\" ng-change=\"requireUpdate()\">{{userObj.user_settings.biography}}</textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\"></label>\n" +
    "            <div class=\"col-sm-5\">\n" +
    "                <button class=\"btn btn-success\" ng-disabled=\"bindingObj.requireUpdate\" ng-click=\"submitUpdatedProfile()\">Update About Me</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "<!-- Template loaded into dropzone for profile upload -->\n" +
    "<script type=\"text/ng-template\" id=\"profileUploadTemplate.tpl\">\n" +
    "    <div>\n" +
    "        <!-- This is used as the file preview template -->\n" +
    "        <div class=\"triggerProfileImageUpload\">\n" +
    "            <img class=\"img-circle\" data-dz-thumbnail />\n" +
    "            <div class=\"progress progress-striped active\" role=\"progressbar\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"0\">\n" +
    "                <div class=\"progress-bar progress-bar-info\" style=\"width:0%;\" data-dz-uploadprogress></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <strong class=\"error text-danger\" data-dz-errormessage></strong>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</script>\n" +
    "\n" +
    "\n" +
    "<!-- Template loaded into dropzone for heading upload -->\n" +
    "<script type=\"text/ng-template\" id=\"bannerUploadTemplate.tpl\">\n" +
    "    <div>\n" +
    "        <!-- This is used as the file preview template -->\n" +
    "        <div class=\"triggerBannerImageUpload\">\n" +
    "            <img class=\"heading-banner\" data-dz-thumbnail />\n" +
    "            <div class=\"progress progress-striped active\" role=\"progressbar\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"0\">\n" +
    "                <div class=\"progress-bar progress-bar-info\" style=\"width:0%;\" data-dz-uploadprogress></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <strong class=\"error text-danger\" data-dz-errormessage></strong>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</script>"
  );


  $templateCache.put('js/settings/settings_partial.html',
    "<div class=\"outer-container-settings custom-settings-well\">\n" +
    "    <div class=\"inner-container\">\n" +
    "        <div ui-view></div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('js/splash/partials/splash_content.html',
    "<div class=\"container-fluid splash-content\">\n" +
    "    <div class=\"master-container\">\n" +
    "        <div class=\"splash-content-container\" ng-class=\"{ 'offcanvas-open' : !sideNav.hidden}\">\n" +
    "            <div class=\"container\">\n" +
    "                <div class=\"splash-outer-container\">\n" +
    "                    <div class=\"splash-inner-container\">\n" +
    "                        <div style=\"background-color: #f8f8f8; border-bottom: 1px solid #e7e7e7; margin-bottom: 20px;\">\n" +
    "                            <div class=\"container-fluid\">\n" +
    "                                <ul class=\"nav navbar-nav\" style=\"width: 100%;\">\n" +
    "                                    <li style=\"float: left;\">\n" +
    "                                        <a ng-click=\"$dismiss()\">\n" +
    "                                            < Back\n" +
    "                                        </a>\n" +
    "                                    </li>\n" +
    "                                    <li style=\"display: table; margin: 6px auto 0px auto;\">\n" +
    "                                        <h3 style=\"margin: 0px;\" ng-bind-html=\"result.heading | cleanHeading\"></h3>\n" +
    "                                    </li>\n" +
    "                                </ul>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"photo-description-column\">\n" +
    "                            <div class=\"photo-carousel\">\n" +
    "                                <div class=\"thumbnail\" style=\"padding: 4px 4px 0px 4px;\" ng-if=\"result.images.length\">\n" +
    "                                    <div class=\"row\">\n" +
    "                                        <div class=\"col-xs-12 splashCarousel\">\n" +
    "                                            <div ng-if=\"result.images.length === 1 && toggles.showCarousel\">\n" +
    "                                                <img ng-src=\"{{::result.images[0].full || result.images[0].thumb || result.images[0].images}}\" class=\"img-responsive singleImage-splash-Image\"/>\n" +
    "                                            </div>\n" +
    "                                            <div ng-if=\"result.images.length > 1\">\n" +
    "                                                <slick ng-if=\"toggles.showCarousel\" data=\"result.images\" lazy-load='progressive' init-onload=true dots=true infinite=true slides-to-scroll=1 speed=100 variable-width=true center-mode=false>\n" +
    "                                                    <div ng-repeat=\"image in result.images\">\n" +
    "                                                        <img data-lazy=\"{{image.thumb || image.thumbnail || image.images || image.full}}\"/>\n" +
    "                                                    </div>\n" +
    "                                                </slick>\n" +
    "                                            </div>\n" +
    "                                            <ui-gmap-google-map class=\"splash-map\" center='map.settings.center' zoom='map.settings.zoom' options='map.settings.options' ng-if=\"!toggles.showCarousel\">\n" +
    "\n" +
    "                                                <ui-gmap-marker coords=\"map.marker.coords\" idkey=\"map.marker.id\" options=\"map.marker.options\" click=\"onClick()\">\n" +
    "                                                    <ui-gmap-window options=\"windowOptions\" show=\"infoWindow.show\" closeClick=\"closeClick()\">\n" +
    "\n" +
    "                                                    </ui-gmap-window>\n" +
    "                                                </ui-gmap-marker>\n" +
    "\n" +
    "                                            </ui-gmap-google-map>\n" +
    "                                            <div style=\"margin: 0px -4px 0px -4px; padding-top: 13px;\">\n" +
    "                                                <div class=\"col-xs-6\" ng-class=\"toggles.showCarousel ? '' : 'grey-photo-selector'\" ng-click=\"toggles.showCarousel = true\" style=\"height: 40px; text-align: center; cursor: pointer;\">\n" +
    "                                                    <i class=\"fa fa-camera fa-lg\" style=\"margin-top: 16px;\">&nbsp; Photos</i>\n" +
    "                                                </div>\n" +
    "                                                <div class=\"col-xs-6\" ng-class=\"toggles.showCarousel ? 'grey-map-selector' : ''\" ng-click=\"toggles.showCarousel = false\" style=\"height: 40px; text-align: center; cursor: pointer;\">\n" +
    "                                                    <i class=\"fa fa-map-marker fa-lg\" style=\"margin-top: 16px;\">&nbsp; Map</i>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"thumbnail\" ng-if=\"!result.images.length\">\n" +
    "                                    <div class=\"row\">\n" +
    "                                        <div class=\"col-xs-12 splashCarousel\">\n" +
    "                                            <ui-gmap-google-map class=\"splash-map\" center='map.settings.center' zoom='map.settings.zoom' options='map.settings.options'>\n" +
    "\n" +
    "                                                <ui-gmap-marker coords=\"map.marker.coords\" idkey=\"map.marker.id\" options=\"map.marker.options\" click=\"onClick()\">\n" +
    "                                                    <ui-gmap-window options=\"windowOptions\" show=\"infoWindow.show\" closeClick=\"closeClick()\">\n" +
    "\n" +
    "                                                    </ui-gmap-window>\n" +
    "                                                </ui-gmap-marker>\n" +
    "\n" +
    "                                            </ui-gmap-google-map>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"annotations-column\">\n" +
    "                                <div ng-if=\"result.sanitized_annotations\" class=\"row\">\n" +
    "                                    <div ng-repeat=\"(key, value) in result.sanitized_annotations\">\n" +
    "                                        <div class=\"col-lg-4 col-md-4 col-sm-4 col-xs-4\">\n" +
    "                                            <h4 class=\"row annotationKey\">\n" +
    "                                                {{::key}}\n" +
    "                                            </h4>\n" +
    "                                            <div class=\"row annotationValue\">\n" +
    "                                                {{::value}}\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <br>\n" +
    "                            <div class=\"details-column\">\n" +
    "                                <h4>Description:</h4>\n" +
    "                                <div style=\"line-height: 20px; padding-bottom: 75px;\" ng-bind-html=\"result.body | cleanBody\">\n" +
    "\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"bs-profile-nav splash-profile-nav\">\n" +
    "                            <splash-side-profile result=\"result\">\n" +
    "                                <div class=\"profile\">\n" +
    "                                    <div class=\"profileCircle\">\n" +
    "                                        <img class='bs-profile-image' width=\"70px;\" height=\"70px;\"/>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"splash-username-container\">\n" +
    "                                    <div class=\"splash-bs-username\"></div>\n" +
    "                                    <h2 style=\"color: #216C2A; margin-bottom: 2px;\">{{::result.askingPrice.value | currency : $ : 0}}</h2>\n" +
    "                                    <!--<button type=\"submit\" class=\"btn btn-danger btn-sm btn-block\" ng-click=\"newPost(); $event.stopPropagation();\">New post</button>-->\n" +
    "                                </div>\n" +
    "                            </splash-side-profile>\n" +
    "\n" +
    "                            <!--SideNav-->\n" +
    "                            <div class=\"list-group splash-bs-side-nav ng-cloak\" ng-if=\"result.username !== userObj.user_settings.name\">\n" +
    "                                <!--<a class=\"list-group-item\" ng-if=\"result.external.source.code == 'CRAIG' && result.annotations.source_account\" ng-click=\"emailSeller(result)\" style=\"cursor: pointer\">-->\n" +
    "                                    <!--<i class=\"fa fa-envelope-square fa-fw fa-lg\"></i>&nbsp; Email seller-->\n" +
    "                                <!--</a>-->\n" +
    "                                <!--<a class=\"list-group-item\" ng-if=\"result.external.source.code == 'CRAIG' && result.annotations.phone\" ng-click=\"displayPhone(result)\" style=\"cursor: pointer\">-->\n" +
    "                                    <!--<i class=\"fa fa-phone-square fa-fw fa-lg\"></i>&nbsp; Phone seller-->\n" +
    "                                <!--</a>-->\n" +
    "                                <a  class=\"list-group-item\" ng-if=\"result.external.source.code === 'HSHTG' && result.askingPrice.value\" ng-click=\"buyOnline(result)\" style=\"cursor: pointer; font-size: 16px; text-align: center\">\n" +
    "                                    <span>Send An Offer</span>\n" +
    "                                </a>\n" +
    "                                <!--<a  class=\"list-group-item\" ng-if=\"result.external.source.code === 'HSHTG'\" ng-click=\"placeOffer(result)\" style=\"cursor: pointer\">-->\n" +
    "                                    <!--<i class=\"fa fa-calendar-o fa-fw fa-lg\"></i>&nbsp; Request a meeting-->\n" +
    "                                <!--</a>-->\n" +
    "                                <a class=\"list-group-item\"  ng-if=\"result.external.source.code === 'E_BAY'\" ng-click=\"placeBid(result)\" style=\"cursor: pointer; font-size: 16px;\">\n" +
    "                                    <i class=\"fa fa-paypal fa-fw fa-lg\"></i>&nbsp; Bid On Item\n" +
    "                                </a>\n" +
    "                                <a class=\"list-group-item\" ng-click=\"toggleFave(result)\" style=\"cursor: pointer; font-size: 16px;\">\n" +
    "                                    <span ng-show=\"favorited\">\n" +
    "                                        <span ng-show=\"favorited\" ng-class=\"{starHighlighted: favorited, star: !favorited}\" class=\"fa fa-fw fa-lg\"></span>&nbsp; Remove From Watch List\n" +
    "                                    </span>\n" +
    "                                    <span ng-show=\"!favorited\">\n" +
    "                                        <span ng-class=\"{starHighlighted: favorited, star: !favorited}\" class=\"fa fa-fw fa-lg\"></span>&nbsp; Add To Watch List\n" +
    "                                    </span>\n" +
    "                                </a>\n" +
    "                                <!--<a class=\"list-group-item\" onclick=\"alert('spam reporting feature soon')\" style=\"cursor: pointer\">-->\n" +
    "                                    <!--<i class=\"fa fa-flag fa-fw fa-lg\"></i>&nbsp; Report-->\n" +
    "                                <!--</a>-->\n" +
    "                                <a class=\"list-group-item\" ng-if=\"result.external.source.url && result.external.source.code != 'HSHTG'\" ng-click=\"showOriginal(result)\" style=\"cursor: pointer; font-size: 16px;\">\n" +
    "                                    <i class=\"fa fa-external-link-square fa-fw fa-lg\"></i>&nbsp; Show Original Post\n" +
    "                                </a>\n" +
    "                            </div>\n" +
    "\n" +
    "\n" +
    "                            <div ng-if=\"result.external.source.code === 'HSHTG' && result.username !== userObj.user_settings.name\" ng-init=\"getPostingIdQuestions()\">\n" +
    "                                <p class=\"input-group\">\n" +
    "                                    <input class=\"form-control\" ng-model=\"qamodule.question\" placeholder=\"Ask the seller a question\" ng-enter=\"submitQuestion(qamodule.question)\"/>\n" +
    "                                    <span class=\"input-group-btn\">\n" +
    "                                        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"submitQuestion(qamodule.question)\">Ask</button>\n" +
    "                                    </span>\n" +
    "                                </p>\n" +
    "                                <div ng-repeat=\"question in questions.store\">\n" +
    "                                    <div class=\"question-counter-block\">\n" +
    "                                        <span class=\"stack-question-counter fa-2x\">\n" +
    "                                            <i class=\"fa fa-caret-up\"></i>\n" +
    "                                            <div>{{question.plus.length}}</div>\n" +
    "                                            <i class=\"fa fa-caret-down\"></i>\n" +
    "                                        </span>\n" +
    "                                        <div class=\"questions-and-answers\">\n" +
    "                                            <div class=\"question\">\n" +
    "                                                <b>Q:</b> {{question.value}}\n" +
    "                                            </div>\n" +
    "                                            <div ng-repeat=\"answer in question.answers\">\n" +
    "                                                <div class=\"answer\" ng-if=\"answer.value\"><b>A:</b> {{answer.value}}</div>\n" +
    "                                            </div>\n" +
    "                                            <div ng-if=\"result.username === userObj.user_settings.name && !question.answers.length\">\n" +
    "                                                <a class=\"answer\" ui-sref=\"myposts.questions({postingId: question.postingId})\">Click here to answer.</a>\n" +
    "                                            </div>\n" +
    "                                            <div ng-if=\"result.username !== userObj.user_settings.name && !question.answers.length\">\n" +
    "                                                <a class=\"answer\">The seller has been notified.</a>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('js/splash/partials/splash_window.html',
    "<section class=\"splash\" ng-class=\"{'splash-open': animate}\">\n" +
    "    <div class=\"splash-inner\" ng-transclude></div>\n" +
    "</section>"
  );


  $templateCache.put('js/submerchant/modals/partials/submerchant.modal.partial.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head lang=\"en\">\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title></title>\n" +
    "</head>\n" +
    "<body>\n" +
    "    <div class=\"modal-header\">\n" +
    "\n" +
    "        <button type=\"button\" class=\"close\" ng-click=\"close()\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "\n" +
    "        <h3 id=\"myModalLabel\">How do we send you money?</h3>\n" +
    "\n" +
    "    </span>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <sub-merchant></sub-merchant>\n" +
    "    </div>\n" +
    "    <!--<div class=\"modal-footer\">-->\n" +
    "        <!--<input class=\"btn btn-success\" type=\"submit\" value=\"Send recovery email\" ng-disabled=\"forgotPasswordForm.$invalid\">-->\n" +
    "    <!--</div>-->\n" +
    "\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('js/submerchant/partials/submerchant.partial.html',
    "\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "\n" +
    "    <form name=\"subMerchForm\" class=\"form-horizontal\" autocomplete=\"false\" ng-submit=\"submitSubMerchant()\">\n" +
    "        <fieldset>\n" +
    "\n" +
    "            <alert ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\" close=\"closeAlert($index)\">{{alert.msg}}</alert>\n" +
    "\n" +
    "            <!-- Select Basic -->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"business\">Are you a business?</label>\n" +
    "                <div class=\"col-md-2\">\n" +
    "                    <select id=\"business\" name=\"business\" class=\"form-control\" ng-init=\"subMerchantForm.business.isBusinessAccount = subMerchantForm.business.businessOptionsDropdown[0]\" ng-model=\"subMerchantForm.business.isBusinessAccount\" ng-options=\"opt.name for opt in subMerchantForm.business.businessOptionsDropdown\" novalidate>\n" +
    "\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Text input-->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"firstname\">First Name</label>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <input id=\"firstname\" name=\"firstname\" type=\"text\" placeholder=\"First Name\" ng-model=\"subMerchant.individual.firstName\" class=\"form-control input-md\" required=\"required\">\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Text input-->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"lastname\">Last Name</label>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <input id=\"lastname\" name=\"lastname\" type=\"text\" placeholder=\"Last Name\" ng-model=\"subMerchant.individual.lastName\" class=\"form-control input-md\" required=\"required\">\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Text input-->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"individualEmail\">Email</label>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <input id=\"individualEmail\" name=\"IndividualEmail\" type=\"email\" placeholder=\"Email\" ng-model=\"subMerchant.individual.email\" class=\"form-control input-md\" required=\"required\">\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Text input-->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"dob\">Date of birth</label>\n" +
    "                <div class=\"col-md-3\">\n" +
    "                    <input id=\"dob\" name=\"dob\" type=\"text\" placeholder=\"mm/dd/yyyy\" ng-model=\"subMerchantForm.individual.dateOfBirth\" class=\"form-control input-md\" required=\"required\" ng-pattern=\"/\\d\\d\\/\\d\\d\\/\\d\\d\\d\\d/\" ng-maxlength=\"10\" ng-minlength=\"10\">\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "            <!-- Text input-->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"individualAddress\">Address</label>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <input autocomplete=\"false\" id=\"individualAddress\" name=\"individualAddress\" type=\"text\" placeholder=\"Address\" ng-model=\"subMerchantForm.individual.addressLookup\" typeahead=\"city.description for city in predictAddress($viewValue)\" typeahead-on-select='setAddressComponents($item, \"individual\")' class=\"form-control input-md\" required=\"required\" >\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Text input-->\n" +
    "            <div class=\"form-group\" ng-show=\"subMerchantForm.business.isBusinessAccount.value\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"companyname\">Company Name</label>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <input id=\"companyname\" name=\"companyname\" type=\"text\" placeholder=\"Company Name\" ng-model=\"subMerchant.business.legalName\" class=\"form-control input-md\" ng-required='subMerchantForm.business.isBusinessAccount.value'>\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-show=\"subMerchantForm.business.isBusinessAccount.value\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"businessaddress\">Address</label>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <input autocomplete=\"off\" id=\"businessaddress\" name=\"business\" type=\"text\" placeholder=\"Business address\" ng-model=\"subMerchantForm.business.addressLookup\" typeahead=\"city.description for city in predictAddress($viewValue)\" typeahead-on-select='setAddressComponents($item, \"business\")' class=\"form-control input-md\" ng-required='subMerchantForm.business.isBusinessAccount.value' >\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Text input-->\n" +
    "            <div class=\"form-group\" ng-show=\"subMerchantForm.business.isBusinessAccount.value\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"taxid\">Tax Id</label>\n" +
    "                <div class=\"col-md-3\">\n" +
    "                    <input id=\"taxid\" name=\"taxid\" type=\"number\" placeholder=\"Tax Id\" ng-model=\"subMerchant.business.taxId\" class=\"form-control input-md\" ng-required='subMerchantForm.business.isBusinessAccount.value'>\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Multiple Radios -->\n" +
    "            <!--<div class=\"form-group\">-->\n" +
    "                <!--<label class=\"col-md-2 control-label\" for=\"destination\">Send funds to</label>-->\n" +
    "                <!--<div class=\"col-md-3\">-->\n" +
    "                    <!--<div class=\"radio\">-->\n" +
    "                        <!--<label for=\"destination-0\">-->\n" +
    "                            <!--<input type=\"radio\" name=\"destination\" id=\"destination-0\" ng-model=\"subMerchantForm.destination.disperseType\" value=\"bank\" required=\"required\">-->\n" +
    "                            <!--Bank Account-->\n" +
    "                        <!--</label>-->\n" +
    "                    <!--</div>-->\n" +
    "                    <!--<div class=\"radio\">-->\n" +
    "                        <!--<label for=\"destination-1\">-->\n" +
    "                            <!--<input type=\"radio\" name=\"destination\" id=\"destination-1\" ng-model=\"subMerchantForm.destination.disperseType\" value=\"venmo\" required=\"required\">-->\n" +
    "                            <!--Venmo-->\n" +
    "                        <!--</label>-->\n" +
    "                    <!--</div>-->\n" +
    "                <!--</div>-->\n" +
    "            <!--</div>-->\n" +
    "\n" +
    "            <!-- Text input-->\n" +
    "            <!--<div class=\"form-group\" ng-show=\"subMerchantForm.destination.disperseType === 'bank'\">-->\n" +
    "                <!--<label class=\"col-md-2 control-label\" for=\"accountnumber\">Bank Account No.</label>-->\n" +
    "                <!--<div class=\"col-md-4\">-->\n" +
    "                    <!--<input id=\"accountnumber\" name=\"accountnumber\" type=\"number\" placeholder=\"Bank Account No.\" ng-model=\"subMerchant.funding.accountNumber\" class=\"form-control input-md\" ng-required=\"subMerchantForm.destination.disperseType === 'bank'\">-->\n" +
    "\n" +
    "                <!--</div>-->\n" +
    "            <!--</div>-->\n" +
    "\n" +
    "            <!--&lt;!&ndash; Text input&ndash;&gt;-->\n" +
    "            <!--<div class=\"form-group\" ng-show=\"subMerchantForm.destination.disperseType === 'bank'\">-->\n" +
    "                <!--<label class=\"col-md-2 control-label\" for=\"routingnumber\">Bank Routing No.</label>-->\n" +
    "                <!--<div class=\"col-md-4\">-->\n" +
    "                    <!--<input id=\"routingnumber\" name=\"routingnumber\" type=\"number\" placeholder=\"Bank Routing No.\" ng-model=\"subMerchant.funding.routingNumber\" class=\"form-control input-md\" ng-required=\"subMerchantForm.destination.disperseType === 'bank'\">-->\n" +
    "\n" +
    "                <!--</div>-->\n" +
    "            <!--</div>-->\n" +
    "\n" +
    "            <!-- Text input-->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"venmoemail\">Venmo Email</label>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <input id=\"venmoemail\" name=\"venmoemail\" type=\"email\" placeholder=\"Venmo Email Account\" ng-model=\"subMerchant.funding.email\" class=\"form-control input-md\" required=\"required\">\n" +
    "                    <small><a href=\"https://venmo.com/w/signup\" target=\"_blank\">I need a Venmo account.</a></small>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!--<div class=\"form-group\">-->\n" +
    "                <!--<label class=\"col-md-2 control-label\" for=\"venmoemail\">Venmo Email</label>-->\n" +
    "                <!--<div class=\"col-md-4\">-->\n" +
    "                    <!-- -->\n" +
    "                <!--</div>-->\n" +
    "            <!--</div>-->\n" +
    "\n" +
    "            <!-- Button -->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"submit\"></label>\n" +
    "                <div class=\"col-md-3\">\n" +
    "                    <button id=\"submit\" name=\"submit\" class=\"btn btn-warning\" ng-show=\"recoveredMerchantAccount.response.status === 'active'\">Change Payment Settings</button>\n" +
    "                    <button id=\"submit\" name=\"submit\" class=\"btn btn-primary\" ng-show=\"recoveredMerchantAccount.response.status === 'declined'\">Re-Submit</button>\n" +
    "                    <button id=\"submit\" name=\"submit\" class=\"btn btn-primary\" ng-show=\"recoveredMerchantAccount.response.status === 'pending'\" ng-disabled=\"true\">Pending approval</button>\n" +
    "                    <button id=\"submit\" name=\"submit\" class=\"btn btn-primary\" ng-show=\"!recoveredMerchantAccount.response.status\">Submit</button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!--{{subMerchant}}-->\n" +
    "\n" +
    "            <!--{{recoveredMerchantAccount}}-->\n" +
    "\n" +
    "        </fieldset>\n" +
    "    </form>\n" +
    "</div>\n" +
    "\n" +
    "<!--{{subMerchantForm}}-->"
  );


  $templateCache.put('js/transactionButtons/modals/buyNow/partials/transactionButtons.modal.buyNow.partial.html',
    "<form class=\"form-horizontal\">\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h3 id=\"myModalLabel\">Send payment</h3>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        I've met the seller and inspected the item for sale.  I'd like to send payment.\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button class=\"btn btn-default\" ng-click=\"no()\">No, I need to inspect the item</button>\n" +
    "        <button class=\"btn btn-primary\" ng-click=\"yes()\">Send Payment</button>\n" +
    "    </div>\n" +
    "</form>"
  );


  $templateCache.put('js/transactionButtons/modals/email/partials/transactionButtons.modal.email.partial.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head lang=\"en\">\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title>HashtagSell Quick Compose</title>\n" +
    "</head>\n" +
    "<body>\n" +
    "\n" +
    "    <!--<form name=\"loginForm\" id=\"loginForm\" class=\"form-horizontal\" ng-submit=\"loginPassport(loginForm.$valid)\" novalidate>-->\n" +
    "        <!--<div class=\"modal-header\">-->\n" +
    "            <!--<h3 id=\"myModalLabel\">Private Beta Login!</h3>-->\n" +
    "        <!--</div>-->\n" +
    "        <!--<div class=\"modal-body\">-->\n" +
    "            <!--<label class=\"control-label\" for=\"email\">Email Address:</label>-->\n" +
    "            <!--<div class=\"controls\">-->\n" +
    "                <!--<input type=\"email\" id=\"email\" ng-model=\"email\" required>-->\n" +
    "            <!--</div>-->\n" +
    "            <!--<br>-->\n" +
    "            <!--<label class=\"control-label\" for=\"password\">Password:</label>-->\n" +
    "            <!--<div class=\"controls\">-->\n" +
    "                <!--<input type=\"password\" id=\"password\" ng-model=\"password\" required>-->\n" +
    "                <!--<br>-->\n" +
    "                <!--<small style=\"color:red;\">-->\n" +
    "                    <!--{{message}}-->\n" +
    "                <!--</small>-->\n" +
    "                <!--<br>-->\n" +
    "                <!--<a href ng-click=\"dismiss('signUp')\">-->\n" +
    "                    <!--<small>Need an account?</small>-->\n" +
    "                <!--</a>-->\n" +
    "                <!--<small> | </small>-->\n" +
    "                <!--<a href ng-click=\"dismiss('forgot')\">-->\n" +
    "                    <!--<small>Forgot your password?</small>-->\n" +
    "                <!--</a>-->\n" +
    "            <!--</div>-->\n" +
    "        <!--</div>-->\n" +
    "        <!--<div class=\"modal-footer\">-->\n" +
    "            <!--<input class=\"btn btn-success\" type=\"submit\" value=\"Log In\" id=\"submit\" ng-disabled=\"loginForm.$invalid\">-->\n" +
    "            <!--<button class=\"btn btn-default\" ng-click=\"dismiss('dismiss')\">Close</button>-->\n" +
    "        <!--</div>-->\n" +
    "    <!--</form>-->\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <!--<div ng-controller=\"quickComposeController\">-->\n" +
    "        <!--<div id=\"QuickComposeEmail\" class=\"modal hide fade\" data-backdrop=\"false\">-->\n" +
    "            <form class=\"form-horizontal\">\n" +
    "                <div class=\"modal-header\">\n" +
    "                    <h3 id=\"myModalLabel\">Select Email</h3>\n" +
    "                </div>\n" +
    "                <div class=\"modal-body\">\n" +
    "                    <select class=\"form-control\" ng-model=\"selected\" ng-options=\"o.value as o.name for o in emailOptionsObject\">\n" +
    "\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"modal-footer\">\n" +
    "                    <span ng-show=\"userObj.user_settings.loggedIn\" class=\"pull-left\">\n" +
    "\n" +
    "                            <input type=\"checkbox\" ng-model=\"setDefaultEmailProvider\"> Save as default email.\n" +
    "\n" +
    "                    </span>\n" +
    "                    <span ng-show=\"!userObj.user_settings.loggedIn\" class=\"pull-left\">\n" +
    "                        <small><a ng-click=\"dismiss('signUp')\" style=\"cursor: pointer;\">Create a free account to setup default mail settings</a></small>\n" +
    "                    </span>\n" +
    "                    <button class=\"btn btn-success\" ng-click=\"qcEmail()\">Compose Email</button>\n" +
    "                    <button class=\"btn btn-default\" ng-click=\"dismiss('dismiss')\">Close</button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        <!--</div>-->\n" +
    "\n" +
    "\n" +
    "        <!--<div id=\"QuickComposePhone\" class=\"modal hide fade\" data-backdrop=\"false\">-->\n" +
    "            <!--<div class=\"modal-header\">-->\n" +
    "                <!--<h3 id=\"myModalLabel\">Call or Text</h3>-->\n" +
    "            <!--</div>-->\n" +
    "            <!--<div class=\"modal-body\">-->\n" +
    "                <!--<div>Seller did not include an email.  Please contact:</div>-->\n" +
    "                <!--<h4>{{dynamicContent.phone}}</h4>-->\n" +
    "            <!--</div>-->\n" +
    "            <!--<div class=\"modal-footer\">-->\n" +
    "                <!--<button class=\"btn btn-default\" data-dismiss=\"modal\" aria-hidden=\"true\">Close</button>-->\n" +
    "            <!--</div>-->\n" +
    "        <!--</div>-->\n" +
    "\n" +
    "\n" +
    "        <!--<div id=\"QuickComposeFail\" class=\"modal hide fade\" data-backdrop=\"false\">-->\n" +
    "            <!--<form id=\"quickComposeForm\" style=\"margin: 0px;\" class=\"form-horizontal\">-->\n" +
    "                <!--<div class=\"modal-header\">-->\n" +
    "                    <!--<h3 id=\"myModalLabel\">No phone or email found :(</h3>-->\n" +
    "                <!--</div>-->\n" +
    "                <!--<div class=\"modal-body\">-->\n" +
    "                    <!--The seller did not provide their contact info.  Please read the ad carefully.-->\n" +
    "                <!--</div>-->\n" +
    "                <!--<div class=\"modal-footer\">-->\n" +
    "                    <!--<button class=\"btn btn-default\" data-dismiss=\"modal\" aria-hidden=\"true\">Close</button>-->\n" +
    "                <!--</div>-->\n" +
    "            <!--</form>-->\n" +
    "        <!--</div>-->\n" +
    "    <!--</div>-->\n" +
    "\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('js/transactionButtons/modals/phone/partials/transactionButtons.modal.phone.partial.html',
    "<form class=\"form-horizontal\">\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h3 id=\"myModalLabel\">Seller Phone Number</h3>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <h3 ng-bind=\"result.annotations.phone | tel\"></h3>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <span ng-show=\"!userObj.user_settings.loggedIn\" class=\"pull-left\">\n" +
    "            <small><a ng-click=\"dismiss('signUp')\" style=\"cursor: pointer;\">Create your free HashtagSell account.</a></small>\n" +
    "        </span>\n" +
    "        <button class=\"btn btn-default\" ng-click=\"dismiss('dismiss')\">Close</button>\n" +
    "    </div>\n" +
    "</form>"
  );


  $templateCache.put('js/transactionButtons/modals/placeOffer/partials/transactionButtons.modal.placeOffer.partial.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head lang=\"en\">\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title>HashtagSell Place an Offer</title>\n" +
    "</head>\n" +
    "<body>\n" +
    "\n" +
    "    <form class=\"form-horizontal\">\n" +
    "        <div class=\"modal-header\">\n" +
    "            <h3 id=\"myModalLabel\">Let's meet!</h3>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "            Schedule a time you can meet the seller face to face.\n" +
    "            <br>\n" +
    "            <br>\n" +
    "            Location: <span class=\"mention-highlighter\">@{{result.external.threeTaps.location.formatted}}</span>\n" +
    "            <br>\n" +
    "            <br>\n" +
    "            <ul>\n" +
    "                <li ng-repeat=\"proposedTime in offer.proposedTimes track by $index\">\n" +
    "                    {{proposedTime.when | date:'MMM d, y h:mm a'}}\n" +
    "                    <i class=\"fa fa-trash-o\" ng-click=\"removeProposedTime($index)\" style=\"cursor: pointer; color: red\"></i>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            <div class=\"dropdown row\" dropdown is-open=\"dropDownStatus.isOpen\">\n" +
    "                <a href class=\"dropdown-toggle col-xs-8\" dropdown-toggle>\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <input type=\"text\" class=\"form-control\" data-ng-model=\"data.dateDropDownInput\" placeholder=\"Propose times you can meet\">\n" +
    "                        <span class=\"input-group-addon\">\n" +
    "                            <i class=\"glyphicon glyphicon-calendar\"></i>\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "                <ul class=\"dropdown-menu\">\n" +
    "                    <li>\n" +
    "                        <datetimepicker data-ng-model=\"data.dateDropDownInput\" data-datetimepicker-config=\"{ minuteStep: 15 }\" data-on-set-time=\"onTimeSet(newDate, oldDate)\"/>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <span ng-show=\"!userObj.user_settings.loggedIn\" class=\"pull-left\">\n" +
    "                <small><a ng-click=\"dismiss('signUp')\" style=\"cursor: pointer;\">Create your free HashtagSell account.</a></small>\n" +
    "            </span>\n" +
    "            {{allowSubmission}}\n" +
    "            <button class=\"btn btn-default btn-primary\" ng-click=\"sendOffer()\" ng-disabled=\"disableSubmission\">Send</button>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('js/transactionButtons/modals/proposeDeal/partials/transactionButtons.modal.proposeDeal.partial.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head lang=\"en\">\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title>HashtagSell Propose a deal</title>\n" +
    "</head>\n" +
    "<body>\n" +
    "\n" +
    "    <form class=\"form-horizontal\">\n" +
    "        <!--<div class=\"modal-header\">-->\n" +
    "            <!--<h3 id=\"myModalLabel\">Let's meet!</h3>-->\n" +
    "        <!--</div>-->\n" +
    "        <div class=\"modal-body\">\n" +
    "\n" +
    "            <div class=\"controls\">\n" +
    "                <div class=\"input-group input-group-lg\">\n" +
    "                    <span class=\"input-group-addon\">$</span>\n" +
    "                    <input class=\"form-control\" type=\"text\" id=\"price\" name=\"price\" ng-model=\"deal.price\" required=\"true\"/>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-show=\"error.price\">\n" +
    "                <span class=\"text-danger\">{{error.price}}</span>\n" +
    "            </div>\n" +
    "\n" +
    "            <br>\n" +
    "\n" +
    "            <div class=\"controls\">\n" +
    "                <div class=\"input-group input-group-lg\">\n" +
    "                    <span class=\"input-group-addon\">@</span>\n" +
    "                    <input autocomplete=\"false\" class=\"form-control\" type=\"text\" id=\"location\" name=\"location\" ng-model=\"deal.location\" typeahead=\"city.description for city in predictAddress($viewValue)\" typeahead-on-select='setAddressComponents($item)' required=\"true\" ng-click=\"deal.location = null\"/>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-show=\"error.where\">\n" +
    "                <span class=\"text-danger\">{{error.where}}</span>\n" +
    "            </div>\n" +
    "\n" +
    "            <br>\n" +
    "\n" +
    "            <div class=\"controls\">\n" +
    "                <div class=\"input-group input-group-lg\">\n" +
    "                    <span class=\"input-group-addon\"><i class=\"fa fa-comments-o\"></i></span>\n" +
    "                    <input class=\"form-control\" type=\"comment\" id=\"comment\" name=\"comment\" ng-model=\"deal.comment\" placeholder=\"Include comment.  (Optional)\"/>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <br>\n" +
    "\n" +
    "            <booking-system></booking-system>\n" +
    "\n" +
    "            <div ng-show=\"error.when\">\n" +
    "                <span class=\"text-danger\">{{error.when}}</span>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <button class=\"btn btn-default btn-primary\" ng-click=\"counterOffer()\">{{button.text}}</button>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "    </form>\n" +
    "\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('js/transactionButtons/partials/transactionButtons.partial.html',
    "\n" +
    "<!--CL item and has email-->\n" +
    "<button ng-if=\"result.source == 'CRAIG' && result.annotations.source_account\" ng-click=\"quickCompose(); $event.stopPropagation();\" class=\"btn btn-default\" role=\"button\"><i class=\"fa fa-envelope-o fa-lg\"></i>&nbsp; Email</button>\n" +
    "\n" +
    "<!--CL item and only has phone-->\n" +
    "<button ng-if=\"result.source == 'CRAIG' && result.annotations.phone\" ng-click=\"displayPhone(); $event.stopPropagation();\" class=\"btn btn-default\" role=\"button\"><i class=\"fa fa-phone fa-lg\"></i>&nbsp; Phone</button>\n" +
    "\n" +
    "<!--CL has no phone or email-->\n" +
    "<button ng-if=\"result.source == 'CRAIG' && !result.annotations.phone && !result.annotations.source_account\" ng-click=\"openSplash(); $event.stopPropagation();\" class=\"btn btn-default\" role=\"button\"><i class=\"fa fa-external-link fa-lg\"></i>&nbsp; Details</button>\n" +
    "\n" +
    "<!--E_Bay Item-->\n" +
    "<a ng-if=\"result.source == 'E_BAY'\" style=\"cursor: pointer;\" ng-click=\"placeBid(); $event.stopPropagation();\" class=\"btn btn-default\" role=\"button\"><i class=\"fa fa-credit-card fa-lg\"></i>&nbsp; Place Bid</a>\n" +
    "\n" +
    "<!--E_Bay Motors-->\n" +
    "<a ng-if=\"result.source == 'EBAYM'\" style=\"cursor: pointer;\" ng-click=\"openSplash(); $event.stopPropagation();\" class=\"btn btn-default\" role=\"button\"><i class=\"fa fa-external-link fa-lg\"></i>&nbsp; Details</a>\n" +
    "\n" +
    "<!--Apartments.com-->\n" +
    "<a ng-if=\"result.source == 'APTSD'\" style=\"cursor: pointer;\" ng-click=\"openSplash(); $event.stopPropagation();\" class=\"btn btn-default\" role=\"button\"><i class=\"fa fa-external-link fa-lg\"></i>&nbsp; Details</a>\n" +
    "\n" +
    "<!--Backpage -->\n" +
    "<a ng-if=\"result.source == 'BKPGE'\" style=\"cursor: pointer;\" ng-click=\"openSplash(); $event.stopPropagation();\" class=\"btn btn-default\" role=\"button\"><i class=\"fa fa-external-link fa-lg\"></i>&nbsp; Details</a>\n" +
    "\n" +
    "<!--Autotrader -->\n" +
    "<a ng-if=\"result.source == 'AUTOD'\" style=\"cursor: pointer;\" ng-click=\"openSplash(); $event.stopPropagation();\" class=\"btn btn-default\" role=\"button\"><i class=\"fa fa-external-link fa-lg\"></i>&nbsp; Details</a>\n" +
    "\n" +
    "<!--HashtagSell Item-->\n" +
    "<a ng-if=\"result.source == 'HSHTG'\" style=\"cursor: pointer;\" ng-click=\"placeOffer(); $event.stopPropagation();\" class=\"btn btn-danger\" role=\"button\"><i class=\"fa fa-calendar-o fa-lg\"></i>&nbsp; Let's Meet</a>"
  );


  $templateCache.put('js/watchlist/meetings/partials/watchlist.meetings.html',
    "<div ng-repeat=\"offer in post.offers.results\">\n" +
    "\n" +
    "    <!--Meeting Requests Awaiting Response-->\n" +
    "    <div style=\"border: 1px solid; border-color: #e5e6e9 #dfe0e4 #d0d1d5; margin-bottom: 20px; padding: 0px;\" class=\"col-md-10 col-xs-12\" ng-if=\"userObj.user_settings.name === offer.username\" ng-class=\"{ 'proposal-sent': !offer.proposals[cachedOffers[$index].proposals.length - 1].isOwnerReply, 'proposal-accepted': offer.proposals[cachedOffers[$index].proposals.length - 1].acceptedAt }\" construct-wish-list-overlay-message offer=\"offer\" post=\"post\" message=\"css content string dynamically added\">\n" +
    "        <div style=\"background-color: #ffffff; padding: 10px;\">\n" +
    "            <div>\n" +
    "                <img ng-src=\"{{offer.userProfile.profile_photo}}\" height=\"40\" style=\"position: relative; top: -12px;\">\n" +
    "                <div style=\"display: inline-block\">\n" +
    "                    <div>\n" +
    "                        @{{offer.username}}\n" +
    "                    </div>\n" +
    "                    <div>\n" +
    "                        Sent {{offer.modifiedAt | date:\"MMMM d 'at' h:mma\"}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    <div class=\"dropdown\" dropdown on-toggle=\"toggled(open)\" style=\"position: absolute; top: 10px; right: 15px;\">\n" +
    "                        <a href class=\"dropdown-toggle\" dropdown-toggle><i class=\"fa fa-chevron-down\"></i></a>\n" +
    "                        <ul class=\"dropdown-menu dropdown-menu-right\">\n" +
    "                            <li>\n" +
    "                                <a href ng-click=\"cancelOffer(offer, post)\">Cancel my offer</a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div>\n" +
    "                        <span ng-show=\"offer.proposals[offer.proposals.length - 1].comment\"><i>\"{{offer.proposals[offer.proposals.length - 1].comment}}\"</i></span>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <br>\n" +
    "\n" +
    "                    <div class=\"controls\">\n" +
    "                        <div class=\"input-group input-group-lg\">\n" +
    "                            <span class=\"input-group-addon\">$</span>\n" +
    "                            <input class=\"form-control\" type=\"text\" id=\"price\" name=\"price\" ng-model=\"offer.proposals[offer.proposals.length - 1].price.value\" ng-disabled=\"true\"/>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <br>\n" +
    "\n" +
    "                    <div class=\"controls\">\n" +
    "                        <div class=\"input-group input-group-lg\">\n" +
    "                            <span class=\"input-group-addon\">@</span>\n" +
    "                            <input class=\"form-control\" type=\"text\" id=\"location\" name=\"location\" ng-model=\"offer.proposals[offer.proposals.length - 1].where\" ng-disabled=\"true\"/>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <br>\n" +
    "\n" +
    "                    <div class=\"btn-group\" role=\"group\">\n" +
    "                        <label class=\"btn btn-default btn-lg\" disabled=\"true\"><i class=\"fa fa-clock-o\"></i></label>\n" +
    "                        <label class=\"btn btn-default btn-lg\" ng-repeat=\"proposedTime in offer.proposals[offer.proposals.length - 1].when\" btn-radio=\"proposedTime\" ng-model=\"acceptedTime.model\" ng-change=\"errors.message = null\">{{proposedTime | date:'MMM d, h:mm a'}}</label>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div ng-show=\"errors.message\">\n" +
    "                        <span class=\"text-danger\">{{errors.message}}</span>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"read-meeting\">\n" +
    "\n" +
    "            <div style=\"display: inline-block; position: relative;\">\n" +
    "                <button class=\"btn btn-primary\" ng-click=\"counterOffer($index, offer.proposals[offer.proposals.length - 1])\">Send Counter Offer</button>\n" +
    "            </div>\n" +
    "\n" +
    "            <div style=\"display: inline-block; position: relative;\">\n" +
    "                <button class=\"btn btn-success\" ng-click=\"acceptDeal($index, offer.proposals[offer.proposals.length - 1])\">Accept Offer</button>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"col-xs-12\">\n" +
    "    <span ng-show=\"!post.offers.results.length\">Keep track of how many users requested to view the {{post.heading}}</span>\n" +
    "    <span ng-show=\"post.offers.results.length && userObj.user_settings.name !== post.offers.results[0].username\"><i class=\"fa fa-exclamation-circle\"></i> {{post.offers.results.length}} other users have placed an offer on this item.</span>\n" +
    "</div>"
  );


  $templateCache.put('js/watchlist/partials/watchlist.html',
    "<div ui-view></div>\n" +
    "\n" +
    "<div class=\"outer-container-interested interested-well\">\n" +
    "\n" +
    "    <!--{{expandedPostingId}}-->\n" +
    "\n" +
    "    <!--{{currentState}}-->\n" +
    "\n" +
    "    <div ng-show=\"!currentFaves.length\" class=\"background-instructions\">\n" +
    "        <div class=\"inset-background-text\">\n" +
    "            Place an offer on an item, or star an item, and it will appear here.\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <div ng-show=\"currentFaves.length\">\n" +
    "        <table ng-table=\"tableParams\" class=\"table\">\n" +
    "            <thead>\n" +
    "            <tr ng-show=\"checkboxes.checked\">\n" +
    "                <th>\n" +
    "\n" +
    "                </th>\n" +
    "                <th colspan=\"6\" class=\"fave-batch-button\">\n" +
    "\n" +
    "                    <dropdown-multiselect selectedlabels=\"selected_labels\" userlabels=\"UserLabels\" selectedfaves=\"checkboxes.items\">\n" +
    "\n" +
    "                    </dropdown-multiselect>\n" +
    "\n" +
    "                </th>\n" +
    "                <!--<th colspan=\"4\" class=\"fave-batch-button\" ng-model=\"batchContact\" ng-click=\"batchEmail(checkboxes)\">-->\n" +
    "                    <!--<i class=\"fa fa-envelope\">&nbsp;&nbsp;Contact Seller</i>-->\n" +
    "                <!--</th>-->\n" +
    "                <th colspan=\"6\" class=\"fave-batch-button\" ng-model=\"batchTrash\" ng-click=\"batchRemoveFaves(checkboxes)\">\n" +
    "                    <i class=\"fa fa-trash\">&nbsp;&nbsp;Trash</i>\n" +
    "                </th>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "                <th colspan=\"1\" width=\"30px\">\n" +
    "                    <input type=\"checkbox\" style=\"text-align: center; vertical-align: middle;\" ng-model=\"checkboxes.masterCheck\" id=\"select_all\" name=\"filter-checkbox\">\n" +
    "                </th>\n" +
    "                <th  colspan=\"9\" class=\"text-center\">\n" +
    "                    <input class=\"form-control\" type=\"text\" ng-model=\"filters.$\" placeholder=\"Filter Watchlist\" style=\"width:98%; margin:0px;\"/>\n" +
    "                </th>\n" +
    "                <th colspan=\"2\" style=\"vertical-align: middle;\" class=\"text-center sortable\" ng-class=\"{\n" +
    "                                        'sort-asc': tableParams.isSortBy('price', 'asc'),\n" +
    "                                        'sort-desc': tableParams.isSortBy('price', 'desc')\n" +
    "                                    }\"\n" +
    "                    ng-click=\"tableParams.sorting({'price' : tableParams.isSortBy('price', 'asc') ? 'desc' : 'asc'})\">\n" +
    "                    <div>Price</div>\n" +
    "                </th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "    <div class=\"inner-container-interested\">\n" +
    "        <table ng-table=\"tableParams\" class=\"table table-striped table-hover table-padding\" ng-class=\"checkboxes.checked ? 'table-big-nudge' : 'table-nudge'\">\n" +
    "            <thead>\n" +
    "\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "                <tr ng-repeat-start=\"favorite in $data\" ng-click=\"openSplash(favorite)\">\n" +
    "                    <td width=\"30\" style=\"text-align: center; vertical-align: middle;\">\n" +
    "                        <input type=\"checkbox\" ng-model=\"checkboxes.items[favorite.postingId]\" ng-click=\"$event.stopPropagation();\"/>\n" +
    "                    </td>\n" +
    "                    <td style=\"width:70px; cursor: pointer;\">\n" +
    "                        <img ng-show=\"favorite.images.length\" ng-src=\"{{::favorite.images[0].full || favorite.images[0].thumb || favorite.images[0].images}}\" style=\"width:70px; height:70px;\">\n" +
    "                        <div ng-show=\"!favorite.images.length\" class=\"watchlist-noImage-Placeholder\"></div>\n" +
    "                    </td>\n" +
    "                    <td filter=\"{ 'heading': 'text' }\" style=\"cursor: pointer;\">\n" +
    "\n" +
    "                        <h4>{{::favorite.heading | cleanHeading}}\n" +
    "                                <span ng-repeat=\"label in favorite.labels\" class=\"label label-primary\" style=\"font-weight: inherit; margin-right: 5px;\">\n" +
    "                                    {{label}} | x\n" +
    "                                </span>\n" +
    "                        </h4>\n" +
    "\n" +
    "                        <div>\n" +
    "                            <button class=\"btn btn-default\" type=\"button\" ng-click=\"expandCollapseQuestions($event, favorite)\">\n" +
    "                                <i class=\"fa\" ng-class=\"favorite.currentlyViewing.questions ? 'fa-chevron-down' : 'fa-chevron-right'\"></i> Questions\n" +
    "                            </button>\n" +
    "\n" +
    "                            <button class=\"btn btn-default\" type=\"button\" ng-click=\"expandCollapseMeetingRequests($event, favorite)\">\n" +
    "                                <i class=\"fa\" ng-class=\"favorite.currentlyViewing.meetings ? 'fa-chevron-down' : 'fa-chevron-right'\"></i> Offers\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                    <td ng-if=\"favorite.askingPrice.value\" style=\"vertical-align: middle;\">\n" +
    "                        <h5>{{::favorite.askingPrice.value | currency : $ : 0}}</h5>\n" +
    "                    </td>\n" +
    "                    <td ng-if=\"!favorite.askingPrice.value\" style=\"vertical-align: middle;\">\n" +
    "                        <h4>No price</h4>\n" +
    "                    </td>\n" +
    "                    <td style=\"width:20px; vertical-align: middle;\">\n" +
    "                        <i class=\"fa fa-trash-o fa-2x\" ng-click=\"removeFave(favorite); $event.stopPropagation();\" style=\"cursor: pointer;\" tooltip=\"Remove from watch list\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"left\"></i>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "\n" +
    "                <tr ng-show=\"currentState === 'watchlist.questions' && expandedPostingId === favorite.postingId\" style=\"background-color: rgb(253, 253, 253);\">\n" +
    "                    <td colspan=\"6\" style=\"background-color: rgb(253, 253, 253);\">\n" +
    "                        <sender-questions-more-info post=\"favorite\"></sender-questions-more-info>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "\n" +
    "                <tr ng-repeat-end ng-show=\"currentState === 'watchlist.meetings' && expandedPostingId === favorite.postingId\" style=\"background-color: rgb(253, 253, 253);\">\n" +
    "                    <td colspan=\"6\" style=\"background-color: rgb(253, 253, 253);\">\n" +
    "                        <sender-meetings-more-info post=\"favorite\"></sender-meetings-more-info>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('js/watchlist/questions/partials/watchlist.questions.html',
    "<div ng-repeat=\"question in post.questions.results\">\n" +
    "    <div style=\"border: 1px solid; border-color: #e5e6e9 #dfe0e4 #d0d1d5; margin-bottom: 20px; padding: 0px;\" class=\"col-md-10 col-xs-12\">\n" +
    "        <div style=\"background-color: #ffffff; padding: 10px;\">\n" +
    "            <div>\n" +
    "                <img ng-src=\"{{question.userProfile.profile_photo}}\" height=\"40\" style=\"position: relative; top: -12px;\">\n" +
    "                <div style=\"display: inline-block\">\n" +
    "                    <div>\n" +
    "                        @{{question.username}}\n" +
    "                    </div>\n" +
    "                    <div>\n" +
    "                        Sent {{question.modifiedAt | date:\"MMMM d 'at' h:mma\"}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div ng-show=\"question.username === userObj.user_settings.name\">\n" +
    "                    <div class=\"dropdown\" dropdown on-toggle=\"toggled(open)\" style=\"position: absolute; top: 10px; right: 15px;\">\n" +
    "                      <a href class=\"dropdown-toggle\" dropdown-toggle><i class=\"fa fa-chevron-down\"></i></a>\n" +
    "                      <ul class=\"dropdown-menu dropdown-menu-right\">\n" +
    "                          <li>\n" +
    "                              <a href ng-click=\"deleteQuestion(question.postingId, question.questionId)\">Delete my question</a>\n" +
    "                          </li>\n" +
    "                      </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    Q: {{question.value}}\n" +
    "                </div>\n" +
    "                <div ng-show=\"question.answers.length\">\n" +
    "                    <div ng-repeat=\"answer in question.answers\">\n" +
    "                        A: {{answer.value}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div style=\"padding: 10px; background-color: #F4A460; color:#ffffff\" ng-show=\"!question.answers.length\">\n" +
    "            Waiting on seller to answer.  Hang tight!\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"col-xs-12\">\n" +
    "    <!--<a ng-show=\"showAnswered && post.questions.results.length\" ng-click=\"showAnswered = !showAnswered\">Hide questions already answered?</a>-->\n" +
    "    <!--<a ng-show=\"!showAnswered && post.questions.results.length\" ng-click=\"showAnswered = !showAnswered\">Show questions already answered?</a>-->\n" +
    "    <span ng-show=\"!post.questions.results.length\">User questions associated with this item will appear here.</span>\n" +
    "</div>"
  );

}]);
