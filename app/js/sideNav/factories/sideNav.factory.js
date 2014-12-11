/**
 * Created by braddavis on 11/29/14.
 */
htsApp.factory('sideNavFactory', ['Session', function (Session) {

    var factory = {};

    console.log(Session.userObj);

    //DEFAULT MENU
    factory.defaultMenu = [{
        name: "My Feed",
        alerts: null,
        link: "feed"
    }, {
        name: "I'm Selling",
        alerts: null,
        link: "selling"
    }, {
        name: "I'm Interested",
        alerts: Session.userObj.user_settings.favorites.length,
        link: "interested"
    }, {
        name: "Notifications",
        alerts: null,
        link: "notifications"
    }];





    //SPLASH SCREEN MENU
    factory.splashMenu = [{
        name: "Make an Offer",
        alerts: null,
        link: "selling"
    }, {
        name: "I'm Interested",
        alerts: null,
        link: "interested"
    }, {
        name: "Mark as Spam",
        alerts: null,
        link: "notifications"
    }];




    //SETTINGS MENU
    factory.settingsMenu = [{
        name: "General Settings",
        alerts: null,
        link: "settings.general"
    }, {
        name: "Edit Profile",
        alerts: null,
        link: "settings.profile"
    }, {
        name: "Payment Settings",
        alerts: null,
        link: "settings.payment"
    }];


    //This function called by ui-router as moves through application.  Updates choice in side nav dynamically.
    factory.updateSideNav = function (toState) {

        console.log(toState.name);

        switch (toState.name) {
            case 'settings':
            case 'settings.general':
            case 'settings.profile':
            case 'settings.payment':
                factory.items = factory.settingsMenu;
                break;
            case 'results.splash':
            case 'interested.splash':
                factory.items = factory.splashMenu;
                break;
            case 'feed':
            case 'selling':
            case 'interested':
            case 'notifications':
            case 'results':
            case 'profile':
                factory.items = factory.defaultMenu;
                break;
        }
    };

    return factory;

}]);