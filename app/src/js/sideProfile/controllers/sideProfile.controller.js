htsApp.controller('sideProfile', ['$scope', 'Session', '$templateCache', function ($scope, Session, $templateCache) {

    $scope.userObj = Session.userObj;


    $scope.checkDefaultBanner = function(){
        return $scope.userObj.user_settings.banner_photo === '/images/userMenu/header-placeholder.png';
    };


    $scope.checkDefaultProfilePhoto = function(){
        return $scope.userObj.user_settings.profile_photo === '/images/userMenu/user-placeholder.png';
    };



    $scope.profileDropzoneConfig = {
        'options': { // passed into the Dropzone constructor
            paramName: "profilePhoto", // The name that will be used to transfer the file
            maxFilesize: 10, // MB
            acceptedFiles: '.jpeg,.jpg,.png,.gif',
            url: "/upload",
            autoProcessQueue: true,
            uploadMultiple: false,
            previewTemplate : '<div style="display:none"></div>',
            clickable: ".sideNavTriggerProfileImageUpload",
            dictDefaultMessage: ''
        },
        'eventHandlers': {
            'success': function (response) {

                var S3response = JSON.parse(response.xhr.response);

                console.log(S3response);

                Session.setSessionValue('profile_photo', S3response.url, function () {
                    console.log('done sidenav profile photo upload');
                });
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
            previewTemplate : '<div style="display:none"></div>',
            clickable: ".sideNavTriggerBannerImageUpload",
            dictDefaultMessage: ''
        },
        'eventHandlers': {
            'success': function (response) {

                var S3response = JSON.parse(response.xhr.response);

                console.log(S3response);

                Session.setSessionValue('banner_photo', S3response.url, $scope.$apply(function () {
                    console.log('done sidenav banner photo upload');
                }));
            },
            'complete' : function () {
                console.log('complete');
            }
        }
    };

}]);