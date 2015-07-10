/**
 * Created by braddavis on 12/15/14.
 */
htsApp.factory('feedFactory', ['$http', '$stateParams', '$location', '$q', '$rootScope', 'Session', 'utilsFactory', 'ENV', function( $http, $stateParams, $location, $q, $rootScope, Session, utilsFactory, ENV) {

    var factory = {};

    factory.spinner = {
        show: true
    };


    factory.feed = {
        items: []
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
            }
        }
    };



    factory.latest = function (userLocationObject) {

        var deferred = $q.defer();

        //factory.defaultParams.filters.mandatory.exact['external.threeTaps.location.city'] = userLocationObject.cityCode.code;

        factory.defaultParams.filters.mandatory.exact = {
            'external.threeTaps.location.state': 'USA-' + userLocationObject.freeGeoIp.region_code
        };

        //factory.defaultParams.filters.mandatory.exact.categoryCode = _.pluck(Session.userObj.user_settings.feed_categories,'code').join(",");

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

                factory.feed.items = response.data.results;

                deferred.resolve(factory.feed.items);
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

        var scrollTopOffset = jQuery(".inner-container").scrollTop();

        $rootScope.$apply(function() {

            factory.currentDate.timestamp = Math.floor(Date.now() / 1000);

            var tempArray = factory.feed.items;
            tempArray.unshift(emit.posting);

            factory.feed.items = tempArray.slice(0, 100);
        });

        jQuery(".inner-container").scrollTop(scrollTopOffset + emit.posting.feedItemHeight);

    };


    return factory;
}]);