/**
 * @description - Popup
 * @return function
 */
var Popup = function() {

    var scope = this;

    //Elements
    var body = document.body;
    var container = document.getElementById('popup');
    var iframe = document.getElementById('popup-iframe');


    //Set on every popup open
    var currentTabUrl = '';


    //Functions


    /**
     * @description - On Popup open
     * @param  {string} title - Active tab title
     * @param  {String} url - Active tab title
     */
    function onPopupOpen(title, url) {
        //Set global
        currentTabUrl = url;
        
        setTimeout(function() {
            var encoded = encodeURIComponent(url);
            var commentUrl = BASE_URI + encoded;

            iframe.setAttribute('src', commentUrl);
            iframe.classList.remove('hidden');
        }, 250);
    };


    //Global functions


    /**
     * @description - Init popup on open
     * @function scope.init
     */
    scope.init = function() {
        if (BROWSER_CONFIG.slug === BROWSER_SAFARI_SLUG) {
           var activeWindow = safari.application.activeBrowserWindow;
           var activeTab = activeWindow.activeTab;

           if (!isObject(activeTab)) activeTab = {};

           var title = activeTab.title || '';
           var url = activeTab.url || '';

           //
           onPopupOpen(title, url);
       }
       else {
            //On popup open, get current tab
            __BROWSER__.tabs.query({
                active: true,
                currentWindow: true
            }, function(tabs) {
                if (!tabs) return false;

                //Get active tab
                var activeTab = tabs[0] || {};

                // check if a canonical url is defined before using the tab url
                __BROWSER__.tabs.executeScript({
                    code: "try { document.querySelector('link[rel=\"canonical\"]').href; } catch(e) {}"
                }, function(result) {
                    //Get title, url
                    var title = activeTab.title || '';
                    var url = result[0] || activeTab.url || '';

                    //
                    onPopupOpen(title, url);
                });
            });
        }
    }
};

/**
 * @description - On popup load
 */
document.addEventListener('DOMContentLoaded', function() {
    //Create and init Popup
    var popup = new Popup();
    popup.init();
});
