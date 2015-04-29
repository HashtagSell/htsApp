/**
 * Created by braddavis on 4/28/15.
 */
htsApp.factory('feedbackFactory', function () {
   var factory = {};

    factory.feedback = {
        form: {
            generalFeedback: null,
            visible: false
        }
    };

    return factory;
});