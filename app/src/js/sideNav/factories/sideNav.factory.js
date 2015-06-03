/**
 * Created by braddavis on 11/29/14.
 */
htsApp.factory('sideNavFactory', function () {

    var factory = {};

    //DEFAULT MENU
    factory.defaultMenu = [{
        name: "Feed",
        alerts: null,
        link: "feed",
        active: false
    }, {
        name: "My Posts",
        alerts: null,
        link: "myposts",
        active: false
    }, {
        name: "Watch List",
        alerts: null,
        link: "watchlist",
        active: false
    }, {
        name: "Notify Me",
        alerts: null,
        link: "notifications",
        active: false
    }];

    factory.items = factory.defaultMenu;




    //SETTINGS MENU
    factory.settingsMenu = [{
        name: "Back",
        alerts: null,
        link: null,
        active: false
    }, {
        name: "Account",
        alerts: null,
        link: "settings.account",
        active: false
    }, {
        name: "Password",
        alerts: null,
        link: "settings.password",
        active: false
    }, {
        name: "Profile",
        alerts: null,
        link: "settings.profile",
        active: false
    }, {
        name: "Payment & Shipping",
        alerts: null,
        link: "settings.payment",
        active: false
    }];


    //This function called by ui-router as moves through application.  Updates choice in side nav dynamically.
    factory.updateSideNav = function (toState) {

        switch (toState.name) {
            //Settings Menu
            case 'settings':
                factory.settingsMenu[0].active = false;
                factory.settingsMenu[1].active = false;
                factory.settingsMenu[2].active = false;
                factory.settingsMenu[3].active = false;
                factory.settingsMenu[4].active = false;
                factory.items = factory.settingsMenu;
                break;
            case 'settings.account':
                factory.settingsMenu[0].active = false;
                factory.settingsMenu[1].active = true;
                factory.settingsMenu[2].active = false;
                factory.settingsMenu[3].active = false;
                factory.settingsMenu[4].active = false;
                factory.items = factory.settingsMenu;
                break;
            case 'settings.password':
                factory.settingsMenu[0].active = false;
                factory.settingsMenu[1].active = false;
                factory.settingsMenu[2].active = true;
                factory.settingsMenu[3].active = false;
                factory.settingsMenu[4].active = false;
                factory.items = factory.settingsMenu;
                break;
            case 'settings.profile':
                factory.settingsMenu[0].active = false;
                factory.settingsMenu[1].active = false;
                factory.settingsMenu[2].active = false;
                factory.settingsMenu[3].active = true;
                factory.settingsMenu[4].active = false;
                factory.items = factory.settingsMenu;
                break;
            case 'settings.payment':
                factory.settingsMenu[0].active = false;
                factory.settingsMenu[1].active = false;
                factory.settingsMenu[2].active = false;
                factory.settingsMenu[3].active = false;
                factory.settingsMenu[4].active = true;
                factory.items = factory.settingsMenu;
                break;



            //Default Menu
            case 'feed':
                factory.defaultMenu[0].active = true;
                factory.defaultMenu[1].active = false;
                factory.defaultMenu[2].active = false;
                factory.defaultMenu[3].active = false;
                factory.items = factory.defaultMenu;
                break;
            case 'myposts':
                factory.defaultMenu[0].active = false;
                factory.defaultMenu[1].active = true;
                factory.defaultMenu[2].active = false;
                factory.defaultMenu[3].active = false;
                factory.items = factory.defaultMenu;
                break;
            case 'watchlist':
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


    factory.sideNav = {
        hidden: true,
        listView: true
    };


    return factory;

});