/**
 * Created by braddavis on 1/4/15.
 */
htsApp.controller('phoneModalController', ['$scope', '$modalInstance', 'Session', 'result', function ($scope, $modalInstance, Session, result) {

    $scope.userObj = Session.userObj;

    $scope.result = result;

    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);