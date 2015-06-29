htsApp.controller('results.controller', ['$scope', '$state', '$stateParams', 'searchFactory', 'splashFactory', 'uiGmapGoogleMapApi', 'uiGmapIsReady', function ($scope, $state, $stateParams, searchFactory, splashFactory, uiGmapGoogleMapApi, uiGmapIsReady) {

    //While true the hashtagspinner will appear
    $scope.status = searchFactory.status;

    //Tracks state of grid visible or not
    $scope.views = searchFactory.views;

    $scope.queryObj = $stateParams;


    //passes properties associated with clicked DOM element to splashFactory for detailed view
    $scope.openSplash = function(elems){
        splashFactory.result = elems.result;
        $state.go('results.splash', { id: elems.result.postingId });
    };


    //updateFeed is triggered on interval and performs polling call to server for more items
    var paginate = function (page) {

        searchFactory.paginate(page).then(function (response) {

            if (response.status !== 200) {

                searchFactory.status.pleaseWait = false;
                searchFactory.status.loading = false;
                searchFactory.status.error.message = ":( Oops.. Something went wrong.";
                searchFactory.status.error.trace = response.data.error;

            } else if (response.status === 200) {

                if(response.data.results.length) { //If we have results

                    if (!$scope.results) { //If there are not results on the page yet, this is our first query

                        searchFactory.filterArray($scope.views, 'pagination');

                        //Function passed into onVsIndexChange Directive
                        $scope.infiniteScroll = function (startIndex, endIndex) {
                            console.log('startIndex: ' + startIndex, 'endIndex: ' + endIndex, 'numRows: ' + $scope.results.gridRows.length);
                            if (!searchFactory.status.loading && endIndex >= $scope.results.gridRows.length - 3) {
                                console.log("paginating");
                                searchFactory.status.loadingMessage = "Fetching more awesome...";
                                searchFactory.status.loading = true;
                                page = page + 1;
                                paginate(page);
                            }
                        };

                    } else { //If there are already results on the page then add them to the bottom of the array and filter

                        searchFactory.filterArray($scope.views, 'pagination');

                    }

                    $scope.results = searchFactory.results;

                    searchFactory.status.pleaseWait = false;
                    searchFactory.status.loading = false;

                } else if (!response.data.results.length && page === 0) { //No results found on the first search

                    searchFactory.status.pleaseWait = false;
                    searchFactory.status.loading = false;
                    searchFactory.status.error.message = "¯\\_(ツ)_/¯  Nothing found.  Keep your searches simple.";

                } else if (!response.data.results.length && page > 0) { //No results found after pagination

                    searchFactory.status.pleaseWait = false;
                    searchFactory.status.loadingMessage = "No more results.  Sell your next item with us to increase our inventory.";

                }

            }
        }, function (response) {

            searchFactory.status.pleaseWait = false;
            searchFactory.status.loading = false;
            searchFactory.status.error.message = "(゜_゜) Oops.. Something went wrong.";
            searchFactory.status.error.trace = response.data.error;

        });
    };
    paginate(0);


    uiGmapGoogleMapApi.then(function(maps) {
        $scope.map = searchFactory.map;
    });

}]);







htsApp.directive('onVsIndexChange', ['$parse', function ($parse) {
    return function ($scope, $element, $attrs) {
        var expr = $parse($attrs.onVsIndexChange);
        var fn = function () {
            expr($scope);
        };
        $scope.$watch('startIndex', fn);
        $scope.$watch('endIndex', fn);
    };
}]);








htsApp.directive('resizeGrid', ['$rootScope', '$window', 'searchFactory', function ($rootScope, $window, searchFactory) {
    return {
        restrict: 'A',
        link: function postLink($scope, element) {

            searchFactory.getInnerContainerDimensions = function () {
                return {
                    w: element.width(),
                    h: element.height()
                };
            };

            angular.element($window).bind('resize', function () {

                if($scope.views.gridView) {
                    searchFactory.filterArray($scope.views, 'resize');
                }

                $scope.$apply();
            });
        }
    };
}]);