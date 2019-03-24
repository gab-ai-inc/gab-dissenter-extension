/**
 * @description - Gab Dissenter - Reddit content script
 */
var GDReddit = function() {
    //Global scope
    var scope = this;

    var redditPermalinks = [];

    /**
     * @description - Finds reddit posts, appends dissent button to each
     * @function fetchElements
     * @return {Boolean} success
     */
    function fetchElements() {
        //All post list items on page
        var commentBtns = document.querySelectorAll('a[data-click-id="comments"][data-test-id="comments-page-link-num-comments"]');

        //Make sure exists
        if (!commentBtns) return false;

        //Cycle through posts to find the action bar
        for (var i = 0; i < commentBtns.length; i++) {
            var commentBtn = commentBtns[i];

            //Get permalink from btn
            var permalink = getRedditPermalinkFromCommentBtn(commentBtn);
            if (!permalink) continue;
            if (redditPermalinks.indexOf(permalink) > -1) continue;

            //Push new permalink to list
            redditPermalinks.push(permalink);

            //Get button parent to append new btn
            var container = commentBtn.parentElement;
            //Make parent width 100% to make room
            container.style.setProperty("width", '100%', "important");

            var dots = container.lastChild.previousSibling;

            //Create new btn, append and add action
            var dissentBtn = createDissentBtn();
            container.insertBefore(dissentBtn, dots);
            dissentBtn.onclick = dissentThisPost.bind(null, permalink);
        };

        //Every 2 seconds check if there's more posts and if so add new "Dissent This" btns
        setTimeout(fetchElements, 2000);
    };

    /**
     * @description - Helper to create "Dissent This" button with styles
     * @function createDissentBtn
     * @return {Node} newBtn
     */
    function createDissentBtn() {
        //Create btn
        var button = document.createElement("a");
        button.style.setProperty("display", 'inline-block', "important");
        button.style.setProperty("height", '20px', "important");
        button.style.setProperty("width", '20px', "important");
        button.style.setProperty("vertical-align", 'top', "important");
        button.style.setProperty("margin-left", '2px', "important");
        button.style.setProperty("margin-right", '4px', "important");

        //Create "g" dissent icon
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.style.setProperty("display", 'inline-block', "important");
        svg.style.setProperty("vertical-align", 'middle', "important");
        svg.setAttribute("version", "1.0");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("width", "20px");
        svg.setAttribute("height", "20px");
        svg.setAttribute("viewBox", "0 0 1280 1280");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("fill", "#878a8c");
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
     * @function dissentThisPost
     */
    function dissentThisPost(permalink) {
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
     * @description Helper to get reddit permalink from reddit comment btn
     * @param {Node} btn
     * @return {String}
     */
    function getRedditPermalinkFromCommentBtn(btn) {
        //Make sure exists
        if (!btn) return null;

        //Get attribute
        var permalink = btn.getAttribute('href');
        //Must exist
        if (!permalink || !isString(permalink)) return null;

        //Append
        var url = 'https://www.reddit.com' + permalink;

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
        key: REDDIT_BUTTONS_ENABLED
    }, function(enabled) {
        if (!enabled) return false;

        //Delay a bit
        setTimeout(function () {
            //Init new script
            var gdr = new GDReddit();
            gdr.init();
        }, 150);
    });
});
