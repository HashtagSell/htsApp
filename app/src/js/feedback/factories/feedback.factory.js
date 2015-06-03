/**
 * Created by braddavis on 4/28/15.
 */
htsApp.factory('feedbackFactory', function () {
   var factory = {};

    factory.feedback = {
        form: {
            user: null,
            generalFeedback: null,
            visible: false
        }
    };

    return factory;
});