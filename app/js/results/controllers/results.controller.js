htsApp.controller('results.controller', ['$scope', '$timeout', 'searchFactory', '$location', '$state', 'splash.factory', function($scope, $timeout, searchFactory, $location, $state, splashFactory){

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


    $scope.openSplash = function(elems) {

        console.log('all elems copied into splash.factory');
        splashFactory.annotations = elems.result.annotations;
        splashFactory.body = elems.result.body;
        splashFactory.category = elems.result.category;
        splashFactory.category_group = elems.result.category_group;
        splashFactory.distanceFromUser = elems.result.distanceFromUser;
        splashFactory.external_id = elems.result.external_id;
        splashFactory.external_url = elems.result.external_url;
        splashFactory.heading = elems.result.heading;
        splashFactory.images = elems.result.images;
        splashFactory.location = elems.result.location;
        splashFactory.price = elems.result.price;
        splashFactory.source = elems.result.source;

        $state.go('results.splash');
    };

    $scope.rangeSlider = {
        min: 0,
        max: 100,
        step: 1,
        rangeValue : [2,20]
    };

    $scope.myFormater = function(value) {
        return "$"+value;
    };

    $scope.showMap = 0;

    $scope.reLayout = function(){
        $timeout(function(){
            $scope.$emit('iso-method', {name:'reLayout', params:null});
        }, 1);

    };

    $scope.gridView = true;

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

            }

            $timeout(function(){
                $scope.loading = false;
            }, 1000);


        }, function () {

            alert("search error");

        });

    };

    $scope.initQuery = function() {
        searchFactory.queryParams = {}; //Clear params from previous search if any
        $scope.paginate();
    };
    $scope.initQuery(); //Kick off first query

}]);


htsApp.factory('searchFactory', ['$http', '$stateParams', '$location', '$q', '$log', function($http, $stateParams, $location, $q, $log){

    var factory = {};

    factory.query = function(){

        var deferred = $q.defer();

        var search_api = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/search?q=" + $stateParams.q;

        if(factory.queryParams.anchor) {
            search_api += "&anchor=" + factory.queryParams.anchor + "&next_page=" + factory.queryParams.next_page + "&next_tier=" + factory.queryParams.next_tier;
        }

        $log.info(search_api);

        $http({method: 'GET', url: search_api}).
            then(function (response, status, headers, config) {

                console.log(response);
                factory.queryParams.anchor = response.data.merged.anchor;
                factory.queryParams.next_page = response.data.merged.next_page;
                factory.queryParams.next_tier = response.data.merged.next_tier;

                deferred.resolve(response);
            },
            function (response, status, headers, config) {


                deferred.reject(response);
            });

        return deferred.promise;
    };

    return factory;
}]);