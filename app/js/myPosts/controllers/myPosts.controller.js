/**
 * Created by braddavis on 2/21/15.
 */
htsApp.controller('myPosts.controller', ['$scope', '$filter', '$modal', '$window', 'myPostsFactory', 'Session', 'socketio', 'ngTableParams', 'newPostFactory', 'Notification', 'splashFactory', '$state', function ($scope, $filter, $modal, $window, myPostsFactory, Session, socketio, ngTableParams, newPostFactory, Notification, splashFactory, $state) {

    $scope.userPosts = myPostsFactory.userPosts;

    console.log($scope.userPosts);


    myPostsFactory.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 2000, // include all favorites on page one
        filter: {},         // initial filter
        sorting: {}         // initial sort
    }, {
        counts: [], //hides page sizes
        total: $scope.userPosts.data.length,
        getData: function($defer, params) {
            // use built-in angular filter
            var filteredData = $filter('filter')($scope.userPosts.data, myPostsFactory.filterString);
            var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                filteredData;

            params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

    $scope.tableParams = myPostsFactory.tableParams;

    // Ugh... http://stackoverflow.com/questions/22892908/ng-table-typeerror-cannot-set-property-data-of-null
    $scope.tableParams.settings().$scope = $scope;

    //Declaring filters var so it can be attached to ng-table
    $scope.filters = {
        $: ''
    };


    //Filtering by all fields in table http://plnkr.co/edit/llb5k6?p=preview
    $scope.$watch("filters.$", function (value) {
        myPostsFactory.filterString = value;
        console.log(myPostsFactory.filterString);
        $scope.tableParams.reload();
    });


    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $scope.currentState = toState.name;
        $scope.expandedPostingId = toParams.postingId;
    });




    $scope.newPost = function () {

        var modalInstance = $modal.open({
            templateUrl: '/js/newPost/modals/newPost/partials/newpost.html',
            controller: 'newPostModal',
            size: 'lg',
            resolve: {
                mentionsFactory: function () {
                    return newPostFactory;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.modalContent.selected = selectedItem;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };






    $scope.countUnreadQuestions = function(post){

        var unreadQuestionsCount = 0;

        for(var i = 0; i < post.questions.results.length; i++){
            var question = post.questions.results[i];
            if(!question.answers.length){ //if question does not have answer
                unreadQuestionsCount++;
            }
        }

        return unreadQuestionsCount;
    };



    $scope.countUnreadOffers = function(post){

        var unreadOffersCount = 0;

        for(var i = 0; i < post.offers.results.length; i++){
            var offer = post.offers.results[i];

            unreadOffersCount++;

            for(var j = 0; j < offer.proposedTimes.length; j++){
                var proposedTime = offer.proposedTimes[j];

                if(proposedTime.acceptedAt){ //if question does not have answer
                    unreadOffersCount--;
                }

            }


        }

        return unreadOffersCount;
    };



    $scope.deletePost = function(post) {

        console.log(post);

        myPostsFactory.deletePost(post).then(function(response){

            if(response.status === 204) {

                socketio.leavePostingRoom(post.postingId, 'postingOwner');

                myPostsFactory.getAllUserPosts(Session.userObj.user_settings.name).then(function(response){

                    if(response.status === 200) {

                    } else {

                        Notification.error({
                            title: 'Whoops',
                            message: 'Please notify support.  We coulnd\'t refresh your myPosts list after deleting an item.' ,
                            delay: 10000
                        });  //Send the webtoast

                        alert('could not refresh myPost list after deleting item.  contact support.');

                    }

                });

            } else {

                Notification.error({
                    title: 'Whoops',
                    message: 'Please notify support.  We coulnd\'t delete your item for some reason.' ,
                    delay: 10000
                });  //Send the webtoast

            }

        });
    };



    $scope.editPost = function(post) {

        Notification.error({
            title: 'Coming soon',
            message: 'Please delete and recreate the ad for now.  We\'re rolling out edit functionality soon! :)' ,
            delay: 10000
        });  //Send the webtoast

    };



    //passes properties associated with clicked DOM element to splashFactory for detailed view
    $scope.openSplash = function(post){
        splashFactory.result = post;
        console.log(splashFactory.result);
        $state.go('myposts.splash', { id: post.postingId });
    };




    //FACEBOOK MGMT
    $scope.showFacebookPost = function (post) {
        $window.open("http://facebook.com");
    };

    $scope.removeFacebookPost = function (post) {

    };



    //TWITTER MGMT
    $scope.showTwitterPost = function (post) {
        $window.open("http://twitter.com");
    };

    $scope.removeTwitterPost = function (post) {

    };



    //EBAY MGMT
    $scope.showEbayPost = function (post) {
        $window.open(post.ebay.url);
    };

    $scope.removeEbayPost = function (post) {

    };

}]);