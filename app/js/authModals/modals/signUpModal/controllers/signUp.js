//Controller catches the create account process from the create account modal and passes it to our authFactory
htsApp.controller('signupModalContainer', ['$scope', '$modalInstance', 'authFactory', 'Notification', function ($scope, $modalInstance, authFactory, Notification) {
    $scope.signupPassport = function (isValid) {

        if (isValid) {
            var email = $scope.email;
            var password = $scope.password;
            var name = $scope.name;

            //Private Beta
            var secret = $scope.secret;

            var betaAgreement = $scope.betaAgreement;

            console.log(email, password, secret, name, betaAgreement);

            authFactory.signUp(email, password, name, secret, betaAgreement).then(function (response) {

                console.log(response);

                if(response.error) {

                    $scope.message = response.error;

                } else if(response.success) {

                    $scope.dismiss("success");

                }

            }, function () {

                Notification.error({
                    message: "Appears we're having sign up issues.  Please check back soon.",
                    delay: 10000
                });  //Send the webtoast

            });

        }
    };


    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };


}]);