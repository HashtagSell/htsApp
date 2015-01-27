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

        if (factory.queryParams.anchor) {
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




    factory.map = {
        zoom: 8,
        markers: [],
        clusterOptions: {
            gridSize: 35,
            maxZoom: 17,
            zoomOnClick: true,
            averageCenter: false,
            minimumClusterSize: 1,
            styles: [
                {
                    textColor: 'white',
                    fontFamily: 'Open Sans, Helvetica, Arial, sans-serif',
                    url: '/images/map/cluster1.png',
                    height: 35,
                    width: 35
                },
                {
                    textColor: 'white',
                    fontFamily: 'Open Sans, Helvetica, Arial, sans-serif',
                    url: '/images/map/cluster2.png',
                    height: 35,
                    width: 35
                },
                {
                    textColor: 'white',
                    fontFamily: 'Open Sans, Helvetica, Arial, sans-serif',
                    url: '/images/map/cluster2.png',
                    height: 35,
                    width: 35
                }
            ]
        }
    };

    factory.cachedColumnCalculation = null;



    //Evaluates the width of the browser and builds array with array of rows.
    factory.generateRows = function (results, reason, views) {

        //Gets dimensions of innerContainer


        //Should match the CSS width of grid-item
        //console.log(dimensions);


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

        //console.log(results);
        var numColumns;

        //If user has gridView enabled calculate columns, else build list view.
        if (views.gridView) {
            var dimensions = factory.getInnerContainerDimensions();
            var itemWidth = 259;
            numColumns = Math.floor(dimensions.w / itemWidth);
            console.log("Calculated " + numColumns + " columns.");
        } else {
            numColumns = 1;
            console.log("List View: " + numColumns + " columns!");
        }


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

        if (numColumns !== factory.cachedColumnCalculation || reason === 'filter' || reason === 'pagination') {

            factory.cachedColumnCalculation = numColumns;

            //TODO: Don't clear all items just clear necessary ones??
            factory.results.gridRows = [];
            factory.map.markers = [];

            //factory.map.bounds = {
            //    southwest: {
            //        latitude: results[results.length - 1].location.lat,
            //        longitude: results[results.length - 1].location.long
            //    }, northeast: {
            //        latitude: results[0].location.lat,
            //        longitude: results[0].location.long
            //    }
            //};

            factory.map.center = {
                latitude: 0,
                longitude: 0
            };

            //Calculate the number of results with images and add up scroll height. This is used for virtual scrolling
            for (var i = 0; i < results.length; i++) {

                var marker = {
                    id: results[i].external_id,
                    latitude: results[i].location.lat,
                    longitude: results[i].location.long,
                    title: results[i].heading
                };

                factory.map.markers.push(marker);

                var rowHeight;

                //If gridview is turned on they height is always 350
                if (views.gridView) {
                    rowHeight = 350;
                } else { //else the user is in list view.  Height depends on whether result contains 2 or more images.
                    if (results[i].images.length === 0 || results[i].images.length === 1) {
                        rowHeight = 300;
                    } else {
                        rowHeight = 485;
                    }
                }


                if (i % numColumns === 0) {
                    var row = {
                        rowHeight: rowHeight,
                        rowContents: []
                    };

                    for (var j = 0; j < numColumns; j++) {

                        if (i + j < results.length) {
                            //console.log(i + j);
                            //console.log(results[i + j]);

                            if (results[i + j].price) {
                                factory.updatePriceSlider(results[i + j].price);
                            }


                            row.rowContents.push(results[i + j]);
                        }
                    }

                    factory.results.gridRows.push(row);

                    i = i + j - 1;
                    console.log('Finshed row! New index is: ' + i);
                }
            }

            var maxPrice = factory.priceSlider.max;

            if (maxPrice < 100) {
                factory.priceSlider.step = 1;
            } else if (maxPrice > 100 && maxPrice < 500) {
                factory.priceSlider.step = 5;
            } else if (maxPrice > 500 && maxPrice < 2000) {
                factory.priceSlider.step = 10;
            } else if (maxPrice > 2000 && maxPrice < 10000) {
                factory.priceSlider.step = 50;
            } else if (maxPrice > 10000) {
                factory.priceSlider.step = 50;
            }


            console.log(factory.results.gridRows);
            console.log(factory.markers);

        } else {
            console.log('column calculation did not change');
        }

    };







    factory.updatePriceSlider = function (itemPrice) {
        //console.log(factory.priceSlider);
        if (itemPrice > factory.priceSlider.max) {

            factory.priceSlider.max = itemPrice;

            if (!factory.priceSlider.userSetValue) {
                factory.priceSlider.rangeValue[1] = itemPrice;
            }
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

    factory.priceSlider = {
        min: 0,
        max: 0,
        step: 1,
        rangeValue : [0,0],
        userSetValue: false
    };

    factory.views = {
        gridView: true,
        showMap: false
    };





    //simplest filters
    factory.mustHaveImage = function(element){
        return element.images.length;
    };


    factory.mustHavePrice = function(element){
        return element.price;
    };

    //Does not filter out free items!!!
    factory.mustFitPriceRange = function(element){
        return !element.price || element.price >= factory.priceSlider.rangeValue[0] && element.price <= factory.priceSlider.rangeValue[1];
    };

    //Image filter possibilities
    factory.mustHaveImageAndPrice = function(element){
        return element.images.length && element.price;
    };


    factory.mustHaveImageAndMustFitPriceRange = function(element){
        return element.images.length && element.price >= factory.priceSlider.rangeValue[0] && element.price <= factory.priceSlider.rangeValue[1];
    };


    //Price filter possibilites
    factory.mustHavePriceAndMustFitPriceRange = function(element){
        return element.price && element.price >= factory.priceSlider.rangeValue[0] && element.price <= factory.priceSlider.rangeValue[1];
    };


    //All filters combined
    factory.mustHavePriceAndMustHaveImageAndMustFitPriceRange = function(element){
        console.log('toggles %o', this);
        return element.images.length && element.price && element.price >= factory.priceSlider.rangeValue[0] && element.price <= factory.priceSlider.rangeValue[1];
    };



    factory.filterArray = function (views, reason) {
        console.log(factory.filter);
        console.log('filterArray view view type: ', views);
        console.log('filterArray view reason: ', reason);

        var filterToggles = factory.filter;
        var priceSliderRange = factory.priceSlider;

        var filteredResults;

        if(factory.results.unfiltered.length) {
            //Must have price and must have image and must fit price range
            if (filterToggles.mustHavePrice && filterToggles.mustHaveImage && priceSliderRange.userSetValue) {
                filteredResults = factory.results.unfiltered.filter(factory.mustHavePriceAndMustHaveImageAndMustFitPriceRange);
                factory.generateRows(filteredResults, reason, views);

                //Must have image and price RANGE
            } else if (filterToggles.mustHaveImage && priceSliderRange.userSetValue) {
                filteredResults = factory.results.unfiltered.filter(factory.mustHaveImageAndMustFitPriceRange);
                factory.generateRows(filteredResults, reason, views);

                //Must have price and must fit price range
            } else if (filterToggles.mustHavePrice && priceSliderRange.userSetValue) {
                filteredResults = factory.results.unfiltered.filter(factory.mustHavePriceAndMustFitPriceRange);
                factory.generateRows(filteredResults, reason, views);

                //Must Have Image and Must have Price
            } else if (filterToggles.mustHaveImage && filterToggles.mustHavePrice) {
                filteredResults = factory.results.unfiltered.filter(factory.mustHaveImageAndPrice);
                factory.generateRows(filteredResults, reason, views);

                //Must have image
            } else if (filterToggles.mustHaveImage) {
                filteredResults = factory.results.unfiltered.filter(factory.mustHaveImage);
                factory.generateRows(filteredResults, reason, views);

                //Must have price
            } else if (filterToggles.mustHavePrice) {
                filteredResults = factory.results.unfiltered.filter(factory.mustHavePrice);
                factory.generateRows(filteredResults, reason, views);

                //Must fit in price RANGE
            } else if (priceSliderRange.userSetValue) {
                filteredResults = factory.results.unfiltered.filter(factory.mustFitPriceRange);
                factory.generateRows(filteredResults, reason, views);

                //All filters turned off, just generate rows
            } else {
                factory.generateRows(factory.results.unfiltered, reason, views);
            }
        }

    };



    factory.resetResultsView = function () {
        factory.results.gridRows = [];
        factory.results.unfiltered = [];

        factory.priceSlider.min = 0;
        factory.priceSlider.max = 0;
        factory.priceSlider.step = 1;
        factory.priceSlider.rangeValue = [0,0];
        factory.priceSlider.userSetValue = false;

        factory.filter.mustHaveImage = false;
        factory.filter.mustHavePrice = false;

        factory.views.gridView = true;
        factory.views.showMap = false;

        factory.queryParams = {};
    };



    return factory;
}]);