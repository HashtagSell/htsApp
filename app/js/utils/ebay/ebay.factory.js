/**
 * Created by braddavis on 4/23/15.
 */
htsApp.factory('ebayFactory', ['$q', '$http', '$window', '$rootScope', '$timeout',  '$interval', 'ENV', 'Session', 'Notification', function ($q, $http, $window, $rootScope, $timeout, $interval, ENV, Session, Notification) {

    var factory = {};


    factory.publishToEbay = function (newPost) {

        var deferred = $q.defer();

        var ebay = Session.getSessionValue('ebay');

        var payload = {
            "ebay": true
        };

        if (newPost.facebook) {
            payload.facebook = newPost.facebook;
        }

        if (newPost.twitter) {
            payload.twitter = newPost.twitter;
        }

        if (newPost.amazon) {
            payload.amazon = newPost.amazon;
        }

        if (newPost.craigslist) {
            payload.craigslist = newPost.craigslist;
        }


        //We already have ebay token for user.. just push to ebay
        if(!factory.isEmpty(ebay)) {

            $http.post(ENV.postingAPI + newPost.postingId + '/publish', payload).
                success(function (response) {
                    deferred.resolve(response);
                }).
                error(function (response) {

                    deferred.reject(response);

                });

        } else {

            factory.getEbaySessionID().then(function (response) {
                Session.setSessionValue('ebay', response.data.ebay, function () {

                    $http.post(ENV.postingAPI + newPost.postingId + '/publish', payload).
                        success(function (response) {
                            deferred.resolve(response);
                        }).
                        error(function (response) {

                            deferred.reject(response);

                        });
                });
            }, function(errResponse) {
                //$scope.ebay.sessionId = errResponse.data.sessionId;
                //$scope.ebay.err = errResponse.data.ebay.Errors.LongMessage;

                Notification.error({
                    title: 'Manually link eBay account',
                    message: 'After completing eBay authorization please click the big red button below.',
                    delay: 10000
                });  //Send the webtoast
            });

        }

        return deferred.promise;
    };



    factory.getEbaySessionID = function () {

        var deferred = $q.defer();

        var w = $window.open(ENV.htsAppUrl + "/ebayauth", "", "width=1020, height=500");

        $http({
            method: 'GET',
            url: ENV.ebayAuth + '/sessionId'
        }).then(function (response) {

            var sessionId = response.data.GetSessionIDResponse.SessionID;
            var ebaySignInPage = ENV.ebaySignIn + '?SignIn&RUName=' + ENV.ebayRuName + '&SessID=' + sessionId;
            w.location = ebaySignInPage;

            var attemptCount = 0;

            var fetchTokenInterval = $interval(function () {
                $http({
                    method: 'GET',
                    url: ENV.ebayAuth + '/fetchToken',
                    params: {'sessionId' : sessionId}
                }).then(function (response) {

                    console.log(response);

                    if(response.data.success) {

                        w.close();

                        $interval.cancel(fetchTokenInterval);
                        deferred.resolve(response);

                    } else if(attemptCount === 50) {

                        $interval.cancel(fetchTokenInterval);

                        response.data.sessionId = sessionId;

                        deferred.reject(response);

                    } else {

                        attemptCount++;
                        console.log(attemptCount);

                    }

                });
            }, 2000);

            //deferred.resolve(response);

        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    };


    factory.manuallyGetEbayToken = function (sessionId) {

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: ENV.ebayAuth + '/fetchToken',
            params: {'sessionId' : sessionId}
        }).then(function (response) {

            deferred.resolve(response);

        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    };


    factory.disconnectEbay = function () {
        Session.setSessionValue('ebay', {}, function () {
            console.log('ebay account disconnected!');
        });
    };







    // Speed up calls to hasOwnProperty
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    factory.isEmpty = function(obj) {

        // null and undefined are "empty"
        if (obj === null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }

        return true;
    };



    return factory;

}]);