/**
 * Created by braddavis on 1/6/15.
 */
htsApp.directive('dropzone', function () {

    return {
        link: function ($scope, element, attrs) {
            var config, dropzone;

            console.log("dropzone scope:", $scope);

            // Disabling autoDiscover, otherwise Dropzone will try to attach twice.
            Dropzone.autoDiscover = false;

            config = $scope[attrs.dropzone];

            // create a Dropzone for the element with the given options
            dropzone = new Dropzone(element[0], config.options);

            // bind the given event handlers
            angular.forEach(config.eventHandlers, function (handler, event) {
                dropzone.on(event, handler);
            });

            config.init = function () {
                dropzone.processQueue();
            };
        }
    };
});