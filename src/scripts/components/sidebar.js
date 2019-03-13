var timeout = null;
var delay = 2000;

/**
 * @description - Sidebar
 * @return function
 */
var Sidebar = function() {

    var scope = this;

    //Elements
    var iframe = document.getElementById('sidebar-iframe');

    //Set on every sidebar open
    var currentActiveUrl = '';


    //Global functions


    /**
     * @description - On Sidebar open
     * @function scope.onSidebarOpen
     * @param  {Object} activeTab - Active tab object
     * @param  {String} activeTab.url - Active tab title
     */
    scope.onSidebarOpen = function(activeTab) {
        //Must be object
        if (!isObject(activeTab)) return false;

        //Get url
        var url = activeTab['url'] || '';

        //If same as currently active, don't reload
        if (currentActiveUrl === url) {
            scope.toggleLoading(false);
            return false;
        }

        //Set currently active if different
        currentActiveUrl = url;

        //Encode current tab url along with base dissenter.com url
        var encoded = encodeURIComponent(url);
        var commentUrl = BASE_URI + encoded;
        //Set src
        iframe.setAttribute('src', commentUrl);

        //Show iframe after delay
        setTimeout(function() {
            scope.toggleLoading(false);
        }, 500);
    };

    /**
     * @description - Init Sidebar on open
     * @param {string|null} url
     * @function scope.init
     */
    scope.init = function(url) {
        //Check if url exists
        if (url && isString(url)) {
            //Open popup now
            scope.onSidebarOpen({
                'url': url
            });

            //Don't continue
            return;
        }

        //Only Firefox
        if (BROWSER_CONFIG.slug !== BROWSER_FIREFOX_SLUG) return;

        //On sidebar open, get current tab
        __BROWSER__.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            if (!tabs) return false;

            var activeTab = tabs[0];

            scope.onSidebarOpen(activeTab);
        });
    };

    /**
     * @description - Helper to toggle loading icon for sidebar
     * @param  {Boolean} onOrOff
     */
    scope.toggleLoading = function(onOrOff) {
        iframe.classList.toggle('hidden', onOrOff);
    };
};

var sidebar = null;

/**
 * @description - On sidebar load
 */
document.addEventListener('DOMContentLoaded', function() {
    //Create and init Sidebar
    sidebar = new Sidebar();
    sidebar.init();
});

/**
 * @description - Handle reload on browser tab activated or update
 */
function handleReload() {
    //Sidebar must exist
    if (!sidebar) sidebar = new Sidebar();

    //Set loading screen
    sidebar.toggleLoading(true);

    if (timeout !== null) {
        clearTimeout(timeout);
    }

    timeout = setTimeout(function() {
        sidebar.init();
    }, delay);
};

//Listen for changes on browser tabs
__BROWSER__.tabs.onActivated.addListener(handleReload);
__BROWSER__.tabs.onUpdated.addListener(handleReload);

/**
 * @description - Listen for message from runtime
 */
__BROWSER__.runtime.onMessage.addListener(function(request) {
    if (!isObject(request)) return false;
    var url = request['url'] || '';

    if (!isString(url)) return false;
    if (url.length <= 1) return false;

    //Set loading screen
    sidebar.toggleLoading(true);

    //Load url
    sidebar.init(url);
});
