/**
 * @description - Create a new background page
 */
__BROWSER__.browserAction.onClicked.addListener(function() {
    __BROWSER__.tabs.create({ url: 'index.html' });
});

/**
 * @description - On tabs updated, send message to content script
 */
__BROWSER__.tabs.onUpdated.addListener(function(tabId) {
    //Reset first so we don't have hanging counts from prior tabs
    setExtensionIconBadge('');
    //Send message
    __BROWSER__.tabs.sendMessage(tabId, {
        action: BACKGROUND_ACTION_TAB_UPDATED
    });
});

/**
 * @description - On tabs activated, send message to content script
 */
__BROWSER__.tabs.onActivated.addListener(function(activeInfo) {
    //Reset first so we don't have hanging counts from prior tabs
    setExtensionIconBadge('');
    //Send message
    __BROWSER__.tabs.sendMessage(activeInfo.tabId, {
        action: BACKGROUND_ACTION_TAB_UPDATED
    });
});

//Not on edge
if (BROWSER_CONFIG.slug !== "edge") {
    /**
     * @description - Within the URL box, type "dissent" to search Dissenter.com
     */
    __BROWSER__.omnibox.onInputEntered.addListener(function(text, disposition) {
        // Encode user input for special characters , / ? : @ & = + $ #
        var newURL = 'https://dissenter.com/search?q=' + encodeURIComponent(text);

        if (disposition == "currentTab") {
            __BROWSER__.tabs.query({
                active: true,
                currentWindow: true
            }, function(tabs) {
                var tab = tabs[0];
                __BROWSER__.tabs.update(tab.id, { url: newURL });
            });
        }
        else {
            __BROWSER__.tabs.create({ url: newURL });
        }
    });
}

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
        var value = message.value;

        //Must be key
        if (!key) return true;

        //Set value in storage
        gdes.setValue(key, value);

        //If we're toggling badge off, remove current badge
        if (key === WEBSITE_COMMENT_BADGE_ENABLED && !value) {
            setExtensionIconBadge('');
        }
    }
    else if (action === BACKGROUND_ACTION_SET_BADGE) {
        var url = message.url || '';

        //Url must exist
        if (!url || !isString(url)) {
            setExtensionIconBadge('');
            return true;
        }

        //Must be valid url
        if (url.indexOf('://') == -1) {
            setExtensionIconBadge('');
            return true;
        }

        //
        var fetchUrl = COMMENT_COUNT_URI + encodeURIComponent(url);

        //Perform request to get comment count
        performRequest({
            method: 'GET',
            url: fetchUrl
        }, function(error, data) {
            //Must be object
            if (!isObject(data)) {
                setExtensionIconBadge('');
                return true;
            }
            //Must be successful
            if (!data.success) {
                setExtensionIconBadge('');
                return true;
            }

            //Convert to string
            var commentCount = String(data.url.stats.commentCount);

            //Set badge
            setExtensionIconBadge(commentCount);
        });
    }

    //Async
    return true;
});
