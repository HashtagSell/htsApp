/**
 * Created by braddavis on 5/9/15.
 */
/**
 * Created by braddavis on 5/6/15.
 */
//Get the user model
var User = require("../config/database/models/user.js");

//Nodemail used to send email via Amazon SES
var mailer = require('../config/mailer/ses.js');

// used to read in email template files
var fs = require("fs");

// used to compile the email templates
var ejs = require('ejs');

// import sync library for waterfall.
var async = require("async");

var User = require("../config/database/models/user.js");

var moment = require('moment');

var common   = require('../config/common.js');
var env  = common.config();





exports.meetingProposed = {

    //Send an email to the seller with information about the buyer and a big button to accept the proposed meeting time
    instantReminder: function (req, res) {
        var proposedMeeting = req.body.proposedMeeting;

        async.waterfall([

            function(done) {
                //Search our users collection by the username to get the sellers email address
                User.findOne({ 'user_settings.name': proposedMeeting.post.username }, function (err, sellerUserObj) {

                    //systematic error. Redirect to page so user can report error.
                    if (err) {
                        console.log("error");
                        done(err);

                        // if no user is found, then this is a bad activation id
                    } else if (!sellerUserObj) {
                        var err = "seller account could not be found";
                        done(err);

                        // found user that provided feedback
                    } else if (sellerUserObj) {
                        done(null, sellerUserObj);
                    }
                });
            },

            function (sellerUserObj, done) {

                var emailObj = {
                    images: {
                        fb_logo: "http://static.hashtagsell.com/logos/facebook/png/FB-f-Logo__white_50.png",
                        twitter_logo: "http://static.hashtagsell.com/logos/twitter/Twitter_logo_white.png",
                        hts_logo: "https://static.hashtagsell.com/logos/hts/HashtagSell_Logo_Home.png"
                    },
                    meetingRequest: proposedMeeting.offer,
                    post: proposedMeeting.post,
                    sellerUserObj: sellerUserObj,
                    meetingUrl : env.hts.appURL + '/myposts/meetings/' + proposedMeeting.post.postingId
                };


                //Get the ejs template for feedback email
                var instant_reminder_seller_template = fs.readFileSync(__dirname + '/../config/mailer/email_templates/notify_seller_meeting_request.ejs', "utf8");

                //Merge the template
                var compiled_html_seller = ejs.render(instant_reminder_seller_template, {emailObj: emailObj, moment: moment});

                //Setup plain text email in case user cannot view Rich text emails
                var plain_text_seller = "Another user would like to meet to see your item.  Please visit: " + emailObj.meetingUrl;

                done(null, sellerUserObj, compiled_html_seller, plain_text_seller);
            },

            function (sellerUserObj, compiled_html_seller, plain_text_seller, done) {

                //Build the seller email message
                var sellerInstantReminder = {
                    from: "HashtagSell <no-reply@hashtagsell.com>",
                    to: sellerUserObj.local.email,
                    subject: "You have an interested buyer!",
                    html: compiled_html_seller,
                    text: plain_text_seller
                };

                // Send seller instant reminder Email
                mailer.sendMail(sellerInstantReminder, function(err, info){
                    if(err){
                        done(err);
                    }else{
                        console.log(info);
                        done(null);
                    }
                });
            }

        ], function(err) {
            if (err) {
                res.json({error: err});
            } else {
                res.json({success: true});
            }
        });
    }
};


exports.meetingUpdated = {

    //Send an email to the seller with information about the buyer and a big button to accept the proposed meeting time
    instantReminder: function (req, res) {
        var updatedMeeting = req.body.updatedMeeting;

        async.waterfall([

            function(done) {
                //Search our users collection by the username to get the sellers email address
                User.findOne({ 'user_settings.name': updatedMeeting.user.email }, function (err, userToNotify) {

                    //systematic error. Redirect to page so user can report error.
                    if (err) {
                        console.log("error");
                        done(err);

                        // if no user is found, then this is a bad activation id
                    } else if (!userToNotify) {
                        var err = "account email could not be found";
                        done(err);

                        // found user that provided feedback
                    } else if (userToNotify) {
                        done(null, userToNotify);
                    }
                });
            },

            function (userToNotify, done) {

                var emailObj = {
                    images: {
                        fb_logo: "http://static.hashtagsell.com/logos/facebook/png/FB-f-Logo__white_50.png",
                        twitter_logo: "http://static.hashtagsell.com/logos/twitter/Twitter_logo_white.png",
                        hts_logo: "https://static.hashtagsell.com/logos/hts/HashtagSell_Logo_Home.png"
                    },
                    meetingRequest: updatedMeeting.offer,
                    post: updatedMeeting.post,
                    sellerUserObj: userToNotify,
                };

                if(updatedMeeting.user.notifySeller){
                    emailObj.meetingUrl = env.hts.appURL + '/myposts/meetings/' + updatedMeeting.post.postingId;
                } else {
                    emailObj.meetingUrl = env.hts.appURL + '/watchlist/meetings/' + updatedMeeting.post.postingId;
                }


                //Get the ejs template for feedback email
                var instant_reminder_meeting_update = fs.readFileSync(__dirname + '/../config/mailer/email_templates/notify_user_meeting_updated.ejs', "utf8");

                //Merge the template
                var compiled_html_user = ejs.render(instant_reminder_meeting_update, {emailObj: emailObj, moment: moment});

                //Setup plain text email in case user cannot view Rich text emails
                var plain_text_user = "You have received and updated offer.  Please visit: " + emailObj.meetingUrl;

                done(null, userToNotify, compiled_html_user, plain_text_user);
            },

            function (userToNotify, compiled_html_user, plain_text_user, done) {

                //Build the seller email message
                var userInstantReminder = {
                    from: "HashtagSell <no-reply@hashtagsell.com>",
                    to: userToNotify.local.email,
                    subject: "You have an updated offer!",
                    html: compiled_html_user,
                    text: plain_text_user
                };

                // Send seller instant reminder Email
                mailer.sendMail(userInstantReminder, function(err, info){
                    if(err){
                        done(err);
                    }else{
                        console.log(info);
                        done(null);
                    }
                });
            }

        ], function(err) {
            if (err) {
                res.json({error: err});
            } else {
                res.json({success: true});
            }
        });
    }
};

exports.questionAsked = {
    instantReminder: function (req, res) {
        var questionAsked = req.body.questionAsked;

        async.waterfall([

            function(done) {
                //Search our users collection by the username to get the sellers email address
                User.findOne({ 'user_settings.name': questionAsked.post.username }, function (err, sellerUserObj) {

                    //systematic error. Redirect to page so user can report error.
                    if (err) {
                        console.log("error");
                        done(err);

                        // if no user is found, then this is a bad activation id
                    } else if (!sellerUserObj) {
                        var err = "seller account could not be found";
                        done(err);

                        // found user that provided feedback
                    } else if (sellerUserObj) {
                        done(null, sellerUserObj);
                    }
                });
            },

            function (sellerUserObj, done) {

                var emailObj = {
                    images: {
                        fb_logo: "http://static.hashtagsell.com/logos/facebook/png/FB-f-Logo__white_50.png",
                        twitter_logo: "http://static.hashtagsell.com/logos/twitter/Twitter_logo_white.png",
                        hts_logo: "https://static.hashtagsell.com/logos/hts/HashtagSell_Logo_Home.png"
                    },
                    question: questionAsked.question,
                    post: questionAsked.post,
                    sellerUserObj: sellerUserObj,
                    questionUrl : env.hts.appURL + '/myposts/questions/' + questionAsked.post.postingId
                };


                //Get the ejs template for feedback email
                var instant_reminder_seller_question = fs.readFileSync(__dirname + '/../config/mailer/email_templates/notify_seller_new_question.ejs', "utf8");

                //Merge the template
                var compiled_html_seller = ejs.render(instant_reminder_seller_question, {emailObj: emailObj, moment: moment});

                //Setup plain text email in case user cannot view Rich text emails
                var plain_text_seller = questionAsked.question.username + 'asked a question about your item for sale.' + '-- "' + questionAsked.question.value + '"';

                done(null, sellerUserObj, compiled_html_seller, plain_text_seller);
            },

            function (sellerUserObj, compiled_html_seller, plain_text_seller, done) {

                //Build the seller email message
                var sellerInstantReminder = {
                    from: "HashtagSell <no-reply@hashtagsell.com>",
                    to: sellerUserObj.local.email,
                    subject: "Question on your item for sale",
                    html: compiled_html_seller,
                    text: plain_text_seller
                };

                // Send seller instant reminder Email
                mailer.sendMail(sellerInstantReminder, function(err, info){
                    if(err){
                        done(err);
                    }else{
                        console.log(info);
                        done(null);
                    }
                });
            }

        ], function(err) {
            if (err) {
                res.json({error: err});
            } else {
                res.json({success: true});
            }
        });
    }
};





exports.meetingAccepted = {

    //Send an email to the potential buyer with meeting location and big button linking to online payment.
    //Send an email to the seller with information about the buyer and a big button linking to online review.
    instantReminder: function (req, res) {

        //This is the object that realtime-svc emitted to client.
        var acceptedMeeting = req.body.acceptedMeeting;

        async.waterfall([

            function(done) {
                //Search our users collection by the username to get the buyers email address
                User.findOne({ 'user_settings.name': acceptedMeeting.offer.username }, function (err, buyerUserObj) {

                    //systematic error. Redirect to page so user can report error.
                    if (err) {
                        console.log("error");
                        done(err);

                        // if no user is found, then this is a bad activation id
                    } else if (!buyerUserObj) {
                        var err = "buyer account could not be found";
                        done(err);

                        // found user that provided feedback
                    } else if (buyerUserObj) {
                        done(null, buyerUserObj);
                    }
                });
            },

            function(buyerUserObj, done) {
                //Search our users collection by the username to get the buyers email address
                User.findOne({ 'user_settings.name': acceptedMeeting.post.username }, function (err, sellerUserObj) {

                    //systematic error. Redirect to page so user can report error.
                    if (err) {
                        console.log("error");
                        done(err);

                        // if no user is found, then this is a bad activation id
                    } else if (!sellerUserObj) {
                        var err = "seller account could not be found";
                        done(err);

                        // found user that provided feedback
                    } else if (sellerUserObj) {
                        done(null, buyerUserObj, sellerUserObj);
                    }
                });
            },

            function (buyerUserObj, sellerUserObj, done) {

                var emailObj = {
                    images: {
                        fb_logo: "http://static.hashtagsell.com/logos/facebook/png/FB-f-Logo__white_50.png",
                        twitter_logo: "http://static.hashtagsell.com/logos/twitter/Twitter_logo_white.png",
                        hts_logo: "https://static.hashtagsell.com/logos/hts/HashtagSell_Logo_Home.png"
                    },
                    buyerUserObj: buyerUserObj,
                    sellerUserObj: sellerUserObj,
                    post: acceptedMeeting.post,
                    offer: acceptedMeeting.offer,
                    acceptedProposal: acceptedMeeting.acceptedProposal,
                    buttons: {
                        payment: {
                            url : env.hts.appURL + '/payment/' + acceptedMeeting.offer.postingId + '/' + acceptedMeeting.offer.offerId,
                            venmo: "https://venmo.com/?txn=pay&recipients=" + sellerUserObj.user_settings.merchantAccount.details.funding.email + "&amount=" + acceptedMeeting.acceptedProposal.price.value + "&note=" + acceptedMeeting.post.heading + "&audience=private"
                        },
                        review: {
                            buyerReviewUrl: env.hts.appURL + '/review/' + acceptedMeeting.offer.postingId + '/' + acceptedMeeting.offer.offerId + '/' + buyerUserObj._id
                        }
                    }
                };


                //Get the ejs template for feedback email
                var instant_reminder_seller_template = fs.readFileSync(__dirname + '/../config/mailer/email_templates/accepted_meeting_seller.ejs', "utf8");
                var instant_reminder_buyer_template = fs.readFileSync(__dirname + '/../config/mailer/email_templates/accepted_meeting_buyer.ejs', "utf8");

                //Merge the template
                var compiled_html_seller = ejs.render(instant_reminder_seller_template, {emailObj: emailObj, moment: moment});
                var compiled_html_buyer = ejs.render(instant_reminder_buyer_template, {emailObj: emailObj, moment: moment});

                //Setup plain text email in case user cannot view Rich text emails
                var plain_text_seller = "Plain text email to seller";
                var plain_text_buyer = "Plain text email to buyer";

                done(null, buyerUserObj, sellerUserObj, compiled_html_seller, plain_text_seller, compiled_html_buyer, plain_text_buyer);
            },

            function (buyerUserObj, sellerUserObj, compiled_html_seller, plain_text_seller, compiled_html_buyer, plain_text_buyer, done) {

                //Build the seller email message
                var sellerInstantReminder = {
                    from: "HashtagSell <no-reply@hashtagsell.com>",
                    to: sellerUserObj.local.email,
                    subject: "Meeting Scheduled",
                    html: compiled_html_seller,
                    text: plain_text_seller
                };

                // Send seller instant reminder Email
                mailer.sendMail(sellerInstantReminder, function(err, info){
                    if(err){
                        done(err);
                    }else{
                        console.log(info);
                        done(null, buyerUserObj, compiled_html_buyer, plain_text_buyer);
                    }
                });
            },

            function (buyerUserObj, compiled_html_buyer, plain_text_buyer, done) {

                //Build the buyer email message
                var buyerInstantReminder = {
                    from: "HashtagSell <no-reply@hashtagsell.com>",
                    to: buyerUserObj.local.email,
                    subject: "Meeting Scheduled",
                    html: compiled_html_buyer,
                    text: plain_text_buyer
                };

                // Send buyer instant reminder Email
                mailer.sendMail(buyerInstantReminder, function(err, info){
                    if(err){
                        done(err);
                    }else{
                        console.log(info);
                        done(null);
                    }
                });
            }

        ], function(err) {
            if (err) {
                res.json({error: err});
            } else {
                res.json({success: true});
            }
        });

    }
};





exports.transactionCompleted = function (sellerUsername, buyerUsername, offerId, posting, paymentReceipt) {

    async.waterfall([

        function(done) {
            //Search our users collection by the username to get the buyers email address
            User.findOne({ 'user_settings.name': buyerUsername }, function (err, buyerUserObj) {

                //systematic error. Redirect to page so user can report error.
                if (err) {
                    console.log("error");
                    done(err);

                    // if no user is found, then this is a bad activation id
                } else if (!buyerUserObj) {
                    var err = "buyer account could not be found";
                    done(err);

                    // found user that provided feedback
                } else if (buyerUserObj) {
                    done(null, buyerUserObj);
                }
            });
        },

        function(buyerUserObj, done) {
            //Search our users collection by the username to get the buyers email address
            User.findOne({ 'user_settings.name': sellerUsername }, function (err, sellerUserObj) {

                //systematic error. Redirect to page so user can report error.
                if (err) {
                    console.log("error");
                    done(err);

                    // if no user is found, then this is a bad activation id
                } else if (!sellerUserObj) {
                    var err = "seller account could not be found";
                    done(err);

                    // found user that provided feedback
                } else if (sellerUserObj) {
                    done(null, buyerUserObj, sellerUserObj);
                }
            });
        },

        function (buyerUserObj, sellerUserObj, done) {

            console.log('here is buyeruserobj');
            console.log(buyerUserObj);

            var emailObj = {
                images: {
                    fb_logo: "http://static.hashtagsell.com/logos/facebook/png/FB-f-Logo__white_50.png",
                    twitter_logo: "http://static.hashtagsell.com/logos/twitter/Twitter_logo_white.png",
                    hts_logo: "https://static.hashtagsell.com/logos/hts/HashtagSell_Logo_Home.png"
                },
                offerId: offerId,
                buyerUserObj: buyerUserObj,
                sellerUserObj: sellerUserObj,
                buttons: {
                    review: {
                        buyerReviewUrl: env.hts.appURL + '/review/' + posting.postingId + '/' + offerId + '/' + buyerUserObj._id,
                        sellerReviewUrl: env.hts.appURL + '/review/' + posting.postingId + '/' + offerId + '/' + sellerUserObj._id
                    }
                }
            };


            //Get the ejs template for feedback email
            var transaction_completed_seller_template = fs.readFileSync(__dirname + '/../config/mailer/email_templates/transaction_completed_seller.ejs', "utf8");
            var transaction_completed_buyer_template = fs.readFileSync(__dirname + '/../config/mailer/email_templates/transaction_completed_buyer.ejs', "utf8");

            //Merge the template
            var compiled_html_seller = ejs.render(transaction_completed_seller_template, emailObj);
            var compiled_html_buyer = ejs.render(transaction_completed_buyer_template, emailObj);

            //Setup plain text email in case user cannot view Rich text emails
            var plain_text_seller = "Plain text email to seller";
            var plain_text_buyer = "Plain text email to buyer";

            done(null, buyerUserObj, sellerUserObj, compiled_html_seller, plain_text_seller, compiled_html_buyer, plain_text_buyer);
        },

        function (buyerUserObj, sellerUserObj, compiled_html_seller, plain_text_seller, compiled_html_buyer, plain_text_buyer, done) {

            //Build the seller email message
            var sellerTransactionCompleted = {
                from: "HashtagSell <no-reply@hashtagsell.com>",
                to: sellerUserObj.local.email,
                subject: "You've been paid!",
                html: compiled_html_seller,
                text: plain_text_seller
            };

            // Send seller instant reminder Email
            mailer.sendMail(sellerTransactionCompleted, function(err, info){
                if(err){
                    done(err);
                }else{
                    console.log(info);
                    done(null, buyerUserObj, compiled_html_buyer, plain_text_buyer);
                }
            });
        },

        function (buyerUserObj, compiled_html_buyer, plain_text_buyer, done) {

            //Build the buyer email message
            var buyerTransactionCompleted = {
                from: "HashtagSell <no-reply@hashtagsell.com>",
                to: buyerUserObj.local.email,
                subject: "Payment Receipt",
                html: compiled_html_buyer,
                text: plain_text_buyer
            };

            // Send buyer instant reminder Email
            mailer.sendMail(buyerTransactionCompleted, function(err, info){
                if(err){
                    done(err);
                }else{
                    console.log(info);
                    done(null);
                }
            });
        }

    ], function(err) {
        if (err) {
            //res.json({error: err});
        } else {
            //res.json({success: true});
        }
    });
};