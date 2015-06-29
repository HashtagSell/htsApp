/**
 * Created by braddavis on 12/14/14.
 */
htsApp.factory('searchFactory', ['$http', '$stateParams', '$location', '$q', '$log', '$timeout', 'utilsFactory', 'ENV', function ($http, $stateParams, $location, $q, $log, $timeout, utilsFactory, ENV) {

    var factory = {};

    factory.results = {
        gridRows: [],
        unfiltered: []
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

    factory.status = {
        pleaseWait: true,
        error: {}
    };


    factory.getInnerContainerDimensions = function () {
        return 'function re-defined via resizeGrid directive';
    };


    factory.paginate = function (page) {

        var deferred = $q.defer();

        if (page === 0) {
            factory.getPopularCategories().then(function (response) {

                if(response.status === 200) {

                    if (response.data.length) {

                        var winningCategories = [];
                        var total = 0;

                        for (var i = 0; i < response.data.length; i++) {

                            var firstCategory = response.data[i];

                            total = total + firstCategory.count;

                        }

                        var avg = (total / response.data.length);

                        //console.log('total: ', total, ' divided by number of categories: ', response.data.length, ' equals: ', avg);

                        for (var j = 0; j < response.data.length; j++) {

                            var secondCategory = response.data[j];

                            //console.log('total number of items: ', total);
                            //console.log('number of items in category: ', secondCategory.code, ' is: ', secondCategory.count);
                            var percentage = (secondCategory.count/total) * 100;
                            //console.log('Percentage weight for category: ', secondCategory.code, ' is: ', percentage);


                            if (percentage >= 10) {
                                winningCategories.push(secondCategory.code);
                            }

                        }

                        if (winningCategories.length > 1) {
                            factory.defaultParams.filters.optional = {
                                exact: {
                                    categoryCode: winningCategories.join(",")
                                }
                            };
                        } else if (winningCategories.length === 1) {
                            factory.defaultParams.filters.optional = {
                                exact: {
                                    categoryCode: [winningCategories[0], '']
                                }
                            };
                        } else if (!winningCategories.length && response.data.length){
                            factory.defaultParams.filters.optional = {
                                exact: {
                                    categoryCode: [response.data[0].code, '']
                                }
                            };
                        }
                    }
                }

            }).then(function () {

                console.log('state params are: ', $stateParams);

                factory.defaultParams.filters.mandatory.contains.heading = $stateParams.q;

                if($stateParams.locationObj) {
                    if ($stateParams.locationObj.geometry) {

                        factory.defaultParams.geo.lookup = false;

                        var lat = $stateParams.locationObj.geometry.location.lat();
                        var lon = $stateParams.locationObj.geometry.location.lng();

                        factory.defaultParams.geo.coords = [lon, lat];
                    }
                }

                if($stateParams.price){
                    if($stateParams.price.min){
                        factory.priceSlider.userSetValue = true;
                        factory.priceSlider.rangeValue[0] = parseInt($stateParams.price.min);
                    }

                    if($stateParams.price.max){
                        factory.priceSlider.userSetValue = true;
                        factory.priceSlider.rangeValue[1] = parseInt($stateParams.price.max);
                    }
                    console.log('manually set pricesliders', factory.priceSlider);
                }

                factory.query(page).then(function (response) {

                    deferred.resolve(response);

                });
            });
        } else {

            factory.query(page).then(function (response) {

                deferred.resolve(response);

            });
        }

        return deferred.promise;
    };



    factory.getPopularCategories = function () {

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: ENV.groupingsAPI + 'popular',
            params: {'query' : $stateParams.q}
        }).then(function (response) {

            //console.log('weighted categories: ', response);

            deferred.resolve(response);

        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;

    };



    factory.query = function (page) {

        var deferred = $q.defer();

        console.log('before braketizing url', factory.defaultParams);

        var bracketURL = utilsFactory.bracketNotationURL(factory.defaultParams);
        console.log('final URL', bracketURL);

        $http({
            method: 'GET',
            url: ENV.postingAPI + bracketURL
        }).then(function (response) {

            //console.log('search results: ', response);

            if(response.data.results.length) {

                factory.defaultParams = {
                    start: (page + 1) * response.data.options.count,
                    count: response.data.options.count,
                    filters: response.data.options.filters,
                    geo: {
                        coords: response.data.options.geo.coords,
                        //min: response.data.results[response.data.results.length - 1].geo.distance,
                        min: response.data.options.geo.min,
                        max: response.data.options.geo.max
                    },
                    sort: {}
                };

                factory.results.unfiltered = factory.results.unfiltered.concat(response.data.results);
            }

            deferred.resolve(response);

        }, function (err) {
            deferred.reject(err);
        });



        return deferred.promise;

    };


    factory.defaultParams = {
        start: 0,
        count: 35,
        filters: {
            mandatory: {
                contains: {
                    heading: null
                }
            }
        },
        geo: {
            lookup: true,
            min: 0,
            max: 50000000 // 8000 miles in meters
        }
    };




    factory.map = {
        bounds: {},
        center: {
            latitude: 0,
            longitude: 0
        },
        zoom: 8,
        markers: [],
        options : {
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.RIGHT_TOP
            },
            panControl: false,
            mapTypeControl: false,
            maxZoom: 22,
            minZoom: 0,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
            }
        },
        clusterOptions: {
            gridSize: 35,
            maxZoom: 22,
            minZoom: 0,
            zoomOnClick: true,
            averageCenter: true,
            minimumClusterSize: 1,
            styles: [
                {
                    textColor: 'white',
                    fontFamily: 'Open Sans, Helvetica, Arial, sans-serif',
                    url: 'https://static.hashtagsell.com/htsApp/map-elements/cluster1.png',
                    height: 35,
                    width: 35
                },
                {
                    textColor: 'white',
                    fontFamily: 'Open Sans, Helvetica, Arial, sans-serif',
                    url: 'https://static.hashtagsell.com/htsApp/map-elements/cluster2.png',
                    height: 35,
                    width: 35
                },
                {
                    textColor: 'white',
                    fontFamily: 'Open Sans, Helvetica, Arial, sans-serif',
                    url: 'https://static.hashtagsell.com/htsApp/map-elements/cluster2.png',
                    height: 35,
                    width: 35
                }
            ]
        },
        refresh : false
    };

    factory.cachedColumnCalculation = null;



    //Evaluates the width of the browser and builds array with array of rows.
    factory.generateRows = function (results, reason, views) {

        //console.log('generate rows', results, reason, views);

        var numColumns;

        //If user has gridView enabled calculate columns, else build list view.
        if (views.gridView) {
            var dimensions = factory.getInnerContainerDimensions();
            var itemWidth = 290;
            //console.log('width: ' + dimensions.w + '/' + itemWidth + ' equals...');
            numColumns = Math.floor(dimensions.w / itemWidth);
            factory.results.gridPercentageWidth = 100 / numColumns;
            //console.log("Calculated " + numColumns + " columns at " + factory.results.gridPercentageWidth + "% width.");
        } else {
            numColumns = 1;
            //console.log("List View: " + numColumns + " columns!");
        }



        if (numColumns !== factory.cachedColumnCalculation || reason === 'filter' || reason === 'pagination') {

            factory.cachedColumnCalculation = numColumns;

            //TODO: Don't clear all items just clear necessary ones??
            factory.results.gridRows = [];

            //Calculate the number of results with images and add up scroll height. This is used for virtual scrolling
            for (var i = 0; i < results.length; i++) {

                var rowHeight;

                //If gridview is turned on they height is always 350
                if (views.gridView) {
                    rowHeight = 390;
                } else { //else the user is in list view.  Height depends on whether result contains 2 or more images.
                    if(results[i].images.length === 0) {
                        rowHeight = 179;
                    } else if (results[i].images.length === 1) {
                        rowHeight = 261;
                    } else {
                        rowHeight = 420;
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


                            //if (results[i + j].askingPrice.value) {
                            //    factory.updatePriceSlider(results[i + j].askingPrice.value);
                            //}


                            row.rowContents.push(results[i + j]);
                        }
                    }

                    factory.results.gridRows.push(row);

                    i = i + j - 1;
                    //console.log('Finshed row! New index is: ' + i);
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


            console.log('Grid Rows: ', factory.results.gridRows);

        }

    };







    factory.updatePriceSlider = function (itemPrice) {

        console.log(itemPrice);

        if (parseInt(itemPrice) > parseInt(factory.priceSlider.max)) {

            factory.priceSlider.max = parseInt(itemPrice);

            if (!factory.priceSlider.userSetValue) {
                factory.priceSlider.rangeValue[1] = parseInt(itemPrice);
            }
        }
    };




    factory.markerMaker = function (result, index, visibleStatus) {

        var marker = {
            id: result.postingId,
            coords: {
                latitude: result.geo.coordinates[1],
                longitude: result.geo.coordinates[0]
            },
            title: result.heading,
            options: {
                visible: visibleStatus
            }
        };


        if(factory.views.showMap) {
            if (factory.map.markers[index]) {
                factory.map.markers[index].options.visible = visibleStatus;
            } else {
                factory.map.markers[index] = marker;
            }
        }
    };






    //simplest filters
    factory.mustHaveImage = function(element, index){

        var visibleStatus = Boolean(element.images.length);

        factory.updatePriceSlider(element.askingPrice.value);

        factory.markerMaker(element, index, visibleStatus);

        return visibleStatus;
    };


    factory.mustHavePrice = function(element, index){

        var visibleStatus = Boolean(element.askingPrice.value);

        factory.updatePriceSlider(element.askingPrice.value);

        factory.markerMaker(element, index, visibleStatus);

        return visibleStatus;
    };

    //Does not filter out free items!!!
    factory.mustFitPriceRange = function(element, index){

        var visibleStatus = Boolean(!element.askingPrice.value || element.askingPrice.value >= factory.priceSlider.rangeValue[0] && element.askingPrice.value <= factory.priceSlider.rangeValue[1]);

        factory.updatePriceSlider(element.askingPrice.value);

        factory.markerMaker(element, index, visibleStatus);

        return visibleStatus;
    };

    //Image filter possibilities
    factory.mustHaveImageAndPrice = function(element, index){

        var visibleStatus = Boolean(element.images.length && element.askingPrice.value);

        factory.updatePriceSlider(element.askingPrice.value);

        factory.markerMaker(element, index, visibleStatus);

        return visibleStatus;
    };


    factory.mustHaveImageAndMustFitPriceRange = function(element, index){

        var visibleStatus = Boolean(element.images.length && element.askingPrice.value >= factory.priceSlider.rangeValue[0] && element.askingPrice.value <= factory.priceSlider.rangeValue[1]);

        factory.updatePriceSlider(element.askingPrice.value);

        factory.markerMaker(element, index, visibleStatus);

        return visibleStatus;
    };


    //Price filter possibilites
    factory.mustHavePriceAndMustFitPriceRange = function(element, index){

        var visibleStatus = Boolean(element.askingPrice.value && element.askingPrice.value >= factory.priceSlider.rangeValue[0] && element.askingPrice.value <= factory.priceSlider.rangeValue[1]);

        factory.updatePriceSlider(element.askingPrice.value);

        factory.markerMaker(element, index, visibleStatus);

        return visibleStatus;
    };


    //All filters combined
    factory.mustHavePriceAndMustHaveImageAndMustFitPriceRange = function(element, index){

        var visibleStatus = Boolean(element.images.length && element.askingPrice.value && element.askingPrice.value >= factory.priceSlider.rangeValue[0] && element.askingPrice.value <= factory.priceSlider.rangeValue[1]);

        factory.updatePriceSlider(element.askingPrice.value);

        factory.markerMaker(element, index, visibleStatus);

        return visibleStatus;
    };



    factory.filterArray = function (views, reason) {
        //console.log('filterArray view view type: ', views, factory.filter);
        //console.log('filterArray view reason: ', reason);

        var filterToggles = factory.filter;
        var priceSliderRange = factory.priceSlider;

        var filteredResults;

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

            for (i = 0; i < factory.results.unfiltered.length; i++ ) {

                factory.updatePriceSlider(factory.results.unfiltered[i].askingPrice.value);

                factory.markerMaker(factory.results.unfiltered[i], i, true);
            }

            factory.generateRows(factory.results.unfiltered, reason, views);
        }

        //TODO: This is a hack because clustered markers are not properly binded in angular-google-maps.  see here: https://github.com/angular-ui/angular-google-maps/issues/813

        if(factory.views.showMap) {
            refreshMap();
        }
    };


    var refreshMap = function () {
        factory.map.refresh = true;
        $timeout(function () {
            factory.map.refresh = false;
        }, 100);
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

        factory.map.markers = [];

        factory.status.pleaseWait = true;
        factory.status.error = {};

        factory.defaultParams = {
            start: 0,
            count: 35,
            filters: {
                mandatory: {
                    contains: {
                        heading: null
                    }
                }
            },
            geo: {
                lookup: true,
                min: 0,
                max: 50000000
            }
        };
    };



    return factory;
}]);