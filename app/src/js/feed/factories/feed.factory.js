/**
 * Created by braddavis on 12/15/14.
 */
htsApp.factory('feedFactory', ['$http', '$stateParams', '$location', '$q', '$rootScope', '$timeout', 'Session', 'utilsFactory', 'ENV', function( $http, $stateParams, $location, $q, $rootScope, $timeout, Session, utilsFactory, ENV) {

    var factory = {};

    factory.spinner = {
        show: true
    };


    factory.feed = {
        unfiltered: [],
        filtered: [],
        categories: null
    };

    factory.currentDate = {
        timestamp: Math.floor(Date.now() / 1000)
    };


    factory.defaultParams = {
        start: 0,
        count: 50,
        filters: {
            mandatory: {
                exact: {}
            },
            optional: {
                exact: {}
            }
        }
    };



    factory.latest = function (userLocationObject, sanitizedTree) {

        var deferred = $q.defer();

        factory.defaultParams.filters.mandatory.exact = {
            'external.threeTaps.location.state': 'USA-' + userLocationObject.freeGeoIp.region_code
        };

        factory.defaultParams.filters.optional.exact = {
            'categoryCode': 'SELE'
        };

        console.log('before braketizing url', factory.defaultParams);

        var bracketURL = utilsFactory.bracketNotationURL(factory.defaultParams);
        console.log('final URL', bracketURL);

        $http({
            method: 'GET',
            url: ENV.postingAPI + bracketURL
        }).then(function (response) {


            if(response.data.results.length) {

                for(var i = 0; i < response.data.results.length; i++) {
                    response.data.results[i] = setItemHeight(response.data.results[i]);
                }

                factory.feed.unfiltered = response.data.results;

                factory.filterFeed(sanitizedTree);

                deferred.resolve();
            } else {

                var err = {
                    message: 'Whoops.. We can\'t find any results in ' + userLocationObject.freeGeoIp.city,
                    error: response
                };

                deferred.reject(err);
            }

        }, function (error) {


            var err = {
                message: 'We seem to be having issues.  Hang tight we\'re working to resolve this.',
                error: error
            };

            deferred.reject(err);
        });

        return deferred.promise;

    };


    var setItemHeight = function (item) {

        if (item.images.length === 0) {
            item.feedItemHeight = 179;
        } else if (item.images.length === 1) {
            item.feedItemHeight = 261;
        } else {
            item.feedItemHeight = 420;
        }

        return item;
    };


    factory.updateFeed = function (emit) {

        emit.posting = setItemHeight(emit.posting);

        console.log(emit.posting);

        var tempUnfilteredArray = factory.feed.unfiltered;
        tempUnfilteredArray.unshift(emit.posting);

        factory.feed.unfiltered = tempUnfilteredArray.slice(0, 350);

        if(factory.mustMatchCategoryCode(emit.posting)){

            var scrollTopOffset = jQuery(".inner-container.feed").scrollTop();

            $rootScope.$apply(function() {

                factory.currentDate.timestamp = Math.floor(Date.now() / 1000);

                var tempFilteredArray = factory.feed.filtered;
                tempFilteredArray.unshift(emit.posting);

                factory.feed.filtered = tempFilteredArray.slice(0, 350);

            });

            jQuery(".inner-container.feed").scrollTop(scrollTopOffset + emit.posting.feedItemHeight);
        }

    };




    //simplest filters
    factory.mustMatchCategoryCode = function(element, index){

        var visibleStatus = factory.feed.categories.indexOf(element.categoryCode) > -1;

        console.log('Show ' + element.categoryCode + '? ' + visibleStatus);

        return visibleStatus;
    };



    factory.filterFeed = function (sanitizedTree) {

        factory.feed.categories = getVisibleCategories(sanitizedTree);

        var filteredResults = factory.feed.unfiltered.filter(factory.mustMatchCategoryCode);

        factory.generateFeed(filteredResults);

    };


    factory.generateFeed = function(filteredResults) {

        //$rootScope.$apply(function() {

            var temp = [];

            for(var i = 0; i < filteredResults.length; i++) {

                var feedItem = filteredResults[i];

                if (feedItem.images.length === 0) {
                    feedItem.feedItemHeight = 179;
                } else if (feedItem.images.length === 1) {
                    feedItem.feedItemHeight = 261;
                } else {
                    feedItem.feedItemHeight = 420;
                }

                temp.push(feedItem);
            }


            factory.feed.filtered = temp;

            $timeout(function(){
                $rootScope.$broadcast('vsRepeatTrigger');
            }, 10);
        //});
    };


    var getVisibleCategories = function (sanitizedTree) {

        var temp = [];

        for(var i = 0; i < sanitizedTree.length; i++) {
            var parentCategory = sanitizedTree[i];

            for(var j = 0; j < parentCategory.categories.length; j ++) {
                var childCategory = parentCategory.categories[j];

                if(childCategory.selected){
                    temp.push(childCategory.code);
                }
            }
        }

        return temp;
    };


    return factory;
}]);