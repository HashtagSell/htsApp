htsApp.controller('sideNav.controller', ['$scope', '$rootScope', 'sideNavFactory', function ($scope, $rootScope, sideNavFactory) {

    $scope.sideNav = sideNavFactory;

    //TODO: SideNav does not correctly highlight menu item on page load.

    //$scope.selected = {
    //    $$hashKey: "object:14",
    //    alerts : null,
    //    link : 'settings.general',
    //    name : 'General Settings'
    //};

    //sideNavFactory.watchme = {
    //    scope : $scope,
    //    prent : $rootScope
    //};
}]);