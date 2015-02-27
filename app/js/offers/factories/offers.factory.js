/**
 * Created by braddavis on 2/21/15.
 */
htsApp.factory('offersFactory', ['$http', '$rootScope', '$q', 'ENV', 'mailboxFactory', 'Session', function ($http, $rootScope, $q, ENV, mailboxFactory, Session) {

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

        $rootScope.$apply(function () {
            factory.getAllOffers(factory.allUserItemsForSale);
        });
    };


    factory.getPostingIdOffers = function (postingId) {

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: ENV.postingAPI + postingId + '/offers'
        }).then(function (response, status, headers, config) {

            factory.parseAllOffers(response.data.results).then(function (response) {

                deferred.resolve(response);

            }, function (err) {

                deferred.reject(err);

            });

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;

    };



    factory.getAllOffers = function (allUserItemsForSale) {

        var deferred = $q.defer();

        factory.allUserItemsForSale = allUserItemsForSale;

        mailboxFactory.mail.offers.received.data = [];

        for(var i=0; i < allUserItemsForSale.length; i++) { //Loop though all the users items for sale and append offer to matching item

            var item = allUserItemsForSale[i];

            $http({
                method: 'GET',
                url: ENV.postingAPI + item.postingId + '/offers/'
            }).then(function (response, status, headers, config) {

                factory.parseAllOffers(response.data.results).then(function (response) {

                    deferred.resolve(response);

                }, function (err) {

                    deferred.reject(err);

                });



            }, function (err, status, headers, config) {

                deferred.reject(err);

            });
        }

        return deferred.promise;
    };


    factory.parseAllOffers = function (allOffers) {

        var deferred = $q.defer();

        console.log('here is all our offers:', allOffers);

        var offersSent = [];

        var offersReceived = [];

        for(var i=0; i < allOffers.length; i++ ){
            var offer = allOffers[i];

            if(offer.username === Session.userObj.user_settings.name) {
                offersSent.push(offer);
            } else {
                offersReceived.push(offer);
            }
        }

        mailboxFactory.mail.offers.sent.data = offersSent;
        mailboxFactory.mail.offers.received.data = offersReceived;
        mailboxFactory.mail.totalUnread();

        console.log('our mailbox: ',mailboxFactory.mail);

        deferred.resolve(mailboxFactory.mail);

        return deferred.promise;

    };





    factory.sendOffer = function (postingId, offer) {

        console.log('sending this offer', offer);

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ENV.postingAPI + postingId + "/offers",
            data: offer
        }).then(function (response, status, headers, config) {

            factory.getPostingIdOffers(postingId).then(function (response) {

                deferred.resolve(response);

            }, function (err) {

                deferred.reject(err);

            });

            //deferred.resolve(true);

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };


    factory.acceptOffer = function (postingId, offerId, payload) {

        console.log('postingId', postingId);
        console.log('offerId', offerId);
        console.log('accepting this offer', payload);

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ENV.postingAPI + postingId + "/offers/" + offerId + "/accept",
            data: payload
        }).then(function (response, status, headers, config) {

            factory.getPostingIdOffers(postingId).then(function (response) {

                deferred.resolve(response);

            }, function (err) {

                deferred.reject(err);

            });

            //deferred.resolve(true);

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };



    factory.deleteOffer = function (postingId, offerId) {

        console.log('postingId', postingId);
        console.log('offerId', offerId);

        var deferred = $q.defer();

        $http({
            method: 'DELETE',
            url: ENV.postingAPI + postingId + "/offers/" + offerId
        }).then(function (response, status, headers, config) {

            factory.getPostingIdOffers(postingId).then(function (response) {

                deferred.resolve(response);

            }, function (err) {

                deferred.reject(err);

            });

            //deferred.resolve(true);

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };



    factory.getSingleOffer = function (postingId, offerId) {

        var deferred = $q.defer();

        $http({
            method: 'GET',
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