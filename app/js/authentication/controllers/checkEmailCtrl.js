//Controller catches the sign-in process from the sign-in modal and passes it to our authFactory
htsApp.controller('checkEmailController', ['$scope', '$modalInstance', 'authFactory', function ($scope, $modalInstance, authFactory) {

    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);