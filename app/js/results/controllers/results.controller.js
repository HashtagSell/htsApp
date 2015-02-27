htsApp.controller('results.controller', ['$scope', '$state', 'searchFactory', 'splashFactory', 'uiGmapGoogleMapApi', 'uiGmapIsReady', function ($scope, $state, searchFactory, splashFactory, uiGmapGoogleMapApi, uiGmapIsReady) {

    //While true the hashtagspinner will appear
    $scope.status = searchFactory.status;

    //Tracks state of grid visible or not
    $scope.views = searchFactory.views;


    $scope.slickConfig = {
        dots: true,
        lazyLoad: 'progressive',
        infinite: true,
        speed: 100,
        slidesToScroll: 1,
        variableWidth: true,
        centerMode: true
    };


    //passes properties associated with clicked DOM element to splashFactory for detailed view
    $scope.openSplash = function(elems){
        splashFactory.result = elems.result;
        $state.go('results.splash', { id: elems.result.postingId });
    };


    //updateFeed is triggered on interval and performs polling call to server for more items
    var paginate = function () {

        searchFactory.query().then(function (response) {

            if (response.status !== 200) {

                $scope.status.pleaseWait = false;
                $scope.status.error.message = ":( Oops.. Something went wrong.";
                $scope.status.error.trace = response.data.error;

            } else if (response.status === 200) {

                if (!$scope.results) { //If there are not results on the page yet, this is our first query

                    searchFactory.filterArray($scope.views, 'pagination');

                    //Function passed into onVsIndexChange Directive
                    $scope.infiniteScroll = function (startIndex, endIndex) {
                        console.log('startIndex: ' + startIndex, 'endIndex: ' + endIndex, 'numRows: ' + $scope.results.gridRows.length);
                        if (!searchFactory.status.loading && endIndex >= $scope.results.gridRows.length - 3) {
                            console.log("paginating");
                            searchFactory.status.loading  = true;
                            paginate();
                        }
                    };

                } else { //If there are already results on the page the add them to the top of the array

                    searchFactory.filterArray($scope.views, 'pagination');

                }

                $scope.results = searchFactory.results;

                searchFactory.status.pleaseWait = false;

                searchFactory.status.loading = false;

            }
        }, function (response) {

            searchFactory.status.pleaseWait = false;
            searchFactory.status.error.message = "(゜_゜) Oops.. Something went wrong.";
            searchFactory.status.error.trace = response;

        });
    };
    paginate();


    uiGmapGoogleMapApi.then(function(maps) {
        $scope.map = searchFactory.map;
    });


    //Clears view if user conducts a second search.
    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if(toState.name !== 'results.splash' && toParams.q !== fromParams.q) {
            searchFactory.resetResultsView();
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

                if($scope.views.gridView) {
                    searchFactory.filterArray($scope.views, 'resize');
                }

                $scope.$apply();
            });
        }
    };
}]);