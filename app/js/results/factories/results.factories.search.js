/**
 * Created by braddavis on 12/14/14.
 */
htsApp.factory('searchFactory', ['$http', '$stateParams', '$location', '$q', '$log', function ($http, $stateParams, $location, $q, $log) {

    var factory = {};

    factory.results = {
        gridRows: [],
        unfiltered: []
    };

    factory.queryParams = {};

    factory.query = function () {

        var deferred = $q.defer();

        var search_api = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/search?q=" + $stateParams.q;

        //TODO: Check if next_page param equal to 0.  this indicates no more results.

        if(factory.queryParams.anchor) {
            search_api += "&anchor=" + factory.queryParams.anchor + "&next_page=" + factory.queryParams.next_page + "&next_tier=" + factory.queryParams.next_tier;
        }

        $log.info(search_api);

        $http({method: 'GET', url: search_api}).
            then(function (response, status, headers, config) {

                //console.log(response);

                factory.queryParams.anchor = response.data.merged.anchor;
                factory.queryParams.next_page = response.data.merged.next_page;
                factory.queryParams.next_tier = response.data.merged.next_tier;
                factory.results.unfiltered = factory.results.unfiltered.concat(response.data.external.postings);
                deferred.resolve(response);

            },
            function (response, status, headers, config) {

                deferred.reject(response);
            });

        return deferred.promise;
    };



    factory.getInnerContainerDimensions = function () {
        return 'function re-defined via resizeGrid directive';
    };


    //Evaluates the width of the browser and builds array with array of rows.
    factory.generateRows = function (results, clearAll, callback) {

        if (clearAll) {
            factory.results.gridRows = [];
        }

        //Gets dimensions of innerContainer
        var dimensions = factory.getInnerContainerDimensions();

        //Should match the CSS width of grid-item
        console.log(dimensions);


        //var itemWidth;
        //
        //if (dimensions.w >= 1200) {
        //    itemWidth = 300;
        //} else if (dimensions.w < 1200 && dimensions.w >= 992) {
        //    itemWidth = 248;
        //} else if (dimensions.w < 992 && dimensions.w >= 768) {
        //    itemWidth = 420;
        //} else if (dimensions.w < 768 && dimensions.w >= 480) {
        //    itemWidth = 240;
        //} else if (dimensions.w < 480 && dimensions.w >= 320) {
        //    itemWidth = 320;
        //} else if (dimensions.w < 320) {
        //    itemWidth = 120;
        //}

        var itemWidth = 259;

        var numColumns = Math.floor(dimensions.w / itemWidth);
        console.log("Calculated " + numColumns + " columns.");

        //var rowHeight;
        //
        //if (numColumns >= 6) {
        //    rowHeight = 270;
        //} else if (numColumns === 5) {
        //    rowHeight = 400;
        //} else if (numColumns === 4) {
        //    rowHeight = 375;
        //} else if (numColumns === 3) {
        //    rowHeight = 500;
        //} else if (numColumns === 2) {
        //    rowHeight = 550;
        //} else if (numColumns === 1) {
        //    rowHeight = 600;
        //}

        var rowHeight = 350;

        //Calculate the number of results with images and add up scroll height. This is used for virtual scrolling
        for (var i = 0; i < results.length; i++) {

            if (i % numColumns === 0) {
                var row = {
                    rowHeight: rowHeight,
                    rowContents: []
                };

                for (var j = 0; j < numColumns; j++) {
                    row.rowContents.push(results[i + j]);
                }

                factory.results.gridRows.push(row);
            }

        }

        console.log(factory.results.gridRows);

        if(callback){
            callback();
        }
    };


    factory.filter = {
        mustHaveImage : false,
        mustHavePrice: false
    };

    factory.sort = {
        distance: true,
        price: false,
        datePosted: false
    };

    factory.views = {
        gridView: true
    };




    factory.mustHaveImage = function(element){
        return element.images.length;
    };

    factory.mustHavePrice = function(element){
        return element.price;
    };

    factory.mustHaveImageAndPrice = function(element){
        return element.images.length && element.price;
    };


    factory.filterArray = function () {
        console.log(factory.filter);

        var filterToggles = factory.filter;

        var filteredResults;

        if(filterToggles.mustHaveImage && filterToggles.mustHavePrice) {
            filteredResults = factory.results.unfiltered.filter(factory.mustHaveImageAndPrice);
            factory.generateRows(filteredResults, true);

        } else if (filterToggles.mustHaveImage) {
            filteredResults = factory.results.unfiltered.filter(factory.mustHaveImage);
            factory.generateRows(filteredResults, true);

        } else if (filterToggles.mustHavePrice) {
            filteredResults = factory.results.unfiltered.filter(factory.mustHavePrice);
            factory.generateRows(filteredResults, true);

        } else {

            factory.generateRows(factory.results.unfiltered, true);
        }

    };



    factory.clearView = function () {
        factory.results = {
            gridRows: [],
            unfiltered: []
        };

        factory.queryParams = {};
    };



    return factory;
}]);