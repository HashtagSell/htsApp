/**
 * Created by braddavis on 2/25/15.
 */
htsApp.controller('pushNewPostToExternalSources', ['$scope', '$modal', '$modalInstance', '$q', 'externalSourcesSelection', 'newPost', 'Notification', 'facebookFactory', 'ebayFactory', 'twitterFactory', function ($scope, $modal, $modalInstance, $q, externalSourcesSelection, newPost, Notification, facebookFactory, ebayFactory, twitterFactory) {


    //Passes the newPost object with the selected external sources to the Josh's api.  Upon success passes resulting post obj to congrats.
    $scope.dismiss = function (reason) {

        if($scope.sourceSelections.length) {

            $scope.publishToFacebook().then(function(){
                $scope.publishToTwitter().then(function(){
                    $scope.publishToAmazon().then(function(){
                       $scope.publishToEbay().then(function(){
                           $scope.publishToCraigslist().then(function(){
                               $modalInstance.dismiss({reason: reason, post: newPost}); //Close the modal and display success!
                           });
                       });
                    });
                });
            });

        } else {

            $modalInstance.dismiss({reason: reason, post: newPost});

        }
    };


    $scope.publishToEbay = function () {

        var deferred = $q.defer();

        if(_.contains($scope.sourceSelections, 'eBay')) {

            ebayFactory.publishToEbay(newPost).then(function (response) {

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



    $scope.publishToFacebook = function () {

        var deferred = $q.defer();

        if(_.contains($scope.sourceSelections, 'Facebook')) {

            facebookFactory.publishToWall(newPost).then(function (response) {

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

        if(_.contains($scope.sourceSelections, 'Twitter')) {

            twitterFactory.publishToTwitter(newPost).then(function (response) {

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

        if(_.contains($scope.sourceSelections, 'Amazon')) {

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


    $scope.publishToCraigslist = function () {

        var deferred = $q.defer();

        if(_.contains($scope.sourceSelections, 'Craigslist')) {

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



    $scope.sources = externalSourcesSelection.sources;

    $scope.sourceSelections = [];

    // watch fruits for changes
    $scope.$watch('sources.marketplaces|filter:{selected:true}', function (newValue) {

        $scope.sourceSelections = newValue.map(function (source) {
            return source.name;
        });

    }, true);


}]);