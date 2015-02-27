/**
 * Created by braddavis on 2/22/15.
 */
htsApp.controller('offer.offers.controller', ['$scope', '$stateParams', 'mailboxFactory', 'Session', 'offersFactory', 'socketio', '$state', function ($scope, $stateParams, mailboxFactory, Session, offersFactory, socketio, $state) {

    $scope.mail = mailboxFactory.mail;
    $scope.disableAcceptSubmit = true;


    if($scope.mail.quickCache.postingId === $stateParams.postingId && $scope.mail.quickCache.offerId ===  $stateParams.offerId) {
        $scope.offer = $scope.mail.quickCache;
    } else {
        console.log($stateParams.postingId, $stateParams.offerId);

        offersFactory.getSingleOffer($stateParams.postingId, $stateParams.offerId).then(function (response) {

            $scope.offer = response.data;

        }, function (response) {

            alert('could not lookup offer');

        });

    }

    $scope.validateForm = function (index) {
        console.log('running validation');
        if ($scope.offer.proposedTimes[index].selected) {
            $scope.disableAcceptSubmit = false;
        } else {
            $scope.disableAcceptSubmit = true;
        }

        //Uncheck all items except the item the user JUST checked
        for(var i=0; i < $scope.offer.proposedTimes.length; i++){
            if(i !== index) {
                var proposedTime = $scope.offer.proposedTimes[i];
                proposedTime.selected = false;
            }
        }

    };

    $scope.submitOfferResponse = function (accept) {

        var postingId = $scope.offer.postingId;
        var offerId = $scope.offer.offerId;

        if(accept) {
            for(var i=0; i < $scope.offer.proposedTimes.length; i++){
                var proposedTime = $scope.offer.proposedTimes[i];
                if(proposedTime.selected){
                    var payload = {
                        when: proposedTime.when,
                        where: proposedTime.where
                    };

                    offersFactory.acceptOffer(postingId, offerId, payload).then(function (response) {

                        $state.go('^');

                    }, function (err) {

                        //TODO: Alert status update

                    });

                    break;
                }
            }
        } else {

            offersFactory.deleteOffer(postingId, offerId).then(function (response) {

                $state.go('^');

            }, function (err) {

                //TODO: Alert status update

            });

        }



        if($scope.offer.message){
            console.log('sending message', $scope.offer.message);
            socketio.sendMessage($scope.offer.username, $scope.offer.message);
        }
    };

}]);