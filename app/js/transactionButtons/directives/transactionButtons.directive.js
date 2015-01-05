/**
 * Created by braddavis on 1/3/15.
 */
htsApp.directive('transactionButtons', function () {
    return {
        restrict: 'E',
        scope: {
            result: '='
        },
        templateUrl: 'js/transactionButtons/partials/transactionButtons.partial.html',
        controller: ['$scope', '$element', '$modal', '$log', 'Session', 'quickComposeFactory', 'authModalFactory', '$window', function ($scope, $element, $modal, $log, Session, quickComposeFactory, authModalFactory, $window) {

            $scope.quickCompose = function () {

                console.log('item we clicked on', $scope.result);

                if(Session.userObj.user_settings.email_provider[0].value === "ask") {  //If user needs to pick their email provider

                    var modalInstance = $modal.open({
                        templateUrl: 'js/transactionButtons/modals/email/partials/transactionButtons.modal.email.partial.html',
                        controller: 'quickComposeController',
                        resolve: {
                            result: function () {
                                return $scope.result;
                            }
                        }
                    });

                    modalInstance.result.then(function (reason) {

                    }, function (reason) {
                        console.log(reason);
                        if (reason === "signUp") {
                            authModalFactory.signUpModal();
                        }
                        $log.info('Modal dismissed at: ' + new Date());
                    });

                } else {  //User already set their default email provider

                    quickComposeFactory.generateMailTo(Session.userObj.user_settings.email_provider[0].value, $scope.result);

                }

            };


            $scope.displayPhone = function () {

                var modalInstance = $modal.open({
                    templateUrl: 'js/transactionButtons/modals/phone/partials/transactionButtons.modal.phone.partial.html',
                    controller: 'phoneModalController',
                    resolve: {
                        result: function () {
                            return $scope.result;
                        }
                    }
                });

                modalInstance.result.then(function (reason) {

                }, function (reason) {
                    console.log(reason);
                    if (reason === "signUp") {
                        authModalFactory.signUpModal();
                    }
                    $log.info('Modal dismissed at: ' + new Date());
                });

            };

            //Ebay item.  Button links to item on ebay
            $scope.placeBid = function () {
                $window.open($scope.result.external_url);
            };


            //HTS item.  Gathers date and time to propose for pickup.
            $scope.proposeDateTime = function () {
                alert('Propose date and time to exchange item');
            };

        }]
    };
});