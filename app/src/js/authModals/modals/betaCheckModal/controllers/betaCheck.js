//Controller catches the create account process from the create account modal and passes it to our authFactory
htsApp.controller('betaCheckModalController', ['$scope', '$modalInstance', function ($scope, $modalInstance) {

    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);