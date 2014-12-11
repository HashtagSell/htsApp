/**
 * Created by braddavis on 12/10/14.
 */
htsApp.directive('htsFaveToggle', function(){
    return {
        restrict: 'E',
        template: '<button type="button" ng-click="toggleFave(result); $event.stopPropagation();" class="btn btn-default" ng-class="{starHighlighted: favorited, star: !favorited}"><i class="fa fa-star"></i></button>',
        controller: ['$scope', '$element', 'favesFactory', 'Session', 'authModalFactory', function ($scope, $element, favesFactory, Session, authModalFactory) {

            //console.log(Session.userObj);
            //
            if(Session.userObj.user_settings.loggedIn) {
                favesFactory.checkFave($scope.result, function (response) {
                    $scope.favorited = response;
                    console.log($scope.favorited);
                    console.log("done checking");
                });
            }

            $scope.toggleFave = function (item) {
                if(Session.userObj.user_settings.loggedIn) {
                    console.log('favorited status: ', $scope.favorited);
                    console.log(item);
                    if (!$scope.favorited) { //If not already favorited
                        favesFactory.addFave(item, function () {  //Add the favorite and flag as done
                            $scope.favorited = true;
                        });
                    } else { //toggle off favorite
                        favesFactory.removeFave(item, function () {
                            $scope.favorited = false;
                        });
                    }
                } else {

                    authModalFactory.signInModal();

                }
                console.log('bluring element', $element);
                $element[0].childNodes[0].blur();
            };
        }]
    };
});