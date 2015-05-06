var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var signer = require('nodemailer-dkim').signer;
var fs = require("fs");

var common   = require('../../config/common.js');
var config   = common.config();


var transporter = nodemailer.createTransport(sesTransport({
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
}));


transporter.use('stream', require('nodemailer-dkim').signer({
    domainName: 'hashtagsell.com',
    keySelector: 'key1',
    privateKey: fs.readFileSync(__dirname+'/key1.hashtagsell.com.pem')
}));


exports.sendMail = function (opts, callback) {

    // mailing options
    var mailOpts = {
        from: opts.from,
        replyTo: opts.from,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
    };


    // Send mail
    transporter.sendMail(mailOpts, function (error, response) {
        if (error) {
            callback(error, null);
        }else {
            callback(null, response);
        }
        /* console.log('Closing Transport'); */
        transporter.close();
    });

}