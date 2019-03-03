/**
 * @description - Popup
 * @return function
 */
var Popup = function() {

    var scope = this;

    //Elements
    var iframe = document.getElementById('popup-iframe');

    var currentActiveUrl = '';

    //Global functions

    /**
     * @description - On Popup open
     * @function scope.init
     * @param  {Object} activeTab - Active tab object
     * @param  {String} activeTab.title - Active tab title
     * @param  {String} activeTab.url - Active tab title
     */
    scope.onPopupOpen = function(activeTab) {
        //Must be object
        if (!isObject(activeTab)) return false;

        //Get title, url
        var title = activeTab['title'] || '';
        var url = activeTab['url'] || '';

        //If same as currently active, don't reload
        if (currentActiveUrl === url) return false;
        //Set currently active if different
        currentActiveUrl = url;

        //Encode current tab url along with base dissenter.com url
        var encoded = encodeURIComponent(url);
        var commentUrl = BASE_URI + encoded;

        //Show iframe after delay
        setTimeout(function() {
            //Set src, make visible
            iframe.setAttribute('src', commentUrl);
            iframe.classList.remove('hidden');
        }, 250);
    };

    /**
     * @description - Init popup on open
     * @function scope.init
     */
    scope.init = function() {
        if (BROWSER_CONFIG.slug === BROWSER_SAFARI_SLUG) {
           var activeWindow = safari.application.activeBrowserWindow;
           var activeTab = activeWindow.activeTab;

           scope.onPopupOpen(activeTab);
       }
       else {
            //On popup open, get current tab
            __BROWSER__.tabs.query({
                active: true,
                currentWindow: true
            }, function(tabs) {
                if (!tabs || !isArray(tabs)) return false;

                var activeTab = tabs[0];

                scope.onPopupOpen(activeTab);
            });
        }
    };
};

/**
 * @description - On popup load
 */
document.addEventListener('DOMContentLoaded', function() {
    //Create and init Popup
    var popup = new Popup();
    popup.init();
});
