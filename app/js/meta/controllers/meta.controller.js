/**
 * Created by braddavis on 4/22/15.
 */
htsApp.controller('metaController', ['$scope', 'metaFactory', function ($scope, metaFactory) {

    $scope.metatags = metaFactory.metatags;

}]);