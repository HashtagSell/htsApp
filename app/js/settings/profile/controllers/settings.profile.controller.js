/**
 * Created by braddavis on 11/29/14.
 */
htsApp.controller('settings.profile.controller', ['$scope', '$window', 'Session', '$templateCache', 'authModalFactory', function ($scope, $window, Session, $templateCache, authModalFactory) {

    $scope.bindingObj = {
        currentlyUploadingProfilePhoto: false,
        currentlyUploadingBannerPhoto: false,
        requireUpdate: true
    };

    $scope.updatePassword = function () {
        authModalFactory.updatePasswordModal();
    };


    $scope.profileDropzoneConfig = {
        'options': { // passed into the Dropzone constructor
            paramName: "profilePhoto", // The name that will be used to transfer the file
            maxFilesize: 10, // MB
            acceptedFiles: '.jpeg,.jpg,.png,.gif',
            url: "/upload",
            autoProcessQueue: true,
            uploadMultiple: false,
            addRemoveLinks: false,
            thumbnailWidth: 90,
            thumbnailHeight: 90,
            previewsContainer: "#profilePreview",
            previewTemplate: $templateCache.get('profileUploadTemplate.tpl'),
            clickable: ".triggerProfileImageUpload",
            dictDefaultMessage: ''
        },
        'eventHandlers': {
            'addedfile': function () {
                $scope.$apply(function(){
                    $scope.bindingObj.currentlyUploadingProfilePhoto = true;
                });
            },
            'success': function (response) {

                var S3response = JSON.parse(response.xhr.response);

                console.log(S3response);

                Session.setSessionValue('profile_photo', S3response.url, $scope.$apply(function () {
                    $scope.bindingObj.currentlyUploadingProfilePhoto = false;
                }));
            },
            'complete' : function () {
                console.log('complete');
            }
        }
    };





    $scope.bannerDropzoneConfig = {
        'options': { // passed into the Dropzone constructor
            paramName: "bannerPhoto", // The name that will be used to transfer the file
            maxFilesize: 10, // MB
            acceptedFiles: '.jpeg,.jpg,.png,.gif',
            url: "/upload",
            autoProcessQueue: true,
            uploadMultiple: false,
            addRemoveLinks: false,
            thumbnailWidth: 180,
            thumbnailHeight: 120,
            previewsContainer: "#bannerPreview",
            previewTemplate: $templateCache.get('bannerUploadTemplate.tpl'),
            clickable: ".triggerBannerImageUpload",
            dictDefaultMessage: ''
        },
        'eventHandlers': {
            'addedfile': function () {
                $scope.$apply(function(){
                    $scope.bindingObj.currentlyUploadingBannerPhoto = true;
                });
            },
            'success': function (response) {

                var S3response = JSON.parse(response.xhr.response);

                console.log(S3response);

                Session.setSessionValue('banner_photo', S3response.url, $scope.$apply(function () {
                    $scope.bindingObj.currentlyUploadingBannerPhoto = false;
                }));
            },
            'complete' : function () {
                console.log('complete');
            }
        }
    };


    $scope.userObj = Session.userObj;

    $scope.requireUpdate = function () {

        $scope.bindingObj.requireUpdate = false;
    };

    $scope.submitUpdatedProfile = function () {
        Session.setSessionValue('biography', $scope.userObj.user_settings.biography, function () {
            $scope.bindingObj.requireUpdate = true;

        });
    };

}]);