/**
 * Created by braddavis on 4/23/15.
 */
htsApp.factory('facebookFactory', ['$q', 'ENV', '$http', 'Session', 'ezfb', function ($q, ENV, $http, Session, ezfb) {

    var factory = {};

    factory.publishToWall = function (newPost) {

        var deferred = $q.defer();

        var facebook = Session.getSessionValue('facebook');

        console.log('facebook tokens', facebook);

        var currentDate = new Date();

        //WE already have facebook token for user.. just post to facebook.
        //if(!factory.isEmpty(facebook) && facebook.tokenExpiration > currentDate || !facebook.tokenExpiration) {
        if((!factory.isEmpty(facebook)  &&  facebook.tokenExpiration > currentDate) || (!factory.isEmpty(facebook)  &&  !facebook.tokenExpiration)) {

            ezfb.api('/me/feed', 'post',
                {
                    message: ENV.htsAppUrl + '/fb/' + newPost.postingId,
                    link: ENV.htsAppUrl + '/fb/' + newPost.postingId,
                    access_token: facebook.token
                },
                function (response) {

                    if (response.error) {

                        deferred.reject(response);

                    } else {


                        var payload = {
                            facebook: response
                        };

                        if (newPost.twitter) {
                            payload.twitter = newPost.twitter;
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

                    }
                }
            );

        } else { //No facebook token for user.

            /**
             * Calling FB.login with required permissions specified
             * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0
             */
            ezfb.login(function (res) { //login to facebook with scope email, and publish_actions
                if (res.authResponse) {
                    console.log('res AuthResponse', res);

                    var t = new Date();
                    t.setSeconds(res.authResponse.expiresIn);

                    var facebookCreds = {};
                    facebookCreds.id = res.authResponse.userID;
                    facebookCreds.token = res.authResponse.accessToken;
                    facebookCreds.tokenExpiration = t;

                    ezfb.api('/me', function (res) {  //Get email address from user now that we are authenticated
                        //$scope.apiMe = res;
                        console.log('apiMe', res);

                        facebookCreds.email = res.email;
                        facebookCreds.name = res.first_name + ' ' + res.last_name;

                        console.log(facebookCreds);

                        Session.setSessionValue('facebook', facebookCreds, function () {  //persist the facebook token in database so we don't have to do this again

                            ezfb.api('/me/feed', 'post',  //Post to facebook
                                {
                                    message: ENV.htsAppUrl + '/fb/' + newPost.postingId,
                                    link: ENV.htsAppUrl + '/fb/' + newPost.postingId,
                                    access_token: facebookCreds.token
                                },
                                function (response) {

                                    if (response.error) {

                                        deferred.reject(response);

                                    } else {

                                        var payload = {
                                            facebook: response
                                        };

                                        if (newPost.twitter) {
                                            payload.twitter = newPost.twitter;
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

                                    }
                                }
                            );

                        });

                    });

                }
            }, {scope: 'email, publish_actions'});

        }

        return deferred.promise;
    };


    //Clears facebook token and creds from server permanently.
    factory.disconnectFacebook = function () {
        Session.setSessionValue('facebook', {}, function () {
            console.log('facebook account disconnected!');
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