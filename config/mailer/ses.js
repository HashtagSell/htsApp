var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var signer = require('nodemailer-dkim').signer;
var fs = require("fs");


var transporter = nodemailer.createTransport(sesTransport({
    accessKeyId: "AKIAJEBBRHS2AU362L4Q",
    secretAccessKey: "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"
}));


transporter.use('stream', require('nodemailer-dkim').signer({
    domainName: 'hashtagsell.com',
    keySelector: 'key1',
    privateKey: fs.readFileSync(__dirname+'/key1.hashtagsell.com.pem')
}));


exports.sendMail = function (opts) {

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
            console.log(error);
        }else {
            /* console.log('Message sent: ' + response.message); */
        }
        /* console.log('Closing Transport'); */
        transporter.close();
    });

}