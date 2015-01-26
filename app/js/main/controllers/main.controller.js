/**
 * Created by braddavis on 1/24/15.
 */
htsApp.controller('mainController', ['$scope', 'sideNavFactory', function ($scope, sideNavFactory) {

    $scope.sideNavOffCanvas = sideNavFactory.sideNavOffCanvas;

    console.log($scope.sideNavOffCanvas);

    $scope.toggleOffCanvasSideNav = function () {
        $scope.sideNavOffCanvas.hidden = !$scope.sideNavOffCanvas.hidden;
    };

}]);