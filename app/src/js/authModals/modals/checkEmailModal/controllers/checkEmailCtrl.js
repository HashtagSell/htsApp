//Controller catches the sign-in process from the sign-in modal and passes it to our authFactory
htsApp.controller('checkEmailController', ['$scope', '$modalInstance', function ($scope, $modalInstance) {

    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);