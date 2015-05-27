/**
 * Created by braddavis on 11/29/14.
 */
htsApp.controller('settings.account.controller', ['$scope', '$timeout', '$window', 'Session', 'ebayFactory', 'facebookFactory', 'twitterFactory', 'Notification', function ($scope, $timeout, $window, Session, ebayFactory, facebookFactory, twitterFactory, Notification) {

    $scope.userObj = Session.userObj;

    $scope.options = {
        safeSearch: ['On', 'Off'],
        defaultEmail: [
            {name : "Always Ask", value: "ask"},
            {name : "Gmail", value : "gmail"},
            {name : "Yahoo", value : "yahoo"},
            {name : "Hotmail", value : "hotmail"},
            {name : "AOL", value : "aol"},
            {name : "Use Default Mail Client", value : "mailto"}
        ],
        location: ['Approximate', 'Exact']
    };

    $scope.defaultEmail = Session.userObj.user_settings.email_provider[0].value;

    $scope.getSafeSearch = function(){
        //var value = Session.getSessionValue('safe_search');
        if (Session.userObj.user_settings.safe_search){
            return $scope.options.safeSearch[0];
        } else {
            return $scope.options.safeSearch[1];
        }
    };
    $scope.safeSearch = $scope.getSafeSearch();
    $scope.setSafeSearch = function(selection){

        if(selection === "On"){
            Session.setSessionValue('safe_search', true, function(){
                $scope.safeSearchUpdated = true;

                $timeout(function () {

                    $scope.safeSearchUpdated = false;
                }, 3000);
            });
        } else if (selection === "Off") {
            Session.setSessionValue('safe_search', false, function(){
                $scope.safeSearchUpdated = true;

                $timeout(function () {

                    $scope.safeSearchUpdated = false;
                }, 3000);
            });
        }

    };


    var buildDefaultEmail = function (selection) {
        //var value = Session.getSessionValue('email_provider');
        switch (selection) {
            case 'ask':
                return [{name : "Always Ask", value: "ask"}];
            case 'gmail':
                return [{name : "Gmail", value : "gmail"}];
            case 'yahoo':
                return [{name : "Yahoo", value : "yahoo"}];
            case 'hotmail':
                return [{name : "Hotmail", value : "hotmail"}];
            case 'aol':
                return [{name : "AOL", value : "aol"}];
            case 'mailto':
                return [{name : "Use Default Mail Client", value : "mailto"}];
        }
    };


    $scope.setDefaultEmail = function(selection){

        selection = buildDefaultEmail(selection);

        Session.setSessionValue('email_provider', selection, function () {
            $scope.defaultEmailUpdated = true;

            $timeout(function () {
                $scope.defaultEmailUpdated = false;
            }, 3000);
        });

    };



    $scope.getLocation = function(){
        //var value = Session.getSessionValue('location_type');
        switch (Session.userObj.user_settings.location_type) {
            case 'Approximate':
                return $scope.options.location[0];
            case 'Exact':
                return $scope.options.location[1];
        }
    };
    $scope.location = $scope.getLocation();
    $scope.setLocation = function(selection){
        Session.setSessionValue('location_type', selection, function(){
            $scope.locationUpdated = true;

            $timeout(function () {

                $scope.locationUpdated = false;
            }, 3000);
        });
    };




    $scope.getEbaySessionID = function () {

        $scope.ebay = {};


        ebayFactory.getEbaySessionID().then(function (response) {
            //if (response.status === 200) {
            //    $scope.ebay.sessionId = response.data.GetSessionIDResponse.SessionID;
            //} else {
            //    console.log('ebay link not working');
            //}

            Session.setSessionValue('ebay', response.data.ebay, function () {
                Notification.primary({
                    message: 'Successfully linked to eBay!',
                    delay: 10000
                });  //Send the webtoast
            });
        }, function(errResponse) {
            $scope.ebay.sessionId = errResponse.data.sessionId;
            $scope.ebay.err = errResponse.data.ebay.Errors.LongMessage;

            Notification.error({
                title: 'Manually link eBay account',
                message: 'After completing eBay authorization please click the big red button below.',
                delay: 10000
            });  //Send the webtoast
        });

    };


    $scope.getEbayToken = function () {
        ebayFactory.manuallyGetEbayToken($scope.ebay.sessionId).then(function (response) {
            console.log(response);
            if(!response.data.success) {
                $scope.ebay.sessionId = false;
                $scope.ebay.err = response.data.ebay.Errors.LongMessage;
            } else {
                Session.setSessionValue('ebay', response.data.ebay, function () {
                    console.log('ebay account connected!');
                });
            }
        });
    };




    $scope.disconnectFacebook = function () {
        facebookFactory.disconnectFacebook();
    };


    $scope.disconnectTwitter = function () {
        twitterFactory.disconnectTwitter();
    };


    $scope.disconnectEbay = function () {
        ebayFactory.disconnectEbay();
    };

    $scope.disconnectAmazon = function () {
        Session.setSessionValue('amazon', {}, function () {
            console.log('amazon account disconnected!');
        });
    };

}]);