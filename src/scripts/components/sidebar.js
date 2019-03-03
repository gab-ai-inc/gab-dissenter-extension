var tabManager = {activeTab: null, panelTab: null};
/**
 * @description - Sidebar
 * @return function
 */
var Sidebar = function () {

  var scope = this;

  //Elements
  var body = document.body;
  var container = document.getElementById('sidebar');
  var iframe = document.getElementById('sidebar-iframe');

  //Set on every sidebar open
  var currentTabUrl = '';

  //Functions

  /**
   * @description - On Sidebar open
   * @param  {string} title - Active tab title
   * @param  {String} url - Active tab title
   */
  function onSidebarOpen(title, url) {
    console.log("sidebar opened")
    //Set global
    currentTabUrl = url;

    setTimeout(function () {
      var encoded = encodeURIComponent(url);
      var commentUrl = BASE_URI + encoded;

      iframe.setAttribute('src', commentUrl);
      iframe.classList.remove('hidden');
    }, 250);
  }


  //Global functions


  /**
   * @description - init Sidebar on open
   * @function scope.init
   */
  scope.init = function () {
    if (BROWSER_CONFIG.slug === BROWSER_SAFARI_SLUG) {
      var activeWindow = safari.application.activeBrowserWindow;
      var activeTab = activeWindow.activeTab;

      if (!isObject(activeTab)) activeTab = {};

      var title = activeTab.title || '';
      var url = activeTab.url || '';

      onSidebarOpen(title, url);
    }
    else {
      //On sidebar open, get current tab
      __BROWSER__.tabs.query({
        active: true,
        currentWindow: true
      }, function (tabs) {
        if (!tabs) return false;

        //Get active tab
        var activeTab = tabs[0] || {};

        //Get title, url
        var title = activeTab.title || '';
        var url = activeTab.url || '';

        tabManager.panelTab = activeTab.id;
        tabManager.activeTab = activeTab.id;

        //Save panel parent ID
        function sendParentPanel(e) {
          var parentPanel = tabManager.panelTab;
          console.log("this is what im sending:",parentPanel);
          var sending = __BROWSER__.runtime.sendMessage({parentPanel:parentPanel});
          sending.then(handleResponse, handleError);
        }

        function handleResponse(message) {
          console.log("Message from the background script:" + message);
        }

        function handleError(error) {
          console.log("Error: " + error);
        }

        sendParentPanel();

        //

        onSidebarOpen(title, url);
      });
    }
  }
};

/**
 * @description - On sidebar load
 */
document.addEventListener('DOMContentLoaded', function () {
  //Create and init Sidebar
  var sidebar = new Sidebar();
  sidebar.init();
});


function handleActivated(activeInfo) {
  setTimeout(function () {
    localInit()
  },2000);
  function localInit() {
    var sidebar = new Sidebar();
    sidebar.init();
  }

  __BROWSER__.tabs.query({lastFocusedWindow: true, active: true}, function (tabs) {
    tabManager.activeTab = tabs[0].id;

    var currentTab = tabs[0].id;

    function sendParentQuestion(e) {
      var parentSuspect = currentTab;
      var sending = __BROWSER__.runtime.sendMessage({parentSuspect:parentSuspect});
      sending.then(handleResponse, handleError);
    }

    function handleResponse(message) {
      console.log("Message from the background script:" + message);
    }

    function handleError(error) {
      console.log("Error: " + error);
    }

    sendParentQuestion()
  })

}

function handleUpdated(){
  setTimeout(function () {
    localInit()
  },2000);
  function localInit() {
    var sidebar = new Sidebar();
    sidebar.init();
  }
}


__BROWSER__.tabs.onActivated.addListener(handleActivated);
__BROWSER__.tabs.onUpdated.addListener(handleUpdated);


