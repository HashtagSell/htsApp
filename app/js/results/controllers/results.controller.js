htsApp.controller('results.controller', ['$scope', '$state', 'searchFactory', 'splashFactory', function($scope, $state, searchFactory, splashFactory) {

    //While true the hashtagspinner will appear
    $scope.pleaseWait = true;

    //Tracks state of grid visible or not
    $scope.view = searchFactory.views;

    //passes properties associated with clicked DOM element to splashFactory for detailed view
    $scope.openSplash = function(elems){
        splashFactory.result = elems.result;
        console.log(splashFactory.result);
        $state.go('results.splash', { id: elems.result.external_id });
    };




    //updateFeed is triggered on interval and performs polling call to server for more items
    var paginate = function () {

        searchFactory.query().then(function (response) {

            if (response.status !== 200) {

                $scope.results = response.data.error;

            } else if (response.status === 200) {

                if (!$scope.results) { //If there are not results on the page yet, this is our first query

                    //searchFactory.generateRows(response.data.external.postings, false);

                    searchFactory.filterArray();

                    //Function passed into onVsIndexChange Directive
                    $scope.infiniteScroll = function (startIndex, endIndex) {
                        console.log('startIndex: ' + startIndex, 'endIndex: ' + endIndex, 'numRows: ' + $scope.results.gridRows.length);
                        if (!$scope.loadingMoreResults && endIndex >= $scope.results.gridRows.length - 3) {
                            console.log("paginating");
                            $scope.loadingMoreResults = true;
                            paginate();
                        }
                    };

                } else { //If there are already results on the page the add them to the top of the array

                    //searchFactory.generateRows(response.data.external.postings, false);

                    searchFactory.filterArray();

                }

                $scope.results = searchFactory.results;

                $scope.pleaseWait = false;

                $scope.loadingMoreResults = false;

            }
        }, function (response) {

            console.log(response);

            //TODO: Use modal service to notify users
            //alert("search error");

        });
    };

    paginate();





    //Clears view is user conducts a second search.
    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if(toState.name !== 'results.splash' && toParams.q !== fromParams.q) {
            searchFactory.clearView();
        }
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
                //searchFactory.generateRows(searchFactory.results.unfiltered, true);

                searchFactory.filterArray();

                //var containerWidth = element.width();
                ////Should match the CSS width of grid-item
                //var itemWidth = 280;
                //var allColumns = Math.floor(containerWidth / itemWidth) * 280;
                //var padding = (containerWidth - allColumns) / 2;
                //
                //element.css(
                //    {
                //        padding: '0px 0px 0px ' + padding + 'px'
                //    }
                //);
                $scope.$apply();
            });
        }
    };
}]);