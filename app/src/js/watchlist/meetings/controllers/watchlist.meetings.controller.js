/**
 * Created by braddavis on 2/22/15.
 */
htsApp.controller('watchlist.meetings.controller', ['$scope', '$element', 'Session', 'meetingsFactory', 'Notification', 'favesFactory', 'transactionFactory', function ($scope, $element, Session, meetingsFactory, Notification, favesFactory, transactionFactory) {

    $scope.userObj = Session.userObj;

    //Drops down menu so posting owner can delete their item for sale.
    $scope.toggled = function(open) {
        console.log('Dropdown is now: ', open);
    };

    console.log('here is watchlist meeting post', $scope.post);

    if($scope.post.external.source.code === 'HSHTG') {
        $scope.cachedOffers = angular.copy($scope.post.offers.results);
    }

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


        if($scope.acceptedTime.model) {

            var acceptedProposal = {
                acceptedAt: moment().format(),
                price: proposal.price,
                when: $scope.acceptedTime.model,
                where: proposal.where,
                isOwnerReply: false
            };

            var offer = $scope.post.offers.results[$index];

            meetingsFactory.acceptOffer($scope.post, offer, acceptedProposal).then(function (response) {

                if (response.status === 201) {

                    //myPostsFactory.getAllUserPosts(Session.userObj.user_settings.name);

                    Notification.primary({
                        title: "Sent Offer Acceptance!",
                        message: "We've notified @" + offer.username + ".  Expect an email shortly.",
                        delay: 7000
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





    $scope.cancelOffer = function (offer, post) {

        meetingsFactory.deleteOffer(offer, post).then(function (response) {

            if (response.status === 204) {

                //alert('deleted');

            } else {

                Notification.error({title: response.name, message: response.message, delay: 20000});

            }


        }, function (err) {

            console.log(err);

            Notification.error({title: err.data.name, message: err.data.message, delay: 20000});

        });

    };

}]);


htsApp.directive('constructWishListOverlayMessage', function () {
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
                attr.$set('message', 'Offer sent to @' + scope.post.username );
            }
        }
    };
});