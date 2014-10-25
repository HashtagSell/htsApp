//Controller catches the new password our user submits and passes it to our authFactory
htsApp.controller('changePasswordController', ['$scope', '$modalInstance', 'authFactory', 'uid', function ($scope, $modalInstance, authFactory, uid) {

    $scope.uid = uid;

    $scope.changePassword = function (isValid) {
        if (isValid) {

            var newpassword = $scope.newpassword;
            var token = $scope.uid;

            authFactory.changePassword(newpassword, token).then(function (response) {

                if(response.error) {

                    $scope.message = response.error;

                } else if(response.success) {

                    $scope.dismiss("success");

                }


            }, function () {

                alert("change password error");

            });
        }
    };

    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);