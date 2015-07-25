/**
 * Created by braddavis on 2/22/15.
 */
htsApp.controller('watchlist.meetings.controller', ['$scope', 'Session', 'meetingsFactory', 'Notification', 'favesFactory', 'transactionFactory', function ($scope, Session, meetingsFactory, Notification, favesFactory, transactionFactory) {

    $scope.userObj = Session.userObj;

    //Drops down menu so posting owner can delete their item for sale.
    $scope.toggled = function(open) {
        console.log('Dropdown is now: ', open);
    };

    $scope.cachedOffers = angular.copy($scope.post.offers.results);



    $scope.counterOffer = function ($index, proposal) {

        var indexOfOfferToUpdate = $index;

        console.log('index of offer to add proposal to:', indexOfOfferToUpdate);

        transactionFactory.proposeDeal($scope.post, indexOfOfferToUpdate);

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

}]);