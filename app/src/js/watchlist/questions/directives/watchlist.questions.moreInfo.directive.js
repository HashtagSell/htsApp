/**
 * Created by braddavis on 4/1/15.
 */
htsApp.directive("senderQuestionsMoreInfo", function() {
    return {
        restrict: "E",
        scope: { post: '=' },
        templateUrl: "js/watchlist/questions/partials/watchlist.questions.html",
        controller: "watchlist.questions.controller"
    };
});