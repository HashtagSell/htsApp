/**
 * Created by braddavis on 2/25/15.
 */
htsApp.controller('pushNewPostToExternalSources', ['$scope', '$modal', '$modalInstance', '$q', '$http', '$window', 'newPost', 'Notification', 'facebookFactory', 'ebayFactory', 'twitterFactory', 'subMerchantFactory', 'craigslistFactory', 'ENV', function ($scope, $modal, $modalInstance, $q, $http, $window, newPost, Notification, facebookFactory, ebayFactory, twitterFactory, subMerchantFactory, craigslistFactory, ENV) {

    $scope.currentlyPublishing = {
        publishing: false,
        facebook: false,
        twitter: false,
        amazon: false,
        ebay: false,
        craigslist: false
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

                           $modalInstance.dismiss({reason: reason, post: newPost}); //Close the modal and display success!

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

    $scope.checkIfFacebookTokenValid = function () {
        if($scope.shareToggles.facebook) {
            facebookFactory.checkIfTokenValid().then(function () {

            }, function (response) {
                $scope.shareToggles.facebook = false;

                Notification.error(response);  //Send the webtoast
            });
        }
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
        if($scope.shareToggles.twitter) {
            twitterFactory.checkIfTokenValid().then(function () {

            }, function (response) {
                $scope.shareToggles.twitter = false;

                Notification.error(response);  //Send the webtoast
            });
        }
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



    $scope.warnAmazonComingSoon = function () {
        alert('Hang tight!  Publishing to Amazon is coming soon!');
        $scope.shareToggles.amazon = false;
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
        if($scope.shareToggles.ebay) {
            ebayFactory.checkIfTokenValid().then(function () {

            }, function (response) {
                $scope.shareToggles.ebay = false;

                Notification.error(response);  //Send the webtoast;
            });
        }
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


    $scope.confirmCraigslistCalifornia = function () {


        var message;

        var isOpera = !!$window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        var isChrome = !!$window.chrome && !isOpera;

        if (!isChrome) {

            message = "Sorry, Craigslist publishing only works in Chrome at this time. :(  Install Chrome?";
            alert(message);
        }

        if(newPost.location.country !== 'USA' && newPost.location.state !== 'CA') {

            message = "Sorry we can only publish to Craigslist in California during this time.";
            alert(message);
        }

        chrome.runtime.sendMessage(ENV.extensionId, { message: "version" }, function (versionResponse) {

            if (versionResponse === undefined || versionResponse === null) {
                message = "Extension not installed";
                alert(message);
            }

            if (parseFloat(versionResponse) < parseFloat(ENV.extensionVersion)) {

                message = "Please update the HashtagSell extension";
                alert(message);
            }

        });


        chrome.webstore.install(ENV.extensionInstallationUrl, function (success) {
            console.log(success);
            $scope.shareToggles.craigslist = true;
        }, function (err) {
            console.log(err);
            $scope.shareToggles.craigslist = false;
        });

    };


    $scope.publishToCraigslist = function () {

        var deferred = $q.defer();

        if($scope.shareToggles.craigslist) {

            $scope.currentlyPublishing.craigslist = true;

            console.log('here is what we send to extension', newPost);

            craigslistFactory.publishToCraigslist(newPost).then(function (response) {
                console.log(response);
            }, function (err) {
                console.log(err);
            });

        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };

}]);