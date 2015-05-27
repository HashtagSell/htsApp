/**
 * Created by braddavis on 2/21/15.
 */
htsApp.factory('meetingsFactory', ['$http', '$rootScope', '$q', 'ENV', 'Session', function ($http, $rootScope, $q, ENV, Session) {

    var factory = {};


    //Socket.io calls this function when new-offer is emitted
    factory.newOfferNotification = function (offer) {

        console.log(
            '%s placed an %s offers on postingId %s to meet @ %s around %s',
            offer.username,
            offer.proposedTimes.length,
            offer.postingId,
            offer.proposedTimes[0].where,
            offer.proposedTimes[0].when
        );

        console.log(offer);
    };





    factory.sendOffer = function (post, offerTime) {

        console.log('sending this offer', offerTime);

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ENV.postingAPI + post.postingId + "/offers",
            data: offerTime
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


    factory.acceptOffer = function (offer) {

        var deferred = $q.defer();

        console.log('HERES THE ACCEPTED OFFER', offer);

        var emailObj = {
            postingOwner: Session.userObj.user_settings.name,
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



    factory.deleteOffer = function (postingId, offerId) {

        console.log('Deleting offer', postingId, offerId);

        var deferred = $q.defer();

        $http({
            method: 'DELETE',
            url: ENV.postingAPI + postingId + "/offers/" + offerId
        }).then(function (response, status, headers, config) {

            deferred.resolve(response);


        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };


    return factory;
}]);