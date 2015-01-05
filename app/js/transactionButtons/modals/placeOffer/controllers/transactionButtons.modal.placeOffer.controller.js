/**
 * Created by braddavis on 1/4/15.
 */
htsApp.controller('placeOfferController', ['$scope', '$modalInstance', 'Session', 'result', function ($scope, $modalInstance, Session, result) {

    $scope.userObj = Session.userObj;

    $scope.result = result;

    $scope.onTimeSet = function (newDate, oldDate) {
        console.log(newDate);
        console.log(oldDate);
    };

    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };


    //$scope.status = {
    //    isopen: false
    //};
    //
    //$scope.toggled = function(open) {
    //    $log.log('Dropdown is now: ', open);
    //};
    //
    //$scope.toggleDropdown = function($event) {
    //    $event.preventDefault();
    //    $event.stopPropagation();
    //    $scope.status.isopen = !$scope.status.isopen;
    //};

}]);