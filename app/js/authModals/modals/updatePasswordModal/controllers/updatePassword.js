/**
 * Created by braddavis on 11/30/14.
 */
htsApp.controller('updatePasswordModalController', ['$scope', '$modalInstance', 'authFactory', function ($scope, $modalInstance, authFactory) {

    $scope.updatePassword = function (isValid) {
        if (isValid) {

            var currentPassword = $scope.currentPassword;
            var newPassword = $scope.newPassword;

            authFactory.updatePassword(currentPassword, newPassword).then(function (response) {

                if(response.error) {

                    $scope.message = response.error;

                } else if(response.success) {

                    $scope.dismiss("success");

                }


            }, function () {

                alert("update password error");

            });
        }
    };

    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);