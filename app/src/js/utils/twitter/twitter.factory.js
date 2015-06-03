/**
 * Created by braddavis on 4/23/15.
 */
htsApp.factory('twitterFactory', ['$q', '$http', '$window', '$interval', 'ENV', 'Session', function ($q, $http, $window, $interval, ENV, Session) {

    var factory = {};

    factory.publishToTwitter = function (newPost) {

        var deferred = $q.defer();

        var twitter = Session.getSessionValue('twitter');

        //Strips HTML from string.
        function strip(html){
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }

        newPost.plainTextBody = strip(newPost.body);

        //We already have twitter token for user.. just post to twitter.
        if(!factory.isEmpty(twitter)) {

            $http({
                method: 'POST',
                url: ENV.htsAppUrl + '/publishTweet',
                data: {
                    'posting': newPost,
                    'token': twitter.token,
                    'tokenSecret': twitter.tokenSecret
                }
            }).then(function (response) {

                var payload = {
                    twitter: {
                        id: response.data.id
                    }
                };

                if (newPost.facebook) {
                    payload.facebook = newPost.facebook;
                }

                if (newPost.amazon) {
                    payload.amazon = newPost.amazon;
                }

                if (newPost.ebay) {
                    payload.ebay = newPost.ebay;
                }

                if (newPost.craigslist) {
                    payload.craigslist = newPost.craigslist;
                }

                $http.post(ENV.postingAPI + newPost.postingId + '/publish', payload).success(function (response) {

                    deferred.resolve(response);

                }).error(function (response) {

                    deferred.reject(response);
                });

            }, function (err) {

                deferred.reject(err);

            });

        } else { //No twitter token for user.

            var w = $window.open(ENV.htsAppUrl + "/auth/twitter", "", "width=1020, height=500");

            var attemptCount = 0;

            var fetchTokenInterval = $interval(function () {

                Session.getUserFromServer().then(function (response) {

                    console.log(response);

                    if(response.user_settings.linkedAccounts.twitter.token) {

                        $interval.cancel(fetchTokenInterval);

                        w.close();

                        Session.create(response);

                        $http({
                            method: 'POST',
                            url: ENV.htsAppUrl + '/publishTweet',
                            data: {
                                'posting': newPost,
                                'token': response.user_settings.linkedAccounts.twitter.token,
                                'tokenSecret': response.user_settings.linkedAccounts.twitter.tokenSecret
                            }
                        }).then(function (response) {

                            var payload = {
                                twitter: {
                                    id: response.data.id
                                }
                            };

                            if (newPost.facebook) {
                                payload.facebook = newPost.facebook;
                            }

                            if (newPost.amazon) {
                                payload.amazon = newPost.amazon;
                            }

                            if (newPost.ebay) {
                                payload.ebay = newPost.ebay;
                            }

                            if (newPost.craigslist) {
                                payload.craigslist = newPost.craigslist;
                            }

                            $http.post(ENV.postingAPI + newPost.postingId + '/publish', payload).success(function (response) {

                                deferred.resolve(response);

                            }).error(function (response) {

                                deferred.reject(response);
                            });

                        }, function (err) {

                            deferred.reject(err);

                        });


                    } else if(attemptCount === 50) {

                        $interval.cancel(fetchTokenInterval);

                        deferred.reject(response);

                    } else {

                        attemptCount++;
                        console.log(attemptCount);

                    }

                });

            }, 2000);

        }

        return deferred.promise;
    };


    //Clears Twitter token and creds from server permanently.
    factory.disconnectTwitter = function () {
        Session.setSessionValue('twitter', {}, function () {
            console.log('twitter account disconnected!');
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