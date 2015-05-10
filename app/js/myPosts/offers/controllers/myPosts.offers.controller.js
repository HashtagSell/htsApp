/**
 * Created by braddavis on 2/22/15.
 */
htsApp.controller('myPosts.offers.controller', ['$scope', 'offersFactory', 'myPostsFactory', 'socketio', '$state', 'Session', 'Notification', function ($scope, offersFactory, myPostsFactory, socketio, $state, Session, Notification) {

    $scope.userObj = Session.userObj;


    $scope.acceptOffer = function (offer) {

        var postingId = offer.postingId;
        var offerId = offer.offerId;
        var payload = offer.response;

        offersFactory.acceptOffer(postingId, offerId, payload).then(function (response) {

            if (response.status === 201) {

                var recipient = offer.username;

                if (!isBlank(offer.message)) {

                    socketio.sendMessage(recipient, offer.message);

                }

                myPostsFactory.getAllUserPosts(Session.userObj.user_settings.name);

                Notification.success({title: "Meeting Request Accepted!", message: "We've notified @" + offer.username + ".  Expect an email shortly.", delay: 7000});

            } else {

                console.log(response);

                Notification.error({title: response.name, message: response.message, delay: 20000});

            }


        }, function (err) {

            console.log(err);

            Notification.error({title: err.data.name, message: err.data.message, delay: 20000});

        });

    };



    $scope.declineOffer = function (offer) {

        var postingId = offer.postingId;
        var offerId = offer.offerId;
        //var payload = $scope.offer.response;

        offersFactory.deleteOffer(postingId, offerId).then(function (response) {

            console.log(response);

            if (response.status === 204) {

                var recipient = offer.username;

                if(!isBlank(offer.message)) {

                    socketio.sendMessage(recipient, offer.message);
                } else {

                    socketio.sendMessage(recipient, offer.response);
                }

                myPostsFactory.getAllUserPosts(Session.userObj.user_settings.name);

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