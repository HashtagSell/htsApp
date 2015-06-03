/**
 * Created by braddavis on 3/31/15.
 */
htsApp.factory('myPostsFactory', ['$http', 'ENV', '$q', 'utilsFactory', 'sideNavFactory', 'profileFactory', function ($http, ENV, $q, utilsFactory, sideNavFactory, profileFactory) {

    var factory = {};

    factory.userPosts = {
        data: [],
        updateMyPostsBadgeCount: function () {

            var unreadCount = 0;

            if(this.data.length){

                for(var i = 0; i < this.data.length; i++){

                    var post = this.data[i];

                    if(post.questions.results.length){

                        for (var j = 0; j < post.questions.results.length; j++){

                            var question = post.questions.results[j];

                            if(!question.answers.length){

                                unreadCount++;

                            }

                        }

                    }

                    if(post.offers.results.length){

                        for (var k = 0; k < post.offers.results.length; k++){

                            var offer = post.offers.results[k];

                            unreadCount++;

                            for(var l = 0; l < offer.proposedTimes.length; l++){
                                var proposedTime = offer.proposedTimes[l];

                                if(proposedTime.acceptedAt){ //if question does not have answer
                                    unreadCount--;
                                }

                            }

                        }

                    }

                }
            }

            sideNavFactory.items[1].alerts = unreadCount;
            return unreadCount;

        }
    };



    factory.getAllUserPosts = function (username) {

        var deferred = $q.defer();

        var params = {
            filters: {
                mandatory: {
                    exact: {
                        username: username
                    }
                }
            }
        };


        $http({
            method: 'GET',
            url: ENV.postingAPI + utilsFactory.bracketNotationURL(params)
        }).then(function (response) {

            var allUserPosts = response.data.results;

            if(allUserPosts.length) {

                if(factory.userPosts.data.length) { //If there are already items on screen then clear it before updating inventory.
                    factory.userPosts.data = [];
                }

                for (var i=0; i < allUserPosts.length; i++) {

                    var post = allUserPosts[i];

                    factory.getPostingIdQuestionsAndOffers(post.postingId).then(function (response) {

                        var postWithQuestionOfferAndProfile = response.data;

                        factory.userPosts.data.push(postWithQuestionOfferAndProfile);

                        factory.userPosts.updateMyPostsBadgeCount();

                        if(factory.userPosts.data.length === allUserPosts.length){ //if we're done caching all posts with questions and offers then resolve so we can update ui.
                            if(factory.tableParams) {
                                factory.tableParams.reload();
                            }

                            console.log(username + ' items for sale:', factory.userPosts);

                            deferred.resolve(response);
                        }

                    });

                }

            } else {

                factory.userPosts.data = [];

                sideNavFactory.items[1].alerts = 0;

            }

        }, function (err) {
            deferred.reject(err);
        });



        return deferred.promise;
    };







    factory.getPostingIdQuestionsAndOffers = function (postingId) {

        var deferred = $q.defer();

        var params = {
            postingId: postingId,
            questions: true,
            offers: true,
            count: 100
        };

        $http({
            method: 'GET',
            url: ENV.postingAPI + postingId + utilsFactory.bracketNotationURL(params)
        }).then(function (response, status, headers, config) {

            if(response.status === 200) {

                //console.log(response);

                //factory.questions.store = response.data.questions.results; //SplashFactory watches this store.
                if(response.data.questions.results.length) {

                    var questionDeferredCount = 0;

                    for(var i = 0; i < response.data.questions.results.length; i++) {

                        profileFactory.getUserProfile(response.data.questions.results[i].username).then(function (profileResponse) { //get user profiles of those who asked questions

                            questionDeferredCount++;

                            if(profileResponse.status === 200){

                                response.data.questions.results[questionDeferredCount-1].userProfile = profileResponse.data.user;

                            }

                            if(questionDeferredCount === response.data.questions.results.length){

                                if(!response.data.offers.results.length) {

                                    deferred.resolve(response);

                                }

                            }

                        });

                    }
                }

                if(response.data.offers.results.length) {

                    var offerDeferredCount = 0;

                    for (var j = 0; j < response.data.offers.results.length; j++) {

                        profileFactory.getUserProfile(response.data.offers.results[j].username).then(function (profileResponse) { //get user profiles of those who asked questions

                            offerDeferredCount++;

                            if (profileResponse.status === 200) {

                                response.data.offers.results[offerDeferredCount - 1].userProfile = profileResponse.data.user;

                            }

                            if (offerDeferredCount === response.data.offers.results.length) {

                                deferred.resolve(response);
                            }

                        });

                    }
                } else {

                    deferred.resolve(response);

                }


            } else {
                deferred.reject(response);
            }

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;

    };




    factory.deletePost = function (post) {

        var deferred = $q.defer();


        $http({
            method: 'DELETE',
            url: ENV.postingAPI + post.postingId
        }).then(function (response, status, headers, config) {

            console.log('delete response: ', response);

            deferred.resolve(response);

        }, function (response, status, headers, config) {

            deferred.reject(response);
        });

        return deferred.promise;
    };


    return factory;

}]);