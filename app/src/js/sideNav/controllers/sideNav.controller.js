htsApp.controller('sideNav.controller', ['$scope', 'sideNavFactory', 'splashFactory', function ($scope, sideNavFactory, splashFactory) {

    $scope.sideNav = sideNavFactory;

    $scope.result = splashFactory.result;

}]);