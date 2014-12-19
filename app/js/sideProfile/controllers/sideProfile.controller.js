htsApp.controller('sideProfile', ['$scope', 'Session', function ($scope, Session) {

    $scope.userObj = Session.userObj;

}]);


htsApp.directive('backImg', function () {
    return function (scope, element, attrs) {
        var url = attrs.backImg;
        element.css({
            'background-image' : "url(" + url + ")",
            'background-size' : "cover"
        });
    };
});