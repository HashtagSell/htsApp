/**
 * Created by braddavis on 1/25/15.
 */
htsApp.factory('socketio', ['sellingFactory', 'ENV', '$http', '$q', 'Session', 'offersFactory', 'qaFactory', 'messagesFactory', function (sellingFactory, ENV, $http, $q, Session, offersFactory, qaFactory, messagesFactory) {

    var socketio = {
        postingSocket: io(ENV.realtimePostingAPI),
        userSocket: io(ENV.realtimeUserAPI),
        postings: [],
        usersViewing: []
    };



    socketio.joinPostingRoom = function (postingId) {
        socketio.postings.push(postingId);

        console.log(Session.userObj.user_settings.name + ' is joining posting room: ' + postingId);

        socketio.postingSocket.emit('join-room', {
            username : Session.userObj.user_settings.name,
            roomId : postingId
        });
    };



    socketio.joinUserRoom = function (ownerUsername, visitor) {
        socketio.usersViewing.push(visitor);

        console.log(visitor + ' is joining ' + ownerUsername + '\'s room: ');

        socketio.userSocket.emit('join-room', {
            username : visitor,
            roomId : ownerUsername
        });
    };



    //Leave all rooms when user logs out.
    socketio.closeAllConnections = function () {

        if(sellingFactory.itemsForSale) {
            sellingFactory.itemsForSale.forEach(function (posting) {
                socketio.leavePostingRoom(posting.postingId);
            });
        }


        socketio.leaveUserRoom(socketio.cachedUsername);

        socketio.cachedUsername = null;
    };


    socketio.leavePostingRoom = function (postingId) {

        console.log('leaving posting room: ' + postingId);

        socketio.postings.splice(socketio.postings.indexOf(postingId), 1);

        socketio.postingSocket.emit('leave-room', postingId);
    };


    socketio.leaveUserRoom = function (username) {

        socketio.usersViewing.splice(socketio.usersViewing.indexOf(username), 1);

        console.log('leaving user room: ' + username);

        socketio.userSocket.emit('leave-room', username);
    };




    socketio.sendMessage = function (recipient, messageText) {
        socketio.userSocket.emit('private-message', {
            message : messageText,
            recipient: recipient,
            username : Session.userObj.user_settings.name
        });
    };



    // listen for messages
    socketio.userSocket.on('private-message', messagesFactory.newMessageNotification);


    // listen for offers
    socketio.postingSocket.on('make-offer', function (offer) {
        //TODO: Need the offer object to include the sellers username
        if (Session.userObj.user_settings.name !== offer.username) {
            offersFactory.newOfferNotification(offer);
        }
    });


    // listen for questions
    socketio.postingSocket.on('question', function (question) {
        //TODO: Need the questions object to include the sellers username
        if (Session.userObj.user_settings.name !== question.username) {
            qaFactory.notifySellerOfNewQuestion(question);
        }
    });


    // listen for answers
    socketio.postingSocket.on('answer', function (answer) {
        console.log(answer);
    });


    // capture any hiccups in the connection and re-init as needed
    socketio.userSocket.on('reconnect', socketio.init);
    socketio.postingSocket.on('reconnect', socketio.init);



    socketio.init = function () {
        if(Session.userObj.user_settings.loggedIn) {
            socketio.cachedUsername = Session.userObj.user_settings.name;

            sellingFactory.getUsersItemsForSale(Session.userObj.user_settings.name).then(function (response) {
                if (response.status === 200) {

                    response.data.results.forEach(function (posting) {
                        socketio.joinPostingRoom(posting.postingId);
                    });
                }

            }, function (response) {

                console.log(response);

                //TODO: Use modal service to notify users
                console.log("socket.io could not lookup items for sale");
            });


            socketio.joinUserRoom(Session.userObj.user_settings.name, Session.userObj.user_settings.name);
        }
    };


    return socketio;
}]);