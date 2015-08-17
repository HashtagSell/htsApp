/**
 * Created by braddavis on 4/23/15.
 */
htsApp.factory('facebookFactory', ['$q', 'ENV', '$http', 'Session', 'ezfb', function ($q, ENV, $http, Session, ezfb) {

    var factory = {};

    factory.publishToWall = function (newPost) {

        var deferred = $q.defer();

        var facebook = Session.getSessionValue('facebook');

        //Strips HTML from string.
        function strip(html){
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }


        var bodyElem = $('<div>' + newPost.body + '</div>');

        $(bodyElem.find('.mention-highlighter')).each(function(i){
            var text = $(this).text();
            text = text.replace(/ /g,'');
            $(this).text(text);
        });


        $(bodyElem.find('.mention-highlighter-location')).each(function(i){
            var text = $(this).text();
            text = text.replace('@','at ');
            $(this).text(text);
        });


        newPost.plainTextBody = strip(bodyElem.html());

        var fbPost = null;

        if(newPost.images.length) {
            fbPost = {
                message: newPost.plainTextBody + '... ' + ENV.htsAppUrl + '/feed/' + newPost.postingId,
                picture: newPost.images[0].full || newPost.images[0].thumbnail,
                access_token: facebook.token
            };
        } else {
            fbPost = {
                message: newPost.plainTextBody + '... ' + ENV.htsAppUrl + '/feed/' + newPost.postingId,
                link: ENV.htsAppUrl + '/feed/' + newPost.postingId,
                access_token: facebook.token
            };
        }

        console.log('here is our fb post object: ', fbPost);


        ezfb.api('/me/feed', 'post', fbPost, function (response) {

            if (response.error) {

                deferred.reject(response);

            } else {

                console.log('here is our facebook success response: ', response);

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

                if (newPost.payment) {
                    payload.payment = newPost.payment;
                }

                $http.post(ENV.postingAPI + newPost.postingId + '/publish', payload).success(function (response) {

                        deferred.resolve(response);

                }).error(function (response) {

                        deferred.reject(response);
                });

            }
        });

        return deferred.promise;
    };


    //Clears facebook token and creds from server permanently.
    factory.disconnectFacebook = function () {
        Session.setSessionValue('facebook', {}, function () {
            console.log('facebook account disconnected!');
        });
    };




    factory.checkIfTokenValid = function () {

        var deferred = $q.defer();

        var facebook = Session.getSessionValue('facebook');

        console.log('facebook tokens', facebook);

        var currentDate = new Date();
        //WE already have facebook token for user.. just post to facebook.
        if((!factory.isEmpty(facebook)  &&  facebook.tokenExpiration > currentDate) || (!factory.isEmpty(facebook)  &&  !facebook.tokenExpiration)) {

        } else {
            ezfb.login(function (res) { //login to facebook with scope email, and publish_actions
                console.log('res AuthResponse', res);

                if (res.authResponse) {
                    if(res.authResponse.grantedScopes === 'email,contact_email,publish_actions,public_profile') {
                        var t = new Date();
                        t.setSeconds(res.authResponse.expiresIn);

                        var facebookCreds = {
                            id: res.authResponse.userID,
                            token: res.authResponse.accessToken,
                            tokenExpiration: t
                        };

                        ezfb.api('/me', function (res) {  //Get email address from user now that we are authenticated
                            if (!res || res.error) {
                                deferred.reject({
                                    message: "Facebook failed to hand back user credentials",
                                    delay: 10000
                                });
                            } else {
                                console.log('apiMe', res);

                                facebookCreds.email = res.email;
                                facebookCreds.name = res.first_name + ' ' + res.last_name;

                                console.log(facebookCreds);

                                Session.setSessionValue('facebook', facebookCreds, function () { //persist the facebook token in database so we don't have to do this again
                                    deferred.resolve();
                                });
                            }
                        });
                    } else {
                        deferred.reject({
                            message: "Need correct Facebook permissions to publish",
                            delay: 10000
                        });
                    }
                } else {  //user cancelled
                    deferred.reject({
                        message: "Could not complete Facebook login.",
                        delay: 10000
                    });
                }
            }, {
                scope: 'email, publish_actions',
                return_scopes: true
            });
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