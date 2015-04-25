/**
 * Created by braddavis on 4/16/15.
 */
htsApp.controller('settings.password.controller', ['$scope', 'authFactory', function ($scope, authFactory) {

    $scope.updatePassword = function (isValid) {
        if (isValid) {

            var currentPassword = $scope.currentPassword;
            var newPassword = $scope.newPassword;

            authFactory.updatePassword(currentPassword, newPassword).then(function (response) {

                if(response.error) {

                    $scope.message = response.error;

                } else if(response.success) {

                    //$scope.dismiss("success");

                    alert('done!');

                }


            }, function () {

                alert("update password error");

            });
        }
    };

}]);