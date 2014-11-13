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
        state('notifications', {
            url: "/notifications",
            template: "My Notifications",
            resolve: { loginRequired: loginRequired }
        }).
        state('settings', {
            url: "/settings",
            template: "User Settings",
            resolve: { loginRequired: loginRequired }
        }).
        state('results.splash', {
            url: "splash",
            resolve: { loginRequired: loginRequired },
            onEnter: ['$stateParams', '$state', '$modal', 'splash.factory', function($stateParams, $state, $modal, splashFactory) {
                var splashInstance = $modal.open({
                    backdrop: false,
                    templateUrl: "js/splash/partials/splash_content.html",
                    windowTemplateUrl: "js/splash/partials/splash_window.html",
                    resolve: {
                        //item: function() { new Item(123).get(); }
                    },
                    controller: ['$scope', function($scope) {

                        $scope.annotations = splashFactory.annotations;
                        $scope.body = splashFactory.body;
                        $scope.category = splashFactory.category;
                        $scope.category_group = splashFactory.category_group;
                        $scope.distanceFromUser = splashFactory.distanceFromUser;
                        $scope.external_id = splashFactory.external_id;
                        $scope.external_url = splashFactory.external_url;
                        $scope.heading = splashFactory.heading;
                        $scope.images = splashFactory.images;
                        $scope.location = splashFactory.location;
                        $scope.price = splashFactory.price;
                        $scope.source = splashFactory.source;

                    }]
                });

                splashInstance.result.then(function (selectedItem) {
                    console.log(selectedItem);
                }, function () {
                    console.log('Splash dismissed at: ' + new Date());
                    $state.go('results');
                });

            }]
        }).
        state('results', {
            url: '/results/:q/',
            controller: 'results.controller',
            templateUrl: "js/results/partials/results_partial.html"
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