angular.module('htsApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('js/404/partials/404.html',
    "<!DOCTYPE html>\n" +
    "<html lang=\"en\">\n" +
    "<head>\n" +
    "    <meta charset=\"utf-8\">\n" +
    "    <title>Page Not Found :(</title>\n" +
    "    <style>\n" +
    "        ::-moz-selection {\n" +
    "            background: #b3d4fc;\n" +
    "            text-shadow: none;\n" +
    "        }\n" +
    "\n" +
    "        ::selection {\n" +
    "            background: #b3d4fc;\n" +
    "            text-shadow: none;\n" +
    "        }\n" +
    "\n" +
    "        html {\n" +
    "            padding: 30px 10px;\n" +
    "            font-size: 20px;\n" +
    "            line-height: 1.4;\n" +
    "            color: #737373;\n" +
    "            background: #f0f0f0;\n" +
    "            -webkit-text-size-adjust: 100%;\n" +
    "            -ms-text-size-adjust: 100%;\n" +
    "        }\n" +
    "\n" +
    "        html,\n" +
    "        input {\n" +
    "            font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n" +
    "        }\n" +
    "\n" +
    "        body {\n" +
    "            max-width: 500px;\n" +
    "            _width: 500px;\n" +
    "            padding: 30px 20px 50px;\n" +
    "            border: 1px solid #b3b3b3;\n" +
    "            border-radius: 4px;\n" +
    "            margin: 0 auto;\n" +
    "            box-shadow: 0 1px 10px #a7a7a7, inset 0 1px 0 #fff;\n" +
    "            background: #fcfcfc;\n" +
    "        }\n" +
    "\n" +
    "        h1 {\n" +
    "            margin: 0 10px;\n" +
    "            font-size: 50px;\n" +
    "            text-align: center;\n" +
    "        }\n" +
    "\n" +
    "        h1 span {\n" +
    "            color: #bbb;\n" +
    "        }\n" +
    "\n" +
    "        h3 {\n" +
    "            margin: 1.5em 0 0.5em;\n" +
    "        }\n" +
    "\n" +
    "        p {\n" +
    "            margin: 1em 0;\n" +
    "        }\n" +
    "\n" +
    "        ul {\n" +
    "            padding: 0 0 0 40px;\n" +
    "            margin: 1em 0;\n" +
    "        }\n" +
    "\n" +
    "        .container {\n" +
    "            max-width: 380px;\n" +
    "            _width: 380px;\n" +
    "            margin: 0 auto;\n" +
    "        }\n" +
    "\n" +
    "        /* google search */\n" +
    "\n" +
    "        #goog-fixurl ul {\n" +
    "            list-style: none;\n" +
    "            padding: 0;\n" +
    "            margin: 0;\n" +
    "        }\n" +
    "\n" +
    "        #goog-fixurl form {\n" +
    "            margin: 0;\n" +
    "        }\n" +
    "\n" +
    "        #goog-wm-qt,\n" +
    "        #goog-wm-sb {\n" +
    "            border: 1px solid #bbb;\n" +
    "            font-size: 16px;\n" +
    "            line-height: normal;\n" +
    "            vertical-align: top;\n" +
    "            color: #444;\n" +
    "            border-radius: 2px;\n" +
    "        }\n" +
    "\n" +
    "        #goog-wm-qt {\n" +
    "            width: 220px;\n" +
    "            height: 20px;\n" +
    "            padding: 5px;\n" +
    "            margin: 5px 10px 0 0;\n" +
    "            box-shadow: inset 0 1px 1px #ccc;\n" +
    "        }\n" +
    "\n" +
    "        #goog-wm-sb {\n" +
    "            display: inline-block;\n" +
    "            height: 32px;\n" +
    "            padding: 0 10px;\n" +
    "            margin: 5px 0 0;\n" +
    "            white-space: nowrap;\n" +
    "            cursor: pointer;\n" +
    "            background-color: #f5f5f5;\n" +
    "            background-image: -webkit-linear-gradient(rgba(255,255,255,0), #f1f1f1);\n" +
    "            background-image: -moz-linear-gradient(rgba(255,255,255,0), #f1f1f1);\n" +
    "            background-image: -ms-linear-gradient(rgba(255,255,255,0), #f1f1f1);\n" +
    "            background-image: -o-linear-gradient(rgba(255,255,255,0), #f1f1f1);\n" +
    "            -webkit-appearance: none;\n" +
    "            -moz-appearance: none;\n" +
    "            appearance: none;\n" +
    "            *overflow: visible;\n" +
    "            *display: inline;\n" +
    "            *zoom: 1;\n" +
    "        }\n" +
    "\n" +
    "        #goog-wm-sb:hover,\n" +
    "        #goog-wm-sb:focus {\n" +
    "            border-color: #aaa;\n" +
    "            box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);\n" +
    "            background-color: #f8f8f8;\n" +
    "        }\n" +
    "\n" +
    "        #goog-wm-qt:hover,\n" +
    "        #goog-wm-qt:focus {\n" +
    "            border-color: #105cb6;\n" +
    "            outline: 0;\n" +
    "            color: #222;\n" +
    "        }\n" +
    "\n" +
    "        input::-moz-focus-inner {\n" +
    "            padding: 0;\n" +
    "            border: 0;\n" +
    "        }\n" +
    "    </style>\n" +
    "</head>\n" +
    "<body>\n" +
    "<div class=\"container\">\n" +
    "    <h1>Not found <span>:(</span></h1>\n" +
    "    <p>Sorry, but the page you were trying to view does not exist.</p>\n" +
    "    <p>It looks like this was the result of either:</p>\n" +
    "    <ul>\n" +
    "        <li>a mistyped address</li>\n" +
    "        <li>an out-of-date link</li>\n" +
    "    </ul>\n" +
    "    <!--<script>-->\n" +
    "        <!--var GOOG_FIXURL_LANG = (navigator.language || '').slice(0,2),GOOG_FIXURL_SITE = location.host;-->\n" +
    "    <!--</script>-->\n" +
    "    <!--<script src=\"//linkhelp.clients.google.com/tbproxy/lh/wm/fixurl.js\"></script>-->\n" +
    "</div>\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('js/authModals/modals/betaCheckModal/partials/betaCheck.html',
    "<style>\n" +
    "    .bike-background {\n" +
    "        background: url(\"//static.hashtagsell.com/htsApp/backdrops/flyingPigeon_dark_compressed.jpg\") no-repeat center center fixed;\n" +
    "        background-size: cover;\n" +
    "        border-radius: 5px 5px 0px 0px;\n" +
    "        height: 100%;\n" +
    "        width: 100%;\n" +
    "    }\n" +
    "</style>\n" +
    "\n" +
    "<div class=\"modal-header bike-background\">\n" +
    "    <h2 style=\"text-align: center; color: white;\">Join <img src=\"//static.hashtagsell.com/logos/hts/HashtagSell_Logo_80px.svg\" style=\"top: -5px; position: relative; height: 80px;\"/><sup>Beta</sup></h2>\n" +
    "</div>\n" +
    "<div class=\"modal-body\" style=\"background-color: #F5F5F5; border-radius: 0px 0px 4px 4px;\">\n" +
    "    <div class=\"row\">\n" +
    "        <button type=\"button\" class=\"btn btn-default btn-lg raised col-md-4 col-md-offset-1 col-xs-10 col-xs-offset-1\" ng-click=\"dismiss('signUp')\">I already have an access code</button>\n" +
    "        <div class=\"col-md-2 col-xs-hidden\"></div>\n" +
    "        <button type=\"button\" class=\"btn btn-default btn-lg raised col-md-4 col-md-offset-0 col-xs-10 col-xs-offset-1\" ng-click=\"dismiss('subscribe')\">I want an access code</button>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('js/authModals/modals/checkEmailModal/partials/checkEmail.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head lang=\"en\">\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title></title>\n" +
    "</head>\n" +
    "<body>\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h3 style=\"text-align: center;\">Verification Email Sent</h3>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <p>Please acknowledge the activation email we've just sent you.</p>\n" +
    "        <p>Thanks for making HashtagSell a safe community to buy and sell used goods!</p>\n" +
    "    </div>\n" +
    "    <!--<div class=\"modal-footer\">-->\n" +
    "        <!--<a href=\"mailto:\" target=\"_self\" class=\"btn btn-default\">Go to inbox</a>-->\n" +
    "    <!--</div>-->\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('js/authModals/modals/forgotPasswordModal/partials/forgotPassword.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head lang=\"en\">\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title></title>\n" +
    "</head>\n" +
    "<body>\n" +
    "\n" +
    "    <form id=\"forgotPasswordForm\" name=\"forgotPasswordForm\" class=\"form-horizontal\" ng-submit=\"forgotPassword(forgotPasswordForm.$valid)\" novalidate>\n" +
    "        <div class=\"modal-header\">\n" +
    "            <h3 id=\"myModalLabel\" style=\"text-align: center;\">Password Recovery</h3>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "            <div class=\"controls\">\n" +
    "                <input class=\"form-control\" type=\"email\" name=\"recoveryId\" ng-model=\"email\" placeholder=\"Email\" required>\n" +
    "                <!--<br>-->\n" +
    "                <small class=\"text-danger\">\n" +
    "                    {{message}}\n" +
    "                </small>\n" +
    "                <br>\n" +
    "                <a href ng-click=\"dismiss('signUp')\">\n" +
    "                    <small>Create Account</small>\n" +
    "                </a>\n" +
    "                <small> | </small>\n" +
    "                <a href ng-click=\"dismiss('signIn')\">\n" +
    "                    <small>Sign In</small>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <input class=\"btn btn-success\" type=\"submit\" value=\"Send recovery email\" ng-disabled=\"forgotPasswordForm.$invalid\">\n" +
    "            <!--<button class=\"btn btn-default\" ng-click=\"dismiss()\">Close</button>-->\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('js/authModals/modals/resetPasswordModal/partials/resetPassword.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head lang=\"en\">\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title></title>\n" +
    "</head>\n" +
    "<body>\n" +
    "\n" +
    "    <form id=\"resetPasswordForm\" name=\"resetPasswordForm\" class=\"form-horizontal\" ng-submit=\"resetPassword(resetPasswordForm.$valid)\" novalidate>\n" +
    "        <div class=\"modal-header\">\n" +
    "            <h3 id=\"myModalLabel\" style=\"text-align: center;\">Reset Password</h3>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "            <div class=\"controls\">\n" +
    "                <input class=\"form-control\" type=\"password\" name=\"newPassword\" ng-model=\"newPassword\" placeholder=\"New password\" ng-minlength=\"4\" ng-maxlength=\"30\" ng-pattern=\"/^[a-zA-Z0-9.!@#$%&*~+=-_]*$/\" required>\n" +
    "                <!--<br>-->\n" +
    "                <small class=\"text-danger\">\n" +
    "                    {{message}}\n" +
    "                </small>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <button class=\"btn btn-success\" type=\"submit\" ng-class=\"resetPasswordForm.$invalid ? 'btn-warning' : 'btn-success'\" ng-disabled=\"resetPasswordForm.$invalid\">\n" +
    "                <span ng-show=\"resetPasswordForm.newPassword.$error.minlength\">Password is too short.</span>\n" +
    "                <span ng-show=\"resetPasswordForm.newPassword.$error.pattern\">Remove spaces in password.</span>\n" +
    "                <span ng-show=\"!resetPasswordForm.newPassword.$error.minlength &&\n" +
    "                    !resetPasswordForm.newPassword.$error.pattern &&\n" +
    "                    resetPasswordForm.$invalid\"\n" +
    "                        >Type password</span>\n" +
    "                <span ng-show=\"!resetPasswordForm.newPassword.$error.minlength &&\n" +
    "                    !resetPasswordForm.newPassword.$error.pattern &&\n" +
    "                    !resetPasswordForm.$invalid\"\n" +
    "                        >Submit new password</span>\n" +
    "            </button>\n" +
    "            <!--<button class=\"btn btn-default\" ng-click=\"dismiss()\">Close</button>-->\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('js/authModals/modals/signInModal/partials/signIn.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head lang=\"en\">\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title>HashtagSell Sign In</title>\n" +
    "    <style>\n" +
    "        /*----- Genral Classes start ------*/\n" +
    "        hr{\n" +
    "            margin: 30px 20px;\n" +
    "            border-top:2px solid #1C1E26 ;\n" +
    "            border-bottom:2px solid #38404D;\n" +
    "        }\n" +
    "        .list-unstyled {\n" +
    "            padding-left: 0;\n" +
    "            list-style: none;\n" +
    "        }\n" +
    "        .list-inline li {\n" +
    "            display: inline-block;\n" +
    "            padding-right: 5px;\n" +
    "            padding-left: 5px;\n" +
    "            margin-bottom: 10px;\n" +
    "        }\n" +
    "        /*---- General classes end -------*/\n" +
    "\n" +
    "        /*Change icons size here*/\n" +
    "        .social-icons .fa {\n" +
    "            font-size: 1.8em;\n" +
    "        }\n" +
    "        /*Change icons circle size and color here*/\n" +
    "        .social-icons .fa {\n" +
    "            width: 50px;\n" +
    "            height: 50px;\n" +
    "            line-height: 50px;\n" +
    "            text-align: center;\n" +
    "            color: #FFF;\n" +
    "            color: rgba(255, 255, 255, 0.8);\n" +
    "            -webkit-transition: all 0.3s ease-in-out;\n" +
    "            -moz-transition: all 0.3s ease-in-out;\n" +
    "            -ms-transition: all 0.3s ease-in-out;\n" +
    "            -o-transition: all 0.3s ease-in-out;\n" +
    "            transition: all 0.3s ease-in-out;\n" +
    "        }\n" +
    "\n" +
    "        .social-icons.icon-circle .fa{\n" +
    "            border-radius: 50%;\n" +
    "        }\n" +
    "        .social-icons.icon-rounded .fa{\n" +
    "            border-radius:5px;\n" +
    "        }\n" +
    "        .social-icons.icon-flat .fa{\n" +
    "            border-radius: 0;\n" +
    "        }\n" +
    "\n" +
    "        .social-icons .fa:hover, .social-icons .fa:active {\n" +
    "            color: #FFF;\n" +
    "            -webkit-box-shadow: 1px 1px 3px #333;\n" +
    "            -moz-box-shadow: 1px 1px 3px #333;\n" +
    "            box-shadow: 1px 1px 3px #333;\n" +
    "        }\n" +
    "        .social-icons.icon-zoom .fa:hover, .social-icons.icon-zoom .fa:active {\n" +
    "            -webkit-transform: scale(1.1);\n" +
    "            -moz-transform: scale(1.1);\n" +
    "            -ms-transform: scale(1.1);\n" +
    "            -o-transform: scale(1.1);\n" +
    "            transform: scale(1.1);\n" +
    "        }\n" +
    "\n" +
    "        .social-icons .fa-facebook,.social-icons .fa-facebook-square{background-color:#3C599F;}\n" +
    "        .social-icons .fa-twitter,.social-icons .fa-twitter-square{background-color:#32CCFE;}\n" +
    "\n" +
    "    </style>\n" +
    "</head>\n" +
    "<body>\n" +
    "\n" +
    "    <form name=\"loginForm\" id=\"loginForm\" class=\"form-horizontal\" ng-submit=\"loginPassport(loginForm.$valid)\" novalidate>\n" +
    "        <div class=\"modal-header\">\n" +
    "            <h3 id=\"myModalLabel\" style=\"text-align: center;\">Welcome Back!</h3>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "            <!--<ul class=\"social-icons icon-circle icon-zoom list-unstyled list-inline\">-->\n" +
    "                <!--<li> <a href=\"/auth/facebook\" target=\"_self\"><i class=\"fa fa-facebook\"></i></a></li>-->\n" +
    "                <!--<li> <a href=\"/auth/twitter\" target=\"_self\"><i class=\"fa fa-twitter\"></i></a></li>-->\n" +
    "            <!--</ul>-->\n" +
    "\n" +
    "            <div class=\"controls\">\n" +
    "                <input class=\"form-control\" type=\"email\" id=\"email\" ng-model=\"email\" placeholder=\"Email\" required>\n" +
    "            </div>\n" +
    "            <br>\n" +
    "            <div class=\"controls\">\n" +
    "                <input class=\"form-control\" type=\"password\" id=\"password\" ng-model=\"password\" placeholder=\"Password\" required>\n" +
    "                <small class=\"text-danger\">\n" +
    "                    {{message}}\n" +
    "                </small>\n" +
    "                <br>\n" +
    "                <a href ng-click=\"dismiss('signUp')\">\n" +
    "                    <small>Create Account</small>\n" +
    "                </a>\n" +
    "                <small> | </small>\n" +
    "                <a href ng-click=\"dismiss('forgot')\">\n" +
    "                    <small>Forgot Your Password?</small>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <input class=\"btn btn-success\" type=\"submit\" value=\"Log In\" id=\"submit\" ng-disabled=\"loginForm.$invalid\">\n" +
    "            <!--<button class=\"btn btn-default\" ng-click=\"dismiss('dismiss')\">Close</button>-->\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('js/authModals/modals/signUpModal/partials/signUp.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head lang=\"en\">\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title></title>\n" +
    "</head>\n" +
    "<body>\n" +
    "\n" +
    "        <form name=\"RegisterFormV2\" id=\"RegisterFormV2\" class=\"form-horizontal\" ng-submit=\"signupPassport(RegisterFormV2.$valid)\" novalidate>\n" +
    "            <div class=\"modal-header\">\n" +
    "                <h3 style=\"text-align: center;\">Create Your Account</h3>\n" +
    "                <div style=\"text-align: center;\">\n" +
    "                    <small>\n" +
    "                        <a href ng-click=\"dismiss('signIn')\">\n" +
    "                            Sign in to my existing account.\n" +
    "                        </a>\n" +
    "                    </small>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"modal-body\">\n" +
    "\n" +
    "                <div class=\"controls\">\n" +
    "                    <input class=\"form-control\" type=\"email\" id=\"email\" name=\"email\" ng-model=\"email\" placeholder=\"Email\" required=\"true\"/>\n" +
    "                </div>\n" +
    "\n" +
    "                <br>\n" +
    "\n" +
    "\n" +
    "                <div class=\"controls\">\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <span class=\"input-group-addon\">@</span>\n" +
    "                        <input class=\"form-control\" type=\"text\" id=\"username\" name=\"username\" ng-model=\"name\" ng-minlength=\"3\" ng-maxlength=\"22\" ng-pattern=\"/^[a-zA-Z0-9]*$/\" placeholder=\"Username\" required=\"true\"/>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "\n" +
    "                <br>\n" +
    "\n" +
    "                <div class=\"controls\">\n" +
    "                    <input class=\"form-control\" type=\"password\" id=\"password\" name=\"password\" ng-model=\"password\" ng-minlength=\"4\" ng-maxlength=\"30\" ng-pattern=\"/^[a-zA-Z0-9.!@#$%&*~+=^-_]*$/\" placeholder=\"Password\" required=\"true\"/>\n" +
    "                </div>\n" +
    "\n" +
    "                <br>\n" +
    "\n" +
    "                <div class=\"controls\">\n" +
    "                    <input class=\"form-control\" type=\"text\" id=\"secret\" placeholder=\"Early Access Code\" name=\"secret\" ng-model=\"secret\" required=\"true\"/>\n" +
    "                    <!--<span>-->\n" +
    "                        <!--<a href ng-click=\"dismiss('subscribe')\" style=\"position: relative; top: 3px;\">-->\n" +
    "                            <!--<small>I don't have an access code</small>-->\n" +
    "                        <!--</a>-->\n" +
    "                    <!--</span>-->\n" +
    "                </div>\n" +
    "\n" +
    "                <br/>\n" +
    "\n" +
    "                <div class=\"controls\">\n" +
    "                    <small>\n" +
    "                        <input id=\"betaAgreement\" name=\"betaAgreement\" type=\"checkbox\" ng-model=\"betaAgreement\" required=\"true\"> I agree to\n" +
    "                        <a ui-sref=\"betaAgreement\" target=\"_blank\" required>Beta Agreement</a>\n" +
    "                    </small>\n" +
    "                    <br>\n" +
    "                    <small class=\"text-danger\">{{message}}</small>\n" +
    "                </div>\n" +
    "\n" +
    "\n" +
    "            </div>\n" +
    "            <div class=\"modal-footer\">\n" +
    "                <button id=\"submit-create-account\" class=\"btn\" ng-class=\"RegisterFormV2.$invalid ? 'btn-warning' : 'btn-success'\" type=\"submit\" ng-disabled=\"RegisterFormV2.$invalid\">\n" +
    "                    <span ng-show=\"RegisterFormV2.username.$error.minlength\">Username too short</span>\n" +
    "                    <span ng-show=\"RegisterFormV2.username.$error.maxlength\">Username too long</span>\n" +
    "                    <span ng-show=\"RegisterFormV2.username.$error.pattern\">Remove special chars in username</span>\n" +
    "                    <span ng-show=\"RegisterFormV2.password_verify.$error.match\">Passwords do not match</span>\n" +
    "                    <span ng-show=\"RegisterFormV2.password.$error.minlength\">Password too short</span>\n" +
    "                    <span ng-show=\"RegisterFormV2.password.$error.pattern\">Remove spaces in password</span>\n" +
    "                    <span ng-show=\"!RegisterFormV2.username.$error.minlength &&\n" +
    "                    !RegisterFormV2.username.$error.maxlength &&\n" +
    "                    !RegisterFormV2.username.$error.pattern &&\n" +
    "                    !RegisterFormV2.password_verify.$error.match &&\n" +
    "                    !RegisterFormV2.password.$error.minlength &&\n" +
    "                    !RegisterFormV2.password.$error.pattern &&\n" +
    "                    RegisterFormV2.$invalid\"\n" +
    "                            >Almost there</span>\n" +
    "                    <span ng-show=\"!RegisterFormV2.username.$error.minlength &&\n" +
    "                    !RegisterFormV2.username.$error.maxlength &&\n" +
    "                    !RegisterFormV2.username.$error.pattern &&\n" +
    "                    !RegisterFormV2.password_verify.$error.match &&\n" +
    "                    !RegisterFormV2.password.$error.minlength &&\n" +
    "                    !RegisterFormV2.password.$error.pattern &&\n" +
    "                    !RegisterFormV2.$invalid\"\n" +
    "                            >Create Account</span>\n" +
    "                </button>\n" +
    "                <!--<button class=\"btn btn-default\" ng-click=\"dismiss('dismiss')\">Close</button>-->\n" +
    "            </div>\n" +
    "        </form>\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('js/authModals/modals/subscribeModal/partials/subscribe.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head lang=\"en\">\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title></title>\n" +
    "</head>\n" +
    "<body>\n" +
    "\n" +
    "    <form id=\"betaSubscriberForm\" name=\"betaSubscriberForm\" class=\"form-horizontal\" ng-submit=\"subscribe(betaSubscriberForm.$valid)\" novalidate>\n" +
    "        <div class=\"modal-header\">\n" +
    "            <h3 id=\"myModalLabel\" style=\"text-align: center;\" ng-show=\"!done\">Request Early Access</h3>\n" +
    "            <h3 id=\"myModalLabel\" style=\"text-align: center;\" ng-show=\"done\">Tell Your Friends!</h3>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "            <div class=\"controls\">\n" +
    "\n" +
    "                <alert ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\" close=\"closeAlert($index)\">{{alert.msg}}</alert>\n" +
    "\n" +
    "                <input class=\"form-control\" type=\"email\" name=\"subscriberEmail\" ng-model=\"email\" placeholder=\"Email\" ng-show=\"!done\" required>\n" +
    "                <span ng-show=\"!done\">\n" +
    "                    <br>\n" +
    "                    <a href ng-click=\"dismiss('signUp')\">\n" +
    "                        <small>Create Account</small>\n" +
    "                    </a>\n" +
    "                    <small> | </small>\n" +
    "                    <a href ng-click=\"dismiss('signIn')\">\n" +
    "                        <small>Sign In</small>\n" +
    "                    </a>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <input class=\"btn btn-success\" type=\"submit\" value=\"I want early access!\" ng-disabled=\"betaSubscriberForm.$invalid\" ng-show=\"!done\">\n" +
    "            <!--<button class=\"btn btn-default\" ng-click=\"dismiss()\">Close</button>-->\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('js/feed/partials/feed.partial.html',
    "<div ui-view></div>\n" +
    "\n" +
    "<div class=\"outer-container col-xs-12\">\n" +
    "    <img ng-if=\"status.pleaseWait\" src=\"https://static.hashtagsell.com/htsApp/spinners/hashtag_spinner.gif\" class=\"spinner-abs-center\"/>\n" +
    "\n" +
    "    <div vs-repeat class=\"inner-container row\" vs-size=\"feedItemHeight\" vs-offset-before=\"77\" vs-excess=\"10\">\n" +
    "        <div class=\"list-item\" ng-repeat=\"result in results\" ng-click=\"openSplash(this)\">\n" +
    "            <div class=\"thumbnail\">\n" +
    "\n" +
    "                <ribbon-list ng-if=\"!!result.askingPrice.value\">{{::result.askingPrice.value | currency : $ : 0}}</ribbon-list>\n" +
    "\n" +
    "                <!--Has NO image-->\n" +
    "                <div ng-if=\"!result.images.length\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"caption\">\n" +
    "                            <h3 class=\"noImage-heading\" ng-bind-html=\"result.heading | cleanHeading\"></h3>\n" +
    "                            <hts-fave-toggle class=\"carousel-starPositioning\"></hts-fave-toggle>\n" +
    "                            <p class=\"noImage-body\" ng-bind-html=\"result.body |cleanBodyExcerpt\"></p>\n" +
    "                            <div class=\"pull-left carousel-timestamp\">\n" +
    "                                <small>Posted {{(currentDate - result.external.threeTaps.timestamp) | secondsToTimeString}} ago.</small>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "\n" +
    "                <!--Has ONE image-->\n" +
    "                <div ng-if=\"result.images.length == 1\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-lg-5 col-md-6 col-sm-6 col-xs-6\">\n" +
    "                            <img ng-src=\"{{::result.images[0].full || result.images[0].thumb || result.images[0].images}}\" class=\"img-rounded singleImage-Image\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-lg-7 col-md-6 col-sm-6 col-xs-6 singleImage-TextContainer\">\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"caption\">\n" +
    "                                    <h3 class=\"singleImage-heading\" ng-bind-html=\"result.heading | cleanHeading\"></h3>\n" +
    "                                    <hts-fave-toggle class=\"singleImage-starPositioning\"></hts-fave-toggle>\n" +
    "                                    <p class=\"singleImage-body\" ng-bind-html=\"result.body |cleanBodyExcerpt\"></p>\n" +
    "                                    <div class=\"pull-left singleImage-timestamp\">\n" +
    "                                        <small>Posted {{(currentDate - result.external.threeTaps.timestamp) | secondsToTimeString}} ago.</small>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "\n" +
    "                <!--Has MULTIPLE images-->\n" +
    "                <div ng-if=\"result.images.length > 1\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-lg-12\">\n" +
    "                            <slick data=\"result.images\" lazy-load='progressive' init-onload=true dots=true infinite=true slides-to-scroll=1 speed=100 variable-width=true center-mode=false next-arrow=\".next-arrow-ctl{{$index}}\" prev-arrow=\".prev-arrow-ctl{{$index}}\">\n" +
    "\n" +
    "\n" +
    "                                <button ng-click=\"$event.stopPropagation();\" type=\"button\" data-role=\"none\" class=\"slick-prev prev-arrow-ctl{{$index}}\" aria-label=\"previous\" style=\"display: block;\">Previous</button>\n" +
    "\n" +
    "                                <button ng-click=\"$event.stopPropagation();\" type=\"button\" data-role=\"none\" class=\"slick-next next-arrow-ctl{{$index}}\" aria-label=\"next\" style=\"display: block;\">Next</button>\n" +
    "\n" +
    "                                <div ng-repeat=\"image in result.images\">\n" +
    "                                    <img data-lazy=\"{{image.thumb || image.thumbnail || image.images || image.full}}\"/>\n" +
    "                                </div>\n" +
    "                            </slick>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"caption\">\n" +
    "                            <h3 class=\"carousel-heading\" ng-bind-html=\"result.heading | cleanHeading\"></h3>\n" +
    "                            <hts-fave-toggle class=\"carousel-starPositioning\"></hts-fave-toggle>\n" +
    "                            <p class=\"carousel-body\" ng-bind-html=\"result.body |cleanBodyExcerpt\"></p>\n" +
    "                            <div class=\"pull-left carousel-timestamp\">\n" +
    "                                <small>Posted {{(currentDate - result.external.threeTaps.timestamp) | secondsToTimeString}} ago.</small>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('js/legal/betaAgreement/partials/betaAgreement.partial.html',
    "<style>\n" +
    "    body, html {\n" +
    "        background-color: #ECF0F5;\n" +
    "        overflow-y: auto;\n" +
    "        overflow-x: hidden;\n" +
    "        font-weight: 200;\n" +
    "    }\n" +
    "</style>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "    <h3>HashtagSell Beta Agreement</h3>\n" +
    "    <p>Last Updated on May 15th, 2015</p>\n" +
    "\n" +
    "    <p>Effective as of May 15th, 2015</p>\n" +
    "\n" +
    "    <p>This Beta Agreement (the “Agreement”) contains the exclusive terms and conditions between HashtagSell, Inc., a California corporation (“Company”) and you (“You”) and it governs Your testing, evaluation and use of the beta version of the Services, any related software and website to which Company gives You access (“Services”). By accessing the Services for the evaluation purposes described herein You are consenting to be bound by and are becoming a party to the terms and conditions of this Agreement. If You do not agree to all of the terms of this Agreement, You must not access the Services.</p>\n" +
    "    <p>1. Evaluation.</p>\n" +
    "    <p>During the time period permitted by Company (the “Term”) You may access the Services and test the functionality and other features of the Services, but only to evaluate the Services for their intended purpose. From time to time as requested by Company You agree to participate in the feedback programs administered by Company.</p>\n" +
    "    <p>This Agreement does not entitle You to any technical support with respect to the Services, but any such support provided by Company in its sole discretion shall be subject to this Agreement. If You are under the age of 18, You shall not access, browse or use the Services, and by using the Services, You represent and warrant that You are at least 18 years of age.</p>\n" +
    "    <p>2. Third Party Services.</p>\n" +
    "    <p>The Services may also allow You to access services provided by third parties or you may use third party services to access the Services. You acknowledge that Company is not responsible nor liable for such services, and that Your use of such services may be subject to separate terms between You and the company providing those services.</p>\n" +
    "    <p>3. Restrictions; Ownership.</p>\n" +
    "    <p>You may not, directly or indirectly: copy, distribute, rent, lease, timeshare, operate a service bureau with, use for the benefit of a third party, reverse engineer, disassemble, decompile, attempt to discover the source code or structure, sequence and organization of, or remove any proprietary notices from, the Services. You shall not:</p>\n" +
    "    <p>*(a) use the Services to abuse, harass, threaten, intimidate or otherwise violate the legal rights (including intellectual property rights or rights of privacy and publicity) of others; *(b) use the Services for any unauthorized purpose or in violation of any applicable laws; *(c) transmit any content that You do not have a right to transmit under any law or under contractual or fiduciary relationships; *(d) interfere with or disrupt the Services. As between the parties, title, ownership rights, and intellectual property rights in and to the Services, and any copies or portions thereof, shall remain in Company and its suppliers or licensors.</p>\n" +
    "    <p>4. Confidentiality; Feedback.</p>\n" +
    "    <p>Your acknowledge that, in the course of evaluating the Services, You will obtain information relating to the Company and the Services which is confidential in nature (“Confidential Information”). You agree that You will not use or disclose Confidential Information without the prior written consent of Company unless such Confidential Information becomes part of the public domain. Further, if You provide Company any feedback, ideas, concepts or suggestions about the Company’s Services, business, technology or Confidential Information (“Feedback”), You grant Company, without charge, the fully paid-up, irrevocable right and license to use, share, commercialize and otherwise fully exercise and exploit Your Feedback and all related rights (and to allow others to do so) in any way and for any purpose. These rights survive termination of this agreement in perpetuity.</p>\n" +
    "    <p>5. Term/Termination.</p>\n" +
    "    <p>This Agreement will commence on the date that You first accept the terms of this Agreement by clicking “Accept” below (or otherwise create an account) and shall continue for the Term. Sections 2-9 of this Agreement will survive any expiration or termination of this Agreement. All rights You are granted herein shall immediately terminate upon expiration or termination of this Agreement and You shall immediately return to Company or destroy all Confidential Information (including all Software). In addition to any other rights set forth herein, Company may in its sole discretion restrict, suspend or terminate Your access to the Services, in whole or in part and without notice.</p>\n" +
    "    <p>6. Disclaimer.</p>\n" +
    "    <p>The parties acknowledge that the Services are experimental in nature and that the Services are provided “AS IS.” COMPANY DISCLAIMS ALL WARRANTIES RELATING TO THE SUBJECT MATTER HEREOF, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>\n" +
    "    <p>7. Limitation of Remedies and Damages. COMPANY SHALL NOT BE RESPONSIBLE OR LIABLE WITH RESPECT TO ANY SUBJECT MATTER OF THIS AGREEMENT OR TERMS AND CONDITIONS RELATED THERETO UNDER ANY CONTRACT, NEGLIGENCE, STRICT LIABILITY OR OTHER THEORY (A) FOR LOSS OR INACCURACY OF DATA OR, COST OF PROCUREMENT OF SUBSTITUTE GOODS, SERVICES OR TECHNOLOGY, (B) FOR ANY INDIRECT, INCIDENTAL OR CONSEQUENTIAL DAMAGES INCLUDING, BUT NOT LIMITED TO LOSS OF REVENUES AND LOSS OF PROFITS, OR (C) ANY AMOUNT IN THE AGGREGATE IN EXCESS OF THE AMOUNTS YOU HAVE PAID COMPANY IN THE LAST SIX (6) MONTHS, OR, IF GREATER, FIFTY DOLLARS ($50). COMPANY SHALL NOT BE RESPONSIBLE FOR ANY MATTER BEYOND ITS REASONABLE CONTROL.</p>\n" +
    "    <p>8. Equitable Relief.</p>\n" +
    "    <p>You acknowledge and agree that due to the unique nature of Company’s Confidential Information, there can be no adequate remedy at law for any breach of Your obligations hereunder, that any such breach may allow You or third parties to unfairly compete with Company resulting in irreparable harm to Company, and therefore, that upon any such breach or threat thereof, Company shall be entitled to injunctions and other appropriate equitable relief in addition to whatever remedies it may have at law.</p>\n" +
    "    <p>9. Miscellaneous.</p>\n" +
    "    <p>In the event that any of the provisions of this Agreement shall be held by a court or other tribunal of competent jurisdiction to be unenforceable, such provisions shall be limited or eliminated to the minimum extent necessary so that this Agreement shall otherwise remain in full force and effect and enforceable. This Agreement constitutes the entire agreement between the parties pertaining to the subject matter hereof, and any and all written or oral agreements previously existing between the parties are expressly cancelled. Neither the rights nor the obligations arising under this Agreement are assignable or transferable by You, and any such attempted assignment or transfer shall be void and without effect. This Agreement shall be governed by and construed in accordance with the laws of the State of California without regard to the conflicts of laws provisions therein.</p>\n" +
    "    <p>Last Modified: 15th May 2015<br>\n" +
    "    © 2015 HashtagSell, Inc.</p>\n" +
    "</div>"
  );


  $templateCache.put('js/legal/postingRules/partials/postingRules.partial.html',
    "<style>\n" +
    "    body, html {\n" +
    "        background-color: #ECF0F5;\n" +
    "        overflow-y: auto;\n" +
    "        overflow-x: hidden;\n" +
    "        font-weight: 200;\n" +
    "    }\n" +
    "</style>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "    <h3>HashtagSell Posting Rules</h3>\n" +
    "    <p>Last Updated on May 15th, 2015</p>\n" +
    "\n" +
    "    <p>Effective as of May 15th, 2015</p>\n" +
    "\n" +
    "    <p>We categorize any ads posted on HashtagSell. Here are some general rules to follow when posting and replying to an ad:</p>\n" +
    "    <ol><li>You are responsible for ensuring compliance with all applicable laws relating to items that you list, buy or sell on HashtagSell.</li>\n" +
    "        <li>Ads that are on our prohibited items list are not permitted.</li>\n" +
    "        <li>Ads or replies that contain any text that violates the spirit of HashtagSell, contains inappropriate or discriminatory language in ads, and/or &quot;hate speech&quot; directed at individuals or groups, is threatening or abusive, infringes on another user&#39;s privacy, or could disturb, harm, or offend our users, may be rejected.</li>\n" +
    "        <li>It is prohibited to post an item or service not located in the U.S.</li>\n" +
    "        <li>It is prohibited to post a duplicate or similar ad for the same item or service.</li>\n" +
    "        <li>Ads that are intentionally misleading, deceptive, deceitful, misinformative, or found to be using &quot;bait and switch&quot; tactics are not permitted.</li>\n" +
    "        <li>You can only post one ad for an item in the area that the item is actually located.</li>\n" +
    "        <li>We generally allow links under the following conditions:</li>\n" +
    "        <ul>\n" +
    "            <li>Link to additional product information/pictures</li>\n" +
    "        </ul>\n" +
    "        <li>Posting an ad for a unique item</li>\n" +
    "        <li>Sole purpose of link is not to direct more traffic to your website</li>\n" +
    "        <li>You do not post links to another classified site</li>\n" +
    "        <li>Your ad must comply with all other site policies.</li>\n" +
    "        <li>It is prohibited to use multiple accounts to post.</li>\n" +
    "        <li>It is prohibited to post pornography, nudity, or other related material that is obscene or adult in nature.</li>\n" +
    "        <li>It is prohibited to post ads relating to personals, dating or adult themed events or services, missed connections, or adult services.</li>\n" +
    "        <li>It is prohibited to infringe upon the rights of third parties. This includes, but is not limited to, infringing upon intellectual property rights such as copyright and trademark.</li>\n" +
    "        <li>It is prohibited to post ads that serve no other purpose than to send traffic to another web site. Ads must describe a specific item or service in order to be allowed on the site. If you include HTML code in your ad it will not work and your ad could be removed.</li>\n" +
    "        <li>It is prohibited to post keywords in your ad for the purpose of increasing its visibility in search results.</li>\n" +
    "        <li>Use of content and/or functionality of HashtagSell to send unsolicited emails, or make unsolicited contact of any kind with its users is strictly prohibited.</li>\n" +
    "        <li>Rules may change periodically to reflect HashtagSell&#39;s ongoing commitment to providing the safest and best user experience possible. We reserve the right to enforce these rules at our discretion and change these rules at any time. HashtagSell reserves the right to remove any ad at any time at our discretion. By posting an ad on the site you understand and have agreed to these rules.</li></ol>\n" +
    "    <h4>HashtagSell Prohibited Items List</h4>\n" +
    "    <p>The list below details a partial list of what can&#39;t be posted on HashtagSell. HashtagSell reserves the right to remove an ad at our discretion, and to alter this list at any time:</p>\n" +
    "    <ul>\n" +
    "        <li>Ads asking for donations unless from a registered charity</li>\n" +
    "        <li>Ads offering or looking for human adoption</li>\n" +
    "        <li>Ads that are adult in nature (including, but not limited to: adult toys, adult magazines, adult services, escort services, adult massages, adult job postings, dating websites, and personal ads)</li>\n" +
    "        <li>Airline tickets that restrict transfer and tickets of any kind which you are not authorized to sell</li>\n" +
    "        <li>Alcoholic Beverages</li>\n" +
    "        <li>Animals/pets</li>\n" +
    "        <li>Animals traps that could be deemed inhumane</li>\n" +
    "        <li>Blood, Bodily Fluids and Body Parts</li>\n" +
    "        <li>Burglary Tools</li>\n" +
    "        <li>Counterfeit Products, replicas or knock-off brand name goods</li>\n" +
    "        <li>Coupons or gift cards that restrict transfer, and coupons or gift cards which you are not authorized to sell</li>\n" +
    "        <li>Electronically delivered gift cards or electronic &quot;scanned&quot; coupons</li>\n" +
    "        <li>Cribs (new and used) unless they meet the new federal safety standards issued by the CPSC. Only cribs that were manufactured in 2011 or later are permitted. If your crib was manufactured in 2011 or later and meets the required safety standards, you must specifically state in your listing that the crib was manufactured in 2011 or later and does meet these standards (please visit the CPSC website for more information)</li>\n" +
    "        <li>Electronic Surveillance Equipment designed or used primarily to illegally intercept/record the private actions or interactions of others without their knowledge or permission</li>\n" +
    "        <li>Embargoed Goods</li>\n" +
    "        <li>Endangered or protected species, or any part of any endangered or protected species (including bone/ivory, taxidermy, shell, pelts, etc)</li>\n" +
    "        <li>Food and food products</li>\n" +
    "        <li>Fireworks, Destructive Devices and Explosives</li>\n" +
    "        <li>Gift cards of any kind</li>\n" +
    "        <li>Government and Transit Badges, Uniforms, IDs, Documents and Licenses</li>\n" +
    "        <li>Hazardous Materials including but not limited to radioactive, toxic and explosive materials</li>\n" +
    "        <li>Identity Documents, Personal Financial Records &amp; Personal Information</li>\n" +
    "        <li>Illegal Drugs, controlled substances, substances and items used to manufacture controlled substances and drugs, &amp; drug paraphernalia</li>\n" +
    "        <li>Illegal telecommunication and electronics equipment such as access cards, password swiffers, any type of jamming device, traffic signal control devices, satellite/cable descrambler, or any device prohibited by the FCC</li>\n" +
    "        <li>Items issued to United States Armed Forces that have not been disposed of in accordance with Department of Defense demilitarization policies</li>\n" +
    "        <li>Items marketed inappropriately with an intolerant regard toward religion, sexual orientation, race, or ethnic background</li>\n" +
    "        <li>Items that restrict transfer (such as tickets or coupons) and items you are not authorized to sell</li>\n" +
    "        <li>Items which encourage or facilitate illegal activity</li>\n" +
    "        <li>Liquor licenses</li>\n" +
    "        <li>Lottery Tickets, Sweepstakes Entries and Slot Machines that requires money to operate</li>\n" +
    "        <li>Material, artwork, and/or photographs that are obscene, contain nudity (partial or full), pornographic, adult in nature, or harmful to minors</li>\n" +
    "        <li>Material that infringes copyright, including but not limited to software or other digital goods which you are not authorized to sell</li>\n" +
    "        <li>Modded gaming items and modification services</li>\n" +
    "        <li>Nonprescription drugs, drugs that make false or misleading treatment claims, or treatment claims that require FDA approval</li>\n" +
    "        <li>Offensive Material</li>\n" +
    "        <li>Pesticides or hazardous materials</li>\n" +
    "        <li>Pictures or images that contain nudity</li>\n" +
    "        <li>Plants and insects that are restricted or regulated</li>\n" +
    "        <li>Prescription Drugs and Devices</li>\n" +
    "        <li>Products being sold by representatives of companies that violate our jobs/services policies</li>\n" +
    "        <li>Prostitution or ads that offer sex, sexual favors or sexual actions in exchange for anything</li>\n" +
    "        <li>Recalled items (please visit the US recall information website for more information)</li>\n" +
    "        <li>Stocks and Other Securities</li>\n" +
    "        <li>Stolen Property</li>\n" +
    "        <li>Tobacco and Related Products (including, but not limited to: nicotine patches, nicotine gum, e-cigarettes, etc)</li>\n" +
    "        <li>Used bedding and clothing, unless sanitized in accordance with law (used undergarments, swimwear and socks are never permitted)</li>\n" +
    "        <li>Used cosmetics or toiletries (items must be new and sealed)</li>\n" +
    "        <li>Weapons and related items (including, but not limited to firearms, magazines and all parts and accessories, ammunition, BB and pellet guns, tear gas, tasers, stun guns, knives, swords, airsoft guns and all accessories, crossbows, archery bows, and martial arts weapons)</li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <p>Last Modified: 15th May 2015<br>\n" +
    "    © 2015 HashtagSell, Inc.</p>\n" +
    "</div>"
  );


  $templateCache.put('js/legal/privacyPolicy/partials/privacyPolicy.partial.html',
    "<style>\n" +
    "    body, html {\n" +
    "        background-color: #ECF0F5;\n" +
    "        overflow-y: auto;\n" +
    "        overflow-x: hidden;\n" +
    "        font-weight: 200;\n" +
    "    }\n" +
    "</style>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "    <h3>HashtagSell Privacy Policy</h3>\n" +
    "\n" +
    "    <p>Last Updated on May 15th, 2015</p>\n" +
    "\n" +
    "    <p>Effective as of May 15th, 2015</p>\n" +
    "\n" +
    "    <p>HashtagSell, Inc., the company behind HashtagSell.com (hereafter “HashtagSell”, “our,” “we,” or “us”) has created this Privacy Policy to explain how your information is collected and used. This Privacy Policy applies to our web site. </p>\n" +
    "\n" +
    "    <p>By visiting and using the web site, you consent to our Terms of Use, which is incorporated by reference including applicable terms regarding limitations on liability and the resolution of disputes. You acknowledge our use of your information per the terms of this Privacy Policy. We reserve the right to modify this Privacy Policy in the future. You can always review the most current version at <a ui-sref=\"privacyPolicy\" target=\"_blank\">{{legalUrl.privacyPolicy}}</a></p>\n" +
    "\n" +
    "    <h4>Data Collected From You.</h4>\n" +
    "\n" +
    "    <p>1. Information Submitted by You. HashtagSell receives, stores, and processes information that you provide when using our Platform, including: </p>\n" +
    "\n" +
    "    <p>1.1. information you submit to the Platform, such as when you register or update the details of your account, information and any payment information you submit to the Platform such as credit card number, expiration, and security codes, or digital payment system account;</p>\n" +
    "\n" +
    "    <p>1.2. information you post in order to sell any product on the Platform, including any photographs, written descriptions and your location (“Offers”), as well as any bids you make on Offers through the Platform; and</p>\n" +
    "\n" +
    "    <p>1.3. any reviews or comments you make using the Platform, all correspondence or communications with another user conducted using the Platform, or if you contact or communicate with us, whether through written or verbal communications.</p>\n" +
    "\n" +
    "    <p>2. Information from Third Parties. HashtagSell may, from time to time, supplement the information we collect about you through our Platform with outside records from third parties in order to enhance our ability to serve you, to tailor our content to you and to offer you opportunities to purchase products or services that we believe may be of interest to you. HashtagSell may also receive information from Facebook, or any other social media site or other third party service which HashtagSell may support in the future, should you elect to log on to the Platform using such social media sites. We may combine the information we receive from those sources with information we collect through the Platform. In those cases, we will apply this Privacy Policy to any Personal Information received, unless we have disclosed otherwise. </p>\n" +
    "\n" +
    "    <p>3. Internet/Mobile Data and Metadata. When you use the Platform, we receive, store and process a variety of information about your location (e.g. IP address, GPS coordinates), your device (e.g. make, model and specifications of your device, OS, UDID), metadata (e.g. time, date and location of when a post was made) and other similar data, to the extent sent by your computer or mobile device or generated as part of the data communications with the Platform. </p>\n" +
    "\n" +
    "    <p>4. Tracking Technologies; Advertising. </p>\n" +
    "\n" +
    "    <p>4.1. HashtagSell uses, or may use, cookies, tracking pixels, embedded scripts and other similar tracking technologies on the Platform and may, without further consultation with you, and may permit its partners to do the same. By accessing or using the Platform, you will provide or make available certain information to us and to our partners. HashtagSell will track your activities if you click on advertisements for our services on third party platforms such as search engines and social networks, and do use analytics to track what you do in response to those advertisements. All information which could reasonably be used to identify you personally (e.g. your name, e-mail address, location, IP address) are hereafter (“Personal Information”).</p>\n" +
    "\n" +
    "    <p>4.2. HashtagSell does not currently offer targeted advertising through the Platform, though we reserve the right to do or allow our partners to do so in the future without further consultation from you. We do not currently support any browser based Do Not Track (DNT) settings or participate in any DNT frameworks, and we do not assign any meaning to any potential DNT track signals you may send or alter any of our data collection or use practices in response to such signals.  </p>\n" +
    "\n" +
    "    <h4>Use of Collected Data.</h4>\n" +
    "\n" +
    "    <p>5. General Uses. HashtagSell uses and processes the collected information, including Personal Information, for the following uses: </p>\n" +
    "\n" +
    "    <p>5.1. to enable you to access and use the Platform and to optimize the type of classified posts presented to you when you use the Platform;</p>\n" +
    "\n" +
    "    <p>5.2. to enable any identification programs we may institute and which you elect to participate, such as verifying your identity and address, and to conduct checks against various publically available databases;</p>\n" +
    "\n" +
    "    <p>5.3. to operate, protect, improve and optimize the Platform, our business, and our users’ experience, such as to perform analytics, conduct research, and for advertising and marketing; </p>\n" +
    "\n" +
    "    <p>5.4. to help create and maintain a trusted and safer environment on the Platform including detection and prevention of fraud, unauthorized access, intrusion, and service interruption </p>\n" +
    "\n" +
    "    <p>5.5. to conduct investigations and to respond to disputes between users, refund requests and other similar customer support service; </p>\n" +
    "\n" +
    "    <p>5.6. to send you service, support and administrative messages, reminders, technical notices, updates, security alerts, and information requested by you; </p>\n" +
    "\n" +
    "    <p>5.7. where we have your consent, to send you our newsletter, marketing and promotional messages and other information that may be of interest to you, including HashtagSell&#39;s newsletter and other information sent on behalf of our business partners that we think you may find interesting; and </p>\n" +
    "\n" +
    "    <p>5.8. to comply with our legal obligations or requests from law enforcement agencies, resolve any disputes that we may have with any of our users, and enforce our agreements with third parties.</p>\n" +
    "\n" +
    "    <p>6. Payment.HashtagSell uses or intends to use a third party credit card processing company to handle credit card payments made on the Platform. As part of this process, your name and other credit card information will be sent to third parties for processing. </p>\n" +
    "\n" +
    "    <p>7. Use of Communications. HashtagSell will review, scan, or analyze your communications made via the Platform or with us for fraud prevention, risk assessment, legal/regulatory compliance, investigation, product development, research and customer support purposes. We may also scan, review or analyze messages for research and product development purposes to help make search, and user communications more efficient and effective, as well as to improve our product and service offerings.</p>\n" +
    "\n" +
    "    <p>8. Limitation on Use. HashtagSell will not review, scan, or analyze your communications for sending third party marketing messages to you, nor will to use any of your credit card or payment information as part of our advertising or marketing campaigns.</p>\n" +
    "\n" +
    "    <p>9. Opting Out. You will be able to unsubscribe or opt-out from receiving certain marketing and promotional messages and communications by by clicking the “unsubscribe” link in any promotional email we send to you.</p>\n" +
    "\n" +
    "    <h4>Disclosure of Your Information.</h4>\n" +
    "\n" +
    "    <p>10. Platform Disclosure. Your Personal Information may be disclosed on the Platform as follows: </p>\n" +
    "\n" +
    "    <p>10.1. Certain information from your HashtagSell account will be made available to the public on the Platform, including your user name, picture (if one is provided), the date you created your HashtagSell account. In addition to your information, your public profile will also display other users who may have “followed” you and your rating on HashtagSell. Billing information will never be shared with another user. </p>\n" +
    "\n" +
    "    <p>10.2. HashtagSell may ask you to review the other HashtagSell users. If you choose to provide a review, your comments may be made public on the Platform.</p>\n" +
    "\n" +
    "    <p>11. Social Media. You may link your account on a third party social media site to your HashtagSell account. We refer to a person’s contacts on these third party sites as “Friends.” When you create this link: </p>\n" +
    "\n" +
    "    <p>11.1. information you provide to us from the linking of your accounts may be published on your HashtagSell account profile; </p>\n" +
    "\n" +
    "    <p>11.2. your activities on the Platform may be displayed to your Friends on the Platform and/or the third party site; </p>\n" +
    "\n" +
    "    <p>11.3. other HashtagSell users may be able to see any common Friends that you may have with them, or that you are a Friend of their Friend if applicable; </p>\n" +
    "\n" +
    "    <p>11.4. other HashtagSell users may be able to see any information you have provided on the linked social networking site(s); and</p>\n" +
    "\n" +
    "    <p>11.5. the information you provide to us from the linking of your accounts may be stored, processed and transmitted for fraud prevention and risk assessment purposes. The publication and display of information that you provide to HashtagSell through this linkage is subject to your settings and authorizations on the Platform and the third party site.</p>\n" +
    "\n" +
    "    <p>12.  Disclosures to Partners, Affiliates </p>\n" +
    "\n" +
    "    <p>12.1. HashtagSell may distribute parts of the Platform (including your posts, communications or offers) for display on sites operated by HashtagSell&#39;s business partners or on social media you have linked to your HashtagSell account. If and when your posts, communications or offers are displayed on a partner’s site or on a social media site, information from your public profile page may also be displayed. </p>\n" +
    "\n" +
    "    <p>12.2. We may allow our related entities such as our subsidiaries, and their employees, to use and process your Personal Information in the same way and to the same extent that we are permitted to under this Privacy Policy. These related entities comply with the same obligations that we have to protect your Personal Information under this Privacy Policy.</p>\n" +
    "\n" +
    "    <p>12.3. You acknowledge, consent and agree that HashtagSell may access, preserve and disclose your information, including all Personal Information, if required to do so by law or in a good faith belief that such access, preservation or disclosure is reasonably necessary to (a) respond to claims asserted against HashtagSell; (b) to comply with legal process (for example, court orders, subpoenas and warrants); (c) to enforce and administer our agreements with users, such as the <a href=\"mailto:contact@hashtagsell.com\" target=\"_blank\">contact us</a> and enter your request for cancellation. Please also note that any reviews, forum postings and similar materials posted by you may continue to be publicly available on the Platform in association with your account name, even after your HashtagSell account is cancelled. </p>\n" +
    "\n" +
    "    <h4>Security of Your Personal Information.</h4>\n" +
    "\n" +
    "    <p>15. All communication between the Platform to HashtagSell&#39;s servers is encrypted using 128-bit SSL. We have also sought to use other reasonable administrative, technical, and physical security measures to protect your Personal Information and other information against the unauthorized access, destruction or alteration of your information. However, no method of transmission over the Internet, and no method of storing electronic information, can be 100% secure. HashtagSell cannot guarantee the absolute security of your transmissions to us and of your Personal Information that we store. </p>\n" +
    "\n" +
    "    <p>16. If you become aware of a security issue, please provide us with details regarding the security issue <a href=\"mailto:contact@hashtagsell.com\" target=\"_blank\">contact us</a> . We will work with you to address the security issues you have encountered. </p>\n" +
    "\n" +
    "    <h4>Third Party Websites.</h4>\n" +
    "\n" +
    "    <p>17. The Platform will contain links to other websites not owned or controlled by HashtagSell. These other websites may place their own cookies, web beacons or other files on your device, or collect and solicit Personal Information from you. These third parties will have their own rules about the collection, use and disclosure of Personal Information. HashtagSell encourages you to read the terms of use and privacy policies of the other websites and mobile applications that you visit. </p>\n" +
    "\n" +
    "    <p>18. The Platform utilizes Google Maps API(s) to give other users the approximate location of the goods you post for sale. Your use of Google Maps/Earth is subject to <a href=\"http://www.google.com/intl/en_us/help/terms_maps.html\" target=\"_blank\">Google’s terms of use</a> and <a href=\"http://www.google.com/privacy\">Google’s privacy policy</a> as may be amended by Google from time to time. </p>\n" +
    "\n" +
    "    <p>19. The Platform utilizes Facebook Connect API(s) to allow you to log on to the Platform using your Facebook account. Your use of Facebook is subject to <a href=\"https://www.facebook.com/policies/\">Facebook’s terms and policies</a>, as may be amended by Facebook from time to time. </p>\n" +
    "\n" +
    "    <p>20. HashtagSell, Inc. uses Braintree, a division of PayPal, Inc. (Braintree) for payment processing services. By using the Braintree payment processing services you agree to the Braintree Payment Services Agreement available at <a href=\"https://www.braintreepayments.com/legal/gateway-agreement\">https://www.braintreepayments.com/legal/gateway-agreement</a>, and the applicable bank agreement available at <a href=\"https://www.braintreepayments.com/legal/cea-wells\">https://www.braintreepayments.com/legal/cea-wells</a>. </p>\n" +
    "\n" +
    "    <h4>Amendments.</h4>\n" +
    "\n" +
    "    <p>21. HashtagSell may change how we collect and then use Personal Information at any time, at our sole discretion. </p>\n" +
    "\n" +
    "    <p>22. We may change this Privacy Policy at any time. If we make material changes to the Privacy Policy, we will notify you either by posting the changed Privacy Policy on the Platform or by sending an e-mail to you. We will also update the “Last Updated Date” and the “Effective Date” at the top of this Privacy Policy. If we let you know of changes through an email communication, then the date on which the e-mail is sent shall be the deemed to be the date of your receipt of that email. </p>\n" +
    "\n" +
    "    <p>23. It’s important that you review the changed Privacy Policy. If you do not wish to agree to the changed Privacy Policy, then we will not be able to continue providing the Platform to you, and your only option will be to stop accessing the Platform and deactivate your HashtagSell account. </p>\n" +
    "\n" +
    "    <h4>Applicable Law.</h4>\n" +
    "\n" +
    "    <p>24. International Users. If you are located anywhere outside of the United States, please be aware that information we collect, including, Personal Information, will be transferred to, processed and stored in the United States. The data protection laws in the United States may differ from those of the country in which you are located, and your Personal Information may be subject to access requests from governments, courts, or law enforcement in the United States according to laws of the United States. By using the Platform or providing us with any information, you consent to this transfer, processing and storage of your information in the United States. </p>\n" +
    "\n" +
    "    <p>25. Notice to California Residents. Under California Civil Code Section 1798.83 (known as the “Shine the Light” law), HashtagSell customers who are residents of California may request certain information regarding the disclosure of your Personal Information during the immediate prior calendar year to third parties for their direct marketing purposes. To make such a request, please write to us at the following address: </p>\n" +
    "\n" +
    "    <p>HashtagSell, Inc.<br>\n" +
    "    Customer Service<br>\n" +
    "    1819 Polk Street #323<br>\n" +
    "    San Francisco, Ca 94109</p>\n" +
    "\n" +
    "    <p>or send us your request electronically <a href=\"mailto:contact@hashtagsell.com\" target=\"_blank\">contact us</a> .</p>\n" +
    "\n" +
    "    <p>Questions and Comments.</p>\n" +
    "\n" +
    "    <p>If you’d like to provide feedback to us about this Privacy Policy, or if you have any questions, please <a href=\"mailto:contact@hashtagsell.com\" target=\"_blank\">contact us</a> . </p>\n" +
    "\n" +
    "    <p>Last Modified: 15th May 2015<br>\n" +
    "    © 2015 HashtagSell, Inc.</p>\n" +
    "</div>"
  );


  $templateCache.put('js/legal/termsOfService/partials/termsOfService.partial.html',
    "<style>\n" +
    "    body, html {\n" +
    "        background-color: #ECF0F5;\n" +
    "        overflow-y: auto;\n" +
    "        overflow-x: hidden;\n" +
    "        font-weight: 200;\n" +
    "    }\n" +
    "</style>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "    <h3>HashtagSell Terms of Service</h3>\n" +
    "    <p>Last Updated on May 15th, 2015</p>\n" +
    "\n" +
    "    <p>Effective as of May 15th, 2015</p>\n" +
    "    <p>Use of the Services. We grant you the nonexclusive right to use the Services only for your personal use, subject to these terms. You are solely responsible for all content and other information that you post or submit via the Services (including your listings and any communications you make through the Services with us or other users) and any consequences that may result from your content and other information. You must comply with applicable third party terms of agreement when using the Services (e.g. your wireless data service agreement). Your right to use the Services will terminate immediately if you violate any provision of these terms.</p>\n" +
    "    <p>Restrictions on Use. As a condition of your use of the Services you agree that you will not:</p>\n" +
    "    <ul>\n" +
    "        <li>modify, copy, publish, license, sell, or otherwise commercialize the Services or any information or software associated with the Services;</li>\n" +
    "        <li>rent, lease or otherwise transfer rights to the Services;</li>\n" +
    "        <li>use the Services in any manner that could impair any of our websites or applications in any way or interfere with any party’s use or enjoyment of any such site or application;</li>\n" +
    "        <li>violate any laws;</li>\n" +
    "        <li>violate our <a ui-sref=\"postingRules\">posting rules</a>;\n" +
    "        <li>post any threatening, abusive, defamatory, obscene or indecent material;</li>\n" +
    "        <li>be false or misleading;</li>\n" +
    "        <li>infringe any third-party right;</li>\n" +
    "        <li>distribute or contain spam, chain letters, or pyramid schemes;</li>\n" +
    "        <li>impose an unreasonable load on our infrastructure or interfere with the proper working of the Services;</li>\n" +
    "        <li>copy, modify, or distribute any other person’s content without their consent;</li>\n" +
    "        <li>use any robot spider, scraper or other automated means to access the Services and collect content for any purpose without our express written permission;</li>\n" +
    "        <li>harvest or otherwise collect information about others, including email addresses, without their consent; and/or</li>\n" +
    "        <li>bypass measures used to prevent or restrict access to the Services.</li>\n" +
    "    </ul>\n" +
    "    <p>Abusing the Services. Please report problems, offensive content and policy breaches to us.</p>\n" +
    "    <p>Without limiting other remedies, we may issue warnings, limit or terminate the Services, remove hosted content and take technical and legal steps to keep users off the Services if we think that they are creating problems or acting inconsistently with the letter or spirit of our policies. However, whether we decide to take any of these steps, remove hosted content or keep a user off the Services or not, we do not accept any liability for monitoring the Services or for unauthorized or unlawful content on the Services or use of the Services by users. You also recognize and accept that we are not under any obligation to monitor any content or other information that is communicated through or available on the Services.</p>\n" +
    "    <p>Global Marketplace. Some of our features may display your ad on other sites that are part of the global HashtagSell community, like on eBay Classifieds or our classifieds sites in other countries. By using the Services, you agree that your ads can be displayed on these other sites. The terms for our other sites are similar to these terms, but you may be subject to additional laws or other restrictions in the countries where your ad is posted. When you choose to post your ad on another site, you may be responsible for ensuring that it does not violate our other site policies. We may remove your ad if it is reported on any our sites, or if we believe it causes problems or violates any law or policy.</p>\n" +
    "    <p>Fees and Services. Using the Services is generally free, but we sometimes charge a fee for certain Services. If the Service you use incurs a fee, you’ll be able to review and accept terms that will be clearly disclosed at the time you post your ad. Our fees are quoted in US Dollars, and we may change them from time to time. We’ll notify you of changes to our fee policy by posting such changes on the site. We may choose to temporarily change our fees for promotional events or new services; these changes are effective when we announce the promotional event or new service.</p>\n" +
    "    <p>Our fees are non-refundable, and you are responsible for paying them when they’re due. If you do not, we may limit your ability to use the Services. If your payment method fails or your account is past due, we may collect fees owed using other collection mechanisms.</p>\n" +
    "    <p>Intellectual Property &amp; Content. We own, or are the licensee to, all right, title and interest in and to the Services, including all rights under patent, copyright, trade secret, trademark, or unfair competition law, and any and all other proprietary rights, including all applications, renewals, extensions and restorations thereof. You will not modify, adapt, translate, prepare derivative works from, decompile, reverse-engineer, disassemble or otherwise attempt to derive source code from the Services and you will not remove, obscure or alter our copyright notice, trademarks or other proprietary rights notices affixed to, contained within or accessed in conjunction with or by the Services.</p>\n" +
    "    <p>Our Services contain content from us, you, and other users. Content displayed on or via the Services is protected as a collective work and/or compilation, pursuant to copyrights laws and international conventions. You agree not to copy, distribute, modify, reproduce, copy, sell, resell, or exploit for any purposes any aspect of the Services (other than your own content) without our express written consent.</p>\n" +
    "    <p>When providing us with content or causing content to be posted using our Services, you grant us a non-exclusive, worldwide, perpetual, irrevocable, royalty-free, sublicensable (through multiple tiers) right to exercise any and all copyright, publicity, trademarks, database rights and other intellectual property rights you have in the content, in any media known now or developed in the future. Further, to the fullest extent permitted under applicable law, you waive your moral rights and promise not to assert such rights or any other intellectual property or publicity rights against us, our sublicensees, or our assignees.</p>\n" +
    "    <p>Infringement. Do not post content that infringes the rights of third parties, This includes, but is not limited to, content that infringes on intellectual property rights such as copyright and trademark (e.g. offering counterfeit items for sale). A large number of very varied products are offered on the Services by private individuals. Entitled parties, in particular the owners of copyright, trademark rights or other rights owned by third parties can report any offers which many infringe on their rights, and submit a request for this offer to be removed. If a legal representative of the entitled party reports this to us in the correct manner, products infringing on the intellectual property rights will be removed by us.</p>\n" +
    "    <p>Braintree Service. HashtagSell, Inc. uses Braintree, a division of PayPal, Inc. (Braintree) for payment processing services. By using the Braintree payment processing services you agree to the Braintree Payment Services Agreement available at <a href=\"https://www.braintreepayments.com/legal/gateway-agreement\" target=\"_blank\">https://www.<wbr>braintreepayments.com/legal/<wbr>gateway-agreement</a>, and the applicable bank agreement available at <a href=\"https://www.braintreepayments.com/legal/cea-wells\" target=\"_blank\">https://www.<wbr>braintreepayments.com/legal/<wbr>cea-wells</a>.</p>\n" +
    "    <p>Reporting Intellectual Property Infringements (HashtagSell Notice and Take Down Program)</p>\n" +
    "    <p>If you have a good faith belief that your work has been copied in a way that constitutes copyright infringement, or that your intellectual property rights have been otherwise violated, please provide our designated agent with the following information:</p>\n" +
    "    <ol>\n" +
    "        <li>a physical or electronic signature of the person authorized to act on behalf of the owner of the copyright or other intellectual property interest that is allegedly infringed;</li>\n" +
    "        <li>identification or description of the copyrighted work or other intellectual property that you claim has been infringed. If you are asserting infringement of an intellectual property right other than copyright, please specify the intellectual property right at issue (for example, trademark or patent);</li>\n" +
    "        <li>identification or description of where the material that you claim is infringing is located within the Services, with enough detail that we may find it;</li>\n" +
    "        <li>your address, telephone number, and email address;</li>\n" +
    "        <li>a statement by you that you have a good faith belief that the use of the material complained of is not authorized by the copyright or intellectual property owner, its agent, or the law;</li>\n" +
    "        <li>a statement by you, made under penalty of perjury, that the information in your notice is accurate and that you are the copyright or intellectual property owner or authorized to act on the copyright or intellectual property owner&#39;s behalf. Our agent designated to receive claims of copyright or other intellectual property infringement may be contacted as follows:</li>\n" +
    "    </ol>\n" +
    "    <p>By mail:<br>\n" +
    "        Attn: HashtagSell<br>\n" +
    "        1819 Polk Street #323<br>\n" +
    "        San Francisco, Ca  94109</p>\n" +
    "    <p>By phone: (415)-662-8809</p>\n" +
    "    <p>By email: <a href=\"mailto:copyright@hashtagsell.com\" target=\"_blank\">copyright@hashtagsell.com</a></p>\n" +
    "    <p>We have adopted and implemented a policy that provides for the termination in appropriate circumstances of the accounts of users who repeatedly infringe copyrights or other intellectual property rights of ours and/or others.</p>\n" +
    "    <p>Other Users; Release. You agree not to hold us responsible for things other users post or do. We do not review users’ postings and (except as may be expressly set out in these terms) are not involved in the actual transactions between users. As most of the content on the Services comes from other users, we do not guarantee the accuracy of postings or user communications or the quality, safety, or legality of what’s offered. If you have a dispute with one or more users, you release us (and our affiliates and subsidiaries, and our and their respective officers, directors, employees and agents) from claims, demands and damages (actual and consequential) of every kind and nature, known and unknown, arising out of or in any way connected with such disputes. In entering into this release you expressly waive any protections (whether statutory or otherwise) that would otherwise limit the coverage of this release to include only those claims which you may know or suspect to exist in your favor at the time of agreeing to this release.</p>\n" +
    "    <p>Disclaimer of Warranties. WE DISCLAIM RESPONSIBILITY FOR ANY HARM RESULTING FROM YOUR USE OF THE SERVICES. THE SERVICES, INCLUDING OTHER SERVICE(S) ACCESSED BY THE APPLICATION ARE PROVIDED “AS IS” AND “AS AVAILABLE”. WE EXPRESSLY DISCLAIM TO THE FULLEST EXTENT PERMITTED BY LAW ALL EXPRESS, IMPLIED AND STATUTORY WARRANTIES, INCLUDING WITHOUT LIMITATION THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT OF PROPRIETARY RIGHTS, AND ANY WARRANTIES REGARDING THE SECURITY, RELIABILITY, TIMELINESS AND PERFORMANCE OF THE SERVICES. YOU DOWNLOAD THE APPLICATION AND USE THE SERVICES AT YOUR OWN DISCRETION AND RISK, AND YOU ARE SOLELY RESPONSIBLE FOR ANY DAMAGES TO YOUR HARDWARE DEVICE(S) OR LOSS OF DATA THAT RESULTS FROM THE DOWNLOAD OF THE APPLICATION OR USE OF THE SERVICES. WE CANNOT GUARANTEE CONTINUOUS, ERROR-FREE OR SECURE ACCESS TO THE SERVICES OR THAT DEFECTS IN THE SERVICES WILL BE CORRECTED. NOTIFICATION FUNCTIONALITY IN THE APPLICATION MAY NOT OCCUR IN REAL TIME. SUCH FUNCTIONALITY IS SUBJECT TO DELAYS BEYOND OUR CONTROL, INCLUDING WITHOUT LIMITATION, DELAYS OR LATENCY DUE TO YOUR PHYSICAL LOCATION OR YOUR WIRELESS DATA SERVICE PROVIDER’S NETWORK.</p>\n" +
    "    <p>Limitation of Liability. We are not liable to you or any user for any use or misuse of the Services. This exclusion: (a) includes direct, indirect, incidental, consequential, special, exemplary and punitive damages, whether such claim is based on warranty, contract, tort or otherwise (even if we have been advised of the possibility of such damages); (b) applies whether damages arise from use or misuse of and reliance on the Services, from inability to use the Services, or from the interruption, suspension, or termination of the Services (including any damages incurred by third parties); and (c) applies notwithstanding a failure of the essential purpose of any limited remedy and to the fullest extent permitted by law.</p>\n" +
    "    <p>Despite the previous paragraph, if we are found to be liable, our liability to you or any third party (whether based on contract, tort, negligence, strict liability or otherwise) is limited to the greater of (a) the total fees you pay to us in the 12 months prior to the action giving rise to liability, and (b) 100 US dollars.</p>\n" +
    "    <p>Some jurisdictions do not allow the disclaimer of warranties or exclusion of damages, so the disclaimers in the preceding section and the above limitations and exclusions of liability may not apply to you.</p>\n" +
    "    <p>Indemnification. You will indemnify and hold harmless us (and our affiliates and subsidiaries, and our and their respective officers, directors, employees, agents) against and from any claim or demand, including reasonable legal fees, made by any third party due to or arising out of your conduct, your use of the Services, any alleged violation of these terms, and any alleged violation of any applicable law or regulation. We reserve the right, at our own expense, to assume the exclusive defense and control of any matter subject to indemnification by you, but doing so will not excuse your indemnity obligations. Security. We reserve the right at our discretion to take whatever action we find necessary to preserve the security, integrity and reliability of our network and back-office applications.</p>\n" +
    "    <p>Changes to the Services or Terms of Use. We reserve the right to make changes to the Services and/or these terms from time to time. Any material changes will take effect when you next use the Services or after 30 days, whichever is sooner. If you do not agree to any change, please uninstall the Application and discontinue your use of the Services. No other amendment to these terms will be effective unless made in writing, signed by users and by us.</p>\n" +
    "    <p>Compliance with Certain Laws. You are responsible for complying with trade regulations and both foreign and domestic laws. You represent and warrant that you are not located in a country that is subject to a US Government embargo, or that has been designated by the US Government as a “terrorist supporting” country and you are not listed on any US Government list of prohibited or restricted parties. Our Application or its underlying technology may not be downloaded to or exported or re-exported: (a) into (or to a resident or national of) Cuba, Iraq, Iran, Libya, North Korea, Syria or any other country subject to United States embargo; (b) to anyone on the US Treasury Department’s list of Specially Designated Nationals or on the US Commerce Department’s Denied Party or Entity List; and (c) you will not export or re-export this Application to any prohibited country, person, end-user or entity specified by US Export Laws.</p>\n" +
    "    <p>Miscellaneous Provisions. These terms and the other policies posted on or accessed by the Services constitute the entire agreement between you and us regarding the subject matter of these terms, superseding any prior agreements relating to that subject matter. To the extent permitted by applicable law, these terms shall be governed and construed in all respects by the laws of the State of California without regard to its conflict of law provisions. You agree that any claim or dispute you may have against us must be resolved by the courts of the United States, and you and we both agree to submit to the non-exclusive jurisdiction of San Francisco, California. If we do not enforce any particular provision, we are not waiving our right to do so later. If a court strikes down any of these terms, the remaining terms will survive. We may automatically assign these terms in our sole discretion in accordance with the notice provision below. Except for notices relating to illegal or infringing content, your notices to us must be sent by registered mail to:</p>\n" +
    "    <p>HashtagSell<br>\n" +
    "    1819 Polk Street #323<br>\n" +
    "    San Francisco, Ca  94109</p>\n" +
    "    <p>We will send notices to you via the email address you provide, or by registered mail. Notices sent by registered mail will be deemed received five days following the date of mailing.</p>\n" +
    "    <p>Last Modified: 15th May 2015<br>\n" +
    "    © 2015 HashtagSell, Inc.</p>\n" +
    "</div>"
  );


  $templateCache.put('js/myPosts/meetings/partials/myPosts.meetings.html',
    "<div ng-repeat=\"offer in post.offers.results\">\n" +
    "\n" +
    "        <!--Unread meeting request-->\n" +
    "        <div ng-show=\"!acceptedMeetingTime(offer)\" style=\"border: 1px solid; border-color: #e5e6e9 #dfe0e4 #d0d1d5; margin-bottom: 20px; padding: 0px;\" class=\"col-md-10 col-xs-12\">\n" +
    "            <div style=\"background-color: #ffffff; padding: 10px;\">\n" +
    "                <div>\n" +
    "                    <img ng-src=\"{{offer.userProfile.profile_photo}}\" height=\"40\" style=\"position: relative; top: -12px;\">\n" +
    "                    <div style=\"display: inline-block\">\n" +
    "                        <div>\n" +
    "                            @{{offer.username}}\n" +
    "                        </div>\n" +
    "                        <div>\n" +
    "                            {{offer.modifiedAt | date:\"MMMM d 'at' h:mma\"}}\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <div>\n" +
    "                            Please select a time you're available to meet.\n" +
    "                        </div>\n" +
    "                        <br>\n" +
    "                        <div ng-repeat=\"proposedTime in offer.proposedTimes\" ng-init=\"!!proposedTime.acceptedAt ? offer.response = proposedTime : null\">\n" +
    "                            <input type=\"radio\" ng-model=\"offer.response\" ng-value=\"proposedTime\">\n" +
    "                            {{proposedTime.when | date : 'EEE, MMM d h:mm a'}}\n" +
    "                        </div>\n" +
    "                        <div>\n" +
    "                            <input type=\"radio\" ng-model=\"offer.response\" value=\"Sorry, I'm not available during these times.  Please, submit some other times that may work for you.\">\n" +
    "                            I'm not available during these times.\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"unread-question\">\n" +
    "                <img ng-src={{userObj.user_settings.profile_photo}} height=\"32\">\n" +
    "                <div style=\"display: inline-block; width: 55%; position: relative; top: 5px;\">\n" +
    "                    <input class=\"col-md-7 col-xs-12 form-control\" height=\"32\" style=\"position: relative; top: 8px;\" placeholder=\"Include message.  (Optional)\" ng-model=\"offer.message\"/>\n" +
    "                </div>\n" +
    "                <div style=\"display: inline-block; position: relative;\" ng-show=\"offer.response && !offer.response.when\">\n" +
    "                    <button class=\"btn btn-danger\" ng-click=\"declineOffer(offer, post)\">Decline meeting request</button>\n" +
    "                </div>\n" +
    "\n" +
    "                <div style=\"display: inline-block; position: relative;\" ng-show=\"offer.response.when\">\n" +
    "                    <button class=\"btn btn-primary\" ng-click=\"acceptOffer(offer, post)\">Accept meeting request</button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <!--READ meeting request-->\n" +
    "        <div ng-show=\"acceptedMeetingTime(offer)\" style=\"border: 1px solid; border-color: #e5e6e9 #dfe0e4 #d0d1d5; margin-bottom: 20px; padding: 0px;\" class=\"col-md-10 col-xs-12\">\n" +
    "\n" +
    "            <span ng-show=\"!offer.updateResponse\">\n" +
    "                <div style=\"background-color: #ffffff; padding: 10px;\">\n" +
    "                    <div>\n" +
    "                        <img ng-src=\"{{offer.userProfile.profile_photo}}\" height=\"40\" style=\"position: relative; top: -12px;\">\n" +
    "                        <div style=\"display: inline-block\">\n" +
    "                            <div>\n" +
    "                                @{{offer.username}}\n" +
    "                            </div>\n" +
    "                            <div>\n" +
    "                                {{offer.modifiedAt | date:\"MMMM d 'at' h:mma\"}}\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <div ng-repeat=\"proposedTime in offer.proposedTimes\" ng-init=\"!!proposedTime.acceptedAt ? offer.response = proposedTime : null\">\n" +
    "                                <span ng-show=\"proposedTime.acceptedAt\">Awesome! You're scheduled to meet {{offer.username}} on {{proposedTime.when | date : 'EEE, MMM d h:mm a'}}.</span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"read-question\">\n" +
    "                    <div style=\"display: inline-block; position: relative;\" ng-show=\"offer.response.when\">\n" +
    "                        <button class=\"btn btn-primary\" ng-click=\"offer.updateResponse = true\">Update my response</button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </span>\n" +
    "\n" +
    "\n" +
    "            <span ng-show=\"offer.updateResponse\">\n" +
    "                <div style=\"background-color: #ffffff; padding: 10px;\">\n" +
    "                    <div>\n" +
    "                        <img ng-src=\"{{offer.userProfile.profile_photo}}\" height=\"40\" style=\"position: relative; top: -12px;\">\n" +
    "                        <div style=\"display: inline-block\">\n" +
    "                            <div>\n" +
    "                                @{{offer.username}}\n" +
    "                            </div>\n" +
    "                            <div>\n" +
    "                                {{offer.modifiedAt | date:\"MMMM d 'at' h:mma\"}}\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <div>\n" +
    "                                Please select a time you're available to meet.\n" +
    "                            </div>\n" +
    "                            <br>\n" +
    "                            <div ng-repeat=\"proposedTime in offer.proposedTimes\" ng-init=\"!!proposedTime.acceptedAt ? offer.response = proposedTime : null\">\n" +
    "                                <input type=\"radio\" ng-model=\"offer.response\" ng-value=\"proposedTime\">\n" +
    "                                {{proposedTime.when | date : 'EEE, MMM d h:mm a'}}\n" +
    "                            </div>\n" +
    "                            <div>\n" +
    "                                <input type=\"radio\" ng-model=\"offer.response\" value=\"Actually, I'm not available during this time.  Please, submit some other times that may work for you.\">\n" +
    "                                Whoops. This time no longer works for me.\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"read-question\">\n" +
    "                    <img ng-src={{userObj.user_settings.profile_photo}} height=\"32\">\n" +
    "                    <div style=\"display: inline-block; width: 55%; position: relative; top: 5px;\">\n" +
    "                        <input class=\"col-md-7 col-xs-12 form-control\" height=\"32\" style=\"position: relative; top: 8px;\" placeholder=\"Include message.  (Optional)\" ng-model=\"offer.message\"/>\n" +
    "                    </div>\n" +
    "                    <div style=\"display: inline-block; position: relative;\" ng-show=\"offer.response && !offer.response.when\">\n" +
    "                        <button class=\"btn btn-danger\" ng-click=\"declineOffer(offer, post)\">Decline meeting request</button>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div style=\"display: inline-block; position: relative;\" ng-show=\"offer.response.when\">\n" +
    "                        <button class=\"btn btn-success\" ng-click=\"acceptOffer(offer, post)\">Update meeting request</button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </span>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"col-xs-12\">\n" +
    "    <!--<a ng-show=\"showAnswered && post.questions.results.length\" ng-click=\"showAnswered = !showAnswered\">Hide answered questions</a>-->\n" +
    "    <!--<a ng-show=\"!showAnswered && post.questions.results.length\" ng-click=\"showAnswered = !showAnswered\">Show all answered questions</a>-->\n" +
    "    <span ng-show=\"!post.offers.results.length\">Buyer's requesting to view your {{post.heading | capitalize}} will appear here.</span>\n" +
    "</div>"
  );


  $templateCache.put('js/myPosts/partials/myPosts.html',
    "<div ui-view></div>\n" +
    "\n" +
    "<div class=\"outer-container-myposts custom-myposts-well\">\n" +
    "\n" +
    "    <div ng-show=\"!userPosts.data.length\" class=\"background-instructions\">\n" +
    "        <div class=\"inset-background-text\">\n" +
    "            :( Awww... You're not selling anything.  <span ng-click=\"newPost();\" style=\"cursor: pointer; color: rgb(66, 139, 202);\">Try it out?</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div ng-show=\"userPosts.data.length\">\n" +
    "        <table class=\"table table-striped table-hover\" ng-table=\"tableParams\">\n" +
    "            <thead>\n" +
    "                <tr>\n" +
    "                    <th>\n" +
    "                        <!--<input type=\"text\" ng-model=\"filters.$\" placeholder=\"Search Favorites\" style=\"width:98%; margin:0px;\"/>-->\n" +
    "                    </th>\n" +
    "                    <th>\n" +
    "                        <input class=\"form-control\" ng-model=\"filters.$\" placeholder=\"Filter posts\" />\n" +
    "                    </th>\n" +
    "                </tr>\n" +
    "            </thead>\n" +
    "        </table>\n" +
    "\n" +
    "        <div class=\"inner-myposts-container\">\n" +
    "            <div class=\"myposts-container\">\n" +
    "\n" +
    "                <table class=\"table table-striped table-hover\" ng-show=\"userPosts.data.length\" ng-table=\"tableParams\">\n" +
    "                    <thead>\n" +
    "\n" +
    "                    </thead>\n" +
    "                    <tbody>\n" +
    "\n" +
    "                        <!--TODO: Open splash on click-->\n" +
    "                        <tr ng-repeat-start=\"post in $data\" style=\"cursor: pointer\" ng-click=\"openSplash(post)\">\n" +
    "\n" +
    "                            <td style=\"width:1px;\">\n" +
    "                                <img ng-show=\"post.images.length\" ng-src=\"{{post.images[0].thumbnail || post.images[0].full}}\" style=\"height:70px; width: 70px;\">\n" +
    "                                <div ng-show=\"!post.images.length\" class=\"myPosts-noImage-Placeholder\"></div>\n" +
    "                            </td>\n" +
    "\n" +
    "                            <td>\n" +
    "                                <h4>\n" +
    "                                    {{::post.heading | cleanHeading}} - {{::post.askingPrice.value | currency : $ : 0}}\n" +
    "                                    <span ng-show=\"post.facebook\" class=\"label label-primary\" ng-click=\"showFacebookPost(post); $event.stopPropagation();\" tooltip=\"Show Facebook post\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"bottom\" style=\"font-weight: inherit;\">Facebook</span>\n" +
    "                                    <span ng-show=\"post.twitter\" class=\"label label-info\" ng-click=\"showTwitterPost(post); $event.stopPropagation();\" tooltip=\"Show Twitter Post\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"bottom\" style=\"font-weight: inherit;\">Twitter</span>\n" +
    "                                    <span ng-show=\"post.ebay\" class=\"label label-warning\" ng-click=\"showEbayPost(post); $event.stopPropagation();\" tooltip=\"Show Ebay Post\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"bottom\" style=\"font-weight: inherit;\">Ebay</span>\n" +
    "                                </h4>\n" +
    "\n" +
    "                                <!--<div ng-bind-html=\"post.body\"/>-->\n" +
    "\n" +
    "                                <div style=\"float: left;\">\n" +
    "                                    <button class=\"btn btn-default\" type=\"button\" ng-init=\"unreadQuestionsCount = countUnreadQuestions(post);\" ng-click=\"expandCollapseQuestions($event, post)\">\n" +
    "                                        <i class=\"fa\" ng-class=\"post.currentlyViewing.questions ? 'fa-chevron-down' : 'fa-chevron-right'\"></i> Questions <span ng-if=\"unreadQuestionsCount > 0\" class=\"badge\">{{unreadQuestionsCount}}</span>\n" +
    "                                    </button>\n" +
    "\n" +
    "                                    <button class=\"btn btn-default\" type=\"button\" ng-init=\"unreadOffersCount = countUnreadOffers(post);\" ng-click=\"expandCollapseMeetingRequests($event, post)\">\n" +
    "                                        <i class=\"fa\" ng-class=\"post.currentlyViewing.meetings ? 'fa-chevron-down' : 'fa-chevron-right'\"></i> Meeting Requests <span ng-if=\"unreadOffersCount > 0\" class=\"badge\">{{unreadOffersCount}}</span>\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div style=\"float: right;\">\n" +
    "                                    <i class=\"fa fa-minus-circle fa-2x\" ng-click=\"deletePost(post); $event.stopPropagation();\" style=\"color:red; margin-right: 20px;\" tooltip=\"Delete post\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"left\"></i>\n" +
    "                                    <i class=\"fa fa-pencil-square-o fa-2x\" ng-click=\"editPost(post); $event.stopPropagation();\" style=\"color:#494949; margin-right: 20px;\" tooltip=\"Edit post\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"left\"></i>\n" +
    "                                </div>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "\n" +
    "                        <tr ng-show=\"currentState === 'myposts.questions' && expandedPostingId === post.postingId\" style=\"background-color: rgb(253, 253, 253);\">\n" +
    "                            <td colspan=\"2\" style=\"background-color: rgb(253, 253, 253);\">\n" +
    "                                <owner-questions-more-info post=\"post\"></owner-questions-more-info>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "\n" +
    "                        <tr ng-repeat-end ng-show=\"currentState === 'myposts.meetings' && expandedPostingId === post.postingId\" style=\"background-color: rgb(253, 253, 253);\">\n" +
    "                            <td colspan=\"2\" style=\"background-color: rgb(253, 253, 253);\">\n" +
    "                                <owner-meetings-more-info post=\"post\"></owner-meetings-more-info>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('js/myPosts/questions/partials/myPosts.questions.html',
    "<div ng-repeat=\"question in post.questions.results\">\n" +
    "    <div style=\"border: 1px solid; border-color: #e5e6e9 #dfe0e4 #d0d1d5; margin-bottom: 20px; padding: 0px;\" class=\"col-md-10 col-xs-12\">\n" +
    "        <div style=\"background-color: #ffffff; padding: 10px;\">\n" +
    "            <div>\n" +
    "                <img ng-src=\"{{question.userProfile.profile_photo}}\" height=\"40\" style=\"position: relative; top: -12px;\">\n" +
    "                <div style=\"display: inline-block\">\n" +
    "                    <div>\n" +
    "                        @{{question.username}}\n" +
    "                    </div>\n" +
    "                    <div>\n" +
    "                        {{question.modifiedAt | date:\"MMMM d 'at' h:mma\"}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    <div class=\"dropdown\" dropdown on-toggle=\"toggled(open)\" style=\"position: absolute; top: 10px; right: 15px;\">\n" +
    "                      <a href class=\"dropdown-toggle\" dropdown-toggle><i class=\"fa fa-chevron-down\"></i></a>\n" +
    "                      <ul class=\"dropdown-menu dropdown-menu-right\">\n" +
    "                          <li>\n" +
    "                              <a href ng-click=\"deleteQuestion(question.postingId, question.questionId, $index)\">Delete Question</a>\n" +
    "                          </li>\n" +
    "                      </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    Q: {{question.value}}\n" +
    "                </div>\n" +
    "                <div ng-show=\"question.answers.length\">\n" +
    "                    <div ng-repeat=\"answer in question.answers\">\n" +
    "                        A: {{answer.value}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-class=\"question.answers.length ? 'read-question' : 'unread-question'\">\n" +
    "            <img ng-src={{userObj.user_settings.profile_photo}} height=\"32\">\n" +
    "            <div style=\"display: inline-block; width: 70%; position: relative; top: 5px;\">\n" +
    "                <input class=\"col-md-7 col-xs-12 form-control\" height=\"32\" style=\"position: relative; top: 8px;\" ng-keyup=\"$event.keyCode == 13 && submitAnswer(question, $index)\" placeholder=\"Add answer\" ng-model=\"question.givenAnswer\"/>\n" +
    "            </div>\n" +
    "            <button class=\"btn btn-primary\" ng-click=\"submitAnswer(question, $index)\">Send</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"col-xs-12\">\n" +
    "    <!--<a ng-show=\"showAnswered && post.questions.results.length\" ng-click=\"showAnswered = !showAnswered\">Hide questions already answered?</a>-->\n" +
    "    <!--<a ng-show=\"!showAnswered && post.questions.results.length\" ng-click=\"showAnswered = !showAnswered\">Show questions already answered?</a>-->\n" +
    "    <span ng-show=\"!post.questions.results.length\">Buyer's questions about your {{post.heading | capitalize}} will appear here.</span>\n" +
    "</div>"
  );


  $templateCache.put('js/newPost/modals/congrats/partials/newPost.congrats.html',
    "<div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <div style=\"text-align: center\">\n" +
    "            <i class=\"fa fa-check-circle fa-5x\" style=\"color:#428bca\"></i>&nbsp;<span style=\"font-size: 36px;\">Congratulations!</span>\n" +
    "            <br>\n" +
    "            <!--<h5>You can edit or modify your post <a ui-sref=\"selling\">here</a> or share this link with others-->\n" +
    "                <!--<a ng-href=\"https://www.hashtagsell.com/#/{{newPost.postingId}}\">www.HashtagSell.com/#/{{newPost.postingId}}</a>.-->\n" +
    "            <!--</h5>-->\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button class=\"btn btn-default\" ng-click=\"dismiss('dismiss')\">Done</button>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('js/newPost/modals/newPost/partials/newPost.html',
    "<div class=\"modal-header hts-post-title\">\n" +
    "    <!--<span class=\"pull-left hover-pointer\" ng-click=\"alert('fullscreen zen editor soon.')\">-->\n" +
    "        <!--<i class=\"fa fa-arrows-alt\"></i>-->\n" +
    "    <!--</span>-->\n" +
    "    <span ng-show=\"!jsonObj.category_name  && !manualCategorySelect.show\">Create New Post</span>\n" +
    "    <select ng-show=\"jsonObj.category_name || manualCategorySelect.show\" ng-change=\"manualCategorySelect.init()\" class=\"btn btn-mini category-select\" ng-model=\"jsonObj.category\" tooltip-placement=\"bottom\" tooltip=\"{{manualCategorySelect.tooltip}}\" tooltip-trigger=\"show\">\n" +
    "        <optgroup ng-repeat=\"category in allCategories\" label=\"{{category.name}}\">\n" +
    "            <option ng-repeat=\"childCategory in category.categories\" value=\"{{childCategory.code}}\">{{childCategory.name | capitalize}}</option>\n" +
    "        </optgroup>\n" +
    "    </select>\n" +
    "    <span ng-show=\"jsonObj.category_name\" class=\"drop-down-caret\">\n" +
    "        <i class=\"fa fa-angle-down\"></i>\n" +
    "    </span>\n" +
    "\n" +
    "    <span class=\"close-sell-box\" ng-click=\"dismiss('cancel post')\">\n" +
    "        <i class=\"fa fa-close\" style=\"font-size: 1.5em;\"></i>\n" +
    "    </span>\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"modal-body dropzone hts-post-modal-body\" dropzone=\"dropzoneConfig\">\n" +
    "\n" +
    "    <div class=\"row remove-row-margins\">\n" +
    "\n" +
    "        <alert ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\" close=\"closeAlert($index)\">{{alert.msg}}</alert>\n" +
    "\n" +
    "        <div class=\"hts-input-container\">\n" +
    "            <div id=\"htsPost\"\n" +
    "                 ng-class=\"jsonObj.category_name ? 'col-md-10' : 'col-md-12' \"\n" +
    "                 class=\"hts-input\" style=\"clear:both;\"\n" +
    "                 mentio\n" +
    "                 contenteditable\n" +
    "                 sellbox\n" +
    "                 ng-focus=\"clearDemo()\"\n" +
    "                 data-placeholder=\"I'm selling\"\n" +
    "                 mentio-require-leading-space=\"true\"\n" +
    "                 mentio-macros=\"macros\"\n" +
    "                 mentio-id=\"'hashtag'\"\n" +
    "                 mentio-typed-term=\"typedTerm\"\n" +
    "                 ng-model=\"jsonObj.body\">\n" +
    "\n" +
    "                I'm selling my <span class=\"mention-highlighter\" contenteditable=\"false\" popover-placement=\"bottom\" popover=\"# your item for sale\" popover-trigger=\"show\">#coffee table</span>&nbsp;\n" +
    "                for <span  class=\"mention-highlighter-price\" contenteditable=\"false\" popover-placement=\"top\" popover=\"$ your price\" popover-trigger=\"show\">$75</span>&nbsp;\n" +
    "                <span class=\"mention-highlighter-location\" contenteditable=\"false\" popover-placement=\"bottom\" popover=\"@ your meeting location!\" popover-trigger=\"show\">@1234 Mulberry Street, New York, NY, United States</span>&nbsp;\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-class=\"{ 'hts-annotations-container' : jsonObj.category_name}\">\n" +
    "                <div ng-show=\"jsonObj.annotations.length\" ng-repeat=\"annotation in jsonObj.annotations\">\n" +
    "                    <input ng-model=\"jsonObj.annotations[$index].value\" placeholder=\"{{annotation.key}}\" class=\"hts-annotation-input\">\n" +
    "                </div>\n" +
    "                <div ng-show=\"!jsonObj.annotations.length && jsonObj.category_name\">\n" +
    "                    <div class=\"spinner\">\n" +
    "                        <div class=\"bounce1\"></div>\n" +
    "                        <div class=\"bounce2\"></div>\n" +
    "                        <div class=\"bounce3\"></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row remove-row-margins\">\n" +
    "        <div class=\"inset-toolbar\">\n" +
    "            <div>\n" +
    "                <div style=\"position: absolute; bottom: 15px;\">\n" +
    "                    <button id=\"imageUpload\" class=\"btn btn-primary\" style=\"height: 45px; border-radius: 0px 0px 0px 4px;\">\n" +
    "                        <i class=\"fa fa-camera\"> Add photo</i>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "\n" +
    "                <progressbar value=\"uploadProgress\" id=\"imgPreviewsContainer\" class=\"dz-preview-container progress-striped active\">{{uploadMessage}}</progressbar>\n" +
    "\n" +
    "                <div style=\"position: absolute; right: 15px; bottom: 15px;\" class=\"sellModalButton\" popover-placement=\"left\" popover=\"Publish on Amazon, eBay, Craigslist, and HashtagSell!\" popover-trigger=\"show\">\n" +
    "                    <button class=\"btn btn-primary\" ng-click=\"validatePost()\" style=\"height: 45px; border-radius: 0px 0px 4px 0px;\">\n" +
    "                        <i class=\"fa fa-slack\">Sell It</i>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<!--ng-TEMPLATES-->\n" +
    "\n" +
    "<mentio-menu id=\"mentioMenu\"\n" +
    "        mentio-for=\"'hashtag'\"\n" +
    "        mentio-trigger-char=\"'#'\"\n" +
    "        mentio-items=\"products\"\n" +
    "        mentio-template-url=\"/product-mentions.tpl\"\n" +
    "        mentio-search=\"searchProducts(term)\"\n" +
    "        mentio-select=\"getProductTextRaw(item)\">\n" +
    "</mentio-menu>\n" +
    "\n" +
    "<mentio-menu id=\"mentioMenu\"\n" +
    "        mentio-for=\"'hashtag'\"\n" +
    "        mentio-trigger-char=\"'@'\"\n" +
    "        mentio-items=\"places\"\n" +
    "        mentio-template-url=\"/place-mentions.tpl\"\n" +
    "        mentio-search=\"searchPlaces(term)\"\n" +
    "        mentio-select=\"getPlacesTextRaw(item)\">\n" +
    "</mentio-menu>\n" +
    "\n" +
    "<mentio-menu id=\"mentioMenu\"\n" +
    "        mentio-for=\"'hashtag'\"\n" +
    "        mentio-trigger-char=\"'$'\"\n" +
    "        mentio-items=\"prices\"\n" +
    "        mentio-template-url=\"/price-mentions.tpl\"\n" +
    "        mentio-search=\"searchPrice(term)\"\n" +
    "        mentio-select=\"getPricesTextRaw(item)\">\n" +
    "</mentio-menu>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"/product-mentions.tpl\">\n" +
    "    <ul class=\"list-group user-search demo-scrollable-menu\">\n" +
    "        <li mentio-menu-item=\"product\" ng-repeat=\"product in items\" class=\"list-group-item\">\n" +
    "\n" +
    "            <span class=\"text-primary\" ng-bind-html=\"product.value | mentioHighlight:typedTerm:'menu-highlighted' | unsafe\"></span>\n" +
    "\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</script>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"/place-mentions.tpl\">\n" +
    "    <ul class=\"list-group user-search demo-scrollable-menu\">\n" +
    "        <li mentio-menu-item=\"place\" ng-repeat=\"place in items\" class=\"list-group-item\">\n" +
    "\n" +
    "            <span class=\"text-primary\" ng-bind-html=\"place.description | mentioHighlight:typedTerm:'menu-highlighted' | unsafe\"></span>\n" +
    "\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</script>\n" +
    "\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"/price-mentions.tpl\">\n" +
    "    <ul class=\"list-group user-search demo-scrollable-menu\">\n" +
    "        <li mentio-menu-item=\"price\" ng-repeat=\"price in items\" class=\"list-group-item\">\n" +
    "\n" +
    "            <span class=\"text-primary\" ng-bind-html=\"price.suggestion | mentioHighlight:typedTerm:'menu-highlighted' | unsafe\"></span>\n" +
    "\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</script>\n" +
    "\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"dropzone-thumbnail.html\">\n" +
    "        <div class=\"dz-preview\">\n" +
    "            <img data-dz-thumbnail />\n" +
    "            <i data-dz-remove class=\"fa fa-times dz-remove\"></i>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <strong class=\"error text-danger\" data-dz-errormessage></strong>\n" +
    "        </div>\n" +
    "</script>\n"
  );


  $templateCache.put('js/newPost/modals/pushToExternalSources/partials/newPost.pushToExternalSources.html',
    "<div class=\"modal-header\">\n" +
    "    <h3 class=\"modal-title\" style=\"text-align: center; font-weight: 100 !important\">Share To</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "    <div class=\"settings\">\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"question\">\n" +
    "                Share to your Facebook?\n" +
    "            </div>\n" +
    "            <div class=\"switch\">\n" +
    "                <input id=\"cmn-toggle-1\" class=\"cmn-toggle cmn-toggle-round\" type=\"checkbox\" ng-model=\"shareToggles.facebook\">\n" +
    "                <label for=\"cmn-toggle-1\"></label>\n" +
    "            </div>\n" +
    "        </div><!-- /row -->\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"question\">\n" +
    "                Share to your Twitter?\n" +
    "            </div>\n" +
    "            <div class=\"switch\">\n" +
    "                <input id=\"cmn-toggle-2\" class=\"cmn-toggle cmn-toggle-round\" type=\"checkbox\" ng-model=\"shareToggles.twitter\">\n" +
    "                <label for=\"cmn-toggle-2\"></label>\n" +
    "            </div>\n" +
    "        </div><!-- /row -->\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"question\">\n" +
    "                Share to your eBay?\n" +
    "            </div>\n" +
    "            <div class=\"switch\">\n" +
    "                <input id=\"cmn-toggle-3\" class=\"cmn-toggle cmn-toggle-round\" type=\"checkbox\" ng-model=\"shareToggles.ebay\">\n" +
    "                <label for=\"cmn-toggle-3\"></label>\n" +
    "            </div>\n" +
    "        </div><!-- /row -->\n" +
    "\n" +
    "        <!--<div class=\"row\">-->\n" +
    "        <!--<div class=\"question\">-->\n" +
    "        <!--Share to your Amazon Seller account?-->\n" +
    "        <!--</div>-->\n" +
    "        <!--<div class=\"switch\">-->\n" +
    "        <!--<input id=\"cmn-toggle-4\" class=\"cmn-toggle cmn-toggle-round-flat\" type=\"checkbox\" ng-model=\"shareToggles.amazon\" ng-disabled=\"true\">-->\n" +
    "        <!--<label for=\"cmn-toggle-4\"></label>-->\n" +
    "        <!--</div>-->\n" +
    "        <!--</div>&lt;!&ndash; /row &ndash;&gt;-->\n" +
    "\n" +
    "        <!--<div class=\"row\">-->\n" +
    "        <!--<div class=\"question\">-->\n" +
    "        <!--Share to your Craigslist?-->\n" +
    "        <!--</div>-->\n" +
    "        <!--<div class=\"switch\">-->\n" +
    "        <!--<input id=\"cmn-toggle-5\" class=\"cmn-toggle cmn-toggle-round-flat\" type=\"checkbox\" ng-model=\"shareToggles.craigslist\" ng-disabled=\"true\">-->\n" +
    "        <!--<label for=\"cmn-toggle-5\"></label>-->\n" +
    "        <!--</div>-->\n" +
    "        <!--</div>&lt;!&ndash; /row &ndash;&gt;-->\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"question\">\n" +
    "                Allow Online Payment from Buyer?\n" +
    "            </div>\n" +
    "            <div class=\"switch\">\n" +
    "                <input id=\"cmn-toggle-7\" class=\"cmn-toggle cmn-toggle-yes-no\" type=\"checkbox\" ng-model=\"onlinePayment.allow\">\n" +
    "                <label for=\"cmn-toggle-7\" data-on=\"Yes\" data-off=\"No\"></label>\n" +
    "            </div>\n" +
    "        </div><!-- /row -->\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <!--{{shareToggles}}-->\n" +
    "\n" +
    "    <!--{{onlinePayment}}-->\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"modal-footer\" style=\"background-color:rgba(235, 121, 121, .9);\">\n" +
    "    <button class=\"btn btn-default\" ng-click=\"dismiss('stageTwoSuccess')\">Next</button>\n" +
    "</div>"
  );


  $templateCache.put('js/notifications/partials/notifications.html',
    "<!--<div class=\"background-instructions\">-->\n" +
    "    <!--<div class=\"inset-background-text\">-->\n" +
    "        <!--Coming soon!  We'll notify you when items you're looking for appear online. :)-->\n" +
    "    <!--</div>-->\n" +
    "<!--</div>-->\n" +
    "\n" +
    "<div class=\"outer-container-myposts custom-myposts-well\">\n" +
    "\n" +
    "    <div ng-show=\"!userPosts.data.length\" class=\"background-instructions\">\n" +
    "        <div class=\"inset-background-text\">\n" +
    "            Coming soon!  We'll notify you when items you're looking for appear online. :)\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<!--<div class=\"outer-container\">-->\n" +
    "    <!--<div class=\"inner-container\" vs-repeat vs-offset-before=\"200\" vs-excess=\"100\">-->\n" +
    "\n" +
    "        <!--<div class=\"well notification-item\" ng-repeat=\"item in items.collection\">-->\n" +
    "            <!--<div class=\"col-lg-12\">-->\n" +
    "                <!--<span>{{$index}} - {{item.text}}</span>-->\n" +
    "            <!--</div>-->\n" +
    "        <!--</div>-->\n" +
    "\n" +
    "    <!--</div>-->\n" +
    "<!--</div>-->"
  );


  $templateCache.put('js/payment/partials/payment.partial.html',
    "<style>\n" +
    "    .top-level {\n" +
    "        height: 100%;\n" +
    "    }\n" +
    "\n" +
    "    .body-main {\n" +
    "        background: url(\"//static.hashtagsell.com/htsApp/backdrops/flyingPigeon_dark_compressed.jpg\") no-repeat center center fixed;\n" +
    "        background-size: cover;\n" +
    "        height: 100%;\n" +
    "        width: 100%;\n" +
    "    }\n" +
    "\n" +
    "    .root {\n" +
    "        position: absolute;\n" +
    "        top: 0;\n" +
    "        bottom: 0;\n" +
    "        left: 0;\n" +
    "        right: 0;\n" +
    "        overflow-y: auto;\n" +
    "        overflow-x: hidden;\n" +
    "    }\n" +
    "</style>\n" +
    "\n" +
    "\n" +
    "<!--TODO: Test on iphone, handle if images are not present, overflow y scroll testing-->\n" +
    "<div class=\"payment-container col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-xs-12\" style=\"position: relative\">\n" +
    "\n" +
    "    <div class=\"inner-payment-container\">\n" +
    "\n" +
    "        <div class=\"payment-logo-container\">\n" +
    "            <img src=\"//static.hashtagsell.com/logos/hts/HTS_Logo_White_512w.png\" class=\"payment-hts-logo\">\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <div style=\"text-align: center; margin-top: 10px; margin-bottom: 10px;\" ng-if=\"posting.images[0].thumbnail || posting.images[0].full\">\n" +
    "            <img ng-show=\"sellerProfile.user.profile_photo\" ng-src=\"{{sellerProfile.user.profile_photo}}\" class=\"img-circle\" style=\"height: 80px; border: 5px solid #fff; display: inline-block; position: relative; right: -50px;\">\n" +
    "            <img ng-show=\"posting.images[0].thumbnail || posting.images[0].full\" ng-src=\"{{posting.images[0].thumbnail || posting.images[0].full}}\" class=\"img-thumbnail\" style=\"max-height: 120px;\">\n" +
    "            <img ng-show=\"buyerProfile.user.profile_photo\" ng-src=\"{{buyerProfile.user.profile_photo}}\" class=\"img-circle\" style=\"height: 80px; border: 5px solid #fff; display: inline-block; position: relative; left: -50px;\">\n" +
    "        </div>\n" +
    "\n" +
    "        <div style=\"text-align: center; margin-top: 10px; margin-bottom: 10px;\" ng-if=\"!posting.images[0].thumbnail || !posting.images[0].full\">\n" +
    "            <img ng-show=\"sellerProfile.user.profile_photo\" ng-src=\"{{sellerProfile.user.profile_photo}}\" class=\"img-circle\" style=\"height: 80px; border: 5px solid #fff; display: inline-block;\">\n" +
    "            <div style=\"font-weight: 200!important; font-size: 36px; color: white\">{{posting.heading}}</div>\n" +
    "            <img ng-show=\"buyerProfile.user.profile_photo\" ng-src=\"{{buyerProfile.user.profile_photo}}\" class=\"img-circle\" style=\"height: 80px; border: 5px solid #fff; display: inline-block;\">\n" +
    "        </div>\n" +
    "\n" +
    "        <alert ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\" close=\"closeAlert($index)\">\n" +
    "            <span ng-bind-html=\"alert.msg\"></span>\n" +
    "        </alert>\n" +
    "\n" +
    "        <form action=\"/payments/purchase\" method=\"post\" ng-show=\"!alerts.length\">\n" +
    "\n" +
    "            <braintree-dropin options=\"dropinOptions\">\n" +
    "                Loading payment form...\n" +
    "            </braintree-dropin>\n" +
    "\n" +
    "            <input type=\"hidden\" name=\"token\" value=\"{{posting.postingId}}\"/>\n" +
    "\n" +
    "            <button type=\"submit\" class=\"btn btn-lg btn-primary btn-block\">Send {{posting.askingPrice.value| currency : $}} to {{posting.username}}</button>\n" +
    "\n" +
    "        </form>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('js/peerReview/partials/peerReview.partial.html',
    "<style>\n" +
    "    .top-level {\n" +
    "        height: 100%;\n" +
    "    }\n" +
    "\n" +
    "    .body-main {\n" +
    "        background: url(\"//static.hashtagsell.com/htsApp/backdrops/flyingPigeon_dark_compressed.jpg\") no-repeat center center fixed;\n" +
    "        background-size: cover;\n" +
    "        height: 100%;\n" +
    "        width: 100%;\n" +
    "    }\n" +
    "\n" +
    "    .root {\n" +
    "        position: absolute;\n" +
    "        top: 0;\n" +
    "        bottom: 0;\n" +
    "        left: 0;\n" +
    "        right: 0;\n" +
    "        overflow-y: auto;\n" +
    "        overflow-x: hidden;\n" +
    "    }\n" +
    "\n" +
    "    .glyphicon-star, .glyphicon-star-empty {\n" +
    "        font-size: 3em;\n" +
    "        color: gold;\n" +
    "    }\n" +
    "\n" +
    "    .peer-review-container {\n" +
    "        background: rgba(255, 255, 255, 0.9);\n" +
    "        border-radius: 4px;\n" +
    "        text-align: center;\n" +
    "        font-weight: 100 !important;\n" +
    "        padding: 20px 10px 20px 10px;\n" +
    "        position: relative;\n" +
    "        top: -40px;\n" +
    "    }\n" +
    "\n" +
    "    .reviewee-photo-container{\n" +
    "        text-align: center;\n" +
    "        margin-top: 10px;\n" +
    "        margin-bottom: 10px;\n" +
    "        position: relative;\n" +
    "        z-index: 1;\n" +
    "    }\n" +
    "\n" +
    "    .reviewee-photo {\n" +
    "        height: 80px;\n" +
    "        border: 5px solid #fff;\n" +
    "        display: inline-block;\n" +
    "    }\n" +
    "\n" +
    "    .submit-button{\n" +
    "        position: relative;\n" +
    "        top: -30px;\n" +
    "    }\n" +
    "</style>\n" +
    "\n" +
    "\n" +
    "<div class=\"review-container col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12\" style=\"position: relative\">\n" +
    "\n" +
    "    <div class=\"inner-review-container\">\n" +
    "\n" +
    "        <div class=\"review-logo-container\">\n" +
    "            <img src=\"//static.hashtagsell.com/logos/hts/HTS_Logo_White_512w.png\" class=\"payment-hts-logo\">\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"reviewee-photo-container\">\n" +
    "            <img ng-show=\"reviewee.user.profile_photo\" ng-src=\"{{reviewee.user.profile_photo}}\" class=\"img-circle reviewee-photo\">\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"!alerts.length\">\n" +
    "            <form class=\"peer-review-container\">\n" +
    "\n" +
    "                <h3>How was your experience?</h3>\n" +
    "                <div ng-init=\"review.rating = 0\">\n" +
    "                    <rating ng-model=\"reviewForm.rating\" max=\"5\" state-on=\"'glyphicon-star'\" state-off=\"'glyphicon-star-empty'\"></rating>\n" +
    "                </div>\n" +
    "\n" +
    "                <textarea ng-model=\"reviewForm.comment\" class=\"form-control\" rows=\"5\" placeholder=\"Optional Feedback\"></textarea>\n" +
    "\n" +
    "            </form>\n" +
    "            <button type=\"submit\" class=\"btn btn-lg btn-primary btn-block submit-button\">Submit</button>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('js/profile/partials/profile.partial.html',
    "<div class=\"outer-container\">\n" +
    "    <div class=\"inner-container-padding\">\n" +
    "        <tabset>\n" +
    "            <tab ng-repeat=\"tab in nav\" heading=\"{{tab.title}}\" active=\"tab.active\" disabled=\"tab.disabled\">\n" +
    "                {{tab.data}}\n" +
    "            </tab>\n" +
    "        </tabset>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('js/results/partials/results_partial.html',
    "<div ui-view></div>\n" +
    "\n" +
    "<div ng-show=\"status.error.message\" class=\"background-instructions\">\n" +
    "    <div class=\"inset-background-text\" ng-bind-html=\"status.error.message\">\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"outer-container\">\n" +
    "    <img ng-if=\"status.pleaseWait\" src=\"https://static.hashtagsell.com/htsApp/spinners/hashtag_spinner.gif\" class=\"spinner-abs-center\"/>\n" +
    "    <div class=\"results-container\" resize-grid ng-class=\"{ 'split-results-container' : views.showMap }\">\n" +
    "        <!--GRID VIEW-->\n" +
    "        <div vs-repeat class=\"inner-container\" vs-size=\"rowHeight\" vs-offset-before=\"77\" vs-excess=\"5\" on-vs-index-change=\"infiniteScroll(startIndex, endIndex)\" ng-show=\"views.gridView\">\n" +
    "            <div ng-repeat=\"row in results.gridRows\" style=\"width: 100%;\">\n" +
    "                <div ng-repeat=\"result in row.rowContents\"\n" +
    "                     ng-click=\"openSplash(this)\"\n" +
    "                     class=\"grid-item\"\n" +
    "                     style=\"width: {{results.gridPercentageWidth}}%;\"\n" +
    "                        >\n" +
    "                    <div class=\"thumbnail\" style=\"cursor: pointer\">\n" +
    "                        <ribbon-grid ng-if=\"result.askingPrice.value\">{{result.askingPrice.value | currency : $ : 0}}</ribbon-grid>\n" +
    "                        <hts-fave-toggle class=\"starPositioning\"></hts-fave-toggle>\n" +
    "                        <!--<div style=\"background: url({{result.images[0].full || result.images[0].thumb || result.images[0].images}}) no-repeat center center fixed; height: 172px; webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover;\"></div>-->\n" +
    "                        <img ng-if=\"result.images.length\" ng-src=\"{{::result.images[0].full || result.images[0].thumb || result.images[0].images}}\" class=\"fitImage\">\n" +
    "                        <div ng-if=\"!result.images.length\" class=\"grid-noImage-Placeholder\"></div>\n" +
    "                        <div class=\"caption\">\n" +
    "                            <h4 class=\"heading\" ng-bind-html=\"result.heading | cleanHeading\"></h4>\n" +
    "                            <p class=\"body\" ng-bind-html=\"result.body | cleanBodyExcerpt\"></p>\n" +
    "                            <span class=\"distance\">\n" +
    "                                <i class=\"fa fa-location-arrow\" style=\"color: #777777;\"></i>&nbsp;{{::result.geo.distance* 0.00062137 | number:0}} mi.\n" +
    "                            </span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "        <!--LIST VIEW-->\n" +
    "        <!--{{views.showMap}}-->\n" +
    "        <div vs-repeat class=\"inner-container\" vs-excess=\"7\" vs-size=\"rowHeight\" vs-offset-before=\"77\" ng-show=\"!views.gridView\">\n" +
    "            <div ng-repeat=\"row in results.gridRows\" ng-class=\"views.showMap ? 'list-item-map-view':'list-item'\">\n" +
    "                <div style=\"cursor: pointer;\" ng-repeat=\"result in row.rowContents\" ng-click=\"openSplash(this)\">\n" +
    "\n" +
    "                    <div class=\"thumbnail\">\n" +
    "                        <ribbon-list ng-if=\"!!result.askingPrice.value\" >{{::result.askingPrice.value | currency : $ : 0}}</ribbon-list>\n" +
    "\n" +
    "                        <!--Has NO image-->\n" +
    "                        <div ng-if=\"!result.images.length\">\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"caption\">\n" +
    "                                    <h3 class=\"noImage-heading\" ng-bind-html=\"result.heading | cleanHeading\"></h3>\n" +
    "                                    <hts-fave-toggle class=\"carousel-starPositioning\"></hts-fave-toggle>\n" +
    "                                    <p class=\"noImage-body\" ng-bind-html=\"result.body |cleanBodyExcerpt\"></p>\n" +
    "                                    <div class=\"pull-left carousel-timestamp\">\n" +
    "                                        <small>Posted {{(currentDate - result.external.threeTaps.timestamp) | secondsToTimeString}} ago.</small>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "\n" +
    "                        <!--Has ONE image-->\n" +
    "                        <div ng-if=\"result.images.length == 1\">\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-lg-5 col-md-6 col-sm-6 col-xs-6\">\n" +
    "                                    <img ng-src=\"{{::result.images[0].full || result.images[0].thumb || result.images[0].images}}\" class=\"img-responsive img-rounded singleImage-Image\">\n" +
    "                                </div>\n" +
    "                                <div class=\"col-lg-7 col-md-6 col-sm-6 col-xs-6 singleImage-TextContainer\">\n" +
    "                                    <div class=\"row\">\n" +
    "                                        <div class=\"caption\">\n" +
    "                                            <h3 class=\"singleImage-heading\" ng-bind-html=\"result.heading | cleanHeading\"></h3>\n" +
    "                                            <hts-fave-toggle class=\"singleImage-starPositioning\"></hts-fave-toggle>\n" +
    "                                            <p class=\"singleImage-body\" ng-bind-html=\"result.body |cleanBody\"></p>\n" +
    "                                            <div class=\"pull-left singleImage-timestamp\">\n" +
    "                                                <small><i class=\"fa fa-location-arrow\"></i>&nbsp;{{::result.geo.distance* 0.00062137 | number:0}} mi.</small>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "\n" +
    "                        <!--Has MULTIPLE images-->\n" +
    "                        <div ng-if=\"result.images.length > 1\">\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-lg-12\">\n" +
    "                                    <slick data=\"result.images\" lazy-load='progressive' init-onload=true dots=true infinite=true slides-to-scroll=1 speed=100 variable-width=true center-mode=false next-arrow=\".next-arrow-ctl{{result.postingId}}\" prev-arrow=\".prev-arrow-ctl{{result.postingId}}\">\n" +
    "\n" +
    "                                        <button ng-click=\"$event.stopPropagation();\" type=\"button\" data-role=\"none\" class=\"slick-prev prev-arrow-ctl{{result.postingId}}\" aria-label=\"previous\" style=\"display: block;\">Previous</button>\n" +
    "\n" +
    "                                        <button ng-click=\"$event.stopPropagation();\" type=\"button\" data-role=\"none\" class=\"slick-next next-arrow-ctl{{result.postingId}}\" aria-label=\"next\" style=\"display: block;\">Next</button>\n" +
    "\n" +
    "                                        <div ng-repeat=\"image in result.images\">\n" +
    "                                            <img data-lazy=\"{{image.thumb || image.thumbnail || image.images || image.full}}\"/>\n" +
    "                                        </div>\n" +
    "                                    </slick>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"caption\">\n" +
    "                                    <h3 class=\"carousel-heading\" ng-bind-html=\"result.heading | cleanHeading\"></h3>\n" +
    "                                    <hts-fave-toggle class=\"carousel-starPositioning\"></hts-fave-toggle>\n" +
    "                                    <p class=\"carousel-body\" ng-bind-html=\"result.body |cleanBodyExcerpt\"></p>\n" +
    "                                    <div class=\"pull-left carousel-timestamp\">\n" +
    "                                        <small><i class=\"fa fa-location-arrow\"></i>&nbsp;{{::result.geo.distance* 0.00062137 | number:0}} mi.<small>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"loadingMore\" ng-show=\"status.loading\">\n" +
    "            <img src=\"https://static.hashtagsell.com/htsApp/spinners/ajax-loader.gif\">&nbsp;{{status.loadingMessage}}</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <div class=\"map-container\" ng-class=\"{ 'show-map' : views.showMap }\" ng-if=\"views.showMap\">\n" +
    "        <ui-gmap-google-map center=\"map.center\" zoom=\"map.zoom\" bounds=\"map.bounds\" draggable=\"true\" options=\"map.options\">\n" +
    "            <ui-gmap-markers models=\"map.markers\" options=\"'options'\" coords=\"'coords'\" fit=\"true\" doCluster=\"true\" clusterOptions=\"map.clusterOptions\" doRebuildAll=\"map.refresh\">\n" +
    "            </ui-gmap-markers>\n" +
    "        </ui-gmap-google-map>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('js/settings/account/partials/settings.account_partial.html',
    "<div>\n" +
    "    <div class=\"settings-header\">\n" +
    "        <h3>Account</h3>\n" +
    "        <h4>Manage your account settings</h4>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "    <form class=\"form-horizontal\">\n" +
    "        <div class=\"form-group has-feedback\" ng-class=\"safeSearchUpdated ? 'has-success' : ''\">\n" +
    "            <label class=\"col-sm-2 control-label\">Safe Search</label>\n" +
    "            <div class=\"col-sm-2\">\n" +
    "                <select class=\"form-control\" ng-model=\"safeSearch\" ng-options=\"opt for opt in options.safeSearch\" ng-change=\"setSafeSearch(safeSearch)\"></select>\n" +
    "                <span ng-show=\"safeSearchUpdated\" class=\"glyphicon glyphicon-ok form-control-feedback\" aria-hidden=\"true\"></span>\n" +
    "                <!--<i ng-show=\"safeSearchUpdated\" class=\"fa fa-check-circle fa-2x safeSearch-checkmark\"></i>-->\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group has-feedback\" ng-class=\"defaultEmailUpdated ? 'has-success' : ''\">\n" +
    "            <label class=\"col-sm-2 control-label\">Default Email</label>\n" +
    "            <div class=\"col-sm-2\">\n" +
    "                <select class=\"form-control\" ng-model=\"defaultEmail\" ng-options=\"opt.value as opt.name for opt in options.defaultEmail\" ng-change=\"setDefaultEmail(defaultEmail)\"></select>\n" +
    "                <span ng-show=\"defaultEmailUpdated\" class=\"glyphicon glyphicon-ok form-control-feedback\" aria-hidden=\"true\"></span>\n" +
    "                <!--<i ng-show=\"defaultEmailUpdated\" class=\"fa fa-check-circle fa-2x defaultEmail-checkmark\"></i>-->\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "\n" +
    "            <label class=\"col-sm-2 control-label\">Facebook</label>\n" +
    "            <div class=\"col-sm-5\" ng-show=\"!userObj.user_settings.linkedAccounts.facebook.id\">\n" +
    "                <a href=\"/auth/facebook\" target=\"_self\" class=\"btn btn-primary btn-sm\"><span class=\"fa fa-facebook\"></span> Link Facebook</a>\n" +
    "            </div>\n" +
    "            <div class=\"col-sm-5\" ng-show=\"userObj.user_settings.linkedAccounts.facebook.id\">\n" +
    "                <!--<img ng-src=\"http://graph.facebook.com/v2.3/{{userObj.user_settings.linkedAccounts.facebook.id}}/picture\">-->\n" +
    "                <a ng-click=\"disconnectFacebook()\"><small>Disconnect my Facebook</small></a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">Twitter</label>\n" +
    "            <div class=\"col-sm-5\" ng-show=\"!userObj.user_settings.linkedAccounts.twitter.id\">\n" +
    "                <a href=\"/auth/twitter\" target=\"_self\" class=\"btn btn-info btn-sm\"><span class=\"fa fa-twitter\"></span> Link Twitter</a>\n" +
    "            </div>\n" +
    "            <div class=\"col-sm-5\" ng-show=\"userObj.user_settings.linkedAccounts.twitter.id\">\n" +
    "                <a ng-click=\"disconnectTwitter()\"><small>Disconnect my Twitter</small></a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">eBay</label>\n" +
    "            <div class=\"col-sm-5\" ng-show=\"!userObj.user_settings.linkedAccounts.ebay.eBayAuthToken\">\n" +
    "                <button ng-click=\"getEbaySessionID()\" ng-disabled=\"ebay.sessionId\" class=\"btn btn-info btn-sm\">Step 1: Sign In</button>\n" +
    "                <button ng-click=\"getEbayToken()\" ng-disabled=\"!ebay.sessionId\" class=\"btn btn-info btn-sm\">Step 2: Link Accounts</button>\n" +
    "                <div>\n" +
    "                    <small ng-show=\"ebay.err\" class=\"text-danger\">{{ebay.err}}</small>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-sm-5\" ng-show=\"userObj.user_settings.linkedAccounts.ebay.eBayAuthToken\">\n" +
    "                <a ng-click=\"disconnectEbay()\"><small>Disconnect my eBay</small></a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </form>\n" +
    "</div>\n"
  );


  $templateCache.put('js/settings/password/partials/settings.password_partial.html',
    "<div>\n" +
    "    <div class=\"settings-header\">\n" +
    "        <h3>Password</h3>\n" +
    "        <h4>Change your password</h4>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "    <form id=\"updatePasswordForm\" name=\"updatePasswordForm\" class=\"form-horizontal\" ng-submit=\"updatePassword(updatePasswordForm.$valid)\" novalidate>\n" +
    "\n" +
    "       <div class=\"form-group\" ng-show=\"alerts.length\">\n" +
    "           <label class=\"col-md-2 control-label\"></label>\n" +
    "\n" +
    "           <div class=\"col-md-3\">\n" +
    "               <alert ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\" close=\"closeAlert($index)\">{{alert.msg}}</alert>\n" +
    "           </div>\n" +
    "       </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-md-2 control-label\">Current Password</label>\n" +
    "            <div class=\"col-md-3\">\n" +
    "\n" +
    "                <div class=\"controls\">\n" +
    "                    <input class=\"form-control\" type=\"password\" name=\"currentPassword\" ng-model=\"currentPassword\" required>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-md-2 control-label\">New Password</label>\n" +
    "\n" +
    "            <div class=\"col-md-3\">\n" +
    "                <input class=\"form-control\" type=\"password\" ng-minlength=\"4\" ng-maxlength=\"30\" ng-pattern=\"/^[a-zA-Z0-9.!@#$%&*~+=-_]*$/\" name=\"newPassword\" ng-model=\"newPassword\" required>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-md-2 control-label\">Verify Password</label>\n" +
    "\n" +
    "            <div class=\"col-md-3\">\n" +
    "                <input class=\"form-control\" type=\"password\" name=\"veryifyNewPassword\" ng-model=\"verifyNewPassword\" matchinput=\"newPassword\" required>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <!-- Button -->\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-md-2 control-label\" for=\"submit\"></label>\n" +
    "            <div class=\"col-md-3\">\n" +
    "                <!--<button id=\"submit\" name=\"submit\" class=\"btn btn-primary\"  ng-disabled=\"updatePasswordForm.$invalid\">Submit</button>-->\n" +
    "                <button class=\"btn btn-primary\" ng-show=\"!currentPassword && !newPassword && !verifyNewPassword\">Change password</button>\n" +
    "\n" +
    "                <button id=\"submit\" class=\"btn\" ng-show=\"currentPassword || newPassword || verifyNewPassword\" type=\"submit\" ng-class=\"updatePasswordForm.$invalid ? 'btn-warning' : 'btn-success'\" ng-disabled=\"updatePasswordForm.$invalid\">\n" +
    "                    <span ng-show=\"updatePasswordForm.newPassword.$error.minlength\">Password is too short.</span>\n" +
    "\n" +
    "                    <span ng-show=\"updatePasswordForm.newPassword.$error.pattern\">Remove spaces in password.</span>\n" +
    "\n" +
    "                    <span ng-show=\"updatePasswordForm.veryifyNewPassword.$error.match\">Passwords do not match.</span>\n" +
    "\n" +
    "                    <span ng-show=\"!updatePasswordForm.newPassword.$error.minlength &&\n" +
    "                        !updatePasswordForm.newPassword.$error.pattern &&\n" +
    "                        !updatePasswordForm.veryifyNewPassword.$error.match &&\n" +
    "                        updatePasswordForm.$invalid\"\n" +
    "                            >Keep going</span>\n" +
    "\n" +
    "                    <span ng-show=\"!updatePasswordForm.newPassword.$error.minlength &&\n" +
    "                        !updatePasswordForm.newPassword.$error.pattern &&\n" +
    "                        !updatePasswordForm.veryifyNewPassword.$error.match &&\n" +
    "                        !updatePasswordForm.$invalid\"\n" +
    "                            >Change password</span>\n" +
    "                </button>\n" +
    "\n" +
    "\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </form>\n" +
    "</div>"
  );


  $templateCache.put('js/settings/payment/partials/settings.payment_partial.html',
    "<div>\n" +
    "    <div class=\"settings-header\">\n" +
    "        <h3>Payment & Shipping Settings</h3>\n" +
    "        <h4>Payment</h4>\n" +
    "    </div>\n" +
    "\n" +
    "    <sub-merchant></sub-merchant>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <div class=\"settings-header\">\n" +
    "        <h4>Shipping</h4>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"container\">\n" +
    "        <form class=\"form-horizontal\">\n" +
    "            <fieldset>\n" +
    "\n" +
    "                <!-- Select Basic -->\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-md-8\">\n" +
    "                        <h4>Yep, we're building in shipping support, and it's going to be awesome!</h4>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </fieldset>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('js/settings/profile/partials/settings.profile_partial.html',
    "<div>\n" +
    "    <div class=\"settings-header\">\n" +
    "        <h3>Profile Settings</h3>\n" +
    "        <h4>Manage your profile</h4>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "    <form class=\"form-horizontal\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">Profile Photo</label>\n" +
    "            <div class=\"col-sm-5\">\n" +
    "\n" +
    "                <div ng-hide=\"bindingObj.currentlyUploadingProfilePhoto\" style=\"cursor: pointer\">\n" +
    "                    <img class='triggerProfileImageUpload' ng-src={{userObj.user_settings.profile_photo}} width=\"90px;\"/>\n" +
    "                </div>\n" +
    "\n" +
    "                <div ng-show=\"bindingObj.currentlyUploadingProfilePhoto\" id=\"profilePreview\" dropzone=\"profileDropzoneConfig\">\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">Banner Photo</label>\n" +
    "\n" +
    "            <div class=\"col-sm-5\">\n" +
    "                <div ng-hide=\"bindingObj.currentlyUploadingBannerPhoto\" style=\"cursor: pointer\">\n" +
    "                    <img class='triggerBannerImageUpload img-rounded' ng-src={{userObj.user_settings.banner_photo}} width=\"190px;\"/>\n" +
    "                </div>\n" +
    "\n" +
    "                <div ng-show=\"bindingObj.currentlyUploadingBannerPhoto\" id=\"bannerPreview\" dropzone=\"bannerDropzoneConfig\">\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">About me</label>\n" +
    "\n" +
    "            <div class=\"col-sm-2\">\n" +
    "                <textarea class=\"form-control\" ng-model=\"userObj.user_settings.biography\" ng-change=\"requireUpdate()\">{{userObj.user_settings.biography}}</textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\"></label>\n" +
    "            <div class=\"col-sm-5\">\n" +
    "                <button class=\"btn btn-success\" ng-disabled=\"bindingObj.requireUpdate\" ng-click=\"submitUpdatedProfile()\">Update About Me</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "<!-- Template loaded into dropzone for profile upload -->\n" +
    "<script type=\"text/ng-template\" id=\"profileUploadTemplate.tpl\">\n" +
    "    <div>\n" +
    "        <!-- This is used as the file preview template -->\n" +
    "        <div class=\"triggerProfileImageUpload\">\n" +
    "            <img class=\"img-circle\" data-dz-thumbnail />\n" +
    "            <div class=\"progress progress-striped active\" role=\"progressbar\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"0\">\n" +
    "                <div class=\"progress-bar progress-bar-info\" style=\"width:0%;\" data-dz-uploadprogress></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <strong class=\"error text-danger\" data-dz-errormessage></strong>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</script>\n" +
    "\n" +
    "\n" +
    "<!-- Template loaded into dropzone for heading upload -->\n" +
    "<script type=\"text/ng-template\" id=\"bannerUploadTemplate.tpl\">\n" +
    "    <div>\n" +
    "        <!-- This is used as the file preview template -->\n" +
    "        <div class=\"triggerBannerImageUpload\">\n" +
    "            <img class=\"heading-banner\" data-dz-thumbnail />\n" +
    "            <div class=\"progress progress-striped active\" role=\"progressbar\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"0\">\n" +
    "                <div class=\"progress-bar progress-bar-info\" style=\"width:0%;\" data-dz-uploadprogress></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <strong class=\"error text-danger\" data-dz-errormessage></strong>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</script>"
  );


  $templateCache.put('js/settings/settings_partial.html',
    "<div class=\"outer-container-settings custom-settings-well\">\n" +
    "    <div class=\"inner-container\">\n" +
    "        <div ui-view></div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('js/splash/partials/splash_content.html',
    "<div class=\"container-fluid splash-content\">\n" +
    "    <div class=\"master-container\">\n" +
    "        <div class=\"splash-content-container\" ng-class=\"{ 'offcanvas-open' : !sideNav.hidden}\">\n" +
    "            <div class=\"container\">\n" +
    "                <div class=\"splash-outer-container\">\n" +
    "                    <div class=\"splash-inner-container\">\n" +
    "                        <div style=\"background-color: #f8f8f8; border-bottom: 1px solid #e7e7e7; margin-bottom: 20px;\">\n" +
    "                            <div class=\"container-fluid\">\n" +
    "                                <ul class=\"nav navbar-nav\" style=\"width: 100%;\">\n" +
    "                                    <li style=\"float: left;\">\n" +
    "                                        <a ng-click=\"$dismiss()\">\n" +
    "                                            < Back\n" +
    "                                        </a>\n" +
    "                                    </li>\n" +
    "                                    <li style=\"display: table; margin: 6px auto 0px auto;\">\n" +
    "                                        <h3 style=\"margin: 0px;\" ng-bind-html=\"result.heading | cleanHeading\"></h3>\n" +
    "                                    </li>\n" +
    "                                </ul>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"photo-description-column\" style=\"padding-right: 40%;\">\n" +
    "                            <div class=\"photocarousel\" style=\"margin-left: 20%;\">\n" +
    "                                <div class=\"thumbnail\" style=\"padding: 4px 4px 0px 4px;\" ng-if=\"result.images.length\">\n" +
    "                                    <div class=\"row\">\n" +
    "                                        <div class=\"col-xs-12 splashCarousel\">\n" +
    "                                            <div ng-if=\"result.images.length === 1 && toggles.showCarousel\">\n" +
    "                                                <img ng-src=\"{{::result.images[0].full || result.images[0].thumb || result.images[0].images}}\" class=\"img-responsive singleImage-splash-Image\"/>\n" +
    "                                            </div>\n" +
    "                                            <div ng-if=\"result.images.length > 1\">\n" +
    "                                                <slick ng-if=\"toggles.showCarousel\" data=\"result.images\" lazy-load='progressive' init-onload=true dots=true infinite=true slides-to-scroll=1 speed=100 variable-width=true center-mode=false>\n" +
    "                                                    <div ng-repeat=\"image in result.images\">\n" +
    "                                                        <img data-lazy=\"{{image.thumb || image.thumbnail || image.images || image.full}}\"/>\n" +
    "                                                    </div>\n" +
    "                                                </slick>\n" +
    "                                            </div>\n" +
    "                                            <ui-gmap-google-map class=\"splash-map\" center='map.settings.center' zoom='map.settings.zoom' options='map.settings.options' ng-if=\"!toggles.showCarousel\">\n" +
    "\n" +
    "                                                <ui-gmap-marker coords=\"map.marker.coords\" idkey=\"map.marker.id\" options=\"map.marker.options\" click=\"onClick()\">\n" +
    "                                                    <ui-gmap-window options=\"windowOptions\" show=\"infoWindow.show\" closeClick=\"closeClick()\">\n" +
    "\n" +
    "                                                    </ui-gmap-window>\n" +
    "                                                </ui-gmap-marker>\n" +
    "\n" +
    "                                            </ui-gmap-google-map>\n" +
    "                                            <div style=\"margin: 0px -4px 0px -4px; padding-top: 13px;\">\n" +
    "                                                <div class=\"col-xs-6\" ng-class=\"toggles.showCarousel ? '' : 'grey-photo-selector'\" ng-click=\"toggles.showCarousel = true\" style=\"height: 40px; text-align: center; cursor: pointer;\">\n" +
    "                                                    <i class=\"fa fa-camera fa-lg\" style=\"margin-top: 16px;\">&nbsp; Photos</i>\n" +
    "                                                </div>\n" +
    "                                                <div class=\"col-xs-6\" ng-class=\"toggles.showCarousel ? 'grey-map-selector' : ''\" ng-click=\"toggles.showCarousel = false\" style=\"height: 40px; text-align: center; cursor: pointer;\">\n" +
    "                                                    <i class=\"fa fa-map-marker fa-lg\" style=\"margin-top: 16px;\">&nbsp; Map</i>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"thumbnail\" ng-if=\"!result.images.length\">\n" +
    "                                    <div class=\"row\">\n" +
    "                                        <div class=\"col-xs-12 splashCarousel\">\n" +
    "                                            <ui-gmap-google-map class=\"splash-map\" center='map.settings.center' zoom='map.settings.zoom' options='map.settings.options'>\n" +
    "\n" +
    "                                                <ui-gmap-marker coords=\"map.marker.coords\" idkey=\"map.marker.id\" options=\"map.marker.options\" click=\"onClick()\">\n" +
    "                                                    <ui-gmap-window options=\"windowOptions\" show=\"infoWindow.show\" closeClick=\"closeClick()\">\n" +
    "\n" +
    "                                                    </ui-gmap-window>\n" +
    "                                                </ui-gmap-marker>\n" +
    "\n" +
    "                                            </ui-gmap-google-map>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"details-column\" style=\"margin-left: 20%; padding-top: 13px;\">\n" +
    "                                <div ng-if=\"result.sanitized_annotations\" class=\"row\">\n" +
    "                                    <div ng-repeat=\"(key, value) in result.sanitized_annotations\">\n" +
    "                                        <div class=\"col-lg-4 col-md-4 col-sm-4 col-xs-4\">\n" +
    "                                            <h4 class=\"row annotationKey\">\n" +
    "                                                {{::key}}\n" +
    "                                            </h4>\n" +
    "                                            <div class=\"row annotationValue\">\n" +
    "                                                {{::value}}\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <br>\n" +
    "                            <div style=\"margin-left: 20%;\">\n" +
    "                                <h4>Description:</h4>\n" +
    "                                <div style=\"line-height: 20px; padding-bottom: 75px;\" ng-bind-html=\"result.body | cleanBody\">\n" +
    "\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"bs-profile-nav\" style=\"position: absolute; left: 60%; top: 38px;\">\n" +
    "                            <splash-side-profile result=\"result\">\n" +
    "                                <div class=\"profile\">\n" +
    "                                    <div class=\"profileCircle\">\n" +
    "                                        <img class='bs-profile-image' width=\"70px;\" height=\"70px;\"/>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"splash-username-container\">\n" +
    "                                    <div class=\"splash-bs-username\"></div>\n" +
    "                                    <h2 style=\"color: #216C2A; margin-bottom: 2px;\">{{::result.askingPrice.value | currency : $ : 0}}</h2>\n" +
    "                                    <!--<button type=\"submit\" class=\"btn btn-danger btn-sm btn-block\" ng-click=\"newPost(); $event.stopPropagation();\">New post</button>-->\n" +
    "                                </div>\n" +
    "                            </splash-side-profile>\n" +
    "\n" +
    "                            <!--SideNav-->\n" +
    "                            <div class=\"list-group splash-bs-side-nav ng-cloak\">\n" +
    "                                <a class=\"list-group-item\" ng-if=\"result.external.source.code == 'CRAIG' && result.annotations.source_account\" ng-click=\"emailSeller(result)\" style=\"cursor: pointer\">\n" +
    "                                    <i class=\"fa fa-envelope-square fa-fw fa-lg\"></i>&nbsp; Email seller\n" +
    "                                </a>\n" +
    "                                <a class=\"list-group-item\" ng-if=\"result.external.source.code == 'CRAIG' && result.annotations.phone\" ng-click=\"displayPhone(result)\" style=\"cursor: pointer\">\n" +
    "                                    <i class=\"fa fa-phone-square fa-fw fa-lg\"></i>&nbsp; Phone seller\n" +
    "                                </a>\n" +
    "                                <a  class=\"list-group-item\" ng-if=\"result.external.source.code === 'HSHTG'\" ng-click=\"placeOffer(result)\" style=\"cursor: pointer\">\n" +
    "                                    <i class=\"fa fa-calendar-o fa-fw fa-lg\"></i>&nbsp; Request a meeting\n" +
    "                                </a>\n" +
    "                                <!--<a  class=\"list-group-item\" ng-if=\"result.external.source.code === 'HSHTG'\" ng-click=\"buyOnline(result)\" style=\"cursor: pointer\" =>-->\n" +
    "                                    <!--<i class=\"fa fa-paypal fa-fw fa-lg\"></i>&nbsp; Payment & Shipping-->\n" +
    "                                <!--</a>-->\n" +
    "                                <a class=\"list-group-item\"  ng-if=\"result.external.source.code === 'E_BAY'\" ng-click=\"placeBid(result)\" style=\"cursor: pointer\">\n" +
    "                                    <i class=\"fa fa-credit-card fa-fw fa-lg\"></i>&nbsp; Bid on item\n" +
    "                                </a>\n" +
    "                                <a class=\"list-group-item\" ng-click=\"toggleFave(result)\" style=\"cursor: pointer\">\n" +
    "                                    <span ng-show=\"favorited\">\n" +
    "                                        <span ng-show=\"favorited\" ng-class=\"{starHighlighted: favorited, star: !favorited}\" class=\"fa fa-fw fa-lg\"></span>&nbsp; Remove from watch list\n" +
    "                                    </span>\n" +
    "                                    <span ng-show=\"!favorited\">\n" +
    "                                        <span ng-class=\"{starHighlighted: favorited, star: !favorited}\" class=\"fa fa-fw fa-lg\"></span>&nbsp; Add to watch list\n" +
    "                                    </span>\n" +
    "                                </a>\n" +
    "                                <!--<a class=\"list-group-item\" onclick=\"alert('spam reporting feature soon')\" style=\"cursor: pointer\">-->\n" +
    "                                    <!--<i class=\"fa fa-flag fa-fw fa-lg\"></i>&nbsp; Report-->\n" +
    "                                <!--</a>-->\n" +
    "                                <a class=\"list-group-item\" ng-if=\"result.external.source.url && result.external.source.code != 'HSHTG'\" ng-click=\"showOriginal(result)\" style=\"cursor: pointer\">\n" +
    "                                    <i class=\"fa fa-external-link-square fa-fw fa-lg\"></i>&nbsp; Show original post\n" +
    "                                </a>\n" +
    "                            </div>\n" +
    "\n" +
    "\n" +
    "                            <div ng-if=\"result.external.source.code === 'HSHTG'\" ng-init=\"getPostingIdQuestions()\">\n" +
    "                                <p class=\"input-group\">\n" +
    "                                    <input class=\"form-control\" ng-model=\"qamodule.question\" placeholder=\"Ask the seller a question\" ng-enter=\"submitQuestion(qamodule.question)\"/>\n" +
    "                                    <span class=\"input-group-btn\">\n" +
    "                                        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"submitQuestion(qamodule.question)\">Ask</button>\n" +
    "                                    </span>\n" +
    "                                </p>\n" +
    "                                <div ng-repeat=\"question in questions.store\">\n" +
    "                                    <div class=\"question-counter-block\">\n" +
    "                                        <span class=\"stack-question-counter fa-2x\">\n" +
    "                                            <i class=\"fa fa-caret-up\"></i>\n" +
    "                                            <div>{{question.plus.length}}</div>\n" +
    "                                            <i class=\"fa fa-caret-down\"></i>\n" +
    "                                        </span>\n" +
    "                                        <div class=\"questions-and-answers\">\n" +
    "                                            <div class=\"question\">\n" +
    "                                                <b>Q:</b> {{question.value}}\n" +
    "                                            </div>\n" +
    "                                            <div ng-repeat=\"answer in question.answers\">\n" +
    "                                                <div class=\"answer\" ng-if=\"answer.value\"><b>A:</b> {{answer.value}}</div>\n" +
    "                                            </div>\n" +
    "                                            <div ng-if=\"result.username === userObj.user_settings.name && !question.answers.length\">\n" +
    "                                                <a class=\"answer\" ui-sref=\"myposts.questions({postingId: question.postingId})\">Click here to answer.</a>\n" +
    "                                            </div>\n" +
    "                                            <div ng-if=\"result.username !== userObj.user_settings.name && !question.answers.length\">\n" +
    "                                                <a class=\"answer\">The seller has been notified.</a>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('js/splash/partials/splash_window.html',
    "<section class=\"splash\" ng-class=\"{'splash-open': animate}\">\n" +
    "    <div class=\"splash-inner\" ng-transclude></div>\n" +
    "</section>"
  );


  $templateCache.put('js/submerchant/modals/partials/submerchant.modal.partial.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head lang=\"en\">\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title></title>\n" +
    "</head>\n" +
    "<body>\n" +
    "    <div class=\"modal-header\">\n" +
    "\n" +
    "        <button type=\"button\" class=\"close\" ng-click=\"$dismiss('abortSubMerchantModal')\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "\n" +
    "        <h3 id=\"myModalLabel\" style=\"font-weight: 100 !important;\">How do we send you money?</h3>\n" +
    "\n" +
    "    </span>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <sub-merchant></sub-merchant>\n" +
    "    </div>\n" +
    "    <!--<div class=\"modal-footer\">-->\n" +
    "        <!--<input class=\"btn btn-success\" type=\"submit\" value=\"Send recovery email\" ng-disabled=\"forgotPasswordForm.$invalid\">-->\n" +
    "    <!--</div>-->\n" +
    "\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('js/submerchant/partials/submerchant.partial.html',
    "\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "\n" +
    "    <alert ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\" close=\"closeAlert($index)\">{{alert.msg}}</alert>\n" +
    "\n" +
    "    <form name=\"subMerchForm\" class=\"form-horizontal\" autocomplete=\"false\" ng-submit=\"submitSubMerchant()\">\n" +
    "        <fieldset>\n" +
    "\n" +
    "            <!-- Select Basic -->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"business\">Are you a business?</label>\n" +
    "                <div class=\"col-md-2\">\n" +
    "                    <select id=\"business\" name=\"business\" class=\"form-control\" ng-init=\"subMerchantForm.business.isBusinessAccount = subMerchantForm.business.businessOptionsDropdown[0]\" ng-model=\"subMerchantForm.business.isBusinessAccount\" ng-options=\"opt.name for opt in subMerchantForm.business.businessOptionsDropdown\" novalidate>\n" +
    "\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Text input-->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"firstname\">First Name</label>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <input id=\"firstname\" name=\"firstname\" type=\"text\" placeholder=\"First Name\" ng-model=\"subMerchant.individual.firstName\" class=\"form-control input-md\" required=\"required\">\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Text input-->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"lastname\">Last Name</label>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <input id=\"lastname\" name=\"lastname\" type=\"text\" placeholder=\"Last Name\" ng-model=\"subMerchant.individual.lastName\" class=\"form-control input-md\" required=\"required\">\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Text input-->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"individualEmail\">Email</label>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <input id=\"individualEmail\" name=\"IndividualEmail\" type=\"email\" placeholder=\"Email\" ng-model=\"subMerchant.individual.email\" class=\"form-control input-md\" required=\"required\">\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Text input-->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"dob\">Date of birth</label>\n" +
    "                <div class=\"col-md-3\">\n" +
    "                    <input id=\"dob\" name=\"dob\" type=\"text\" placeholder=\"mm/dd/yyyy\" ng-model=\"subMerchantForm.individual.dateOfBirth\" class=\"form-control input-md\" required=\"required\" ng-pattern=\"/\\d\\d\\/\\d\\d\\/\\d\\d\\d\\d/\" ng-maxlength=\"10\" ng-minlength=\"10\">\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "            <!-- Text input-->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"individualAddress\">Address</label>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <input autocomplete=\"false\" id=\"individualAddress\" name=\"individualAddress\" type=\"text\" placeholder=\"Address\" ng-model=\"subMerchantForm.individual.addressLookup\" typeahead=\"city.description for city in predictAddress($viewValue)\" typeahead-on-select='setAddressComponents($item, \"individual\")' class=\"form-control input-md\" required=\"required\" >\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Text input-->\n" +
    "            <div class=\"form-group\" ng-show=\"subMerchantForm.business.isBusinessAccount.value\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"companyname\">Company Name</label>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <input id=\"companyname\" name=\"companyname\" type=\"text\" placeholder=\"Company Name\" ng-model=\"subMerchant.business.legalName\" class=\"form-control input-md\" ng-required='subMerchantForm.business.isBusinessAccount.value'>\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-show=\"subMerchantForm.business.isBusinessAccount.value\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"businessaddress\">Address</label>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <input autocomplete=\"off\" id=\"businessaddress\" name=\"business\" type=\"text\" placeholder=\"Business address\" ng-model=\"subMerchantForm.business.addressLookup\" typeahead=\"city.description for city in predictAddress($viewValue)\" typeahead-on-select='setAddressComponents($item, \"business\")' class=\"form-control input-md\" ng-required='subMerchantForm.business.isBusinessAccount.value' >\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Text input-->\n" +
    "            <div class=\"form-group\" ng-show=\"subMerchantForm.business.isBusinessAccount.value\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"taxid\">Tax Id</label>\n" +
    "                <div class=\"col-md-3\">\n" +
    "                    <input id=\"taxid\" name=\"taxid\" type=\"number\" placeholder=\"Tax Id\" ng-model=\"subMerchant.business.taxId\" class=\"form-control input-md\" ng-required='subMerchantForm.business.isBusinessAccount.value'>\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Multiple Radios -->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"destination\">Send funds to</label>\n" +
    "                <div class=\"col-md-3\">\n" +
    "                    <div class=\"radio\">\n" +
    "                        <label for=\"destination-0\">\n" +
    "                            <input type=\"radio\" name=\"destination\" id=\"destination-0\" ng-model=\"subMerchantForm.destination.disperseType\" value=\"bank\" required=\"required\">\n" +
    "                            Bank Account\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                    <div class=\"radio\">\n" +
    "                        <label for=\"destination-1\">\n" +
    "                            <input type=\"radio\" name=\"destination\" id=\"destination-1\" ng-model=\"subMerchantForm.destination.disperseType\" value=\"venmo\" required=\"required\">\n" +
    "                            Venmo\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Text input-->\n" +
    "            <div class=\"form-group\" ng-show=\"subMerchantForm.destination.disperseType === 'bank'\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"accountnumber\">Bank Account No.</label>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <input id=\"accountnumber\" name=\"accountnumber\" type=\"number\" placeholder=\"Bank Account No.\" ng-model=\"subMerchant.funding.accountNumber\" class=\"form-control input-md\" ng-required=\"subMerchantForm.destination.disperseType === 'bank'\">\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Text input-->\n" +
    "            <div class=\"form-group\" ng-show=\"subMerchantForm.destination.disperseType === 'bank'\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"routingnumber\">Bank Routing No.</label>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <input id=\"routingnumber\" name=\"routingnumber\" type=\"number\" placeholder=\"Bank Routing No.\" ng-model=\"subMerchant.funding.routingNumber\" class=\"form-control input-md\" ng-required=\"subMerchantForm.destination.disperseType === 'bank'\">\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Text input-->\n" +
    "            <div class=\"form-group\" ng-show=\"subMerchantForm.destination.disperseType === 'venmo'\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"venmoemail\">Venmo Email</label>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <input id=\"venmoemail\" name=\"venmoemail\" type=\"email\" placeholder=\"Venmo Email Account\" ng-model=\"subMerchant.funding.email\" class=\"form-control input-md\" ng-required=\"subMerchantForm.destination.disperseType === 'venmo'\">\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Button -->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"col-md-2 control-label\" for=\"submit\"></label>\n" +
    "                <div class=\"col-md-3\">\n" +
    "                    <button id=\"submit\" name=\"submit\" class=\"btn btn-warning\" ng-show=\"recoveredMerchantAccount.response.status === 'active'\">Change Payment Settings</button>\n" +
    "                    <button id=\"submit\" name=\"submit\" class=\"btn btn-primary\" ng-show=\"recoveredMerchantAccount.response.status === 'declined'\">Re-Submit</button>\n" +
    "                    <button id=\"submit\" name=\"submit\" class=\"btn btn-primary\" ng-show=\"recoveredMerchantAccount.response.status === 'pending'\" ng-disabled=\"true\">Pending approval</button>\n" +
    "                    <button id=\"submit\" name=\"submit\" class=\"btn btn-primary\" ng-show=\"!recoveredMerchantAccount.response.status\">Submit</button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!--{{subMerchant}}-->\n" +
    "\n" +
    "            <!--{{recoveredMerchantAccount}}-->\n" +
    "\n" +
    "        </fieldset>\n" +
    "    </form>\n" +
    "</div>\n" +
    "\n" +
    "<!--{{subMerchantForm}}-->"
  );


  $templateCache.put('js/transactionButtons/modals/email/partials/transactionButtons.modal.email.partial.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head lang=\"en\">\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title>HashtagSell Quick Compose</title>\n" +
    "</head>\n" +
    "<body>\n" +
    "\n" +
    "    <!--<form name=\"loginForm\" id=\"loginForm\" class=\"form-horizontal\" ng-submit=\"loginPassport(loginForm.$valid)\" novalidate>-->\n" +
    "        <!--<div class=\"modal-header\">-->\n" +
    "            <!--<h3 id=\"myModalLabel\">Private Beta Login!</h3>-->\n" +
    "        <!--</div>-->\n" +
    "        <!--<div class=\"modal-body\">-->\n" +
    "            <!--<label class=\"control-label\" for=\"email\">Email Address:</label>-->\n" +
    "            <!--<div class=\"controls\">-->\n" +
    "                <!--<input type=\"email\" id=\"email\" ng-model=\"email\" required>-->\n" +
    "            <!--</div>-->\n" +
    "            <!--<br>-->\n" +
    "            <!--<label class=\"control-label\" for=\"password\">Password:</label>-->\n" +
    "            <!--<div class=\"controls\">-->\n" +
    "                <!--<input type=\"password\" id=\"password\" ng-model=\"password\" required>-->\n" +
    "                <!--<br>-->\n" +
    "                <!--<small style=\"color:red;\">-->\n" +
    "                    <!--{{message}}-->\n" +
    "                <!--</small>-->\n" +
    "                <!--<br>-->\n" +
    "                <!--<a href ng-click=\"dismiss('signUp')\">-->\n" +
    "                    <!--<small>Need an account?</small>-->\n" +
    "                <!--</a>-->\n" +
    "                <!--<small> | </small>-->\n" +
    "                <!--<a href ng-click=\"dismiss('forgot')\">-->\n" +
    "                    <!--<small>Forgot your password?</small>-->\n" +
    "                <!--</a>-->\n" +
    "            <!--</div>-->\n" +
    "        <!--</div>-->\n" +
    "        <!--<div class=\"modal-footer\">-->\n" +
    "            <!--<input class=\"btn btn-success\" type=\"submit\" value=\"Log In\" id=\"submit\" ng-disabled=\"loginForm.$invalid\">-->\n" +
    "            <!--<button class=\"btn btn-default\" ng-click=\"dismiss('dismiss')\">Close</button>-->\n" +
    "        <!--</div>-->\n" +
    "    <!--</form>-->\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <!--<div ng-controller=\"quickComposeController\">-->\n" +
    "        <!--<div id=\"QuickComposeEmail\" class=\"modal hide fade\" data-backdrop=\"false\">-->\n" +
    "            <form class=\"form-horizontal\">\n" +
    "                <div class=\"modal-header\">\n" +
    "                    <h3 id=\"myModalLabel\">Select Email</h3>\n" +
    "                </div>\n" +
    "                <div class=\"modal-body\">\n" +
    "                    <select class=\"form-control\" ng-model=\"selected\" ng-options=\"o.value as o.name for o in emailOptionsObject\">\n" +
    "\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"modal-footer\">\n" +
    "                    <span ng-show=\"userObj.user_settings.loggedIn\" class=\"pull-left\">\n" +
    "\n" +
    "                            <input type=\"checkbox\" ng-model=\"setDefaultEmailProvider\"> Save as default email.\n" +
    "\n" +
    "                    </span>\n" +
    "                    <span ng-show=\"!userObj.user_settings.loggedIn\" class=\"pull-left\">\n" +
    "                        <small><a ng-click=\"dismiss('signUp')\" style=\"cursor: pointer;\">Create a free account to setup default mail settings</a></small>\n" +
    "                    </span>\n" +
    "                    <button class=\"btn btn-success\" ng-click=\"qcEmail()\">Compose Email</button>\n" +
    "                    <button class=\"btn btn-default\" ng-click=\"dismiss('dismiss')\">Close</button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        <!--</div>-->\n" +
    "\n" +
    "\n" +
    "        <!--<div id=\"QuickComposePhone\" class=\"modal hide fade\" data-backdrop=\"false\">-->\n" +
    "            <!--<div class=\"modal-header\">-->\n" +
    "                <!--<h3 id=\"myModalLabel\">Call or Text</h3>-->\n" +
    "            <!--</div>-->\n" +
    "            <!--<div class=\"modal-body\">-->\n" +
    "                <!--<div>Seller did not include an email.  Please contact:</div>-->\n" +
    "                <!--<h4>{{dynamicContent.phone}}</h4>-->\n" +
    "            <!--</div>-->\n" +
    "            <!--<div class=\"modal-footer\">-->\n" +
    "                <!--<button class=\"btn btn-default\" data-dismiss=\"modal\" aria-hidden=\"true\">Close</button>-->\n" +
    "            <!--</div>-->\n" +
    "        <!--</div>-->\n" +
    "\n" +
    "\n" +
    "        <!--<div id=\"QuickComposeFail\" class=\"modal hide fade\" data-backdrop=\"false\">-->\n" +
    "            <!--<form id=\"quickComposeForm\" style=\"margin: 0px;\" class=\"form-horizontal\">-->\n" +
    "                <!--<div class=\"modal-header\">-->\n" +
    "                    <!--<h3 id=\"myModalLabel\">No phone or email found :(</h3>-->\n" +
    "                <!--</div>-->\n" +
    "                <!--<div class=\"modal-body\">-->\n" +
    "                    <!--The seller did not provide their contact info.  Please read the ad carefully.-->\n" +
    "                <!--</div>-->\n" +
    "                <!--<div class=\"modal-footer\">-->\n" +
    "                    <!--<button class=\"btn btn-default\" data-dismiss=\"modal\" aria-hidden=\"true\">Close</button>-->\n" +
    "                <!--</div>-->\n" +
    "            <!--</form>-->\n" +
    "        <!--</div>-->\n" +
    "    <!--</div>-->\n" +
    "\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('js/transactionButtons/modals/phone/partials/transactionButtons.modal.phone.partial.html',
    "<form class=\"form-horizontal\">\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h3 id=\"myModalLabel\">Seller Phone Number</h3>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <h3 ng-bind=\"result.annotations.phone | tel\"></h3>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <span ng-show=\"!userObj.user_settings.loggedIn\" class=\"pull-left\">\n" +
    "            <small><a ng-click=\"dismiss('signUp')\" style=\"cursor: pointer;\">Create your free HashtagSell account.</a></small>\n" +
    "        </span>\n" +
    "        <button class=\"btn btn-default\" ng-click=\"dismiss('dismiss')\">Close</button>\n" +
    "    </div>\n" +
    "</form>"
  );


  $templateCache.put('js/transactionButtons/modals/placeOffer/partials/transactionButtons.modal.placeOffer.partial.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head lang=\"en\">\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title>HashtagSell Place an Offer</title>\n" +
    "</head>\n" +
    "<body>\n" +
    "\n" +
    "    <form class=\"form-horizontal\">\n" +
    "        <div class=\"modal-header\">\n" +
    "            <h3 id=\"myModalLabel\">Let's meet!</h3>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "            Schedule a time you can meet the seller face to face.\n" +
    "            <br>\n" +
    "            <br>\n" +
    "            Location: <span class=\"mention-highlighter\">@{{result.external.threeTaps.location.formatted}}</span>\n" +
    "            <br>\n" +
    "            <br>\n" +
    "            <ul>\n" +
    "                <li ng-repeat=\"proposedTime in offer.proposedTimes track by $index\">\n" +
    "                    {{proposedTime.when | date:'MMM d, y h:mm a'}}\n" +
    "                    <i class=\"fa fa-trash-o\" ng-click=\"removeProposedTime($index)\" style=\"cursor: pointer; color: red\"></i>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            <div class=\"dropdown row\" dropdown is-open=\"dropDownStatus.isOpen\">\n" +
    "                <a href class=\"dropdown-toggle col-xs-8\" dropdown-toggle>\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <input type=\"text\" class=\"form-control\" data-ng-model=\"data.dateDropDownInput\" placeholder=\"Propose times you can meet\">\n" +
    "                        <span class=\"input-group-addon\">\n" +
    "                            <i class=\"glyphicon glyphicon-calendar\"></i>\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "                <ul class=\"dropdown-menu\">\n" +
    "                    <li>\n" +
    "                        <datetimepicker data-ng-model=\"data.dateDropDownInput\" data-datetimepicker-config=\"{ minuteStep: 15 }\" data-on-set-time=\"onTimeSet(newDate, oldDate)\"/>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <span ng-show=\"!userObj.user_settings.loggedIn\" class=\"pull-left\">\n" +
    "                <small><a ng-click=\"dismiss('signUp')\" style=\"cursor: pointer;\">Create your free HashtagSell account.</a></small>\n" +
    "            </span>\n" +
    "            {{allowSubmission}}\n" +
    "            <button class=\"btn btn-default btn-primary\" ng-click=\"sendOffer()\" ng-disabled=\"disableSubmission\">Send</button>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('js/transactionButtons/partials/transactionButtons.partial.html',
    "\n" +
    "<!--CL item and has email-->\n" +
    "<button ng-if=\"result.source == 'CRAIG' && result.annotations.source_account\" ng-click=\"quickCompose(); $event.stopPropagation();\" class=\"btn btn-default\" role=\"button\"><i class=\"fa fa-envelope-o fa-lg\"></i>&nbsp; Email</button>\n" +
    "\n" +
    "<!--CL item and only has phone-->\n" +
    "<button ng-if=\"result.source == 'CRAIG' && result.annotations.phone\" ng-click=\"displayPhone(); $event.stopPropagation();\" class=\"btn btn-default\" role=\"button\"><i class=\"fa fa-phone fa-lg\"></i>&nbsp; Phone</button>\n" +
    "\n" +
    "<!--CL has no phone or email-->\n" +
    "<button ng-if=\"result.source == 'CRAIG' && !result.annotations.phone && !result.annotations.source_account\" ng-click=\"openSplash(); $event.stopPropagation();\" class=\"btn btn-default\" role=\"button\"><i class=\"fa fa-external-link fa-lg\"></i>&nbsp; Details</button>\n" +
    "\n" +
    "<!--E_Bay Item-->\n" +
    "<a ng-if=\"result.source == 'E_BAY'\" style=\"cursor: pointer;\" ng-click=\"placeBid(); $event.stopPropagation();\" class=\"btn btn-default\" role=\"button\"><i class=\"fa fa-credit-card fa-lg\"></i>&nbsp; Place Bid</a>\n" +
    "\n" +
    "<!--E_Bay Motors-->\n" +
    "<a ng-if=\"result.source == 'EBAYM'\" style=\"cursor: pointer;\" ng-click=\"openSplash(); $event.stopPropagation();\" class=\"btn btn-default\" role=\"button\"><i class=\"fa fa-external-link fa-lg\"></i>&nbsp; Details</a>\n" +
    "\n" +
    "<!--Apartments.com-->\n" +
    "<a ng-if=\"result.source == 'APTSD'\" style=\"cursor: pointer;\" ng-click=\"openSplash(); $event.stopPropagation();\" class=\"btn btn-default\" role=\"button\"><i class=\"fa fa-external-link fa-lg\"></i>&nbsp; Details</a>\n" +
    "\n" +
    "<!--Backpage -->\n" +
    "<a ng-if=\"result.source == 'BKPGE'\" style=\"cursor: pointer;\" ng-click=\"openSplash(); $event.stopPropagation();\" class=\"btn btn-default\" role=\"button\"><i class=\"fa fa-external-link fa-lg\"></i>&nbsp; Details</a>\n" +
    "\n" +
    "<!--Autotrader -->\n" +
    "<a ng-if=\"result.source == 'AUTOD'\" style=\"cursor: pointer;\" ng-click=\"openSplash(); $event.stopPropagation();\" class=\"btn btn-default\" role=\"button\"><i class=\"fa fa-external-link fa-lg\"></i>&nbsp; Details</a>\n" +
    "\n" +
    "<!--HashtagSell Item-->\n" +
    "<a ng-if=\"result.source == 'HSHTG'\" style=\"cursor: pointer;\" ng-click=\"placeOffer(); $event.stopPropagation();\" class=\"btn btn-danger\" role=\"button\"><i class=\"fa fa-calendar-o fa-lg\"></i>&nbsp; Let's Meet</a>"
  );


  $templateCache.put('js/watchlist/meetings/partials/watchlist.meetings.html',
    "<div ng-repeat=\"offer in post.offers.results\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <!--Meeting Requests Awaiting Response-->\n" +
    "    <div style=\"border: 1px solid; border-color: #e5e6e9 #dfe0e4 #d0d1d5; margin-bottom: 20px; padding: 0px;\" class=\"col-md-10 col-xs-12\" ng-show=\"!acceptedMeetingTime(offer)\" ng-if=\"userObj.user_settings.name === offer.username\">\n" +
    "        <div style=\"background-color: #ffffff; padding: 10px;\">\n" +
    "            <div>\n" +
    "                <img ng-src=\"{{offer.userProfile.profile_photo}}\" height=\"40\" style=\"position: relative; top: -12px;\">\n" +
    "                <div style=\"display: inline-block\">\n" +
    "                    <div>\n" +
    "                        @{{offer.username}}\n" +
    "                    </div>\n" +
    "                    <div>\n" +
    "                        Sent {{offer.modifiedAt | date:\"MMMM d 'at' h:mma\"}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    <div class=\"dropdown\" dropdown on-toggle=\"toggled(open)\" style=\"position: absolute; top: 10px; right: 15px;\">\n" +
    "                        <a href class=\"dropdown-toggle\" dropdown-toggle><i class=\"fa fa-chevron-down\"></i></a>\n" +
    "                        <ul class=\"dropdown-menu dropdown-menu-right\">\n" +
    "                            <li>\n" +
    "                                <a href ng-click=\"cancelOffer(offer)\">Cancel my meeting request</a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div>\n" +
    "                        I'm interested in viewing your {{post.heading}}.  Can you meet at any of the time(s) below?\n" +
    "                    </div>\n" +
    "                    <br>\n" +
    "                    <ul ng-repeat=\"proposedTime in offer.proposedTimes\">\n" +
    "                        <li>{{proposedTime.when | date : 'EEE, MMM d h:mm a'}}</li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"unread-meeting\" ng-show=\"!offer.acceptedAt.length\">\n" +
    "            You'll be notified as soon as the seller responds.  Hang Tight!\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <!--Meeting Requests Answered-->\n" +
    "    <div style=\"border: 1px solid; border-color: #e5e6e9 #dfe0e4 #d0d1d5; margin-bottom: 20px; padding: 0px;\" class=\"col-md-10 col-xs-12\" ng-show=\"acceptedMeetingTime(offer)\" ng-if=\"userObj.user_settings.name === offer.username\">\n" +
    "        <div style=\"background-color: #ffffff; padding: 10px;\">\n" +
    "            <div>\n" +
    "                <img ng-src=\"{{offer.userProfile.profile_photo}}\" height=\"40\" style=\"position: relative; top: -12px;\">\n" +
    "                <div style=\"display: inline-block\">\n" +
    "                    <div>\n" +
    "                        @{{offer.username}}\n" +
    "                    </div>\n" +
    "                    <div>\n" +
    "                        Sent {{offer.modifiedAt | date:\"MMMM d 'at' h:mma\"}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    <div class=\"dropdown\" dropdown on-toggle=\"toggled(open)\" style=\"position: absolute; top: 10px; right: 15px;\">\n" +
    "                        <a href class=\"dropdown-toggle\" dropdown-toggle><i class=\"fa fa-chevron-down\"></i></a>\n" +
    "                        <ul class=\"dropdown-menu dropdown-menu-right\">\n" +
    "                            <li>\n" +
    "                                <a href ng-click=\"cancelOffer(offer, post)\">Cancel my meeting request</a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div ng-repeat=\"proposedTime in offer.proposedTimes\">\n" +
    "                        <span ng-show=\"proposedTime.acceptedAt\">Awesome! You're scheduled to meet {{offer.username}} on {{proposedTime.when | date : 'EEE, MMM d h:mm a'}}.</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"read-meeting\" ng-show=\"!offer.acceptedAt.length\">\n" +
    "            <button class=\"btn btn-primary\" ng-click=\"cancelOffer(offer, post)\">Cancel meeting request</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"col-xs-12\">\n" +
    "    <span ng-show=\"!post.offers.results.length\">Keep track of how many users requested to view the {{post.heading}}</span>\n" +
    "    <span ng-show=\"post.offers.results.length && userObj.user_settings.name !== post.offers.results[0].username\">{{post.offers.results.length}} other users have requested to view this item.</span>\n" +
    "</div>"
  );


  $templateCache.put('js/watchlist/partials/watchlist.html',
    "<div ui-view></div>\n" +
    "\n" +
    "<div class=\"outer-container-interested interested-well\">\n" +
    "\n" +
    "    <!--{{expandedPostingId}}-->\n" +
    "\n" +
    "    <!--{{currentState}}-->\n" +
    "\n" +
    "    <div ng-show=\"!currentFaves.length\" class=\"background-instructions\">\n" +
    "        <div class=\"inset-background-text\">\n" +
    "            Starred items appear in your Watch List. We'll notify you when Watch List items are sold or updated.\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <div ng-show=\"currentFaves.length\">\n" +
    "        <table ng-table=\"tableParams\" class=\"table\">\n" +
    "            <thead>\n" +
    "            <tr ng-show=\"checkboxes.checked\">\n" +
    "                <th>\n" +
    "\n" +
    "                </th>\n" +
    "                <th colspan=\"4\" class=\"fave-batch-button\">\n" +
    "\n" +
    "                    <dropdown-multiselect selectedlabels=\"selected_labels\" userlabels=\"UserLabels\" selectedfaves=\"checkboxes.items\">\n" +
    "\n" +
    "                    </dropdown-multiselect>\n" +
    "\n" +
    "                </th>\n" +
    "                <th colspan=\"4\" class=\"fave-batch-button\" ng-model=\"batchContact\" ng-click=\"batchEmail(checkboxes)\">\n" +
    "                    <i class=\"fa fa-envelope\">&nbsp;&nbsp;Contact Seller</i>\n" +
    "                </th>\n" +
    "                <th colspan=\"4\" class=\"fave-batch-button\" ng-model=\"batchTrash\" ng-click=\"batchRemoveFaves(checkboxes)\">\n" +
    "                    <i class=\"fa fa-trash\">&nbsp;&nbsp;Trash</i>\n" +
    "                </th>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "                <th colspan=\"1\" width=\"30px\">\n" +
    "                    <input type=\"checkbox\" style=\"text-align: center; vertical-align: middle;\" ng-model=\"checkboxes.masterCheck\" id=\"select_all\" name=\"filter-checkbox\">\n" +
    "                </th>\n" +
    "                <th  colspan=\"9\" class=\"text-center\">\n" +
    "                    <input class=\"form-control\" type=\"text\" ng-model=\"filters.$\" placeholder=\"Filter Watchlist\" style=\"width:98%; margin:0px;\"/>\n" +
    "                </th>\n" +
    "                <th colspan=\"2\" style=\"vertical-align: middle;\" class=\"text-center sortable\" ng-class=\"{\n" +
    "                                        'sort-asc': tableParams.isSortBy('price', 'asc'),\n" +
    "                                        'sort-desc': tableParams.isSortBy('price', 'desc')\n" +
    "                                    }\"\n" +
    "                    ng-click=\"tableParams.sorting({'price' : tableParams.isSortBy('price', 'asc') ? 'desc' : 'asc'})\">\n" +
    "                    <div>Price</div>\n" +
    "                </th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "    <div class=\"inner-container-interested\">\n" +
    "        <table ng-table=\"tableParams\" class=\"table table-striped table-hover table-padding\" ng-class=\"checkboxes.checked ? 'table-big-nudge' : 'table-nudge'\">\n" +
    "            <thead>\n" +
    "\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "                <tr ng-repeat-start=\"favorite in $data\" ng-click=\"openSplash(favorite)\">\n" +
    "                    <td width=\"30\" style=\"text-align: center; vertical-align: middle;\">\n" +
    "                        <input type=\"checkbox\" ng-model=\"checkboxes.items[favorite.postingId]\" ng-click=\"$event.stopPropagation();\"/>\n" +
    "                    </td>\n" +
    "                    <td style=\"width:70px; cursor: pointer;\">\n" +
    "                        <img ng-show=\"favorite.images.length\" ng-src=\"{{::favorite.images[0].full || favorite.images[0].thumb || favorite.images[0].images}}\" style=\"width:70px; height:70px;\">\n" +
    "                        <div ng-show=\"!favorite.images.length\" class=\"watchlist-noImage-Placeholder\"></div>\n" +
    "                    </td>\n" +
    "                    <td filter=\"{ 'heading': 'text' }\" style=\"cursor: pointer;\">\n" +
    "\n" +
    "                        <h4>{{::favorite.heading | cleanHeading}}\n" +
    "                                <span ng-repeat=\"label in favorite.labels\" class=\"label label-primary\" style=\"font-weight: inherit; margin-right: 5px;\">\n" +
    "                                    {{label}} | x\n" +
    "                                </span>\n" +
    "                        </h4>\n" +
    "\n" +
    "                        <div>\n" +
    "                            <button class=\"btn btn-default\" type=\"button\" ng-click=\"expandCollapseQuestions($event, favorite)\">\n" +
    "                                <i class=\"fa\" ng-class=\"favorite.currentlyViewing.questions ? 'fa-chevron-down' : 'fa-chevron-right'\"></i> Questions\n" +
    "                            </button>\n" +
    "\n" +
    "                            <button class=\"btn btn-default\" type=\"button\" ng-click=\"expandCollapseMeetingRequests($event, favorite)\">\n" +
    "                                <i class=\"fa\" ng-class=\"favorite.currentlyViewing.meetings ? 'fa-chevron-down' : 'fa-chevron-right'\"></i> Meeting Requests\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                    <td ng-if=\"favorite.askingPrice.value\" style=\"vertical-align: middle;\">\n" +
    "                        <h5>{{::favorite.askingPrice.value | currency : $ : 0}}</h5>\n" +
    "                    </td>\n" +
    "                    <td ng-if=\"!favorite.askingPrice.value\" style=\"vertical-align: middle;\">\n" +
    "                        <h4>No price</h4>\n" +
    "                    </td>\n" +
    "                    <td style=\"width:20px; vertical-align: middle;\">\n" +
    "                        <i class=\"fa fa-minus-circle fa-2x\" ng-click=\"removeFave(favorite); $event.stopPropagation();\" style=\"color:red; cursor: pointer;\" tooltip=\"Remove from watch list\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"left\"></i>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "\n" +
    "                <tr ng-show=\"currentState === 'watchlist.questions' && expandedPostingId === favorite.postingId\" style=\"background-color: rgb(253, 253, 253);\">\n" +
    "                    <td colspan=\"6\" style=\"background-color: rgb(253, 253, 253);\">\n" +
    "                        <sender-questions-more-info post=\"favorite\"></sender-questions-more-info>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "\n" +
    "                <tr ng-repeat-end ng-show=\"currentState === 'watchlist.meetings' && expandedPostingId === favorite.postingId\" style=\"background-color: rgb(253, 253, 253);\">\n" +
    "                    <td colspan=\"6\" style=\"background-color: rgb(253, 253, 253);\">\n" +
    "                        <sender-meetings-more-info post=\"favorite\"></sender-meetings-more-info>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('js/watchlist/questions/partials/watchlist.questions.html',
    "<div ng-repeat=\"question in post.questions.results\">\n" +
    "    <div style=\"border: 1px solid; border-color: #e5e6e9 #dfe0e4 #d0d1d5; margin-bottom: 20px; padding: 0px;\" class=\"col-md-10 col-xs-12\">\n" +
    "        <div style=\"background-color: #ffffff; padding: 10px;\">\n" +
    "            <div>\n" +
    "                <img ng-src=\"{{question.userProfile.profile_photo}}\" height=\"40\" style=\"position: relative; top: -12px;\">\n" +
    "                <div style=\"display: inline-block\">\n" +
    "                    <div>\n" +
    "                        @{{question.username}}\n" +
    "                    </div>\n" +
    "                    <div>\n" +
    "                        Sent {{question.modifiedAt | date:\"MMMM d 'at' h:mma\"}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div ng-show=\"question.username === userObj.user_settings.name\">\n" +
    "                    <div class=\"dropdown\" dropdown on-toggle=\"toggled(open)\" style=\"position: absolute; top: 10px; right: 15px;\">\n" +
    "                      <a href class=\"dropdown-toggle\" dropdown-toggle><i class=\"fa fa-chevron-down\"></i></a>\n" +
    "                      <ul class=\"dropdown-menu dropdown-menu-right\">\n" +
    "                          <li>\n" +
    "                              <a href ng-click=\"deleteQuestion(question.postingId, question.questionId)\">Delete my question</a>\n" +
    "                          </li>\n" +
    "                      </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    Q: {{question.value}}\n" +
    "                </div>\n" +
    "                <div ng-show=\"question.answers.length\">\n" +
    "                    <div ng-repeat=\"answer in question.answers\">\n" +
    "                        A: {{answer.value}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div style=\"padding: 10px; background-color: #F4A460; color:#ffffff\" ng-show=\"!question.answers.length\">\n" +
    "            Waiting on seller to answer.  Hang tight!\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"col-xs-12\">\n" +
    "    <!--<a ng-show=\"showAnswered && post.questions.results.length\" ng-click=\"showAnswered = !showAnswered\">Hide questions already answered?</a>-->\n" +
    "    <!--<a ng-show=\"!showAnswered && post.questions.results.length\" ng-click=\"showAnswered = !showAnswered\">Show questions already answered?</a>-->\n" +
    "    <span ng-show=\"!post.questions.results.length\">User questions associated with this item will appear here.</span>\n" +
    "</div>"
  );

}]);
