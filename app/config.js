//Forcing XHR requests via Angular $http (AJAX)
htsApp.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', function ($httpProvider, $stateProvider, $urlRouterProvider) {

    //Allows for async ajax calls to authentication apis
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

    //function assigned to routes that can only be accessed when user logged in
    var loginRequired = ['$q', '$location', '$modal', '$log', 'Session', function($q, $location, $modal, $log, Session) {
        var deferred = $q.defer();

        if(! Session.getLoginStatus()) {
            deferred.reject();
            $location.path('/');


            var modalInstance = $modal.open({
                templateUrl: 'js/authentication/partials/signIn.html',
                controller: 'signInModalController'
            });

            modalInstance.result.then(function (reason) {

            }, function (reason) {
                console.log(reason);
                if(reason == "signUp"){
//                    $scope.signUp();
                } else if (reason == "forgot"){
//                    $scope.forgotPassword();
                }
                $log.info('Modal dismissed at: ' + new Date());
            });


        } else {
            deferred.resolve()
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
            template: "My Profile"
        }).
        state('feed', {
            url: "/feed",
            template: "My Feed"
        }).
        state('selling', {
            url: "/selling",
            template: "Items I'm Selling",
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
            templateUrl: "js/settings/partials/settings_partial.html",
            resolve: { loginRequired: loginRequired }
        }).
        state('settings.general', {
            url: "/general",
            templateUrl: "js/settings/partials/settings.general_partial.html",
            controller: "settings.general.controller",
            resolve: { loginRequired: loginRequired }
        }).
        state('settings.profile', {
            url: "/profile",
            templateUrl: "js/settings/partials/settings.profile_partial.html",
            controller: "settings.profile.controller",
            resolve: { loginRequired: loginRequired }
        }).
        state('settings.payment', {
            url: "/payment",
            templateUrl: "js/settings/partials/settings.payment_partial.html",
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
            resolve: { loginRequired: loginRequired }
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




htsApp.run(['$rootScope', 'sideNavFactory', function ($rootScope, sideNavFactory) {

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            //console.log(event, toState, toParams, fromState, fromParams);
            sideNavFactory.updateState(toState);

        }
    )

}]);