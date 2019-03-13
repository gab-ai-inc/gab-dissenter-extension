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

        var showWindow = gdes.getValue(WINDOW_SIDEBAR_UNAVAILABLE_ENABLED);

        if (BROWSER_CONFIG.slug === BROWSER_FIREFOX_SLUG && !showWindow) {
            __BROWSER__.runtime.sendMessage({url: url});
            return true;
        }
        
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
    else if (action === BACKGROUND_ACTION_GET_KEY) {
        var key = message.key || '';

        //Key must exist
        if (!key) {
            if (sendResponse) sendResponse(null);
            return true;
        }

        //Get/Send value
        var value = gdes.getValue(key);

        if (sendResponse) sendResponse(value);
    }
    else if (action === BACKGROUND_ACTION_SET_KEY) {
        //Get key/value
        var key = message.key || '';
        var value = message.value || '';

        //Must be key
        if (!key) return true;

        //Set value in storage
        gdes.setValue(key, value);
    }

    //Async
    return true;
});
