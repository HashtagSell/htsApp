/**
 * Created by braddavis on 4/1/15.
 */
htsApp.directive("ownerMeetingsMoreInfo", function() {
    return {
        restrict: "E",
        scope: { post: '=' },
        templateUrl: "js/myPosts/meetings/partials/myPosts.meetings.html",
        controller: "myPosts.meetings.controller"
    };
});