/**
 * @description - Gab Dissenter - Twitter V2 content script
 */
var GDTwitterV2 = function() {
    //Global scope
    var scope = this;

    var tweetPermalinks = [];
    var selectedTweet = null;

    /**
     * @description - Finds tweets (for twitter's updated design - 2019), appends dissent button to each
     * @function fetchElementsV2
     * @return {Boolean} success
     */
    function fetchElementsV2() {
      //All tweet list items on page
      var tweets = document.querySelectorAll('div[aria-label="Share Tweet"]');

      //Every 2 seconds check if there's more tweets and if so add new "Dissent This" btns
      setTimeout(fetchElementsV2, 2000);

      //Make sure exists
      if (!tweets || tweets.length == 0) return false;

      //Cycle through tweets to find the action bar
      for (var i = 0; i < tweets.length; i++) {
          var tweetBlock = tweets[i];

          //Get permalink from tweet block
          var permalink = getTweetPermalinkFromBlockV2(tweetBlock);
          if (!permalink) continue;
          if (tweetPermalinks.indexOf(permalink) > -1) continue;

          //Push new permalink to list
          tweetPermalinks.push(permalink);

          //Get "tweet card" to append new button to
          var tweetCard = tweetBlock.parentElement.parentElement.parentElement;

          //Create new btn, append and add action
          var dissentBtn = createDissentBtn();
          tweetCard.appendChild(dissentBtn);
          dissentBtn.onclick = dissentThisTweet.bind(null, permalink);
      };
    };

    /**
     * @description - Helper to create "Dissent This" button with styles
     * @function createDissentBtn
     * @return {Node}
     */
    function createDissentBtn() {
        //Create btn
        var button = document.createElement("a");
        button.setAttribute("title", "Dissent");
        button.style.setProperty("display", 'inline-block', "important");
        button.style.setProperty("height", '35px', "important");
        button.style.setProperty("width", '35px', "important");
        button.style.setProperty("position", 'absolute', "important");
        button.style.setProperty("right", '-6px', "important");
        button.style.setProperty("bottom", '-8px', "important");
        button.style.setProperty("border-radius", '50%', "important");

        var svg = getDissenterDLogoAsSVG("18px", "18px", "#657786", "#fff")
        svg.style.setProperty("display", 'block', "important");
        svg.style.setProperty("margin", '9px', "important");

        button.onmouseover = function() {
            var p = this.querySelectorAll("path")[0];
            if (!p) return false;
            p.setAttribute("fill", "#20cf7b");
            button.style.setProperty("background-color", 'rgba(32,207,123,.1)', "important");
        };
        button.onmouseout = function() {
            var p = this.querySelectorAll("path")[0];
            if (!p) return false;
            p.setAttribute("fill", "#657786");
            button.style.removeProperty("background-color");
        };

        button.appendChild(svg);

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
    function getTweetPermalinkFromBlockV2(tweetBlock) {
        //Make sure exists
        if (!tweetBlock) return null;

        var parent = tweetBlock.parentElement.parentElement.parentElement;
        var btn = parent.querySelectorAll('a[href*="/status/"]')[0];

        if (!btn) return null;

        //Get attribute
        var permalink = btn.getAttribute('href');
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
        fetchElementsV2();
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
            var gdt = new GDTwitterV2();
            gdt.init();
        }, 150);
    });
});
