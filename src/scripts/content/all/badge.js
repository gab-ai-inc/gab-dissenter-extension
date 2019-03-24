/**
 * @description - Gab Dissenter - Badge content script
 */
var GDBadge = function() {
    //Global scope
    var scope = this;

    /**
     * @description - Set badge with current window.location.href url by sending to background to make request to get comment count
     */
    scope.setBadge = function() {
        __BROWSER__.runtime.sendMessage({
            action: BACKGROUND_ACTION_SET_BADGE,
            url: window.location.href
        });
    };
};

//
var gdb = null;

/**
 * @description - onMessage Handler for receiving messages from background
 */
__BROWSER__.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    var action = message['action'] || '';

    if (action === BACKGROUND_ACTION_TAB_UPDATED) {
        // Get config keys from background
        __BROWSER__.runtime.sendMessage({
            action: BACKGROUND_ACTION_GET_KEY,
            key: WEBSITE_COMMENT_BADGE_ENABLED
        }, function(enabled) {
            if (!enabled) return false;

            if (!gdb) gdb = new GDBadge();
            gdb.setBadge();
        });
    }

    //Async
    return true;
});

//Wait for page to be ready and loaded
ready(function() {
    // Get config keys from background
    __BROWSER__.runtime.sendMessage({
        action: BACKGROUND_ACTION_GET_KEY,
        key: WEBSITE_COMMENT_BADGE_ENABLED
    }, function(enabled) {
        if (!enabled) return false;

        //Delay a bit
        setTimeout(function () {
            //Init new script
            gdb = new GDBadge();
            gdb.setBadge();
        }, 150);
    });
});
