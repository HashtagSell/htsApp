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

    }
};










exports.meetingAccepted = {

    //Send an email to the potential buyer with meeting location and big button linking to online payment.
    //Send an email to the seller with information about the buyer and a big button linking to online review.
    instantReminder: function (req, res) {

        //This is the object that realtime-svc emitted to client.
        var offerObj = req.body.acceptedOffer;

        async.waterfall([

            function(done) {
                //Search our users collection by the username to get the buyers email address
                User.findOne({ 'user_settings.name': offerObj.username }, function (err, buyerUserObj) {

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
                User.findOne({ 'user_settings.name': offerObj.posting.username }, function (err, sellerUserObj) {

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
                    offerObj: offerObj,
                    buyerUserObj: buyerUserObj,
                    sellerUserObj: sellerUserObj,
                    buttons: {
                        payment: {
                            url : env.hts.appURL + '/payment/' + offerObj.posting.postingId + '/' + offerObj.offerId
                        },
                        review: {
                            buyerReviewUrl: env.hts.appURL + '/review/' + offerObj.posting.postingId + '/' + offerObj.offerId + '/' + buyerUserObj._id
                        }
                    }
                };


                //Get the ejs template for feedback email
                var instant_reminder_seller_template = fs.readFileSync(__dirname + '/../config/mailer/email_templates/instant_reminder_seller.ejs', "utf8");
                var instant_reminder_buyer_template = fs.readFileSync(__dirname + '/../config/mailer/email_templates/instant_reminder_buyer.ejs', "utf8");

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