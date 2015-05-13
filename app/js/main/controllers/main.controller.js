/**
 * Created by braddavis on 1/24/15.
 */
htsApp.controller('mainController', ['$scope', '$rootScope', 'sideNavFactory', '$timeout', 'Session', 'socketio', 'myPostsFactory', 'favesFactory', function ($scope, $rootScope, sideNavFactory, $timeout, Session, socketio, myPostsFactory, favesFactory) {

    $scope.userObj = Session.userObj;

    $scope.sideNav = sideNavFactory.sideNav;




    $scope.toggleOffCanvasSideNav = function () {
        $scope.sideNav.hidden = !$scope.sideNav.hidden;
    };




    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

        $rootScope.previousState = fromState.name || 'feed';
        $rootScope.currentState = toState.name;
        console.log('Previous state:' + $rootScope.previousState);
        console.log('Current state:' + $rootScope.currentState);


        //Update the sidenav
        sideNavFactory.updateSideNav(toState);
        sideNavFactory.settingsMenu[0].link = $rootScope.previousState;


        if($rootScope.currentState !== 'feed.splash'  && $rootScope.currentState !== 'results.splash') {
            if ($rootScope.currentState === 'feed') {
                $scope.sideNav.listView = true;
            } else if($rootScope.previousState === 'results.splash' || $rootScope.previousState === 'feed.splash') {
                console.log('do nothing');
            } else {
                $scope.sideNav.listView = false;
            }
        }

        //Hide the side navigation after user clicks a link
        $scope.sideNav.hidden = true;


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



    //RUNS ON PAGE LOAD.  Fetches user object from server as soon as page loads
    if ($scope.userObj.user_settings.loggedIn) {

        Session.getUserFromServer().then(function (response) {
            Session.create(response);

        });
    }



    //Joins/Leaves rooms and builds/destroys userobject on login/logout
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