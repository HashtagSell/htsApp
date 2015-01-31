/**
 * Created by braddavis on 1/25/15.
 */
htsApp.factory('socketio', ['sellingFactory', function (sellingFactory) {

    var socketio = {
        socket: io('https://stage-realtime.hashtagsell.com/postings'),
        postings: [],
        username: 'anon'
    };





    socketio.init = function () {
        sellingFactory.init().then(function (response) {
            if (response.status === 200) {

                response.data.forEach(function (posting) {
                    socketio.joinRoom(posting.external_id);
                });
            }

        }, function (response) {

            console.log(response);

            //TODO: Use modal service to notify users
            console.log("socket.io could not lookup items for sale");
        });
    };

    socketio.joinRoom = function (postingId) {
        socketio.postings.push(postingId);

        console.log('joining room: ' + postingId);

        socketio.socket.emit('join-room', {
            username : socketio.username,
            roomId : postingId
        });
    };

    // capture any hiccups in the connection and re-init as needed
    socketio.socket.on('reconnect', socketio.init);






    //Leave all rooms when user logs out.
    socketio.closeAllConnections = function () {
        sellingFactory.init().then(function (response) {
            if (response.status === 200) {

                response.data.forEach(function (posting) {
                    socketio.leaveRoom(posting.external_id);
                });
            }

        }, function (response) {

            console.log(response);

            //TODO: Use modal service to notify users
            console.log("socket.io could not lookup items for sale");
        });
    };


    socketio.leaveRoom = function (postingId) {

        console.log('leaving room: ' + postingId);

        socketio.postings.splice(socketio.postings.indexOf(postingId), 1);

        socketio.socket.emit('leave-room', postingId);
    };






    socketio.sendMessage = function (postingId, messageText) {
        socketio.socket.emit('message', {
            message : messageText,
            roomId : postingId
        });
    };

    socketio.updates = {
        messages: []
    };


    socketio.renderMessage = function (message) {
        console.log(
            '%s said "%s" at %s in room %s',
            message.username,
            message.message,
            message.timestamp,
            message.roomId
        );
        socketio.updates.messages.unshift(message);
        console.log('socketfactory sees: ', socketio.updates);
    };




    // listen for messages
    socketio.socket.on('message', socketio.renderMessage);






    //socketio.askSellerQuestion = function (postingId, questionText) {
    //    socketio.socket.emit('askSellerQuestion', {
    //        question : questionText,
    //        roomId : postingId
    //    });
    //};
    //
    //
    //socketio.renderBuyerQuestion = function (question) {
    //    console.log(
    //        '%s asked "%s" at %s in room %s',
    //        question.username,
    //        question.message,
    //        question.timestamp,
    //        question.roomId
    //    );
    //};
    //
    //// listen for messages
    //socketio.socket.on('askSellerQuestion', socketio.renderBuyerQuestion);



    return socketio;
}]);