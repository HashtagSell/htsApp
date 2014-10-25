//Controller manages the Create Acount and Sign In menu on top right
htsApp.controller('userMenuController', ['$scope', '$location', 'authFactory', 'Session', function ($scope, $location, authFactory, Session) {

    $scope.user = {};

    $scope.loggedIn = function () {
        $scope.getUserName();
        return Session.getLoginStatus();
    };

    $scope.getUserName = function () {
        var userObj = Session.getSessionObj();
        $scope.user = userObj;
    };

    $scope.clearStorage = function () {
        Session.destroy();
    };

    $scope.showUserSettings = function () {
      alert("update view user settings");
    };

    $scope.img = {};
    $scope.ifLoggedIn = function(){
        if($scope.loggedIn()){
            $scope.img.profilePhoto = "/images/userMenu/user-placeholder.png";
        } else {
            $scope.img.profilePhoto = "/images/userMenu/user-placeholder.png";
        }
    };
    $scope.ifLoggedIn();


    $scope.userSettings = function() {
        $location.path("/settings");
    };

}]);