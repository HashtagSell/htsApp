/**
 * Created by braddavis on 2/22/15.
 */
htsApp.controller('myPosts.meetings.controller', ['$scope', 'meetingsFactory', 'myPostsFactory', 'socketio', '$state', 'Session', 'Notification', 'transactionFactory', function ($scope, meetingsFactory, myPostsFactory, socketio, $state, Session, Notification, transactionFactory) {

    $scope.userObj = Session.userObj;

    $scope.cachedOffers = angular.copy($scope.post.offers.results);

    $scope.acceptedTime = {model :  undefined};

    $scope.errors = {
        message: null
    };

    $scope.counterOffer = function ($index, proposal) {

        var indexOfOfferToUpdate = $index;

        console.log('index of offer to add proposal to:', indexOfOfferToUpdate);

        transactionFactory.proposeDeal($scope.post, indexOfOfferToUpdate);

    };


    $scope.acceptDeal = function ($index, proposal) {

        //console.log($index);
        //
        //console.log(proposal);
        //
        //proposal.when = $scope.acceptedTime.model;
        //
        //console.log(proposal);

        if($scope.acceptedTime.model) {

            var acceptedProposal = {
                acceptedAt: moment().format(),
                price: proposal.price,
                when: $scope.acceptedTime.model,
                where: proposal.where,
                isOwnerReply: true
            };

            var offer = $scope.post.offers.results[$index];

            meetingsFactory.acceptOffer($scope.post, offer, acceptedProposal).then(function (response) {

                if (response.status === 201) {

                    myPostsFactory.getAllUserPosts($scope.userObj.user_settings.name);

                    Notification.primary({
                        title: "Sent Offer Acceptance!",
                        message: "We've notified @" + offer.username + ".  Expect an email shortly.",
                        delay: 7000
                    });

                    var transactionRequirements = {
                        "buyer" : offer.userProfile,
                        "buyerUsername" : offer.username,
                        "offerId" : offer.offerId,
                        "postingId" : $scope.post.postingId,
                        "seller" : {
                            "name": $scope.userObj.user_settings.name,
                            "banner_photo" : $scope.userObj.user_settings.banner_photo,
                            "profile_photo" : $scope.userObj.user_settings.profile_photo
                        },
                        "sellerUsername" : $scope.userObj.user_settings.name
                    };

                    transactionFactory.createTransaction(transactionRequirements).then(function (response) {

                        console.log(response);

                    }, function (err) {

                        Notification.error({
                            title: "Failed to append transaction ID",
                            message: "Please inform support.  Sorry for the trouble.",
                            delay: 7000
                        });

                    });

                } else {

                    console.log(response);

                    Notification.error({title: response.name, message: response.message, delay: 20000});

                }


            }, function (err) {

                console.log(err);

                Notification.error({title: err.data.name, message: err.data.message, delay: 20000});

            });
        } else {

            $scope.errors.message = "Please select a proposed time from above.";

        }

    };

    $scope.deleteOffer = function (offer, post) {

        meetingsFactory.deleteOffer(offer, post).then(function (response) {

            console.log(response);

            if (response.status === 204) {

                var recipient = offer.username;

                if(!isBlank(offer.message)) {

                    socketio.sendMessage(recipient, offer.message);
                } else {

                    socketio.sendMessage(recipient, offer.response);
                }

                myPostsFactory.getAllUserPosts($scope.userObj.user_settings.name);

            } else {

                Notification.error({title: response.name, message: response.message, delay: 20000});

            }


        }, function (err) {

            Notification.error({title: "Contact Support", message: "Failed to decline the offer.  Error:" + err, delay: 20000});

        });

    };


    function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }

}]);



htsApp.directive('constructMyPostsOverlayMessage', function () {
    return {
        scope: {
            offer: '=',
            post: '='
        },
        restrict: 'EA',
        link: function (scope, element, attr) {
            console.log('scope', scope);
            console.log('element', element);
            console.log('attr', attr);
            if(scope.offer.proposals[scope.offer.proposals.length - 1].acceptedAt){
                attr.$set('message', 'Awesome!  We\'ll send you a reminder email with details.');
            } else {
                attr.$set('message', 'Offer sent to @' + scope.offer.username );
            }
        }
    };
});