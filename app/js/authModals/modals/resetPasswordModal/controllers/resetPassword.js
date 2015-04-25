//Controller catches forgot password process from the forgot password modal and passes it to our authFactory
htsApp.controller('resetPasswordModalController', ['$scope', '$modalInstance', 'authFactory', 'token', function ($scope, $modalInstance, authFactory, token) {
    $scope.resetPassword = function (isValid) {
        if (isValid) {
            var newPassword = $scope.newPassword;


            authFactory.changePassword(newPassword, token).then(function (response) {

                console.log(response);

                if(response.error) {

                    $scope.message = response.error;

                } else if(response.success) {

                    $scope.dismiss(response);

                }

            }, function () {

                $scope.message = "Please contact support.  Sorry for the trouble";

            });
        }

    };


    $scope.dismiss = function (response) {
        $modalInstance.dismiss(response);
    };

}]);