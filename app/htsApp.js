var htsApp = angular.module('htsApp', ['ui.router', 'ui.bootstrap', 'mentio', 'iso.directives', 'ui.bootstrap-slider', 'infinite-scroll', 'angular-images-loaded', 'ngTable', 'uiGmapgoogle-maps', 'angular-carousel']);



//Forcing XHR requests via Angular $http (AJAX)
htsApp.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', function ($httpProvider, $stateProvider, $urlRouterProvider) {

    //Allows for async ajax calls to authentication apis
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

    //function assigned to routes that can only be accessed when user logged in
    var loginRequired = ['$q', '$location', 'Session', 'authModalFactory', function ($q, $location, Session, authModalFactory) {
        var deferred = $q.defer();

        if (!Session.userObj.user_settings.loggedIn) {
            deferred.reject();
            $location.path('/');


            authModalFactory.signInModal();


        } else {
            deferred.resolve();
        }

        return deferred.promise;

    }];

    $urlRouterProvider.otherwise('/feed');


    $stateProvider.
        state('new-post', {
            url: "/new-post",
            controller: 'newPostController'
        }).
        state('profile', {
            url: "/profile",
            template: "My Profile",
            resolve: { loginRequired: loginRequired }
        }).
        state('feed', {
            url: "/feed",
            template: "My Feed"
        }).
        state('selling', {
            url: "/selling",
            templateUrl: "js/selling/partials/selling.partials.listSoldItems.html",
            controller: 'selling.controller.listSoldItems',
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
            resolve: { loginRequired: loginRequired }
        }).
        state('notifications', {
            url: "/notifications",
            template: "My Notifications",
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
            controller: 'splashController'
        }).
        state('reset', {
            url: '/reset/:uid/',
            template: " ",
            controller: "changePasswordModalController"
        }).
        state('otherwise', {
            url: '/feed'
        });

}]);



//Updates sideNav when user clicks to navigate around application.
htsApp.run(['$rootScope', 'sideNavFactory', function ($rootScope, sideNavFactory) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            sideNavFactory.updateSideNav(toState);
    });
}]);


//Verifies is password field match
htsApp.directive('match', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
            match: '='
        },
        link: function (scope, elem, attrs, ctrl) {
            scope.$watch(function () {
                return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || scope.match === ctrl.$modelValue;
            }, function (currentValue) {
                ctrl.$setValidity('match', currentValue);
            });
        }
    };
});
