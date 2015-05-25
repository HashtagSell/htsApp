/**
 * Created by braddavis on 2/25/15.
 */
htsApp.controller('pushNewPostToExternalSources', ['$scope', '$modal', '$modalInstance', '$q', 'newPost', 'Notification', 'facebookFactory', 'ebayFactory', 'twitterFactory', 'subMerchantFactory', function ($scope, $modal, $modalInstance, $q, newPost, Notification, facebookFactory, ebayFactory, twitterFactory, subMerchantFactory) {


    //Passes the newPost object with the selected external sources to the Josh's api.  Upon success passes resulting post obj to congrats.
    $scope.dismiss = function (reason) {
        $scope.publishToFacebook().then(function(){
            $scope.publishToTwitter().then(function(){
                $scope.publishToAmazon().then(function(){
                   $scope.publishToEbay().then(function(){
                       $scope.publishToCraigslist().then(function(){
                           $scope.setupOnlinePayment().then(function() {
                               $modalInstance.dismiss({reason: reason, post: newPost}); //Close the modal and display success!
                           });
                       });
                   });
                });
            });
        });
    };


    $scope.shareToggles = {
        facebook : false,
        twitter: false,
        ebay: false,
        amazon: false,
        craigslist: false
    };

    $scope.onlinePayment = {
        allow: false
    };


    $scope.publishToFacebook = function () {

        var deferred = $q.defer();

        if($scope.shareToggles.facebook) {

            facebookFactory.publishToWall(newPost).then(function (response) {

                newPost = response;

                Notification.success({
                    message: "Facebook publishing success!",
                    delay: 10000
                });  //Send the webtoast

                deferred.resolve();

            }, function (errResponse) {

                Notification.error({
                    title: "Facebook publishing error",
                    message: errResponse.error.message,
                    delay: 10000
                });  //Send the webtoast

                deferred.resolve();
            });

        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };


    $scope.publishToTwitter = function () {

        var deferred = $q.defer();

        if($scope.shareToggles.twitter) {

            twitterFactory.publishToTwitter(newPost).then(function (response) {

                newPost = response;

                Notification.success({
                    message: "Twitter publishing success!",
                    delay: 10000
                });  //Send the webtoast

                deferred.resolve();

            }, function (errResponse) {

                Notification.error({
                    title: "Twitter publishing error",
                    message: errResponse.error.message,
                    delay: 10000
                });  //Send the webtoast

                deferred.resolve();
            });

        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };


    $scope.publishToAmazon = function () {

        var deferred = $q.defer();

        if($scope.shareToggles.amazon) {

            Notification.error({
                title: "Amazon publishing error",
                message: "push to amazon coming soon!",
                delay: 10000
            });  //Send the webtoast
            deferred.resolve();

        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };



    $scope.publishToEbay = function () {

        var deferred = $q.defer();

        if($scope.shareToggles.ebay) {

            ebayFactory.publishToEbay(newPost).then(function (response) {

                newPost = response;

                Notification.success({
                    message: "eBay publishing success!",
                    delay: 10000
                });  //Send the webtoast

                deferred.resolve();

            }, function (errResponse) {

                console.log('ebay err', errResponse);

                try {

                    Notification.error({
                        title: 'eBay ' + errResponse.name,
                        message: errResponse.sourceError.details[0].LongMessage[0],
                        delay: 10000
                    });  //Send the webtoast

                }
                catch (err) {

                    Notification.error({
                        title: 'eBay ' + errResponse.name,
                        message: errResponse.message || "Please contact support",
                        delay: 10000
                    });  //Send the webtoast
                }

                deferred.resolve();

            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };



    $scope.publishToCraigslist = function () {

        var deferred = $q.defer();

        if($scope.shareToggles.craigslist) {

            Notification.error({
                title: "Craigslist publishing error",
                message: "push to craiglist coming soon!",
                delay: 10000
            });  //Send the webtoast
            deferred.resolve();

        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };


    $scope.setupOnlinePayment = function () {

        var deferred = $q.defer();

        if($scope.onlinePayment.allow) {

            subMerchantFactory.validateSubMerchant(newPost).then(function(response){

                console.log('success', response);

                deferred.resolve();

            }, function (err) {

                console.log('error', err);

                deferred.resolve();
            });

        } else {
            deferred.resolve();
        }

        return deferred.promise;

    };

}]);