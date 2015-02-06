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

var htsApp = angular.module('htsApp', ['ui.router', 'ui.bootstrap', 'mentio', 'ui.bootstrap-slider', 'frapontillo.bootstrap-switch', 'ngTable', 'uiGmapgoogle-maps', 'angular-carousel', 'ivh.treeview', 'vs-repeat', 'ui.bootstrap.datetimepicker', 'angular-medium-editor', 'ngSanitize']);



//Forcing XHR requests via Angular $http (AJAX)
htsApp.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', 'ivhTreeviewOptionsProvider', function ($httpProvider, $stateProvider, $urlRouterProvider, ivhTreeviewOptionsProvider) {

    //Allows for async ajax calls to authentication apis
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

    //uiGmapGoogleMapApiProvider.configure({
    //    //    key: 'your api key',
    //    v: '3.17',
    //    libraries: 'geometry'
    //});

    //function assigned to routes that can only be accessed when user logged in
    var loginRequired = ['$q', 'Session', 'authModalFactory', 'sideNavFactory', function ($q, Session, authModalFactory, sideNavFactory) {
        var deferred = $q.defer();

        if (!Session.userObj.user_settings.loggedIn) {
            deferred.reject();
            //$location.path('/');
            //$location.path('/');

            authModalFactory.signInModal(sideNavFactory.redirect.name);

        } else {
            deferred.resolve();
        }

        return deferred.promise;

    }];


    var joinRoom = ['socketio', 'Session', '$stateParams', function (socketio, Session, $stateParams) {
       if (Session.userObj.user_settings.loggedIn) {
           socketio.joinRoom($stateParams.id);
       }
    }];

    var leaveRoom = ['socketio', 'Session', '$stateParams', function (socketio, Session, $stateParams) {
        if (Session.userObj.user_settings.loggedIn) {
            socketio.leaveRoom($stateParams.id);
        }
    }];


    $urlRouterProvider.otherwise('/feed');


    $stateProvider.
        state('new-post', {
            url: "/new-post",
            controller: 'newPostController'
        }).
        state('profile', {
            url: "/profile",
            template: '<div class="outer-container col-lg-7 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-12" style="margin-top:20px;"><div class="inner-container">User Profile, Messages, & Ratings (Coming soon)</div></div>',
            resolve: { loginRequired: loginRequired }
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
        state('selling', {
            url: "/selling",
            templateUrl: "js/selling/partials/selling.partials.listSoldItems.html",
            controller: 'selling.controller.listSoldItems',
            resolve: { loginRequired: loginRequired }
        }).
        state('selling.splash', {
            url: "/:id",
            controller: 'splashController',
            resolve: { loginRequired: loginRequired }
        }).
        state('interested', {
            url: "/interested",
            templateUrl: "js/interested/partials/interested.html",
            controller: 'myFavesController',
            resolve: { loginRequired: loginRequired }
        }).
        state('interested.splash', {
            url: "/:id",
            controller: 'splashController',
            resolve: { loginRequired: loginRequired },
            onEnter: joinRoom,
            onExit: leaveRoom
        }).
        state('notifications', {
            url: "/notifications",
            templateUrl: "js/notifications/partials/notifications.html",
            controller: 'notifications.controller',
            resolve: { loginRequired: loginRequired }
        }).
        state('settings', {
            url: "/settings",
            template: "<div ui-view></div>",
            resolve: { loginRequired: loginRequired }
        }).
        state('settings.general', {
            url: "/general",
            templateUrl: "js/settings/general/partials/settings.general_partial.html",
            controller: "settings.general.controller",
            resolve: { loginRequired: loginRequired }
        }).
        state('settings.profile', {
            url: "/profile",
            templateUrl: "js/settings/profile/partials/settings.profile_partial.html",
            controller: "settings.profile.controller",
            resolve: { loginRequired: loginRequired }
        }).
        state('settings.payment', {
            url: "/payment",
            templateUrl: "js/settings/payment/partials/settings.payment_partial.html",
            controller: "settings.payment.controller",
            resolve: { loginRequired: loginRequired }
        }).
        state('results', {
            url: '/results/:q/',
            controller: 'results.controller',
            templateUrl: "js/results/partials/results_partial.html"
        }).
        state('results.splash', {
            url: ":id",
            controller: 'splashController',
            onEnter: joinRoom,
            onExit: leaveRoom
        }).
        state('reset', {
            url: '/reset/:uid/',
            template: " ",
            controller: "changePasswordModalController"
        }).
        state('otherwise', {
            url: '/feed'
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
        //Find any word that is in ALL CAPS and only capitalize the first letter
        return dirtyBody.replace(/\b([A-Z]{2,})\b/g, function (dirtyBody) {

            //Test against regex expression to find items like integers followed by simicolon.  i.e. 5556;
            var integersAndSimicolon = new RegExp("\\S+([0-9];)");
            if (!integersAndSimicolon.test(dirtyBody)) {

                //console.log(dirtyBody);
                //
                //var catchNewLineChar = new RegExp("↵");
                //if (catchNewLineChar.test);

                //TODO: Catch ↵ character and insert new line in html

                var cleanedBody = dirtyBody.charAt(0).toUpperCase() + dirtyBody.substr(1).toLowerCase();
                return $sce.trustAsHtml(cleanedBody);

            } else {
                return '';
            }
        });
    };
}]);
