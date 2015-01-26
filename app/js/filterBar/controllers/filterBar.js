htsApp.controller('filterBar', ['$scope', '$rootScope', 'searchFactory', '$timeout', function ($scope, $rootScope, searchFactory, $timeout) {

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

        searchFactory.filterArray($scope.views, 'filter');

    });


    //View
    $scope.views = searchFactory.views;

    $scope.$watchGroup(['views.gridView', 'views.showMap'], function () {
        $timeout(function () {
            searchFactory.filterArray($scope.views, 'resize');
        }, 1);
    });





    $scope.rangeSlider = searchFactory.priceSlider;
    console.log($scope.rangeSlider);

    $scope.slideDelegate = function (value) {
        console.log(value);
        searchFactory.priceSlider.userSetValue = true;
        console.log(searchFactory.priceSlider);

        searchFactory.filterArray($scope.views, 'filter');
        //searchFactory.priceSlider.rangeValue = value;
    };


    //Adds $ before the price slider values
    $scope.myFormatter = function(value) {
        return "$"+value;
    };



}]);