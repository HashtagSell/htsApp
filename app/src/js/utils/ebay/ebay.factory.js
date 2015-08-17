/**
 * Created by braddavis on 4/23/15.
 */
htsApp.factory('ebayFactory', ['$q', '$http', '$window', '$rootScope', '$timeout',  '$interval', 'ENV', 'Session', 'Notification', function ($q, $http, $window, $rootScope, $timeout, $interval, ENV, Session, Notification) {

    var factory = {};


    factory.publishToEbay = function (newPost) {

        var deferred = $q.defer();

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

        if (newPost.payment) {
            payload.payment = newPost.payment;
        }

        $http.post(ENV.postingAPI + newPost.postingId + '/publish', payload).
            success(function (response) {
                deferred.resolve(response);
            }).
            error(function (response) {

                deferred.reject(response);

            });

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
                if(!w.closed) {
                    $http({
                        method: 'GET',
                        url: ENV.ebayAuth + '/fetchToken',
                        params: {'sessionId': sessionId}
                    }).then(function (response) {

                        console.log(response);

                        if (response.data.success) {

                            w.close();

                            $interval.cancel(fetchTokenInterval);
                            deferred.resolve(response);

                        } else if (attemptCount === 30) {

                            $interval.cancel(fetchTokenInterval);

                            w.close();

                            response.data.sessionId = sessionId;

                            deferred.reject({
                                message: "Ebay login timed out.  Please try again.",
                                delay: 10000
                            });

                        } else {

                            attemptCount++;
                            console.log(attemptCount);

                        }

                    });
                } else {

                    $interval.cancel(fetchTokenInterval);
                    deferred.reject({
                        message: "Looks like you closed the Ebay login window.  Please try again.",
                        delay: 10000
                    });
                }
            }, 2000);

            //deferred.resolve(response);

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



    factory.checkIfTokenValid = function () {

        var deferred = $q.defer();

        var ebay = Session.getSessionValue('ebay');

        //We already have ebay token for user.. just push to ebay
        if(factory.isEmpty(ebay)){

            factory.getEbaySessionID().then(function (response) {
                Session.setSessionValue('ebay', response.data.ebay, function () {

                });
            }, function(errResponse) {

                deferred.reject(errResponse);
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
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