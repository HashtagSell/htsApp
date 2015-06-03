htsApp.controller('filterBar', ['$scope', '$rootScope', 'searchFactory', '$timeout', 'sideNavFactory', function ($scope, $rootScope, searchFactory, $timeout, sideNavFactory) {

    //Any time the user moves to a different page this function is called.
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name === 'results' || toState.name === 'results.splash') {
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

        if($rootScope.currentState === "results") {

            $timeout(function () {
                searchFactory.filterArray($scope.views, 'resize');


                if ($scope.views.gridView) { //If grid view enabled don't show css gutters
                    sideNavFactory.sideNav.listView = false;
                } else if (!$scope.views.gridView && $scope.views.showMap) {  //If list view is enabled BUT map is visible don't show css gutters
                    sideNavFactory.sideNav.listView = false;
                } else if (!$scope.views.gridView && !$scope.views.showMap) {  //If list view is enabled AND map is NOT visible then show the css gutters
                    sideNavFactory.sideNav.listView = true;
                }


            }, 1);

        }
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