/**
 * Created by braddavis on 5/5/15.
 */
var feedbackModel = require("../config/database/models/feedback.js");
var User = require("../config/database/models/user.js");

//Nodemail used to send email via Amazon SES
var mailer = require('../config/mailer/ses.js');

// used to read in email template files
var fs = require("fs");

// used to compile the email templates
var ejs = require('ejs');


var async = require("async");


exports.submit = function(req, res){

    async.waterfall([

        function(done) {

            //Search our users collection by the username and update their user_settings object
            User.findOne({ '_id': req.user._id }, function (err, user) {

                //systematic error. Redirect to page so user can report error.
                if (err) {
                    console.log("error");
                    done(err);

                    // if no user is found, then this is a bad activation id
                } else if (!user) {

                    done("user name not found");

                    // found user that provided feedback
                } else if (user) {
                    done(null, user);
                }
            });
        },

        function(user, done) {
            var feedback = new feedbackModel();

            feedback.user = req.body.form.user;
            feedback.generalFeedback = req.body.form.generalFeedback;


            feedback.save(function(err) {
                if (err) {
                    done("Could not store your feedback in database.  Wowzers.  We're working on this.");
                } else {
                    done(null, user, feedback);
                }
            });
        },

        function (user, feedback, done) {
            //Get the ejs template for feedback email
            var feedback_template = fs.readFileSync(__dirname + '/../config/mailer/email_templates/feedback_email_template.ejs', "utf8");

            //Variables for EJS to inject into template
            var emailObj = {
                user: {
                    name: user.user_settings.name,
                    email: user.local.email,
                    feedback: feedback.generalFeedback
                },
                images: {
                    fb_logo: "http://static.hashtagsell.com/logos/facebook/png/FB-f-Logo__white_50.png",
                    twitter_logo: "http://static.hashtagsell.com/logos/twitter/Twitter_logo_white.png",
                    hts_logo: "https://static.hashtagsell.com/logos/hts/HashtagSell_Logo_Home.png"
                }
            };

            //Merge the template
            var compiled_html = ejs.render(feedback_template, emailObj);

            //Setup plain text email in case user cannot view Rich text emails
            var plain_text = "Thanks for taking the time to provide feedback.  We may write back if we have further questions about your comments.  Sincerely, - HashtagSell Team";

            done(null, user, feedback, compiled_html, plain_text);
        },

        function (user, feedback, compiled_html, plain_text, done) {

            //Build the email message
            var userEmail = {
                from: "HashtagSell Feedback <feedback@hashtagsell.com>",
                to: user.local.email,
                subject: "Thanks for your feedback",
                html: compiled_html,
                text: plain_text
            };

            // Send Registration Email
            mailer.sendMail(userEmail, function(err, info){
                if(err){
                    done(err);
                }else{
                    console.log(info);
                    done(null, user, feedback);
                }
            });
        },

        function (user, feedback, done) {

            console.log(feedback);

            //Build the email message
            var teamEmail = {
                from: "HashtagSell Feedback <feedback@hashtagsell.com>",
                to: "feedback@hashtagsell.com",
                replyTo: user.local.email,
                subject: "Thanks for your feedback",
                text: "User to email back: " + user.local.email + "\r\nUsername: " + user.user_settings.name + "\r\n\r\nFeedback: " + feedback.generalFeedback
            };

            // Send Registration Email
            mailer.sendMail(teamEmail, function(err, info){
                if(err){
                    done(err);
                }else{
                    console.log(info);
                    done(null, 'done');
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
};