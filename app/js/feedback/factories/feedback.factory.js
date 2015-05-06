/**
 * Created by braddavis on 4/28/15.
 */
htsApp.factory('feedbackFactory', ['Session', function (Session) {
   var factory = {};

    factory.feedback = {
        form: {
            user: Session.userObj.user_settings.name,
            generalFeedback: null,
            visible: false
        }
    };

    return factory;
}]);