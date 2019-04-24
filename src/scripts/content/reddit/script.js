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
        button.setAttribute("title", 'Dissent');
        button.style.setProperty("display", 'inline-block', "important");
        button.style.setProperty("height", '21px', "important");
        button.style.setProperty("width", '72px', "important");
        button.style.setProperty("vertical-align", 'top', "important");
        button.style.setProperty("margin-left", '1px', "important");
        button.style.setProperty("margin-right", '2px', "important");
        button.style.setProperty("padding", '3px 4px 0', "important");
        button.style.setProperty("border-radius", '3px', "important");
        button.onmouseover = function() {
            button.style.setProperty("background-color", 'rgba(26,26,27,.1)', "important");
        };
        button.onmouseout = function() {
            button.style.removeProperty("background-color");
        };

        var svg = getDissenterDLogoAsSVG("17px", "17px", "#878a8c", "#fff")
        svg.style.setProperty("display", 'inline-block', "important");
        svg.style.setProperty("vertical-align", 'middle', "important");

        var span = document.createElement("span");
        span.style.setProperty("display", 'inline-block', "important");
        span.style.setProperty("height", '20px', "important");
        span.style.setProperty("width", '44px', "important");
        span.style.setProperty("vertical-align", 'top', "important");
        span.style.setProperty("margin-left", '6px', "important");
        span.style.setProperty("line-height", '17px', "important");
        span.style.setProperty("color", '#87818c', "important");
        span.textContent = 'Dissent';

        button.appendChild(svg);
        button.appendChild(span);

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
