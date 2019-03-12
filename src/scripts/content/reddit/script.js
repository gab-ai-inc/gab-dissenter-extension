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

            //Create new btn, append and add action
            var dissentBtn = createDissentBtn();
            container.appendChild(dissentBtn);
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
        //Create button
        var button = document.createElement("a");
        button.textContent = "Dissent This";
        button.style.setProperty("display", 'block', "important");
        button.style.setProperty("position", 'absolute', "important");
        button.style.setProperty("height", '20px', "important");
        button.style.setProperty("width", '80px', "important");
        button.style.setProperty("background-color", COLOR_GAB_GREEN, "important");
        button.style.setProperty("border-radius", "2px", "important");
        button.style.setProperty("right", '6px', "important");
        button.style.setProperty("bottom", '6px', "important");
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
    //Delay a bit
    setTimeout(function () {
        //Init new script
        var gdr = new GDReddit();
        gdr.init();
    }, 150);
});
