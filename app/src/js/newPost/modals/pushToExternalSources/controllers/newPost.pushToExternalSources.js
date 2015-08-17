/**
 * Created by braddavis on 2/25/15.
 */
htsApp.controller('pushNewPostToExternalSources', ['$scope', '$modal', '$modalInstance', '$q', '$http', 'newPost', 'Notification', 'facebookFactory', 'ebayFactory', 'twitterFactory', 'subMerchantFactory', 'ENV', function ($scope, $modal, $modalInstance, $q, $http, newPost, Notification, facebookFactory, ebayFactory, twitterFactory, subMerchantFactory, ENV) {

    $scope.currentlyPublishing = {
        publishing: false,
        facebook: false,
        twitter: false,
        amazon: false,
        ebay: false,
        craigslist: false,
        onlinePayment: false
    };

    //Passes the newPost object with the selected external sources to the Josh's api.  Upon success passes resulting post obj to congrats.
    $scope.dismiss = function (reason) {

        $scope.currentlyPublishing.publishing = true;

        $scope.publishToFacebook().then(function(){

            $scope.currentlyPublishing.facebook = false;

            $scope.publishToTwitter().then(function(){

                $scope.currentlyPublishing.twitter = false;

                $scope.publishToEbay().then(function(){

                    $scope.currentlyPublishing.ebay = false;

                   $scope.publishToAmazon().then(function(){

                       $scope.currentlyPublishing.amazon = false;

                       $scope.publishToCraigslist().then(function(){

                           $scope.currentlyPublishing.craigslist = false;

                           $scope.setupOnlinePayment().then(function() {

                               $scope.currentlyPublishing.onlinePayment = false;

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
        allow: true
    };

    $scope.checkIfFacebookTokenValid = function () {
        facebookFactory.checkIfTokenValid();
    };


    $scope.publishToFacebook = function () {

        var deferred = $q.defer();

        if($scope.shareToggles.facebook) {

            $scope.currentlyPublishing.facebook = true;

            facebookFactory.publishToWall(newPost).then(function (response) {

                newPost = response;

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


    $scope.checkIfTwitterTokenValid = function () {
        twitterFactory.checkIfTokenValid();
    };


    $scope.publishToTwitter = function () {

        var deferred = $q.defer();

        if($scope.shareToggles.twitter) {

            $scope.currentlyPublishing.twitter = true;

            twitterFactory.publishToTwitter(newPost).then(function (response) {

                newPost = response;

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

            $scope.currentlyPublishing.amazon = true;

            Notification.primary({
                title: "Amazon coming soon",
                message: "Publish to Amazon is almost there!",
                delay: 15000
            });  //Send the webtoast
            deferred.resolve();

        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };


    $scope.checkIfEbayTokenValid = function () {
        ebayFactory.checkIfTokenValid();
    };


    $scope.publishToEbay = function () {

        var deferred = $q.defer();

        if($scope.shareToggles.ebay) {

            $scope.currentlyPublishing.ebay = true;

            ebayFactory.publishToEbay(newPost).then(function (response) {

                newPost = response;

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

            $scope.currentlyPublishing.craigslist = true;

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

            $scope.currentlyPublishing.onlinePayment = true;

            subMerchantFactory.validateSubMerchant(newPost).then(function(response){

                console.log(response);

                //var payload = {
                //    payment: response
                //};
                //
                //if (newPost.facebook) {
                //    payload.facebook = newPost.facebook;
                //}
                //
                //if (newPost.amazon) {
                //    payload.amazon = newPost.amazon;
                //}
                //
                //if (newPost.craigslist) {
                //    payload.craigslist = newPost.craigslist;
                //}
                //
                //$http.post(ENV.postingAPI + newPost.postingId + '/publish', payload).success(function (response) {
                //
                //    deferred.resolve(response);
                //
                //}).error(function (response) {
                //
                //    deferred.reject(response);
                //});

                deferred.resolve(response);

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