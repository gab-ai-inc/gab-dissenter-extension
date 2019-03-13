/**
 * @description - Options
 */
var Options = function() {

    //Declare scope
    var scope = this;

    //

    //Elements
    var twitterCheckbox = document.getElementById('twitter-enabled');
    var redditCheckbox = document.getElementById('reddit-enabled');
    var youtubeCheckbox = document.getElementById('youtube-enabled');
    var windowSidebarCheckbox = document.getElementById('window-sidebar-enabled');

    //Listeners

    /**
     * @description - On twitter enabled
     */
    twitterCheckbox.onchange = function() {
        var value = this.checked;

        //Send message
        __BROWSER__.runtime.sendMessage({
            action: BACKGROUND_ACTION_SET_KEY,
            key: TWITTER_BUTTONS_ENABLED,
            value: value
        });
    };

    /**
     * @description - On reddit enabled
     */
    redditCheckbox.onchange = function() {
        var value = this.checked;

        //Send message
        __BROWSER__.runtime.sendMessage({
            action: BACKGROUND_ACTION_SET_KEY,
            key: REDDIT_BUTTONS_ENABLED,
            value: value
        });
    };

    /**
     * @description - On youtube enabled
     */
    youtubeCheckbox.onchange = function() {
        var value = this.checked;

        //Send message
        __BROWSER__.runtime.sendMessage({
            action: BACKGROUND_ACTION_SET_KEY,
            key: YOUTUBE_BUTTONS_ENABLED,
            value: value
        });
    };

    /**
     * @description - Sidebar window checkbox
     */
    windowSidebarCheckbox.onchange = function() {
        var value = this.checked;

        //Send message
        __BROWSER__.runtime.sendMessage({
            action: BACKGROUND_ACTION_SET_KEY,
            key: WINDOW_SIDEBAR_UNAVAILABLE_ENABLED,
            value: value
        });
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

            //Set checkboxes for enabled values
            twitterCheckbox.checked = data[TWITTER_BUTTONS_ENABLED];
            redditCheckbox.checked = data[REDDIT_BUTTONS_ENABLED];
            youtubeCheckbox.checked = data[YOUTUBE_BUTTONS_ENABLED];
            windowSidebarCheckbox.checked = data[WINDOW_SIDEBAR_UNAVAILABLE_ENABLED];
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
