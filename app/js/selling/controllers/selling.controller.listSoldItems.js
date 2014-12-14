/**
 * Created by braddavis on 12/14/14.
 */
htsApp.controller('selling.controller.listSoldItems', ['$scope', 'lookupItemsForSale', function ($scope, lookupItemsForSale) {


    lookupItemsForSale.init().then(function (response) {

        if(response.status !== 200) {

            $scope.results = response.data.error;

        } else if(response.status == 200) {

            $scope.results = response.data;

        }
    }, function (response) {

        console.log(response);

        //TODO: Use modal service to notify users
        alert("lookup error");

    });

}]);