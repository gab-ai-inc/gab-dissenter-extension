/**
 * @description - Gab Dissenter - Youtube content script
 */
var GDYoutube = function() {
    //Global scope
    var scope = this;

    /**
     * @description - Finds top bar, appends dissent button next to subscribe buton
     * @function fetchElements
     * @return {Boolean} success
     */
    function fetchElements() {
        //Get bar where subscribe button is
        var topBar = document.querySelector('#top-row.style-scope.ytd-video-secondary-info-renderer');

        //Must exist
        if (!topBar) {
            //If it doesn't exist, it didn't render yet, so wait and try again
            setTimeout(function() {
                fetchElements();
            }, 500);
            return false;
        }

        //Create "Dissent This" button
        var dissentBtn = createDissentBtn();

        //Append to top bar
        topBar.appendChild(dissentBtn);

        //Add event listener
        dissentBtn.onclick = dissentThisVideo;

        //Success
        return true;
    };

    /**
     * @description - Helper to create "Dissent This" button with styles
     * @function createDissentBtn
     * @return {Node}
     */
    function createDissentBtn() {
        //Create container to match the "Subscribe" button container
        var container = document.createElement("div");
        container.style.setProperty("display", 'inline-block', "important");
        container.style.setProperty("width", '140px', "important");
        container.style.setProperty("height", '50px', "important");
        container.style.setProperty("padding", '7px', "important");
        container.style.setProperty("overflow", 'hidden', "important");
        container.style.setProperty("box-sizing", 'border-box', "important");

        var svg = getDissenterDLogoAsSVG("18px", "18px", "#fff", COLOR_GAB_GREEN)
        svg.style.setProperty("display", 'inline-block', "important");
        svg.style.setProperty("vertical-align", 'middle', "important");
        svg.style.setProperty("margin-right", '8px', "important");

        //Create button with same general style as "Subscribe" button but with new Gab Dissenter styles
        var button = document.createElement("a");
        button.style.setProperty("display", 'inline-block', "important");
        button.style.setProperty("width", '100%', "important");
        button.style.setProperty("height", '100%', "important");
        button.style.setProperty("padding", '10px', "important");
        button.style.setProperty("background-color", COLOR_GAB_GREEN, "important");
        button.style.setProperty("border-radius", '2px', "important");
        button.style.setProperty("text-align", 'center', "important");
        button.style.setProperty("box-sizing", 'border-box', "important");
        button.style.setProperty("cursor", 'pointer', "important");

        var span = document.createElement("span");
        span.textContent = "Dissent This";
        span.style.setProperty("display", 'inline-block', "important");
        span.style.setProperty("color", '#fff', "important");
        span.style.setProperty("text-align", 'left', "important");
        span.style.setProperty("font-size", '14px', "important");
        span.style.setProperty("box-sizing", 'border-box', "important");
        span.style.setProperty("vertical-align", 'top', "important");
        span.style.setProperty("line-height", '17px', "important");

        button.appendChild(svg);
        button.appendChild(span);

        //Append
        container.appendChild(button);

        //Return container
        return container;
    };

    /**
     * @description - Makes a request to the background to open a new dissenter comment window with current page url
     * @function dissentThisVideo
     */
    function dissentThisVideo() {
        //Get url, height
        var url = window.location.href;
        var height = window.innerHeight;

        //Send message to background to open popup window
        __BROWSER__.runtime.sendMessage({
            action: BACKGROUND_ACTION_OPEN_POPUP,
            url: url,
            height: height
        });
    };

    // todo: possibly setup a utils folder for browser-side functions
    // remove element from dom
    Element.prototype.remove = function() {
        this.parentElement.removeChild(this);
    };

    // add element to dom before given element
    Element.prototype.appendBefore = function (element) {
        element.parentNode.insertBefore(this, element);
    }, false;


  // add element to dom after given element
    Element.prototype.appendAfter = function(element) {
        element.parentNode.insertBefore(this, element.nextSibling);
    }, false;

    /**
    * @description - Adds a Dissenter comment section to the bottom of every YouTube video
    * @function addCommentSection
    */
    function addCommentSection(){

        // check if a comment iframe already exists
        var alreadyExistingElement = document.getElementsByClassName('existing-iframe')

        // delete the comment iframe if it already exists
        if(alreadyExistingElement && alreadyExistingElement[0]){
          alreadyExistingElement[0].remove();
        }

        // dissenter address to append current url to
        var BASE_URI = 'https://dissenter.com/discussion/begin-extension?url=';

        // current browser url
        var url = window.location.href;

        // url encode current url
        var encoded = encodeURIComponent(url);

        // build url encoded link to dissenter
        var commentUrl = BASE_URI + encoded;

        // create a new iframe
        var commentsIframe = document.createElement('iframe');
        commentsIframe.src = commentUrl;
        commentsIframe.className = 'popup__iframe abs existing-iframe';
        commentsIframe.id = 'popup-iframe';
        commentsIframe.style.height = '500px';
        commentsIframe.style.width = '100%';

        // div to stick iframe in after, currently start of youtube comments
        var youtubeCommentsDiv = document.getElementsByTagName("ytd-comments")

        /* Add NewElement BEFORE -OR- AFTER Using the Aforementioned Prototypes */
        commentsIframe.appendBefore(youtubeCommentsDiv[0]);
    }

    //Global functions

    /**
     * @description - Init script on open
     * @function scope.init
     */
    scope.init = function() {
        fetchElements();

        // add a comment section to every youtube video
        addCommentSection();
        window.addEventListener("spfdone", addCommentSection); // old youtube design
        window.addEventListener("yt-navigate-start", addCommentSection); // new youtube design
    };
};

//Wait for page to be ready and loaded
ready(function() {
    //Get config keys from background
    __BROWSER__.runtime.sendMessage({
        action: BACKGROUND_ACTION_GET_KEY,
        key: YOUTUBE_BUTTONS_ENABLED
    }, function(enabled) {
        if (!enabled) return false;

        //Delay a bit
        setTimeout(function () {
            //Init new script
            var gdy = new GDYoutube();
            gdy.init();
        }, 250);
    });
});
