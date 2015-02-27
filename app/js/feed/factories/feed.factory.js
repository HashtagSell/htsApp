/**
 * Created by braddavis on 12/15/14.
 */
htsApp.factory('feedFactory', ['$http', '$stateParams', '$location', '$q', 'Session', 'utilsFactory', function( $http, $stateParams, $location, $q, Session, utilsFactory) {

    var factory = {};

    factory.status = {
        pleaseWait: true,
        error: {}
    };

    factory.queryParams = {};

    factory.poll = function () {

        var deferred = $q.defer();

        var polling_api = '';

        var category_groups = '';

        var categories = '';

        for(i=0; i < Session.userObj.user_settings.feed_categories.length; i++){
            if((Session.userObj.user_settings.feed_categories[i].code == 'AAAA') ||
                (Session.userObj.user_settings.feed_categories[i].code == 'CCCC') ||
                (Session.userObj.user_settings.feed_categories[i].code == 'DISP') ||
                (Session.userObj.user_settings.feed_categories[i].code == 'SSSS') ||
                (Session.userObj.user_settings.feed_categories[i].code == 'JJJJ') ||
                (Session.userObj.user_settings.feed_categories[i].code == 'MMMM') ||
                (Session.userObj.user_settings.feed_categories[i].code == 'PPPP') ||
                (Session.userObj.user_settings.feed_categories[i].code == 'RRRR') ||
                (Session.userObj.user_settings.feed_categories[i].code == 'SVCS') ||
                (Session.userObj.user_settings.feed_categories[i].code == 'ZZZZ') ||
                (Session.userObj.user_settings.feed_categories[i].code == 'VVVV'))
            {
                category_groups += Session.userObj.user_settings.feed_categories[i].code + '|';
            } else {
                categories += Session.userObj.user_settings.feed_categories[i].code + '|';
            }
        }

        if(Session.userObj.user_settings.safe_search) {
            category_groups += '~PPPP|~MMMM';
        }


        polling_api = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/userfeed?category_group=" + category_groups + "&category=" + categories;


        if(factory.queryParams.anchor) {
            polling_api += "&anchor=" + factory.queryParams.anchor;
            polling_api += "&cityCode=" + factory.queryParams.cityCode;
        }

        $http({method: 'GET', url: polling_api}).
            then(function (response, status, headers, config) {

                console.log('polling response', response);

                if(!response.data.error) {

                    factory.queryParams.anchor = response.data.external.anchor;
                    factory.queryParams.cityCode = response.data.location.cityCode;

                    deferred.resolve(response);

                } else {

                    factory.status.pleaseWait = false;
                    factory.status.error.message = ":( Oops.. Something went wrong.";
                    factory.status.error.trace = response.data.error.response.error;


                    deferred.reject(response);
                }



            }, function (response, status, headers, config) {

                deferred.reject(response);
            });

        return deferred.promise;
    };





    factory.lookupCategories = function () {

        var deferred = $q.defer();

        //TODO: Lookup users selected categories we should poll for them

        var reference_api = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/search/categorylookup";

        $http({method: 'GET', url: reference_api}).
            then(function (response, status, headers, config) {

                console.log('reference api response', response);

                //factory.categories = response.data;

                deferred.resolve(response);

            }, function (response, status, headers, config) {

                deferred.reject(response);
            });

        return deferred.promise;
    };





    factory.resetFeedView = function () {

        factory.status.error = {};
    };



    return factory;
}]);