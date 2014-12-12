/**
 * Created by braddavis on 11/29/14.
 */
htsApp.controller('settings.profile.controller', ['$scope', '$window', 'Session', '$templateCache', 'authModalFactory', function ($scope, $window, Session, $templateCache, authModalFactory) {

    $scope.bindingObj = {
        currentlyUploadingProfilePhoto: false,
        requireUpdate: true
    };

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
            clickable: ".triggerProfileImageUpload",
            dictDefaultMessage: ''
        },
        'eventHandlers': {
            'addedfile': function () {
                console.log($scope);
                $scope.$apply(function(){
                    $scope.bindingObj.currentlyUploadingProfilePhoto = true;
                });
                console.log($scope);
            }
        }
    };


    $scope.userObj = Session.userObj;

    $scope.requireUpdate = function() {
        $scope.bindingObj.requireUpdate = false;
    };

}]);