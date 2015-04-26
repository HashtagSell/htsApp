/**
 * Created by braddavis on 1/24/15.
 */
htsApp.controller('mainController', ['$scope', '$rootScope', 'sideNavFactory', '$timeout', 'Session', 'socketio', 'myPostsFactory', 'favesFactory', '$location', '$window', function ($scope, $rootScope, sideNavFactory, $timeout, Session, socketio, myPostsFactory, favesFactory, $location, $window) {

    $scope.sideNavOffCanvas = sideNavFactory.sideNavOffCanvas;

    $scope.toggleOffCanvasSideNav = function () {
        $scope.sideNavOffCanvas.hidden = !$scope.sideNavOffCanvas.hidden;
    };


    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

        $rootScope.previousState = fromState.name;
        $rootScope.currentState = toState.name;
        console.log('Previous state:' + $rootScope.previousState);
        console.log('Current state:' + $rootScope.currentState);


        $scope.sideNavOffCanvas.hidden = true;


        if (toState.name === 'results') {

            $timeout(function () {

                //console.log('priming responsive navbar');

                var navbar = angular.element(document.getElementsByClassName('navbar-fixed-top'));
                var innercontainer = angular.element(document.getElementsByClassName('inner-container'));
                var sideBarContainer = angular.element(document.getElementsByClassName('sidebar-container'));

                var lastScrollTop = 0,
                    st,
                    scrollBarHidden = false;

                var scrollingUpTest = function () {

                    st = innercontainer.scrollTop();

                    if (st > lastScrollTop) {
                        lastScrollTop = st;
                        return false;
                    } else {
                        lastScrollTop = st;
                        return true;
                    }
                };

                innercontainer.on('scroll', function () {
                    var scrollingUp = scrollingUpTest();
                    var yScroll = innercontainer.scrollTop();

                    if (scrollBarHidden && scrollingUp) {
                        navbar.removeClass('hide-navbar');
                        sideBarContainer.removeClass('sidebar-container-roll-up');
                        scrollBarHidden = false;
                        //console.log('ACTION: Showing navbar!');

                    } else if (yScroll >= 50 && !scrollBarHidden && !scrollingUp) {
                        navbar.addClass('hide-navbar');
                        sideBarContainer.addClass('sidebar-container-roll-up');
                        scrollBarHidden = true;
                        //console.log('ACTION: Hiding navbar!');
                    }
                });

            }, 250);

        } else {

            var navbar = angular.element(document.getElementsByClassName('navbar-fixed-top'));
            var sideBarContainer = angular.element(document.getElementsByClassName('sidebar-container'));

            navbar.removeClass('hide-navbar');
            sideBarContainer.removeClass('sidebar-container-roll-up');
        }


    });


    $scope.userObj = Session.userObj;



    if ($scope.userObj.user_settings.loggedIn) {

        Session.getUserFromServer().then(function (response) {

            //console.log('pass this to create to update to update userObj and html5 storage', response);

            Session.create(response);

        });

    }


    $scope.$watch('userObj.user_settings.loggedIn', function(newValue, oldValue) {
        if(newValue){
            socketio.init(Session.userObj.user_settings.name);
            myPostsFactory.getAllUserPosts(Session.userObj.user_settings.name).then(function(response){

                for(var i = 0; i < myPostsFactory.userPosts.data.length; i++){

                    var post = myPostsFactory.userPosts.data[i];

                    socketio.joinPostingRoom(post.postingId, 'postingOwner'); //Join the room of each posting the user owns.

                }

            });


            _.each(favesFactory.currentFavorites, function(favorite) {
                socketio.joinPostingRoom(favorite.postingId, 'inWatchList');
            });



        } else {
            if(socketio.cachedUsername) { //if the user was previously logged in they will have this value so we must cleanup.
                socketio.closeAllConnections();


                if(myPostsFactory.userPosts.data.length) {

                    for(var i = 0; i < myPostsFactory.userPosts.data.length; i++) {

                        var post = myPostsFactory.userPosts.data[i];

                        socketio.leavePostingRoom(post.postingId, 'postingOwner');
                    }
                }


                _.each(favesFactory.currentFavorites, function(favorite) {
                    socketio.leavePostingRoom(favorite.postingId, 'inWatchList');
                });

            }
        }
    }, true);

}]);