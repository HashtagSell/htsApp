htsApp.controller('sideNav.controller', ['$scope', '$rootScope', 'sideNavFactory', 'splashFactory', function ($scope, $rootScope, sideNavFactory, splashFactory) {

    $scope.sideNav = sideNavFactory;

    $scope.result = splashFactory.result;

    //Any time the user moves to a different page this function is called.
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

        sideNavFactory.updateSideNav(toState);

        //Captures the previous state and appends it to the 'back' button in the settings and splash sideNav
        sideNavFactory.settingsMenu[0].link = fromState.name;
    });


    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        sideNavFactory.redirect = toState;
    });

}]);