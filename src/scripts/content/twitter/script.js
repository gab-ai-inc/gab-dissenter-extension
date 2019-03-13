/**
 * @description - Gab Dissenter - Twitter content script
 */
var GDTwitter = function() {
    //Global scope
    var scope = this;

    var tweetPermalinks = [];
    var selectedTweet = null;

    /**
     * @description - Finds tweets, appends dissent button to each
     * @function fetchElements
     * @return {Boolean} success
     */
    function fetchElements() {
        //All tweet list items on page
        var tweets = document.querySelectorAll('div.tweet.js-actionable-tweet');

        //Make sure exists
        if (!tweets) return false;

        //Cycle through tweets to find the action bar
        for (var i = 0; i < tweets.length; i++) {
            var tweetBlock = tweets[i];

            //Get permalink from tweet block
            var permalink = getTweetPermalinkFromBlock(tweetBlock);
            if (!permalink) continue;
            if (tweetPermalinks.indexOf(permalink) > -1) continue;

            //Push new permalink to list
            tweetPermalinks.push(permalink);

            //Get "action block" to append new button to
            var actionsBlock = tweetBlock.querySelector('div.ProfileTweet-actionList.js-actions');

            //Create new btn, append and add action
            var dissentBtn = createDissentBtn();
            actionsBlock.appendChild(dissentBtn);
            dissentBtn.onclick = dissentThisTweet.bind(null, permalink);
        };

        //Every 2 seconds check if there's more tweets and if so add new "Dissent This" btns
        setTimeout(fetchElements, 2000);
    };

    /**
     * @description - Helper to create "Dissent This" button with styles
     * @function createDissentBtn
     * @return {Node}
     */
    function createDissentBtn() {
        //Create btn
        var button = document.createElement("a");
        button.textContent = "Dissent This";
        button.style.setProperty("display", 'block', "important");
        button.style.setProperty("position", 'absolute', "important");
        button.style.setProperty("height", '20px', "important");
        button.style.setProperty("width", '80px', "important");
        button.style.setProperty("background-color", COLOR_GAB_GREEN, "important");
        button.style.setProperty("border-radius", "2px", "important");
        button.style.setProperty("right", '10px', "important");
        button.style.setProperty("bottom", '10px', "important");
        button.style.setProperty("left", 'auto', "important");
        button.style.setProperty("top", 'auto', "important");
        button.style.setProperty("color", "#fff", "important");
        button.style.setProperty("font-size", '12px', "important");
        button.style.setProperty("text-align", 'center', "important");
        button.style.setProperty("line-height", '20px', "important");

        //Return
        return button;
    };

    /**
     * @description - Makes a request to the background to open a new dissenter comment window with current page url
     * @function dissentThisTweet
     */
    function dissentThisTweet(permalink) {
        //Get height
        var height = window.innerHeight;

        //Send message to background to open popup window
        __BROWSER__.runtime.sendMessage({
            action: BACKGROUND_ACTION_OPEN_POPUP,
            url: permalink,
            height: height
        });
    };

    /**
     * @description Helper to get tweet permalink from tweet block
     * @param {Node} tweetBlock
     * @return {String}
     */
    function getTweetPermalinkFromBlock(tweetBlock) {
        //Make sure exists
        if (!tweetBlock) return null;

        //Get attribute
        var permalink = tweetBlock.getAttribute('data-permalink-path');
        //Must exist
        if (!permalink || !isString(permalink)) return null;

        //Append
        var url = 'https://www.twitter.com' + permalink;

        //Return
        return url;
    };

    //Global functions


    /**
     * @description - Init script on open
     * @function scope.init
     */
    scope.init = function() {
        fetchElements();
    };
};

//Wait for page to be ready and loaded
ready(function() {
    //Get config keys from background
    __BROWSER__.runtime.sendMessage({
        action: BACKGROUND_ACTION_GET_KEY,
        key: TWITTER_BUTTONS_ENABLED
    }, function(enabled) {
        if (!enabled) return false;

        //Delay a bit
        setTimeout(function () {
            //Init new script
            var gdt = new GDTwitter();
            gdt.init();
        }, 150);
    });
});
