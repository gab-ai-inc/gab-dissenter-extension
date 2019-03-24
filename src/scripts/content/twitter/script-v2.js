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

          //Get "action block" to append new button to
          var actionsBlock = tweetBlock.parentElement.parentElement;

          //Create new btn, append and add action
          var dissentBtn = createDissentBtn();
          actionsBlock.appendChild(dissentBtn);
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
        button.style.setProperty("display", 'inline-block', "important");
        button.style.setProperty("height", '18px', "important");
        button.style.setProperty("width", '65px', "important");
        button.style.setProperty("vertical-align", 'top', "important");

        //Create "g" dissent icon
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("version", "1.0");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("width", "18px");
        svg.setAttribute("height", "18px");
        svg.setAttribute("viewBox", "0 0 1280 1280");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("fill", "#657786");
        g.setAttribute("stroke", "none");

        var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
        p.setAttribute("d", "M702 1155 c-60 -13 -144 -53 -157 -75 -6 -10 71 -170 83 -170 4 0 25 9 46 20 145 73 296 -6 296 -156 l0 -37 -22 20 c-28 25 -82 53 -103 53 -19 0 -19 14 0 30 20 17 19 50 -2 50 -9 0 -45 -7 -80 -16 -49 -12 -71 -13 -95 -5 -48 17 -188 13 -249 -6 -60 -20 -149 -96 -149 -129 0 -18 8 -19 107 -19 112 0 185 -17 152 -35 -9 -6 -30 -4 -55 5 -46 17 -183 19 -237 4 -30 -8 -53 -7 -107 8 -56 14 -72 15 -82 5 -8 -8 -9 -17 -3 -26 48 -66 47 -59 25 -107 -30 -67 -27 -155 6 -205 59 -86 124 -118 253 -123 54 -2 111 2 134 9 38 11 39 11 78 -34 21 -24 63 -56 91 -70 94 -47 289 -31 324 26 6 9 10 5 14 -12 6 -25 7 -25 115 -25 l110 0 0 365 c0 403 -2 416 -66 514 -80 120 -260 179 -427 141z m-27 -324 c17 -11 29 -11 68 3 60 20 60 20 47 -3 -15 -30 -12 -66 9 -103 32 -55 35 -91 11 -146 -21 -49 -41 -71 -92 -104 l-27 -18 -6 48 c-22 164 -98 231 -275 241 l-94 6 39 33 c22 18 60 39 85 47 54 18 205 15 235 -4z m-191 -186 c45 -19 103 -70 122 -107 51 -99 -29 -221 -174 -263 -40 -12 -146 -6 -190 9 -135 48 -195 157 -142 261 22 44 25 77 10 106 -13 23 -13 23 40 4 37 -13 49 -13 94 0 28 7 62 15 76 17 36 5 121 -9 164 -27z m440 -73 c46 -43 59 -116 30 -178 -47 -98 -210 -99 -257 -2 l-15 32 41 19 c23 10 53 28 65 40 27 25 62 88 62 111 0 13 5 14 27 5 16 -6 36 -18 47 -27z");

        g.appendChild(p);
        svg.appendChild(g);

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
