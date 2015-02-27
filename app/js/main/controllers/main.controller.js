/**
 * Created by braddavis on 1/24/15.
 */
htsApp.controller('mainController', ['$scope', 'sideNavFactory', '$timeout', 'Session', 'socketio', function ($scope, sideNavFactory, $timeout, Session, socketio) {

    $scope.sideNavOffCanvas = sideNavFactory.sideNavOffCanvas;

    console.log($scope.sideNavOffCanvas);

    $scope.toggleOffCanvasSideNav = function () {
        $scope.sideNavOffCanvas.hidden = !$scope.sideNavOffCanvas.hidden;
    };

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

        if (toState.name === 'results' || toState.name === 'results.splash') {

            $timeout(function () {

                console.log('priming responsive navbar');

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
                        console.log('ACTION: Showing navbar!');

                    } else if (yScroll >= 50 && !scrollBarHidden && !scrollingUp) {
                        navbar.addClass('hide-navbar');
                        sideBarContainer.addClass('sidebar-container-roll-up');
                        scrollBarHidden = true;
                        console.log('ACTION: Hiding navbar!');
                    }
                });

            }, 200);

        } else {

            $timeout(function () {

                console.log('showing responsive navbar');

                var navbar = angular.element(document.getElementsByClassName('navbar-fixed-top'));
                var sideBarContainer = angular.element(document.getElementsByClassName('sidebar-container'));

                navbar.removeClass('hide-navbar');
                sideBarContainer.removeClass('sidebar-container-roll-up');
            }, 200);

        }

    });

    $scope.userObj = Session.userObj;

    $scope.$watch('userObj.user_settings.loggedIn', function(newValue, oldValue) {
        if(newValue){
            socketio.init();
        } else {
            socketio.closeAllConnections();
        }
    }, true);

}]);