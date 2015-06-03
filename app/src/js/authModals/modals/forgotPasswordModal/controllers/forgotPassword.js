//Controller catches forgot password process from the forgot password modal and passes it to our authFactory
htsApp.controller('forgotPasswordController', ['$scope', '$modalInstance', 'authFactory', 'params', function ($scope, $modalInstance, authFactory, params) {

    if(params.msg) {
        $scope.message = "This activation email link has already been used.  Sign in or reset your password.";
    }

    $scope.forgotPassword = function (isValid) {
        if (isValid) {
            var email = $scope.email;

            authFactory.passwordReset(email).then(function (response) {

                if(response.error) {

                    $scope.message = response.error;

                } else if(response.success) {

                    $scope.dismiss("success");

                }

            }, function () {

                $scope.message = "Please contact support.  Sorry for the trouble";

            });
        }

    };


    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);