htsApp.controller('changePasswordModalController', ['$scope', '$modal', '$log', '$routeParams', function ($scope, $modal, $log, $routeParams) {

        if($routeParams.uid) {

            $scope.uid = $routeParams.uid;

            var modalInstance = $modal.open({
                templateUrl: 'js/authentication/partials/changePassword.html',
                controller: 'changePasswordController',
                resolve: {
                    uid: function () {
                        return $scope.uid;
                    }
                }
            });

            modalInstance.result.then(function (reason) {

            }, function (reason) {
                console.log(reason);
                if (reason == "success") {
                    $scope.signIn();
                }
                $log.info('Modal dismissed at: ' + new Date());
            });



            $scope.signIn = function (size) {

                var modalInstance = $modal.open({
                    templateUrl: 'js/authentication/partials/signIn.html',
                    controller: 'signInModalController'
                });

                modalInstance.result.then(function (reason) {

                }, function (reason) {
                    console.log(reason);
                    if(reason == "signUp"){
                        $scope.signUp();
                    } else if (reason == "forgot"){
                        $scope.forgotPassword();
                    }
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };



            $scope.signUp = function (size) {

                var modalInstance = $modal.open({
                    templateUrl: 'js/authentication/partials/signUp.html',
                    controller: 'signupModalContainer'
                });

                modalInstance.result.then(function (reason) {

                }, function (reason) {
                    if(reason == "success"){
                        $scope.checkEmail();
                    }
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };


            $scope.checkEmail = function (size) {

                var modalInstance = $modal.open({
                    templateUrl: 'js/authentication/partials/checkEmail.html',
                    controller: 'checkEmailController'
                });

                modalInstance.result.then(function (reason) {

                }, function (reason) {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };


            $scope.forgotPassword = function (size) {

                var modalInstance = $modal.open({
                    templateUrl: 'js/authentication/partials/forgotPassword.html',
                    controller: 'forgotPasswordController'
                });

                modalInstance.result.then(function (reason) {

                }, function (reason) {
                    if(reason == "success"){
                        $scope.checkEmail();
                    }
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };


        }
}]);