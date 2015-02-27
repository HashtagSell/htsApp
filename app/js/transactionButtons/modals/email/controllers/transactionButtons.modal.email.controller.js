htsApp.controller('quickComposeController', ['$scope', '$modalInstance', 'quickComposeFactory', 'Session', '$window', 'result', function ($scope, $modalInstance, quickComposeFactory, Session, $window, result) {

    $scope.userObj = Session.userObj;

    $scope.emailOptionsObject = [
        {name : "Use Default Mail Client", value : "mailto"},
        {name : "Gmail", value : "gmail"},
        {name : "Yahoo", value : "yahoo"},
        {name : "Hotmail", value : "hotmail"},
        {name : "AOL", value : "aol"}
    ];

    $scope.selected = "mailto";

    $scope.qcEmail = function () {

        if($scope.setDefaultEmailProvider){ //User requested we save their setting as default email provider
            quickComposeFactory.setDefaultEmailProvider($scope.selected);
        }


        quickComposeFactory.generateMailTo($scope.selected, result);


        $modalInstance.dismiss("auto-compose complete");
    };


    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);



htsApp.factory('quickComposeFactory', ['Session', '$window', function(Session, $window) {

    var newQuickCompose = {};

    //Open pre-filled out compose message window
    newQuickCompose.generateMailTo = function (provider, result) {

        var mailLink = "";

        if(!result.length) { //If only one result then append to TO: field.

            switch (provider) {
                case "gmail":
                    mailLink = "https://mail.google.com/mail/?view=cm&fs=1&to=" + result.annotations.source_account + "&su=" + result.heading + "&body=" + result.external.source.url;
                    $window.open(mailLink);
                    break;
                case "yahoo":
                    mailLink = "http://compose.mail.yahoo.com/?to=" + result.annotations.source_account + "&subject=" + result.heading + "&body=" + result.external.source.url;
                    $window.open(mailLink);
                    break;
                case "hotmail":
                    mailLink = "https://mail.live.com/default.aspx?rru=compose&to=" + result.annotations.source_account + "&subject=" + result.heading + "&body=" + result.external.source.url;
                    $window.open(mailLink);
                    break;
                case "aol":
                    mailLink = "http://mail.aol.com/mail/compose-message.aspx?to=" + result.annotations.source_account + "&subject=" + result.heading + "&body=" + result.external.source.url;
                    $window.open(mailLink);
                    break;
                case "mailto":
                    mailLink = 'mailto:' + result.annotations.source_account + '?Subject=' + result.heading + '&body=' + result.external.source.url;
                    $window.open(mailLink);
                    break;
            }

        } else { //If multiple results then add comma delimited string to bcc field

            var bccString = "";

            for(i=0; i<result.length; i++) {
                if(result[i].annotations.source_account){
                    bccString += result[i].annotations.source_account+',';
                }
            }

            switch(provider){
                case "gmail":
                    mailLink = "https://mail.google.com/mail/?view=cm&fs=1&bcc="+bccString+"&su="+"I'd like to buy your item..."+"&body="+"HashtagSell.com - Re-thinking Online Classifieds";
                    $window.open(mailLink);
                    break;
                case "yahoo":
                    mailLink = "http://compose.mail.yahoo.com/?bcc="+bccString+"&subject="+"I'd like to buy your item..."+"&body="+"HashtagSell.com - Re-thinking Online Classifieds";
                    $window.open(mailLink);
                    break;
                case "hotmail":
                    mailLink = "https://mail.live.com/default.aspx?rru=compose&bcc="+bccString+"&subject="+"I'd like to buy your item..."+"&body="+"HashtagSell.com - Re-thinking Online Classifieds";
                    $window.open(mailLink);
                    break;
                case "aol":
                    mailLink = "http://mail.aol.com/mail/compose-message.aspx?bcc="+bccString+"&subject="+"I'd like to buy your item..."+"&body="+"HashtagSell.com - Re-thinking Online Classifieds";
                    $window.open(mailLink);
                    break;
                case "mailto":
                    mailLink = 'mailto:?bcc='+bccString+'&subject='+"I'd like to buy your item..."+'&body='+"HashtagSell.com - Re-thinking Online Classifieds";
                    $window.open(mailLink);
                    break;
            }
        }
    };



    //Saves the user email provider selection as default
    newQuickCompose.setDefaultEmailProvider = function(selectedProvider){

        var defaultEmail;

        switch (selectedProvider) {
            case 'ask':
                defaultEmail =  [{name : "Always Ask", value: "ask"}];
                break;
            case 'gmail':
                defaultEmail =  [{name : "Gmail", value : "gmail"}];
                break;
            case 'yahoo':
                defaultEmail =  [{name : "Yahoo", value : "yahoo"}];
                break;
            case 'hotmail':
                defaultEmail =  [{name : "Hotmail", value : "hotmail"}];
                break;
            case 'aol':
                defaultEmail =  [{name : "AOL", value : "aol"}];
                break;
            case 'mailto':
                defaultEmail =  [{name : "Use Default Mail Client", value : "mailto"}];
                break;
        }


        Session.setSessionValue("email_provider", defaultEmail, function () {
            console.log('default email updated');
        });
    };


    return newQuickCompose;
}]);