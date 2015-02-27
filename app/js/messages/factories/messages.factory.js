/**
 * Created by braddavis on 2/24/15.
 */
htsApp.factory('messagesFactory', ['mailboxFactory', function (mailboxFactory) {

    var factory = {};

    factory.newMessageNotification = function (message) {
        console.log(
            '%s said "%s" at %s in room %s',
            message.username,
            message.message,
            message.timestamp,
            message.recipient
        );
    };

    return factory;
}]);