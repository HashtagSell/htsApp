/**
 * Created by braddavis on 4/1/15.
 */
htsApp.directive("ownerQuestionsMoreInfo", function() {
    return {
        restrict: "E",
        scope: { post: '=' },
        templateUrl: "js/myPosts/questions/partials/myPosts.questions.html",
        controller: "myPosts.questions.controller"
    };
});