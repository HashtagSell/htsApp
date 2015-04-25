/**
 * Created by braddavis on 1/4/15.
 */
htsApp.controller('placeOfferController', ['$scope', '$modalInstance', 'Session', 'result', 'ENV', '$filter', 'offersFactory', 'favesFactory', 'socketio', function ($scope, $modalInstance, Session, result, ENV, $filter, offersFactory, favesFactory, socketio) {

    //Logged in user details
    $scope.userObj = Session.userObj;

    //Item details
    $scope.result = result;

    //User must add proposal times before they are allowed to submit.
    $scope.disableSubmission = true;

    $scope.offer = {
        "proposedTimes": [],
        "username": $scope.userObj.user_settings.name
    };


    //Fired when user completes selecting time and date.
    $scope.onTimeSet = function (newDate, oldDate) {
        $scope.dropDownStatus.isOpen = false; //Closes date/time picker

        newDate = $filter('date')(newDate, "yyyy-MM-ddTHH:mm:ssZ");

        $scope.addProposedTime(newDate);

        //Clear the input field
        $scope.data.dateDropDownInput = null;

        console.log(newDate);
    };


    //Track the date/time picker dropdown status: open or closed
    $scope.dropDownStatus = {
        isOpen: false
    };


    //When offer modal is dismissed
    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

    $scope.addProposedTime = function (newDate) {
        $scope.offer.proposedTimes.push({
            'when': newDate,
            'where': result.external.threeTaps.location.formatted
        });

        $scope.disableSubmission = $scope.validateProposal();
    };

    $scope.removeProposedTime = function (index) {
        $scope.offer.proposedTimes.splice(index, 1);

        $scope.disableSubmission = $scope.validateProposal();
    };


    $scope.validateProposal = function () {
        return $scope.offer.proposedTimes.length < 1;
    };



    $scope.sendOffer = function () {

        socketio.joinPostingRoom($scope.result.postingId, 'inWatchList', function(){

            offersFactory.sendOffer($scope.result.postingId, $scope.offer).then(function (response) {

                $scope.dismiss("offer sent");

            }, function (err) {

                $scope.dismiss("error");

                alert(err);

            });

        }); //Join the room of each posting the user places an offer on.

    };

}]);