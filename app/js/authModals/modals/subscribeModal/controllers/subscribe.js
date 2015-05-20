//Controller catches the create account process from the create account modal and passes it to our authFactory
htsApp.controller('subscribeModalController', ['$scope', '$modalInstance', 'authFactory', 'Notification', function ($scope, $modalInstance, authFactory, Notification) {


    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.subscribe = function (isValid) {

        if (isValid) {

            var email = $scope.email;

            authFactory.subscribe(email).then(function (response) {

                console.log(response);

                if(!response.success) {

                    $scope.alerts.push({ type: 'danger', msg: response.message });

                } else if(response.success) {

                    $scope.alerts.push({ type: 'success', msg: response.message });

                }

            }, function () {

                Notification.error({
                    message: "Whoops.. Can't take new subscribers right meow.. We're working on this.",
                    delay: 10000
                });  //Send the webtoast

            });

        }
    };


    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };


}]);