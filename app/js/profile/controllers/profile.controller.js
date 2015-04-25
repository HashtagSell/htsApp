/**
 * Created by braddavis on 4/5/15.
 */
htsApp.controller('profile.controller', ['$scope', 'profileFactory', function ($scope, profileFactory) {

    $scope.nav = profileFactory.nav;

}]);