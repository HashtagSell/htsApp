/**
 * Created by braddavis on 11/29/14.
 */
htsApp.factory('sideNavFactory', ['Session', 'forSaleFactory', function (Session, forSaleFactory) {

    var factory = {};

    //DEFAULT MENU
    factory.defaultMenu = [{
        name: "My Feed",
        alerts: null,
        link: "feed",
        active: false
    }, {
        name: "I'm Selling",
        alerts: null,
        link: "selling",
        active: false
    }, {
        name: "I'm Interested",
        alerts: Session.userObj.user_settings.favorites.length,
        link: "interested",
        active: false
    }, {
        name: "Notifications",
        alerts: null,
        link: "notifications",
        active: false
    }];





    //SPLASH SCREEN MENU
    factory.splashMenu = [{
        name: "Make an Offer",
        alerts: null,
        link: "selling",
        active: false
    }, {
        name: "I'm Interested",
        alerts: null,
        link: "interested",
        active: false
    }, {
        name: "Mark as Spam",
        alerts: null,
        link: "notifications",
        active: false
    }];




    //SETTINGS MENU
    factory.settingsMenu = [{
        name: "Back",
        alerts: null,
        link: null,
        active: false
    }, {
        name: "General Settings",
        alerts: null,
        link: "settings.general",
        active: false
    }, {
        name: "Edit Profile",
        alerts: null,
        link: "settings.profile",
        active: false
    }, {
        name: "Payment Settings",
        alerts: null,
        link: "settings.payment",
        active: false
    }];


    //This function called by ui-router as moves through application.  Updates choice in side nav dynamically.
    factory.updateSideNav = function (toState) {
        //
        //alert(toState.name);
        //
        //console.log('here is watch me', factory.watchme);

        switch (toState.name) {
            //Settings Menu
            case 'settings':
                factory.settingsMenu[0].active = false;
                factory.settingsMenu[1].active = false;
                factory.settingsMenu[2].active = false;
                factory.settingsMenu[3].active = false;
                factory.items = factory.settingsMenu;
                break;
            case 'settings.general':
                factory.settingsMenu[0].active = false;
                factory.settingsMenu[1].active = true;
                factory.settingsMenu[2].active = false;
                factory.settingsMenu[3].active = false;
                factory.items = factory.settingsMenu;
                break;
            case 'settings.profile':
                factory.settingsMenu[0].active = false;
                factory.settingsMenu[1].active = false;
                factory.settingsMenu[2].active = true;
                factory.settingsMenu[3].active = false;
                factory.items = factory.settingsMenu;
                break;
            case 'settings.payment':
                factory.settingsMenu[0].active = false;
                factory.settingsMenu[1].active = false;
                factory.settingsMenu[2].active = false;
                factory.settingsMenu[3].active = true;
                factory.items = factory.settingsMenu;
                break;



            //Splash Menu
            case 'results.splash':
                factory.splashMenu[0].active = false;
                factory.splashMenu[1].active = false;
                factory.splashMenu[2].active = false;
                factory.items = factory.splashMenu;
                break;
            case 'interested.splash':
                factory.splashMenu[0].active = false;
                factory.splashMenu[1].active = false;
                factory.splashMenu[2].active = false;
                factory.items = factory.splashMenu;
                break;
            case 'selling.splash':
                factory.splashMenu[0].active = false;
                factory.splashMenu[1].active = false;
                factory.splashMenu[2].active = false;
                factory.items = factory.splashMenu;
                break;



            //Default Menu
            case 'feed':
                factory.defaultMenu[0].active = true;
                factory.defaultMenu[1].active = false;
                factory.defaultMenu[2].active = false;
                factory.defaultMenu[3].active = false;
                factory.items = factory.defaultMenu;
                break;
            case 'selling':
                factory.defaultMenu[0].active = false;
                factory.defaultMenu[1].active = true;
                factory.defaultMenu[2].active = false;
                factory.defaultMenu[3].active = false;
                factory.items = factory.defaultMenu;
                break;
            case 'interested':
                factory.defaultMenu[0].active = false;
                factory.defaultMenu[1].active = false;
                factory.defaultMenu[2].active = true;
                factory.defaultMenu[3].active = false;
                factory.items = factory.defaultMenu;
                break;
            case 'notifications':
                factory.defaultMenu[0].active = false;
                factory.defaultMenu[1].active = false;
                factory.defaultMenu[2].active = false;
                factory.defaultMenu[3].active = true;
                factory.items = factory.defaultMenu;
                break;
            case 'results':
                factory.defaultMenu[0].active = false;
                factory.defaultMenu[1].active = false;
                factory.defaultMenu[2].active = false;
                factory.defaultMenu[3].active = false;
                factory.items = factory.defaultMenu;
                break;
            case 'profile':
                factory.defaultMenu[0].active = false;
                factory.defaultMenu[1].active = false;
                factory.defaultMenu[2].active = false;
                factory.defaultMenu[3].active = false;
                factory.items = factory.defaultMenu;
                break;
        }
    };

    return factory;

}]);