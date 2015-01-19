htsApp.controller('filterBar', ['$scope', '$rootScope', 'searchFactory', function ($scope, $rootScope, searchFactory) {

    //Any time the user moves to a different page this function is called.
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name === 'results') {
            $scope.showFilterBar = true;
        } else {
            $scope.showFilterBar = false;
        }
    });

    //Filtering
    $scope.filterToggles = searchFactory.filter;

    $scope.$watchGroup(['filterToggles.mustHaveImage', 'filterToggles.mustHavePrice'], function (newValues, oldValues, scope) {
        //searchFactory.imageFilter(value);

        console.log($scope.filterToggles);

        searchFactory.filterArray();

    });


    $scope.rangeSlider = {
        min: 0,
        max: 100,
        step: 1,
        rangeValue : [2,20]
    };

    $scope.slideDelegate = function (value) {
        console.log(value);
    };

    //Adds $ before the price slider values
    $scope.myFormater = function(value) {
        return "$"+value;
    };

    //View
    $scope.view = searchFactory.view;

    //Tracks state of map visible or not
    $scope.showMap = 0;
}]);