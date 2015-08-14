/**
 * Created by braddavis on 1/25/15.
 */
htsApp.factory('socketio', ['ENV', 'myPostsFactory', 'Notification', 'favesFactory', 'feedFactory', function (ENV, myPostsFactory, Notification, favesFactory, feedFactory) {

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


    socketio.joinLocationRoom = function(metroCode, callback) {

        console.log(socketio.cachedUsername + ' is joining ' + metroCode + '\'s room: ');

        socketio.postingSocket.emit('join-room', {
            username : socketio.cachedUsername,
            roomId : metroCode
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



    socketio.leaveLocationRoom = function (metroCode, callback) {

        console.log('leaving metro code room: ' + metroCode);

        socketio.userSocket.emit('leave-room', metroCode);

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

        Notification.primary({title: 'New message from @' + pm.username, message: pm.message, delay: 10000});  //Send the webtoast
    });


    // listen for meeting requests
    socketio.postingSocket.on('make-offer', function (emit) {

        console.log('emitted make-offer request', emit);

        //TODO: Need the offer object to include the sellers username
        if(emit.username === socketio.cachedUsername) { //If currently logged in user is the user who caused the emit then inform them the their meeting request is sent

            favesFactory.checkFave(emit.posting, function (favorited) {

                if(favorited){ //The user sending the meeting request already has the item in their watchlist

                    favesFactory.updateFavorite(emit, function(){

                        var url = '"/watchlist/meetings/' + emit.posting.postingId + '"';

                        Notification.primary({
                            title: '<a href=' + url + '>Offer Sent!</a>',
                            message: '<a href=' + url + '>This watchlist item has been updated. You\'ll be notified when the seller responds.</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });

                } else { //The user sending the meeting request does not have this item in their watchlist.

                    favesFactory.addFave(emit.posting, function(){

                        var url = '"/watchlist/meetings/' + emit.posting.postingId + '"';

                        Notification.primary({
                            title: '<a href=' + url + '>Offer Sent!</a>',
                            message: '<a href=' + url + '>This item has been added to your watchlist. You\'ll be notified when the seller responds.</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });

                }

            });



        } else if(emit.posting.username === socketio.cachedUsername) { //If the currently logged in user owns the item the meeting request was placed on

            //Update owners meeting request and notify them.
            myPostsFactory.getAllUserPosts(socketio.cachedUsername).then(function (response) { //Have the owner lookup all their items they're selling and the associated questions, meeting requests, etc etc.  The owner app view updates realtime.

                var url = '"/myposts/meetings/' + emit.posting.postingId + '"';

                Notification.primary({
                    title: '<a href=' + url + '>New Offer</a>',
                    message: '<a href=' + url + '>@' + emit.username + ' has placed an offer on your item!</a>',
                    delay: 10000
                });  //Send the webtoast

            });

        } else { //update all the users who have the item in their wishlist

            favesFactory.updateFavorite(emit, function(){

                var url = '"/wishlist/meetings/' + emit.posting.postingId + '"';

                Notification.primary({
                    title: '<a href=' + url + '>'+  emit.posting.heading +' may go fast!</a>',
                    message: '<a href=' + url + '>Just letting you know other people are interested in an item you\'re watching. *wink *wink</a>',
                    delay: 10000
                });  //Send the webtoast

            });

        }

        console.log(
            '%s has placed an offer %s regarding postingId: "%s"',
            emit.username,
            emit.proposals,
            emit.posting.postingId
        );
    });




    // listen for meeting requests
    socketio.postingSocket.on('update-offer', function (emit) {

        console.log('emitted update-offer request', emit);

        if(!emit.offer.proposals[emit.offer.proposals.length - 1].acceptedAt) {

            //TODO: Need the offer object to include the sellers username
            if (emit.username === socketio.cachedUsername) { //If currently logged in user is the user who caused the emit then inform them the their meeting request is sent

                favesFactory.checkFave(emit.posting, function (favorited) {

                    if (favorited) { //The user sending the meeting request already has the item in their watchlist

                        if (emit.offer.proposals[emit.offer.proposals.length - 1].isOwnerReply) {

                            favesFactory.updateFavorite(emit, function () {

                                var url = '"/watchlist/meetings/' + emit.posting.postingId + '"';

                                Notification.primary({
                                    title: '<a href=' + url + '>Counter Offer Received</a>',
                                    message: '<a href=' + url + '>The seller has responded with a counter offer</a>',
                                    delay: 10000
                                });  //Send the webtoast

                            });

                        } else {

                            favesFactory.updateFavorite(emit, function () {

                                var url = '"/watchlist/meetings/' + emit.posting.postingId + '"';

                                Notification.primary({
                                    title: '<a href=' + url + '>Counter Offer Sent!</a>',
                                    message: '<a href=' + url + '>This watchlist item has been updated. You\'ll be notified when the seller responds.</a>',
                                    delay: 10000
                                });  //Send the webtoast

                            });
                        }

                    } else { //The user sending the meeting request does not have this item in their watchlist.

                        favesFactory.addFave(emit.posting, function () {

                            var url = '"/watchlist/meetings/' + emit.posting.postingId + '"';

                            Notification.primary({
                                title: '<a href=' + url + '>Counter Offer Sent!</a>',
                                message: '<a href=' + url + '>This item has been added to your watchlist. You\'ll be notified when the seller responds.</a>',
                                delay: 10000
                            });  //Send the webtoast

                        });

                    }

                });


            } else if (emit.posting.username === socketio.cachedUsername) { //If the currently logged in user owns the item the meeting request was placed on


                if (emit.offer.proposals[emit.offer.proposals.length - 1].isOwnerReply) {

                    //Update owners meeting request and notify them.
                    myPostsFactory.getAllUserPosts(socketio.cachedUsername).then(function (response) { //Have the owner lookup all their items they're selling and the associated questions, meeting requests, etc etc.  The owner app view updates realtime.

                        var url = '"/myposts/meetings/' + emit.posting.postingId + '"';

                        Notification.primary({
                            title: '<a href=' + url + '>Counter Offer Sent</a>',
                            message: '<a href=' + url + '>You\'ll be notified when the buyer responds.</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });

                } else {

                    //Update owners meeting request and notify them.
                    myPostsFactory.getAllUserPosts(socketio.cachedUsername).then(function (response) { //Have the owner lookup all their items they're selling and the associated questions, meeting requests, etc etc.  The owner app view updates realtime.

                        var url = '"/myposts/meetings/' + emit.posting.postingId + '"';

                        Notification.primary({
                            title: '<a href=' + url + '>Counter Offer Received</a>',
                            message: '<a href=' + url + '>@' + emit.username + ' has updated their offer.</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });
                }

            }

            console.log(
                '%s sent a counter offer %s regarding postingId: "%s"',
                emit.username,
                emit.proposals,
                emit.posting.postingId
            );
        }
    });




    // listen for questions
    socketio.postingSocket.on('question', function (emit) {

        console.log('emitted question', emit);

        if(emit.username === socketio.cachedUsername) { //If currently logged in user is the user who caused the emit then inform them their message will be sent


            favesFactory.checkFave(emit.posting, function (favorited) {

                if(favorited){ //This user asking the question already has the item in their watchlist

                    favesFactory.updateFavorite(emit, function(){

                        var url = '"/watchlist/questions/' + emit.posting.postingId + '"';

                        Notification.primary({
                            title: '<a href=' + url + '>Question Sent!</a>',
                            message: '<a href=' + url + '>This watchlist item has been updated. You\'ll be notified when the seller responds.</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });

                } else { //The user asking the question does not have this item in their watchlist.

                    favesFactory.addFave(emit.posting, function(){

                        var url = '"/watchlist/questions/' + emit.posting.postingId + '"';

                        Notification.primary({
                            title: '<a href=' + url + '>Question Sent!</a>',
                            message: '<a href=' + url + '>This item has been added to your watchlist. You\'ll be notified when the seller responds.</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });

                }

            });


        } else if (emit.posting.username === socketio.cachedUsername) { //if currently logged in users owns the posting the emitted question relates to

            //Update owners questions and notify them
            myPostsFactory.getAllUserPosts(socketio.cachedUsername).then(function (response) { //Have the owner lookup all their items they're selling and the associated questions, meeting requests, etc etc.  The owner app view updates realtime.

                var url = '"/myposts/questions/' + emit.question.postingId + '"';

                Notification.primary({
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

        if(emit.username === socketio.cachedUsername){ //If the user who asked this question is logged in then notify them


            favesFactory.updateFavorite(emit, function(){

                var url =  '"/watchlist/questions/' + emit.posting.postingId + '"';
                Notification.primary({title: '<a href=' + url + '>Question has been answered</a>', message: '<a href=' + url + '>' + emit.answer.value + '</a>', delay: 10000});  //Send the webtoast

            });

        } else if (emit.username !== emit.posting.username){ //if the owner of the posting is not the same person who asked the question (aka all the other people with this item in their watchlist). then update.

            favesFactory.updateFavorite(emit, function(){

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
        console.log('emitted meeting acceptance', emit);


        if(emit.offer.proposals[emit.offer.proposals.length - 1].isOwnerReply) {

            if (emit.username === socketio.cachedUsername) { //if currently logged in same user who placed the accepted meeting request

                favesFactory.updateFavorite(emit, function () {
                    console.log('silently updated watchlist');
                });

                //TODO: open posting in splash screen.
                var url = '"/watchlist/meetings/' + emit.posting.postingId + '"';

                Notification.primary({
                    title: '<a href=' + url + '>@' + emit.posting.username + ' accepted your offer.</a>',
                    message: '<a href=' + url + '>Congrats! The seller has accepted your offer.  We\'ll send you a reminder email your way.</a>',
                    delay: 10000
                });  //Send the webtoast

            } else if (emit.username !== emit.posting.username) { //if the owner of the posting is not the same person who accepted the offer then update.

                //Update owners my posts and notify them
                myPostsFactory.getAllUserPosts(socketio.cachedUsername).then(function (response) { //Have the owner lookup all their items they're selling and the associated questions, meeting requests, etc etc.  The owner app view updates realtime.


                });

            }
            console.log(
                'OWNER accepted meeting request on postingId %s',
                emit.posting.username,
                emit.posting.postingId
            );

        } else {

            if (emit.username === socketio.cachedUsername) { //if currently logged in same user who placed the accepted meeting request

                favesFactory.updateFavorite(emit, function () {
                    console.log('silently updated watchlist');
                });

                //TODO: open posting in splash screen.
                //var url = '"/watchlist/meetings/' + emit.posting.postingId + '"';
                //
                //Notification.primary({
                //    title: '<a href=' + url + '>@' + emit.posting.username + ' accepted your offer.</a>',
                //    message: '<a href=' + url + '>Congrats! Your meeting request has been accepted.  We\'ll send you a reminder email you way.</a>',
                //    delay: 10000
                //});  //Send the webtoast

                //alert("I'm the buyer");

            } else if (emit.username !== emit.posting.username) { //if the owner of the posting is not the same person who accepted the offer then update.

                //Update owners my posts and notify them
                myPostsFactory.getAllUserPosts(socketio.cachedUsername).then(function (response) { //Have the owner lookup all their items they're selling and the associated questions, meeting requests, etc etc.  The owner app view updates realtime.

                    var url = '"/myposts/meetings/' + emit.posting.postingId + '"';

                    Notification.primary({
                        title: '<a href=' + url + '>@' + emit.username + ' accepted your offer.</a>',
                        message: '<a href=' + url + '>Congrats! The buyer has accepted your offer.  We\'ll send you a reminder email your way.</a>',
                        delay: 10000
                    });  //Send the webtoast

                });

                //alert("I'm the owner");

            }
            console.log(
                'OWNER accepted meeting request on postingId %s',
                emit.posting.username,
                emit.posting.postingId
            );
        }

    });


    socketio.postingSocket.on('decline-offer', function (emit) {

        if(emit.username === socketio.cachedUsername) { //If currently logged in user is the user who caused the emit then inform them the their meeting request is sent

            favesFactory.checkFave(emit.posting, function (favorited) {

                if(favorited){ //The user sending the meeting request already has the item in their watchlist

                    favesFactory.updateFavorite(emit, function(){

                        var url = '"/watchlist/meetings/' + emit.posting.postingId + '"';

                        Notification.primary({
                            title: '<a href=' + url + '>Offer Cancelled!</a>',
                            message: '<a href=' + url + '>The seller has been notified</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });

                }

            });



        } else if(emit.posting.username === socketio.cachedUsername) { //If the currently logged in user owns the item the meeting request was placed on

            //Update owners meeting request and notify them.
            myPostsFactory.getAllUserPosts(socketio.cachedUsername).then(function (response) { //Have the owner lookup all their items they're selling and the associated questions, meeting requests, etc etc.  The owner app view updates realtime.

                var url = '"/myposts/meetings/' + emit.posting.postingId + '"';

                Notification.primary({
                    title: '<a href=' + url + '>Offer Cancelled</a>',
                    message: '<a href=' + url + '>@' + emit.username + ' Had tocancel their offer.</a>',
                    delay: 10000
                });  //Send the webtoast

            });

        } else { //update all the users who have the item in their wishlist

            favesFactory.updateFavorite(emit, function(){

            });

        }

        console.log(
            '%s cancelled %s regarding postingId: "%s"',
            emit.username,
            emit.proposals,
            emit.posting.postingId
        );
    });


    socketio.postingSocket.on('delete-question', function (emit) {

        if(emit.username === socketio.cachedUsername) { //If currently logged in user is the user who caused the emit then inform them their message will be sent


            favesFactory.checkFave(emit.posting, function (favorited) {

                if(favorited){ //This user asking the question already has the item in their watchlist

                    favesFactory.updateFavorite(emit, function(){

                    });

                }

            });


        } else if (emit.posting.username === socketio.cachedUsername) { //if currently logged in users owns the posting the emitted question relates to

            //Update owners questions and notify them
            myPostsFactory.getAllUserPosts(socketio.cachedUsername).then(function (response) { //Have the owner lookup all their items they're selling and the associated questions, meeting requests, etc etc.  The owner app view updates realtime.

            });


        } else {  //This user is ALSO watching the same item but did not ask the question itself and does the own the item they are watching.. THEREFORE, silently update their watchlist.

            favesFactory.updateFavorite(emit, function(){
                console.log('silently updated watchlist');
            });
        }

    });


    socketio.postingSocket.on('posting', function (emit) {
        feedFactory.updateFeed(emit);
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