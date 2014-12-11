//Controller catches the sign-in process from the sign-in modal and passes it to our authFactory
htsApp.controller('signInModalController', ['$scope', '$modalInstance', 'authFactory', function ($scope, $modalInstance, authFactory) {

    $scope.loginPassport = function (isValid) {
        if (isValid) {

            var email = $scope.email;
            var password = $scope.password;

            authFactory.login(email, password).then(function (response) {

                if(response.error) {

                    $scope.message = response.error;

                } else if(response.success) {

                    $scope.dismiss("successful login");

                }

            }, function () {

                $scope.message = "Ooops.. Login error, please contact support.";

            });
        }
    };


    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };


}]);