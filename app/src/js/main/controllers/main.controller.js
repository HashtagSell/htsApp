/**
 * Created by braddavis on 1/24/15.
 */
htsApp.controller('mainController', ['$scope', '$rootScope', 'sideNavFactory', '$timeout', 'Session', 'socketio', 'myPostsFactory', 'favesFactory', 'metaFactory', '$window', function ($scope, $rootScope, sideNavFactory, $timeout, Session, socketio, myPostsFactory, favesFactory, metaFactory, $window) {

    $scope.userObj = Session.userObj;

    $scope.sideNav = sideNavFactory.sideNav;

    //toggles sideNav left/right
    $scope.toggleOffCanvasSideNav = function () {
        $scope.sideNav.hidden = !$scope.sideNav.hidden;
    };


    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

        $rootScope.previousState = fromState.name || 'feed';
        $rootScope.currentState = toState.name;

        $rootScope.toParams = toParams;
        $rootScope.fromParams = fromParams;

        $rootScope.event = event;

        console.log("============= State Change Start ==============");
        console.log('State change event', $rootScope.event);
        console.log('Previous state:' + $rootScope.previousState, 'Params', $rootScope.fromParams);
        console.log('Current state:' + $rootScope.currentState, 'Params', $rootScope.toParams);
        console.log("============= State Change Done ==============");

        $timeout(function () {
            metaFactory.metatags.facebook.url = $window.location.href;
        }, 50);


        //Update the sidenav
        sideNavFactory.updateSideNav(toState);
        sideNavFactory.settingsMenu[0].link = $rootScope.previousState;


        if($rootScope.currentState !== 'feed.splash' && $rootScope.currentState !== 'results.splash' && $rootScope.currentState !== 'signup' && $rootScope.currentState !== 'signin' && $rootScope.currentState !== 'forgot') {
            if ($rootScope.currentState === 'feed') {
                $scope.sideNav.listView = true;
            } else {
                $scope.sideNav.listView = false;
            }
        }

        //Hide the side navigation after user clicks a link
        $scope.sideNav.hidden = true;


        //if (toState.name === 'results' || 'feed') {
        //
        //    $timeout(function () {
        //
        //        //console.log('priming responsive navbar');
        //
        //        var navbar = angular.element(document.getElementsByClassName('navbar-fixed-top'));
        //        var innercontainer = angular.element(document.getElementsByClassName('inner-container'));
        //        var sideBarContainer = angular.element(document.getElementsByClassName('sidebar-container'));
        //
        //        var lastScrollTop = 0,
        //            st,
        //            scrollBarHidden = false;
        //
        //        var scrollingUpTest = function () {
        //
        //            st = innercontainer.scrollTop();
        //
        //            if (st > lastScrollTop) {
        //                lastScrollTop = st;
        //                return false;
        //            } else {
        //                lastScrollTop = st;
        //                return true;
        //            }
        //        };
        //
        //        innercontainer.on('scroll', function () {
        //            var scrollingUp = scrollingUpTest();
        //            var yScroll = innercontainer.scrollTop();
        //
        //            if (scrollBarHidden && scrollingUp) {
        //                navbar.removeClass('hide-navbar');
        //
        //                if(toState.name === 'results') {
        //                    sideBarContainer.removeClass('sidebar-container-roll-up');
        //                } else {
        //                    sideBarContainer.removeClass('sidebar-container-list-view-roll-up');
        //                }
        //
        //                scrollBarHidden = false;
        //                //console.log('ACTION: Showing navbar!');
        //
        //            } else if (yScroll >= 50 && !scrollBarHidden && !scrollingUp) {
        //                navbar.addClass('hide-navbar');
        //
        //                if(toState.name === 'results') {
        //                    sideBarContainer.addClass('sidebar-container-roll-up');
        //                } else {
        //                    sideBarContainer.addClass('sidebar-container-list-view-roll-up');
        //                }
        //
        //                scrollBarHidden = true;
        //                //console.log('ACTION: Hiding navbar!');
        //            }
        //        });
        //
        //    }, 250);
        //
        //} else {
        //
        //    var navbar = angular.element(document.getElementsByClassName('navbar-fixed-top'));
        //    var sideBarContainer = angular.element(document.getElementsByClassName('sidebar-container'));
        //
        //    navbar.removeClass('hide-navbar');
        //    sideBarContainer.removeClass('sidebar-container-roll-up');
        //    sideBarContainer.removeClass('sidebar-container-list-view-roll-up');
        //}
    });



    //RUNS ON PAGE LOAD.
    if ($scope.userObj.user_settings.loggedIn) {

        //Connect to Google Analytics... This will fail if app running in dev env.
        try {
            ga('set', '&uid', 'bdavis');
        } catch (err){
            console.log('Google Analytics not running');
        }

        //Fetches user object from server as soon as page loads
        Session.getUserFromServer().then(function (response) {
            Session.create(response);
        });
    }


    //Geolocate the users ip address
    //geoFactory.geolocateUser().then(function (response) {
    //    Session.userLocation = response;
    //
    //    console.log('Session.userLocation is: ', Session.userLocation);
    //
    //});






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

            try {
                ga('set', '&uid', 'bdavis');
            } catch (err){
                console.log('Google Analytics not running');
            }



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