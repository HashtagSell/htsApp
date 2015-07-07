/**
 * Created by braddavis on 1/4/15.
 */
htsApp.controller('buyNowModalController', ['$scope', '$modalInstance', 'result', function ($scope, $modalInstance, result) {

    $scope.result = result;

    $scope.yes = function() {
        $modalInstance.dismiss('venmo');
    };

    $scope.no = function() {
        $modalInstance.dismiss('meetingRequest');
    };

    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);