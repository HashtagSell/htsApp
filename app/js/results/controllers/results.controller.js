htsApp.controller('results.controller', ['$scope', '$sce', '$state', '$timeout', 'searchFactory', 'splashFactory', function($scope, $sce, $state, $timeout, searchFactory, splashFactory){

    $scope.priceFiltered = false;
    $scope.imageFiltered = false;


    $scope.togglePriceFilter = function () {
        $scope.priceFiltered = !$scope.priceFiltered;
    };

    $scope.toggleImageFilter = function () {
        $scope.imageFiltered = !$scope.imageFiltered;
    };

    $scope.test = function () {
        return 'blah';
    };


    $scope.imgLoadedEvents = {

        always: function(instance) {

        },

        done: function(instance) {
            $scope.$emit('iso-method', {name:'reLayout', params:null});

            //TODO: don't relayout all items on page.  Only do each item. https://github.com/mankindsoftware/angular-isotope/issues/27
            //$scope.$emit('iso-method', {name:'layout', params:instance.elements[0]});

        },

        fail: function(instance) {
            console.log("Img didn't load?");
        }

    };

    //passes properties associated with clicked DOM element to splashFactory for detailed view
    $scope.openSplash = function(elems){
        splashFactory.result = elems.result;
        console.log(splashFactory.result);
        $state.go('results.splash', { id: elems.result.external_id });
    };

    $scope.rangeSlider = {
        min: 0,
        max: 100,
        step: 1,
        rangeValue : [2,20]
    };

    //Unbind and destroy isotope if user is leaving results or results splash page.  Speeds up route change by 10000%
    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if(toState.name !== 'results' && toState.name !== 'results.splash') {
            $scope.$emit('iso-method', {name: 'destroy'});
        }
    });


    //Adds $ before the price slider values
    $scope.myFormater = function(value) {
        return "$"+value;
    };

    //Tracks state of map visible or not
    $scope.showMap = 0;

    $scope.reLayout = function(){
        $timeout(function(){
            $scope.$emit('iso-method', {name:'reLayout', params:null});
        }, 1);

    };

    //Tracks state of grid visible or not
    $scope.gridView = true;

    //Tracks state of page if items are currently being loaded into view
    $scope.loading = false;

    $scope.results = [];

    $scope.count = 0;

    $scope.paginate = function(){

        console.log($scope.count++);

        if ($scope.loading) return;

        $scope.loading = true;

        searchFactory.query().then(function (response) {

            if(response.status !== 200) {

                $scope.results = response.data.error;

            } else if(response.status == 200) {

                $scope.results = $scope.results.concat(response.data.merged.postings);

                if(response.data.merged.next_page === 0){ //If next_page equal to zero then we have no more results to display

                    //TODO: Use modal service to notify users
                    alert("no more results...modal service soon");

                    $scope.noMoreResults = true;

                }

            }

            $timeout(function(){
                if(!$scope.noMoreResults) {
                    $scope.loading = false;
                }
            }, 1000);


        }, function () {

            console.log(response);

            //TODO: Use modal service to notify users
            alert("search error");

        });

    };

    $scope.initQuery = function() {
        searchFactory.queryParams = {}; //Clear params from previous search if any
        $scope.paginate();
    };
    $scope.initQuery(); //Kick off first query

}]);