/**
 * Created by braddavis on 2/22/15.
 */
htsApp.controller('watchlist.offers.controller', ['$scope', 'Session', 'offersFactory', 'Notification', function ($scope, Session, offersFactory, Notification) {

    $scope.userObj = Session.userObj;

    //Drops down menu so posting owner can delete their item for sale.
    $scope.toggled = function(open) {
        console.log('Dropdown is now: ', open);
    };


    $scope.cancelOffer = function (offer) {

        var postingId = offer.postingId;
        var offerId = offer.offerId;

        offersFactory.deleteOffer(postingId, offerId).then(function (response) {

            console.log(response);

            if (response.status === 204) {



            } else {

                Notification.error({title: response.name, message: response.message, delay: 20000});

            }


        }, function (err) {

            console.log(err);

            Notification.error({title: err.data.name, message: err.data.message, delay: 20000});

        });

    };

}]);