/**
 * Created by braddavis on 2/22/15.
 */
htsApp.controller('watchlist.meetings.controller', ['$scope', 'Session', 'meetingsFactory', 'Notification', 'favesFactory', function ($scope, Session, meetingsFactory, Notification, favesFactory) {

    $scope.userObj = Session.userObj;

    //Drops down menu so posting owner can delete their item for sale.
    $scope.toggled = function(open) {
        console.log('Dropdown is now: ', open);
    };


    $scope.cancelOffer = function (offer, post) {

        meetingsFactory.deleteOffer(offer, post).then(function (response) {

            if (response.status === 204) {

                alert('deleted');

            } else {

                Notification.error({title: response.name, message: response.message, delay: 20000});

            }


        }, function (err) {

            console.log(err);

            Notification.error({title: err.data.name, message: err.data.message, delay: 20000});

        });

    };



    $scope.acceptedMeetingTime = function (offer) {

        for (var i = 0; i < offer.proposedTimes.length; i++) {
            var proposedTime = offer.proposedTimes[i];
            if(proposedTime.acceptedAt){
                return true;
            }
        }
        return false;
    };

}]);