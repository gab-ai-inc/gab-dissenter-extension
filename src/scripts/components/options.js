/**
 * @description - Options
 */
var Options = function() {

    //Declare scope
    var scope = this;

    //

    var optionalPermissions = {
        permissions: ["tabs"]
    };

    var checkboxData = [
        {
            element: document.getElementById('twitter-enabled'),
            key: TWITTER_BUTTONS_ENABLED,
        },
        {
            element: document.getElementById('reddit-enabled'),
            key: REDDIT_BUTTONS_ENABLED,
        },
        {
            element: document.getElementById('youtube-enabled'),
            key: YOUTUBE_BUTTONS_ENABLED,
        },
        {
            element: document.getElementById('window-sidebar-enabled'),
            key: WINDOW_SIDEBAR_UNAVAILABLE_ENABLED,
        },
        {
            element: document.getElementById('comment-badge-enabled'),
            key: WEBSITE_COMMENT_BADGE_ENABLED,
        },
        {
            element: document.getElementById('disqus-dissent-enabled'),
            key: DISSENT_DISQUS_BUTTONS_ENABLED,
        },
        {
            element: document.getElementById('wikipedia-enabled'),
            key: WIKIPEDIA_BUTTONS_ENABLED,
        },
        {
            element: document.getElementById('custom-new-tab-enabled'),
            key: CUSTOM_NEW_TAB_ENABLED,
        }
    ];

    function setKeyValue(checkboxBlock) {
        //If is new tab, request "tabs" permission
        if (checkboxBlock.key === CUSTOM_NEW_TAB_ENABLED) {
            __BROWSER__.permissions.request(optionalPermissions, function(granted) {
                //
            });
        }

        //Send message
        __BROWSER__.runtime.sendMessage({
            action: BACKGROUND_ACTION_SET_KEY,
            key: checkboxBlock.key,
            value: checkboxBlock.element.checked
        });
    };

    for (var i = 0; i < checkboxData.length; i++) {
        var checkboxBlock = checkboxData[i];
        var key = checkboxBlock.key;
        checkboxBlock.element.onchange = setKeyValue.bind(null, checkboxBlock);
    };

    //Global functions

    /**
     * @description - Function to call on options instantiation
     * @function scope.init
     */
    scope.init = function() {
        //Send message to browser to get config data
        __BROWSER__.runtime.sendMessage({
            action: BACKGROUND_ACTION_GET_KEY,
            key: STORAGE_KEY_ALL
        }, function(data) {
            if (!data) return false;

            for (var i = 0; i < checkboxData.length; i++) {
                checkboxData[i].element.checked = data[checkboxData[i].key];
            };
        });
    };
};

/**
 * @description - On options DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function() {
    //Init new options page
    var options = new Options();
    options.init();
});
