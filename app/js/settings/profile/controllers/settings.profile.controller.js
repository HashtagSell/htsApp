/**
 * Created by braddavis on 11/29/14.
 */
htsApp.controller('settings.profile.controller', ['$scope', '$window', 'Session', '$templateCache', 'authModalFactory', function ($scope, $window, Session, $templateCache, authModalFactory) {

    $scope.updatePassword = function () {

        authModalFactory.updatePasswordModal();

    };

    $scope.dropzoneConfig = {
        'options': { // passed into the Dropzone constructor
            paramName: "profilePhoto", // The name that will be used to transfer the file
            maxFilesize: 15, // MB
            maxFiles: 1,
            acceptedFiles: '.jpeg,.jpg,.png,.gif',
            url: "/upload",
            autoProcessQueue: true,
            uploadMultiple: false,
            addRemoveLinks: false,
            thumbnailWidth: 90,
            thumbnailHeight: 90,
            previewsContainer: "#preview",
            previewTemplate: $templateCache.get('profileUploadTemplate.tpl'),
            clickable: ".initProfileImageUpload",
            dictDefaultMessage: ''
        },
        'eventHandlers': {
            'sendingmultiple': function (file, xhr, formData) {
                console.log("sending for upload!");
            },
            'successmultiple': function (file, response) {

                console.log(response);

                var newPost = $scope.jsonObj;

                newPost.images = response.images;

                $scope.publishPost();

            },
            'addedfile': function () {
                console.log("image added");
            }
        },
        'init': {}
    };






    $scope.saveButtonDisabled = true;

    $scope.userObj = Session.userObj;

    if(!$scope.userObj.user_settings.profile_photo){
        $scope.userObj.user_settings.profile_photo = "/images/userMenu/user-placeholder.png";
    }

    if(!$scope.userObj.user_settings.profile_header) {
        $scope.userObj.user_settings.profile_header = "/images/userMenu/header-placeholder.gif";
    }

    console.log($scope.userObj);

    $scope.requireUpdate = function() {
        $scope.saveButtonDisabled = false;
    };

}]);