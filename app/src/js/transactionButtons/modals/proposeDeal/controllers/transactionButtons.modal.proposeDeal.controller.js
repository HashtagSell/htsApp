/**
 * Created by braddavis on 1/4/15.
 */
htsApp.controller('proposeDealController', ['$scope', '$modalInstance', 'Session', 'result', 'offerIndex', 'ENV', '$filter', 'meetingsFactory', 'favesFactory', 'socketio', 'Notification', function ($scope, $modalInstance, Session, result, offerIndex, ENV, $filter, meetingsFactory, favesFactory, socketio, Notification) {

    //Logged in user details
    $scope.userObj = Session.userObj;

    //Item details
    $scope.result = result;

    //Double binded to deal box in UI
    $scope.deal = {
        item: null,
        price: null,
        location: null,
        comment: null,
        when: null,
        declinedTimes: []
    };

    //All the existing offers cached here.  New proposals are pushed onto this the proposals array then sent to server.
    $scope.offers = {
        proposals: [],
        username: null
    };

    $scope.slots = [
        {start: 300, stop: 420, day: 1},
        {start: 60, stop: 120, day: 1}
    ];

    $scope.error = {
        price: null,
        when: null,
        where: null
    };

    $scope.button = {
        text: "Send offer"
    };

    var updateOffer = false;  //POST a new offer or UPDATE an existing offer proposal


    meetingsFactory.getOffers($scope.result).then(function (response) {

        if (offerIndex === undefined) { //if we don't have the index of the offer we are updating then this is either first offer the user is sending or we need to check

            for (var i = 0; i < response.data.offers.results.length; i++) {
                var offers = response.data.offers.results[i];

                if (offers.username === $scope.userObj.user_settings.name) {

                    $scope.button.text = "Send counter offer";

                    $scope.offers = offers;

                    console.log('The logged in user has already placed and offer on this item');

                    updateOffer = true;

                    $scope.deal.item = $scope.result.heading;
                    $scope.deal.price = $scope.offers.proposals[$scope.offers.proposals.length - 1].price.value;
                    $scope.deal.location = $scope.offers.proposals[$scope.offers.proposals.length - 1].where;
                    $scope.deal.comment = $scope.offers.proposals[$scope.offers.proposals.length - 1].comment || '';
                    $scope.deal.when = $scope.offers.proposals[$scope.offers.proposals.length - 1].when;

                    break;
                }
            }

            if (!updateOffer) {

                console.log('The logged in user has NEVER placed an offer on this item.');

                $scope.deal.item = $scope.result.heading;
                $scope.deal.price = $scope.result.askingPrice.value;
                $scope.deal.location = $scope.result.external.threeTaps.location.formatted;
                $scope.deal.when = null;
            }

        } else { //Since the index of the offer is already supplied we will be pushing new proposal to this offer

            console.log('The owner of this item is supplying a counter offer.');

            $scope.button.text = "Send counter offer";

            $scope.offers = response.data.offers.results[offerIndex];

            updateOffer = true;

            $scope.deal.item = $scope.result.heading;
            $scope.deal.price = $scope.offers.proposals[$scope.offers.proposals.length - 1].price.value;
            $scope.deal.location = $scope.offers.proposals[$scope.offers.proposals.length - 1].where;
            $scope.deal.when = $scope.offers.proposals[$scope.offers.proposals.length - 1].when;

        }

    }, function (err) {

        Notification.error({
            title: "Failed to lookup offers on this post",
            message: err.message,
            delay: 10000
        });  //Send the webtoast

    });



    //When offer modal is dismissed
    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };


    $scope.counterOffer = function () {

        console.log('heres our proposal', $scope.deal);

        if(!$scope.deal.price) {
            $scope.error.price = "Please propose a price";

        } else if(!$scope.deal.when) {
            $scope.error.when = "Please propose a day and time";

        } else if(!$scope.deal.location) {
            $scope.error.where = "Please propose a meeting location";

        } else {

            if (offerIndex === undefined) { //if we don't have the index of the offer we are updating then this is either first offer the user is sending or we need to check
                socketio.joinPostingRoom($scope.result.postingId, 'inWatchList', function () {

                    $scope.offers.proposals.push({
                        "comment": $scope.deal.comment,
                        "price": {
                            "currency": $scope.result.askingPrice.currency,
                            "value": $scope.deal.price
                        },
                        "when": $scope.deal.when,
                        "where": $scope.deal.location
                    });

                    $scope.offers.username = $scope.userObj.user_settings.name;

                    if (!updateOffer) { //The logged in user has NEVER placed an offer on this item.

                        console.log('Here is the updated offer we are about to submit', $scope.offers);

                        meetingsFactory.sendOffer($scope.result, $scope.offers).then(function (response) {

                            $scope.dismiss("offer sent");

                        }, function (err) {

                            $scope.dismiss("error");

                            alert(err);

                        });

                    } else {

                        console.log('New offer we are about to submit', $scope.offers);

                        meetingsFactory.updateOffer($scope.result, $scope.offers).then(function (response) {

                            $scope.dismiss("offer sent");

                        }, function (err) {

                            $scope.dismiss("error");

                            alert(err);

                        });

                    }
                });
            } else { //Since the index of the offer is already supplied we will be pushing new proposal to this offer

                if ($scope.result.username === $scope.userObj.user_settings.name) {

                    $scope.offers.proposals.push({
                        "comment": $scope.deal.comment,
                        "isOwnerReply": true,
                        "price": {
                            "currency": $scope.result.askingPrice.currency,
                            "value": $scope.deal.price
                        },
                        "when": $scope.deal.when,
                        "where": $scope.deal.location
                    });

                    //"2015-02-03T10:00:00Z"

                    console.log('Updated offer with the owners reply', $scope.offers);

                } else {

                    $scope.offers.proposals.push({
                        "comment": $scope.deal.comment,
                        "isOwnerReply": false,
                        "price": {
                            "currency": $scope.result.askingPrice.currency,
                            "value": $scope.deal.price
                        },
                        "when": $scope.deal.when,
                        "where": $scope.deal.location
                    });

                    //"2015-02-03T10:00:00Z"

                    console.log('Updated offer with the buyers reply', $scope.offers);
                }

                meetingsFactory.updateOffer($scope.result, $scope.offers).then(function (response) {

                    $scope.dismiss("offer sent");

                }, function (err) {

                    $scope.dismiss("error");

                    alert(err);

                });
            }
        }

    };

}]);