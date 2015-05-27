/**
 * Created by braddavis on 4/1/15.
 */
htsApp.directive("senderMeetingsMoreInfo", function() {
    return {
        restrict: "E",
        scope: { post: '=' },
        templateUrl: "js/watchlist/meetings/partials/watchlist.meetings.html",
        controller: "watchlist.meetings.controller"
    };
});