htsApp.controller('sideProfile', ['$scope', 'Session', function ($scope, Session) {

    $scope.userObj = Session.userObj;

}]);