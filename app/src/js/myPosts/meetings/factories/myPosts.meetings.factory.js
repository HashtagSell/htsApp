/**
 * Created by braddavis on 2/21/15.
 */
htsApp.factory('meetingsFactory', ['$http', '$rootScope', '$q', 'ENV', 'Session', 'utilsFactory', function ($http, $rootScope, $q, ENV, Session, utilsFactory) {

    var factory = {};


    //Socket.io calls this function when new-offer is emitted
    factory.newOfferNotification = function (offer) {

        console.log(
            '%s placed an %s offers on postingId %s to meet @ %s around %s',
            offer.username,
            offer.proposals.length,
            offer.postingId,
            offer.proposals[0].where,
            offer.proposals[0].when
        );

        console.log(offer);
    };





    factory.sendOffer = function (post, offer) {

        console.log('sending this offer', offer);

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ENV.postingAPI + post.postingId + "/offers",
            data: offer
        }).then(function (offerResponse, status, headers, config) {

            console.log('heres our offer response', offerResponse);

            var emailObj = {
                post: post,
                offer: offerResponse.data
            };

            //Send email to owner of posting and user potential buyer
            $http.post(ENV.htsAppUrl + '/email/meeting-proposed/instant-reminder', {proposedMeeting: emailObj}).success(function(response){


            }).error(function(data){


            });


            deferred.resolve(offerResponse);

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };


    factory.acceptOffer = function (offer, post) {

        var deferred = $q.defer();

        console.log('HERES THE ACCEPTED OFFER', offer);
        console.log('HEREs THE ACCEPTED POST', post);

        var emailObj = {
            post: post,
            offer: offer
        };

        $http({
            method: 'POST',
            url: ENV.postingAPI + offer.postingId + "/offers/" + offer.offerId + "/accept",
            data: offer.response
        }).then(function (response, status, headers, config) {

            //Send email to owner of posting and user potential buyer
            $http.post(ENV.htsAppUrl + '/email/meeting-accepted/instant-reminder', {acceptedMeeting: emailObj}).success(function(response){


            }).error(function(data){


            });


            deferred.resolve(response);


        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };



    factory.deleteOffer = function (offer, post) {

        console.log('Deleting offer', post.postingId, offer.offerId);

        var deferred = $q.defer();

        $http({
            method: 'DELETE',
            url: ENV.postingAPI + post.postingId + "/offers/" + offer.offerId
        }).then(function (response, status, headers, config) {

            deferred.resolve(response);


        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };


    factory.getOffers = function (post) {

        console.log('Gettings offers for post: ', post.postingId);

        var deferred = $q.defer();

        var params = {
            postingId: post.postingId,
            questions: false,
            offers: true,
            count: 100
        };

        $http({
            method: 'GET',
            url: ENV.postingAPI + post.postingId + utilsFactory.bracketNotationURL(params)
        }).then(function (response, status, headers, config) {

            deferred.resolve(response);


        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };




    factory.updateOffer = function (post, offer) {

        console.log('Updating offer', post.postingId, offer.offerId);

        var deferred = $q.defer();

        $http({
            method: 'PUT',
            url: ENV.postingAPI + post.postingId + "/offers/" + offer.offerId,
            data: offer
        }).then(function (response, status, headers, config) {

            deferred.resolve(response);


        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };


    return factory;
}]);