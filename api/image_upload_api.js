var fs = require('fs');
var AWS = require('aws-sdk');
var common   = require('../config/common.js');
var config   = common.config();
var mongoose = require("mongoose");
var easyimg = require('easyimage');
var async = require('async');
var User = require('../config/database/models/user.js');

AWS.config.region = 'us-west-2';
AWS.config.update({
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
});

exports.postingImage = function(req, res) {

    var numPhotos = Object.keys(req.files).length;

    async.waterfall([

        function(done) {

            var imgsToUpload = [];

            var processPhotos = function (index) {

                if (index < numPhotos){

                    var fileNum = "file["+index+"]";

                    var image = req.files[fileNum];

                    var path = image.path;
                    var name = image.name;
                    var mimetype = image.mimetype;
                    var url = config.aws.s3_static_url + "/posts/" + name;
                    var type = "full";

                    var imgObj = {
                        path: path,
                        name: name,
                        mimetype: mimetype,
                        url: url,
                        type: type,
                        file:name
                    };

                    imgsToUpload[index] = {
                        'full': imgObj
                    };

                    easyimg.info(path).then(
                        function(image) {
                            if(image.width > 253){  //If larger than 253 px wide then create thumbnail
                                var thumb_name = 'thumb_' + name;
                                var thumb_path = 'tmp/' + thumb_name;
                                var thumb_url = config.aws.s3_static_url + "/posts/" + thumb_name;
                                var thumb_mimetype = mimetype;
                                var type = "thumbnail";
                                var thumb_imgObj = {path: thumb_path, name: thumb_name, mimetype: thumb_mimetype, url: thumb_url, type: type, file:name};

                                easyimg.resize({
                                    src: path, dst: 'tmp/thumb_' + name,
                                    width: 253
                                }).then(
                                    function (image) {
                                        console.log('Resized and cropped: ' + image.width + ' x ' + image.height);

                                        imgsToUpload[index].thumbnail = thumb_imgObj;

                                        processPhotos(index + 1);
                                    },
                                    function (err) {
                                        done(err);
                                        processPhotos(index + 1);
                                    }
                                );
                            } else {
                                processPhotos(index + 1);
                            }
                        }, function (err) { //Could not lookup image info
                            processPhotos(index + 1);
                        }
                    );
                } else {
                    done(null, imgsToUpload);
                }
            };

            processPhotos(0);
        },

        function(imgsToUpload, done) {

            var s3 = new AWS.S3();

            var uploadPhotos = function (index) {

                if (index < numPhotos) {

                    var image = imgsToUpload[index];

                    fs.readFile(image.full.path, function (err, file_buffer) {
                        var fullImageParams = {
                            ACL: 'public-read',
                            Bucket: config.aws.s3_static_bucket,
                            Key: "posts/" + image.full.name,
                            Body: file_buffer,
                            ContentType: image.full.mimetype
                        };

                        s3.putObject(fullImageParams, function (err, data) {

                            if (err) {
                                console.log(err);
                                image.full.uploaded = false;
                                done(err);

                            } else {

                                image.full.uploaded = true;

                                if (image.thumbnail) {

                                    fs.readFile(image.thumbnail.path, function (err, file_buffer) {
                                        var thumbnailImageParams = {
                                            ACL: 'public-read',
                                            Bucket: config.aws.s3_static_bucket,
                                            Key: "posts/" + image.thumbnail.name,
                                            Body: file_buffer,
                                            ContentType: image.thumbnail.mimetype
                                        };

                                        s3.putObject(thumbnailImageParams, function (err, data) {

                                            if (err) {
                                                image.thumbnail.uploaded = false;
                                                console.log(err);
                                                done(err);

                                            } else {
                                                image.thumbnail.uploaded = true;
                                                uploadPhotos(index + 1);
                                            }
                                        });

                                    });
                                } else {
                                    uploadPhotos(index + 1);
                                }
                            }
                        });

                    });
                } else {
                    done(null, imgsToUpload);
                }
            };

            uploadPhotos(0);

        },

        function(imgsToUpload, done) {

            var cleanTempDir = function (index) {

                if (index < numPhotos) {

                    var image = imgsToUpload[index];

                    fs.unlink(image.full.path, function (err) {
                        if (err) {
                            console.log(err);
                            image.full.deleted = false;
                            done(err);

                        } else {
                            image.full.deleted = true;

                            if(image.thumbnail) {

                                fs.unlink(image.thumbnail.path, function (err) {
                                    if (err) {
                                        image.thumbnail.deleted = false;
                                        done(err);

                                    } else {
                                        image.thumbnail.deleted = true;
                                        cleanTempDir(index + 1);

                                    }
                                });

                            } else {
                                cleanTempDir(index + 1);
                            }
                        }
                    });

                } else {
                    done(null, imgsToUpload);
                }
            };
            cleanTempDir(0);
        }
    ], function(err, imgsToUpload) {
        if (err) {

            return res.json(
                {
                    success: false,
                    error: err
                }
            );
            throw err;

        } else {

            var imageUploadResponse = [];

            for(var i = 0; i < imgsToUpload.length; i++){
                var image = imgsToUpload[i];

                var tmpObj = {};

                if(image.full){
                    tmpObj.full = image.full.url;
                }

                if(image.thumbnail) {
                    tmpObj.thumbnail = image.thumbnail.url;
                }

                imageUploadResponse.push(tmpObj);
            }

            return res.json(
                {
                    success: true,
                    images: imageUploadResponse
                }
            );
        }
    });
};




exports.profileImage = function (req, res) {

    async.waterfall([
        function(callback){

            console.log("***************************");
            console.log("Get profile photo payload");
            console.log("***************************");

            if(req.files.profilePhoto) {
                var image = req.files.profilePhoto;
                image.type = 'profilePhoto';
            } else if (req.files.bannerPhoto) {
                var image = req.files.bannerPhoto;
                image.type = 'bannerPhoto';
            }

            console.log(image);

            fs.readFile(image.path, function (err, file_buffer) {

                if(err){

                    callback(err);

                } else {

                    if(image.type === 'profilePhoto') {

                        var params = {
                            ACL: 'public-read',
                            Bucket: config.aws.s3_static_bucket,
                            Key: 'users/' + req.user._id + '/profile-photo/' + image.name,
                            Body: file_buffer,
                            ContentType: image.mimetype
                        };

                    } else if (image.type === 'bannerPhoto') {

                        var params = {
                            ACL: 'public-read',
                            Bucket: config.aws.s3_static_bucket,
                            Key: 'users/' + req.user._id + '/banner-photo/' + image.name,
                            Body: file_buffer,
                            ContentType: image.mimetype
                        };

                    }



                    callback(null, params, image);
                }

            });
        },
        function(params, image, callback){

            console.log("***************************");
            console.log("PUSH TO AWS S3 BUCKET");
            console.log("***************************");

            var S3 = new AWS.S3();

            S3.putObject(params, function (err, S3response) {

                if (err) {
                    callback(err);
                } else {
                    callback(null, params, image);
                }


            });
        },
        function(params, image, callback){
            // arg1 now equals 'three'
            console.log("***************************");
            console.log("REMOVE IMAGE FROM SERVER AFTER SUCCESSFUL UPLOAD TO S3");
            console.log("***************************");

            fs.unlink(image.path, function (err) {
                if (err) {
                    callback(err);

                } else {
                    callback(null, params, image);

                }
            });
        },
        function(params, image, callback){
            // arg1 now equals 'three'

            console.log("***************************");
            console.log("SAVE NEW PROFILE PHOTO TO USER IN DATABASE");
            console.log("***************************");

            User.findOne({'local.email': req.user.local.email}, function (err, user) {

                // if there are any errors, return the error before anything else
                console.log(user);

                if (err) {

                    callback(err);

                    // if no user is found, return the message
                } else if (!user) {
                    return res.json(
                        {
                            error: "Couldn't find user.  Please contact support."
                        }
                    );


                } else if (user) { //found user with email.  check if current passwords match.

                    var S3ImageUrl = '';

                    if(image.type === 'profilePhoto') {
                        S3ImageUrl = config.aws.s3_static_url + '/users/' + req.user._id + '/profile-photo/' + image.name;
                        user.user_settings.profile_photo = S3ImageUrl;
                    } else if (image.type === 'bannerPhoto') {
                        S3ImageUrl = config.aws.s3_static_url + '/users/' + req.user._id + '/banner-photo/' + image.name;
                        user.user_settings.banner_photo = S3ImageUrl;
                    }

                    user.save(function (err) {
                        if (err) {
                            callback(err);
                        } else {

                            callback( null, {
                                success : true,
                                url : S3ImageUrl
                            });
                        }
                    });

                }
            });
        }
    ], function (err, result) {
        // result now equals 'done'
        if(err){
            res.send(err);
        } else {
            res.send(result);
        }
    });
};
