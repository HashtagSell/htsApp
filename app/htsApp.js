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

var htsApp = angular.module('htsApp', ['globalVars', 'ui.router', 'ct.ui.router.extras.core', 'ct.ui.router.extras.dsr', 'ui.bootstrap', 'mentio', 'ui.bootstrap-slider', 'frapontillo.bootstrap-switch', 'ngTable', 'uiGmapgoogle-maps', 'ivh.treeview', 'vs-repeat', 'ui.bootstrap.datetimepicker', 'angular-medium-editor', 'ngSanitize', 'ui-notification', 'ezfb']);



//Forcing XHR requests via Angular $http (AJAX)
htsApp.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$tooltipProvider', 'ivhTreeviewOptionsProvider', '$locationProvider', 'ezfbProvider', 'ENV', function ($httpProvider, $stateProvider, $urlRouterProvider, $tooltipProvider, ivhTreeviewOptionsProvider, $locationProvider, ezfbProvider, ENV) {

    //Allows for async ajax calls to authentication apis
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

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

    //Allows me to programatically show/hide popovers needed in tutorials
    $tooltipProvider.setTriggers({
        'show': 'hide'
    });


    //function assigned to routes that can only be accessed when user logged in
    var loginRequired = ['$q', 'Session', '$state', '$timeout', 'redirect', function ($q, Session, $state, $timeout, redirect) {
        var deferred = $q.defer();

        console.log('checking login!', Session.userObj);
        console.log('login Checker should redirect to', redirect);

        if (!Session.userObj.user_settings.loggedIn) {

            $timeout(function() {
                $state.go('signup', { 'redirect': redirect });
            });

            deferred.reject();

        } else {
            deferred.resolve();
        }

        return deferred.promise;

    }];


    var joinRoom = ['socketio', 'Session', '$stateParams', 'splashFactory', function (socketio, Session, $stateParams, splashFactory) {
       if (Session.userObj.user_settings.loggedIn) {
           socketio.joinPostingRoom($stateParams.id, 'toggleSplash');

           //TODO: This is running before we have any data in factory.
           if(splashFactory.result) {
               if (splashFactory.result.external.source === 'HSHTG') {

                   var postingOwner = splashFactory.result.username;

                   socketio.joinUserRoom(postingOwner, Session.userObj.user_settings.name);
               }
           }
       }
    }];

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
        state('new-post', {
            url: "/new-post",
            controller: 'newPostController',
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'new-post';
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
        state('root', {
            url: "/",
            onEnter: function ($state) {
                $state.go('feed');
            }
        }).
        state('feed', {
            url: "/feed",
            templateUrl: "js/feed/partials/feed.partial.html",
            controller: "feed.controller",
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'feed';
                }
            }
        }).
        state('feed.splash', {
            url: "/:id",
            controller: 'splashController',
            onEnter: joinRoom,
            onExit: leaveRoom
        }).
        state('watchlist', {
            url: "/watchlist",
            templateUrl: "js/interested/partials/interested.html",
            controller: 'myFavesController',
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'watchlist';
                }
            }
        }).
        state('watchlist.questions', {
            url: "/questions/:postingId"
        }).
        state('watchlist.offers', {
            url: "/offers/:postingId"
        }).
        state('watchlist.splash', {
            url: "/:id",
            controller: 'splashController',
            onEnter: joinRoom,
            onExit: leaveRoom
        }).
        state('notifications', {
            url: "/notifications",
            templateUrl: "js/notifications/partials/notifications.html",
            controller: 'notifications.controller',
            rresolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'notifications';
                }
            }
        }).
        state('myposts', {
            url: "/myposts",
            templateUrl: "js/myPosts/partials/myPosts.html",
            controller: 'myPosts.controller',
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'myposts';
                }
            }
        }).
        state('myposts.questions', {
            url: "/questions/:postingId"
        }).
        state('myposts.offers', {
            url: "/offers/:postingId"
        }).
        state('myposts.splash', {
            url: "/:id",
            controller: 'splashController'
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
        state('results', {
            url: '/q/:q',
            controller: 'results.controller',
            templateUrl: "js/results/partials/results_partial.html",
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'results';
                }
            }
            //deepStateRedirect: {
            //    default: { state: "results", params: { q: "logitech" } },
            //    params: true,
            //    fn: function($dsr$) {
            //        return false;
            //    }
            //}
        }).
        state('results.splash', {
            url: "/:id",
            controller: 'splashController',
            onEnter: joinRoom,
            onExit: leaveRoom
        }).
        state('twitter', {
            url: "/tw/:id",
            controller: 'splashController'
        }).
        state('facebook', {
            url: "/fb/:id",
            controller: 'splashController'
        }).
        state('ebay', {
            url: "/eb/:id",
            controller: 'splashController'
        }).
        state('amazon', {
            url: "/az/:id",
            controller: 'splashController'
        }).
        state('signin', {
            url: '/signin?email&tour',
            params: {
                'redirect': null,
                'email': null,
                'tour': null
            },
            controller: function(authModalFactory, $state) {
                console.log($state.params);
                authModalFactory.signInModal($state.params);
            }
        }).
        state('signup', {
            url: '/signup',
            params: { 'redirect': null },
            controller: function(authModalFactory, $state) {
                authModalFactory.signUpModal($state.params);
            }
        }).
        state('checkemail', {
            url: '/checkemail',
            params: { 'redirect': null },
            controller: function(authModalFactory, $state) {
                authModalFactory.checkEmailModal($state.params);
            }
        }).
        state('forgot', {
            url: '/forgot?msg',
            params: {
                'redirect': null,
                'msg': null
            },
            controller: function(authModalFactory, $state) {
                authModalFactory.forgotPasswordModal($state.params);
            }
        }).
        state('reset', {
            url: '/reset/:token/',
            controller: function(authModalFactory, $state) {
                authModalFactory.resetPasswordModal('signin', $state.params.token);
            }
        });



    ivhTreeviewOptionsProvider.set({
        twistieCollapsedTpl: '<span class="glyphicon glyphicon-chevron-right"></span>',
        twistieExpandedTpl: '<span class="glyphicon glyphicon-chevron-down"></span>',
        twistieLeafTpl: '',
        defaultSelectedState: false
    });
}]);


//Verifies is password field match
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
