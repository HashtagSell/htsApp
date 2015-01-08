htsApp.controller('sideNav.controller', ['$scope', '$rootScope', 'sideNavFactory', function ($scope, $rootScope, sideNavFactory) {

    $scope.sideNav = sideNavFactory;

    //TODO: SideNav does not correctly highlight menu item on page load.
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

        sideNavFactory.settingsMenu[0].link = fromState.name;
    });

}]);