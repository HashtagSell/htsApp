//Controller catches the create account process from the create account modal and passes it to our authFactory
htsApp.controller('signupModalContainer', ['$scope', '$modalInstance', 'authFactory', function ($scope, $modalInstance, authFactory) {
    $scope.signupPassport = function (isValid) {

        if (isValid) {
            var email = $scope.email;
            var password = $scope.password_verify;
            var name = $scope.name;

            //Private Beta
            var secret = $scope.secret;

            authFactory.signUp(email, password, name, secret).then(function (response) {

                console.log(response);

                if(response.error) {

                    $scope.message = response.error;

                } else if(response.success) {

                    $scope.dismiss("success");

                }

            }, function () {

                alert("signup error");

            });

        }
    };


    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };


}]);