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
        controller: ['$scope', 'transactionFactory', function ($scope, transactionFactory) {

            $scope.quickCompose = function () {
                transactionFactory.quickCompose($scope.result);
            };


            $scope.displayPhone = function () {
                transactionFactory.displayPhone($scope.result);
            };

            //CL item does not have phone and email so we open splash detailed view.
            $scope.openSplash = function () {
                transactionFactory.openSplash($scope.result);
            };


            //Ebay item.  Button links to item on ebay
            $scope.placeBid = function () {
                transactionFactory.placeBid($scope.result);
            };


            //HTS item.  Gathers date and time to propose for pickup.
            $scope.placeOffer = function () {
                transactionFactory.placeOffer($scope.result);
            };

        }]
    };
});