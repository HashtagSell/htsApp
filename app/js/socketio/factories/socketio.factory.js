/**
 * Created by braddavis on 1/25/15.
 */
htsApp.factory('socketio', ['ENV', '$http', 'myPostsFactory', 'Notification', 'favesFactory', function (ENV, $http, myPostsFactory, Notification, favesFactory) {

    var socketio = {
        postingSocket: io(ENV.realtimePostingAPI),
        userSocket: io(ENV.realtimeUserAPI),
        postings: [],
        usersViewing: []
    };



    socketio.joinPostingRoom = function (postingId, reason, callback) {

        //reason can be postingOwner, toggleSplash, inWatchList
        var permissionLevel = 0;
        if(reason === "toggleSplash") {
            permissionLevel = 1;
        } else if (reason === "inWatchList") {
            permissionLevel = 2;
        } else if (reason === "postingOwner") {
            permissionLevel = 3;
        }

        var handleRequest = false;

        if(socketio.postings.length) {
            for (var i = 0; i < socketio.postings.length; i++) {

                var previouslyJoinedRoom = socketio.postings[i];

                if (previouslyJoinedRoom.postingId === postingId) { //If the user is requesting to join a room they have already joined
                    if(previouslyJoinedRoom.permissionLevel < permissionLevel){ //If join request has a higher permission level than the room they have already joined
                        socketio.postings.splice(i, 1); //Remove the room with inferior permission from list of rooms user has access too.

                        handleRequest = true;

                        reason = socketio.cachedUsername + ' is joining posting room: ' + postingId + ' because requested permission level ' + permissionLevel + ' is greater than ' + previouslyJoinedRoom.permissionLevel;

                        break;
                    }
                } else { //this requested room to join is unique

                    if(i === socketio.postings.length - 1) { //if we have completed checking all rooms the user is currently subscribed too.

                        handleRequest = true;

                        reason = socketio.cachedUsername + ' is joining posting room: ' + postingId + ' for first time with permission level ' + permissionLevel;
                    }

                }
            }
        } else {//The user is not subscribed to any current posting rooms so add their first one.

            handleRequest = true;

            reason = socketio.cachedUsername + ' is joining posting room: ' + postingId + ' with permission level ' + permissionLevel + ' as their first room ';
        }


        if (handleRequest) {

            socketio.postings.push({'postingId': postingId, 'permissionLevel': permissionLevel});

            socketio.postingSocket.emit('join-room', {
                username: socketio.cachedUsername,
                roomId: postingId
            });

        } else {

            reason = socketio.cachedUsername + ' already joined posting room: ' + postingId + ' with higher permission level than ' + permissionLevel;

        }

        if(callback){
            callback();
        }

    };



    socketio.joinUserRoom = function (userRoomToJoin, visitor, callback) {
        socketio.usersViewing.push(visitor);

        console.log(visitor + ' is joining ' + userRoomToJoin + '\'s room: ');

        socketio.userSocket.emit('join-room', {
            username : visitor,
            roomId : userRoomToJoin
        });

        if(callback){
            callback();
        }
    };



    //Leave all rooms when user logs out.
    socketio.closeAllConnections = function (callback) { //called by main.controller.js

        socketio.leaveUserRoom(socketio.cachedUsername);

        socketio.cachedUsername = null;

        if(callback){
            callback();
        }
    };


    socketio.leavePostingRoom = function (postingId, reason, callback) {

        //reason can be postingOwner, splashToggle, inWatchList
        var permissionLevel = 0;
        if(reason === "toggleSplash") {
            permissionLevel = 1;
        } else if (reason === "inWatchList") {
            permissionLevel = 2;
        } else if (reason === "postingOwner") {
            permissionLevel = 3;
        }

        var handleRequest = false;

        if(socketio.postings.length) {
            for (var i = 0; i < socketio.postings.length; i++) {

                var previouslyJoinedRoom = socketio.postings[i];

                if (previouslyJoinedRoom.postingId === postingId) { //If the user is requesting to leave a room they have already joined
                    if(previouslyJoinedRoom.permissionLevel <= permissionLevel){ //If join request has a higher permission level than the room they have already joined

                        socketio.postings.splice(i, 1); //Remove the room with inferior permission from list of rooms user has access too.

                        handleRequest = true;

                        reason = socketio.cachedUsername + ' is leaving posting room: ' + postingId + ' because requested permission level ' + permissionLevel + ' is greater than or equal to ' + previouslyJoinedRoom.permissionLevel;

                        break;
                    } else {

                        reason = socketio.cachedUsername + ' is NOT leaving posting room: ' + postingId + ' because requested permission level ' + permissionLevel + ' is less than ' + previouslyJoinedRoom.permissionLevel;

                    }
                } else { //the requested room to leave is unique

                    if(i === socketio.postings.length - 1) { //if we have completed checking all rooms the user is currently subscribed too.

                        reason = socketio.cachedUsername + ' is requesting to leave posting room: ' + postingId + ' which they have not joined?';
                    }
                }
            }
        } else {//The user is not subscribed to any current posting rooms so add their first one.

            reason = socketio.cachedUsername + ' is requesting to leave posting room: ' + postingId + ' when they havent joined any rooms?';
        }


        if (handleRequest) {

            socketio.postingSocket.emit('leave-room', postingId);

        }

        if(callback){
            callback();
        }
    };


    socketio.leaveUserRoom = function (username, callback) {

        socketio.usersViewing.splice(socketio.usersViewing.indexOf(username), 1);

        console.log('leaving user room: ' + username);

        socketio.userSocket.emit('leave-room', username);

        if(callback){
            callback();
        }
    };




    socketio.sendMessage = function (recipient, messageText) {
        socketio.userSocket.emit('private-message', {
            message : messageText,
            recipient: recipient,
            username : socketio.cachedUsername
        });
    };



    // listen for messages
    socketio.userSocket.on('private-message', function(pm){

        console.log('emitted private message', pm);

        Notification.success({title: 'New message from @' + pm.username, message: pm.message, delay: 10000});  //Send the webtoast
    });


    // listen for offers
    socketio.postingSocket.on('make-offer', function (emit) {

        console.log('emitted make-offer', emit);

        //TODO: Need the offer object to include the sellers username
        if(emit.username === socketio.cachedUsername) { //If currently logged in user is the user who caused the emit then inform them the their offer is sent

            //favesFactory.addFave(emit.posting, function(){
            //
            //    var url = '"/watchlist/offers/' + emit.posting.postingId + '"';
            //
            //    Notification.success({
            //        title: '<a href=' + url + '>Meeting Request Sent!</a>',
            //        message: '<a href=' + url + '>This item has been added to your watchlist. You\'ll be notified when the seller responds.</a>',
            //        delay: 10000
            //    });  //Send the webtoast
            //
            //});




            favesFactory.checkFave(emit.posting, function (favorited) {

                if(favorited){ //The user sending the offer already has the item in their watchlist

                    favesFactory.updateFavorite(emit, function(){

                        var url = '"/watchlist/offers/' + emit.posting.postingId + '"';

                        Notification.success({
                            title: '<a href=' + url + '>Meeting Request Sent!</a>',
                            message: '<a href=' + url + '>This watchlist item has been updated. You\'ll be notified when the seller responds.</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });

                } else { //The user sending the offer does not have this item in their watchlist.

                    favesFactory.addFave(emit.posting, function(){

                        var url = '"/watchlist/offers/' + emit.posting.postingId + '"';

                        Notification.success({
                            title: '<a href=' + url + '>Meeting Request Sent!</a>',
                            message: '<a href=' + url + '>This item has been added to your watchlist. You\'ll be notified when the seller responds.</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });

                }

            });



        } else if(emit.posting.username === socketio.cachedUsername) { //If the currently logged in user owns the item the offer was placed on

            //Update owners offers and notify them.
            myPostsFactory.getAllUserPosts(socketio.cachedUsername).then(function (response) { //Have the owner lookup all their items they're selling and the associated questions, offers, etc etc.  The owner app view updates realtime.

                var url = '"/myposts/offers/' + emit.posting.postingId + '"';

                Notification.success({
                    title: '<a href=' + url + '>New Offer</a>',
                    message: '<a href=' + url + '>@' + emit.username + ' would like to meet!</a>',
                    delay: 10000
                });  //Send the webtoast

            });

        } else { //update all the users who have the item in their wishlist

            favesFactory.updateFavorite(emit, function(){

                var url = '"//wishlist/offers/' + emit.posting.postingId + '"';

                Notification.success({
                    title: '<a href=' + url + '>Another user placed an offer on an item you\'re watching.</a>',
                    message: '<a href=' + url + '>'+  emit.posting.heading +' may go fast!  We\'re just letting you know!</a>',
                    delay: 10000
                });  //Send the webtoast

            });

        }

        console.log(
            '%s would like to meet %s regarding postingId: "%s"',
            emit.username,
            emit.proposedTimes,
            emit.posting.postingId
        );
    });


    // listen for questions
    socketio.postingSocket.on('question', function (emit) {

        console.log('emitted question', emit);

        if(emit.username === socketio.cachedUsername) { //If currently logged in user is the user who caused the emit then inform them their message will be sent


            favesFactory.checkFave(emit.posting, function (favorited) {

                if(favorited){ //This user asking the question already has the item in their watchlist

                    favesFactory.updateFavorite(emit, function(){

                        var url = '"/watchlist/questions/' + emit.posting.postingId + '"';

                        Notification.success({
                            title: '<a href=' + url + '>Question Sent!</a>',
                            message: '<a href=' + url + '>This watchlist item has been updated. You\'ll be notified when the seller responds.</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });

                } else { //The user asking the question does not have this item in their watchlist.

                    favesFactory.addFave(emit.posting, function(){

                        var url = '"/watchlist/questions/' + emit.posting.postingId + '"';

                        Notification.success({
                            title: '<a href=' + url + '>Question Sent!</a>',
                            message: '<a href=' + url + '>This item has been added to your watchlist. You\'ll be notified when the seller responds.</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });

                }

            });


        } else if (emit.posting.username === socketio.cachedUsername) { //if currently logged in users owns the posting the emitted question relates to

            //Update owners questions and notify them
            myPostsFactory.getAllUserPosts(socketio.cachedUsername).then(function (response) { //Have the owner lookup all their items they're selling and the associated quesiotns, offers, etc etc.  The owner app view updates realtime.

                var url = '"/myposts/questions/' + emit.question.postingId + '"';

                Notification.success({
                    title: '<a href=' + url + '>New Question</a>',
                    message: '<a href=' + url + '>' + emit.question.value + '</a>',
                    delay: 10000
                });  //Send the webtoast

            });


        } else {  //This user is ALSO watching the same item but did not ask the question itself and does the own the item they are watching.. THEREFORE, silently update their watchlist.

            favesFactory.updateFavorite(emit, function(){
                console.log('silently updated watchlist');
            });
        }

        console.log(
            '%s asked a question on postingId %s : "%s"',
            emit.question.username,
            emit.posting.postingId,
            emit.question.value
        );
    });


    // listen for answers
    socketio.postingSocket.on('answer', function (emit) {

        console.log('emitted answer', emit);

        //TODO: Updates qaFactory.questions.store which causes splash to update.

        if(emit.posting.username !== socketio.cachedUsername){


            favesFactory.updateFavorite(emit, function(){

                //TODO: open posting in splash screen.
                var url =  '"/watchlist/questions/' + emit.posting.postingId + '"';
                Notification.success({title: '<a href=' + url + '>Question has been answered</a>', message: '<a href=' + url + '>' + emit.answer.value + '</a>', delay: 10000});  //Send the webtoast

            });

        }

        console.log(
            '%s answered a question on postingId %s : "%s"',
            emit.posting.username,
            emit.posting.postingId,
            emit.answer.value
        );

    });


    socketio.postingSocket.on('accept-offer', function (emit) {
        console.log('emitted offer acceptance', emit);

        if (emit.username === socketio.cachedUsername) { //if currently logged in same user who place the accepted offer

            //TODO: open posting in splash screen.
            var url =  '"/watchlist/offers/' + emit.posting.postingId + '"';

            Notification.success({title: '<a href=' + url + '>@' + emit.posting.username + ' accepted your meeting.</a>', message: '<a href=' + url + '>Please meet at ' + emit.acceptedTime.where + ' on ' + emit.acceptedTime.when + '.  A reminder email will be sent containing the online payment URL.  Sincerely, HashtagSell Team.</a>', delay: 10000});  //Send the webtoast

        }

        console.log(
            '%s accepted offer on postingId %s : "%s"',
            emit.posting.username,
            emit.posting.postingId,
            emit.acceptedTime.when
        );

    });


    // capture any hiccups in the connection and re-init as needed
    socketio.userSocket.on('reconnect', socketio.init);
    socketio.postingSocket.on('reconnect', socketio.init);



    socketio.init = function (username) { //called by main.controller.js
        if(username) {
            socketio.cachedUsername = username;

            var userRoomToJoin = username;
            var visitor = username;

            socketio.joinUserRoom(userRoomToJoin, visitor);
        }
    };


    return socketio;
}]);