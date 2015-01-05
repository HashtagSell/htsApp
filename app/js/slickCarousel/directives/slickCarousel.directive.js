/**
 * Created by braddavis on 1/3/15.
 */
//Custom implementation of https://github.com/kbdaitch/angular-slick-carousel
//Var needed for slick carousel directives below.
__indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };


htsApp.directive('onFinishRender', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                return scope.$evalAsync(attr.onFinishRender);
            }
        }
    };
});

htsApp.directive('slickCarousel', [
    '$timeout', '$templateCache', function($timeout, $templateCache) {
        var SLICK_FUNCTION_WHITELIST, SLICK_OPTION_WHITELIST, isEmpty;
        $templateCache.put('angular-slick-carousel/template.html', "<div class=\"multiple\" ng-repeat=\"m in media\" on-finish-render=\"init()\">\n  <img ng-if=\"isImage({media: m})\" data-lazy=\"{{m.thumb || m.thumbnail || m.images || m.full}}\"/>\n  <video ng-if=\"isVideo({media: m})\" ng-src=\"{{m.src}}\" type=\"{{m.mimeType}}\" ></video>\n</div>");
        SLICK_OPTION_WHITELIST = ['accessiblity', 'autoplay', 'autoplaySpeed', 'arrows', 'cssEase', 'dots', 'draggable', 'fade', 'easing', 'infinite', 'lazyLoad', 'onBeforeChange', 'onAfterChange', 'pauseOnHover', 'responsive', 'slide', 'slidesToShow', 'slidesToScroll', 'speed', 'swipe', 'touchMove', 'touchThreshold', 'vertical'];
        SLICK_FUNCTION_WHITELIST = ['slickGoTo', 'slickNext', 'slickPrev', 'slickPause', 'slickPlay', 'slickAdd', 'slickRemove', 'slickFilter', 'slickUnfilter', 'unslick'];
        isEmpty = function(value) {
            var key;
            if (angular.isArray(value)) {
                return value.length === 0;
            } else if (angular.isObject(value)) {
                for (key in value) {
                    if (value.hasOwnProperty(key)) {
                        return false;
                    }
                }
            }
            return true;
        };
        return {
            scope: {
                settings: '=',
                control: '=',
                media: '=',
                onDirectiveInit: '&',
                isImage: '&',
                isVideo: '&'
            },
            templateUrl: function(tElement, tAttrs) {
                if (tAttrs.src) {
                    return tAttrs.src;
                }
                return 'angular-slick-carousel/template.html';
            },
            restrict: 'AE',
            terminal: true,
            link: function(scope, element, attr) {
                var options;
                if (typeof attr.isImage !== 'function') {
                    scope.isImage = function(params) {
                        //TODO: Should evaluate mimetype of image.. grrrr
                        //Here is original code
                        //return params.media.mimeType === 'image/png' || params.media.mimeType === 'image/jpeg';
                        return true;
                    };
                }
                if (typeof attr.isVideo !== 'function') {
                    scope.isVideo = function(params) {
                        return params.media.mimeType === 'video/mp4';
                    };
                }
                options = scope.settings || {};
                angular.forEach(attr, function(value, key) {
                    if (__indexOf.call(SLICK_OPTION_WHITELIST, key) >= 0) {
                        return options[key] === scope.$eval(value);
                    }
                });
                scope.init = function() {
                    var slick;
                    slick = element.slick(options);
                    scope.internalControl = scope.control || {};
                    SLICK_FUNCTION_WHITELIST.forEach(function(value) {
                        scope.internalControl[value] = function() {
                            slick[value].apply(slick, arguments);
                        };
                    });
                    scope.onDirectiveInit();
                };
            }
        };
    }
]);