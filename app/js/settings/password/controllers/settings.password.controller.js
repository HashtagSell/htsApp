/**
 * Created by braddavis on 4/16/15.
 */
htsApp.controller('settings.password.controller', ['$scope', 'authFactory', function ($scope, authFactory) {

    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };


    $scope.updatePassword = function (isValid) {
        if (isValid) {

            var currentPassword = $scope.currentPassword;
            var newPassword = $scope.newPassword;

            authFactory.updatePassword(currentPassword, newPassword).then(function (response) {

                if(response.error) {

                    $scope.alerts.push({ type: 'danger', msg: response.error });

                } else if(response.success) {

                    $scope.alerts.push({ type: 'success', msg: 'Success! Password updated.' });

                }


            }, function () {

                $scope.alerts.push({ type: 'danger', msg: 'Whoops.. Try again or contact support.'});

            });
        }

        $scope.currentPassword = null;
        $scope.newPassword = null;
        $scope.verifyNewPassword = null;
    };

}]);