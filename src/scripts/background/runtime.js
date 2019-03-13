/**
 * @description - Create a new background page
 */
__BROWSER__.browserAction.onClicked.addListener(function() {
    __BROWSER__.tabs.create({ url: 'index.html' });
});

/**
 * @description - onMessage Handler for sending messages from elsewhere to this background.js file
 * @returns callback(*)
 */
__BROWSER__.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    var action = message['action'] || '';

    if (action === BACKGROUND_ACTION_OPEN_POPUP) {
        //Get url, height
        var url = message['url'] || '';
        var windowHeight = message['height'] || 0;

        //Set variables
        var screenWidth = screen.width;
        var screenHeight = screen.height;
        var top = screenHeight - windowHeight;

        //Get popup url
        var popupURL = __BROWSER__.extension.getURL("popup/popup.html?url=" + url);

        if (BROWSER_CONFIG.slug === BROWSER_FIREFOX_SLUG) {
            __BROWSER__.runtime.sendMessage({url: url});
        }
        else {
            //Open new popup window with url using popup.html
            __BROWSER__.windows.create({
                url: popupURL,
                width: 420,
                height: windowHeight,
                top: top,
                left: screenWidth,
                type: 'popup'
            });
        }
    }
    }

    //Async
    return true;
});
