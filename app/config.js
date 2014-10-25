//Forcing XHR requests via Angular $http (AJAX)
htsApp.config(['$httpProvider', '$routeProvider', function ($httpProvider, $routeProvider) {

    //Allows for async ajax calls to authentication apis
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';


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

    }]


    $routeProvider.
        when('/profile', {
//            templateUrl: 'partials/results_grid.html'
            template: "My Profile"
        }).
        when('/feed', {
//            templateUrl: 'partials/results_grid.html'
            template: "My Feed"
        }).
        when('/selling', {
//            templateUrl: 'partials/results_grid.html'
            template: "Items I'm Selling",
            resolve: { loginRequired: loginRequired }
        }).
        when('/interested', {
//            templateUrl: 'partials/results_grid.html'
            template: "Items I'm interested in",
            resolve: { loginRequired: loginRequired }
        }).
        when('/notifications', {
//            templateUrl: 'partials/results_grid.html'
            template: "My Notifications",
            resolve: { loginRequired: loginRequired }
        }).
        when('/settings', {
//            templateUrl: 'partials/results_grid.html'
            template: "User Settings",
            resolve: { loginRequired: loginRequired }
        }).
        when('/search/:q/', {
            controller: 'searchController',
            templateUrl: "js/search/partials/results.html"
        }).
        when('/reset/:uid/', {
            template: " ",
            controller: "changePasswordModalController"
        }).
        otherwise({
            redirectTo: '/feed'
        });





}]);