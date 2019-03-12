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
        container.style.setProperty("width", '120px', "important");
        container.style.setProperty("height", '50px', "important");
        container.style.setProperty("padding", '7px', "important");
        container.style.setProperty("overflow", 'hidden', "important");
        container.style.setProperty("box-sizing", 'border-box', "important");

        //Create button with same general style as "Subscribe" button but with new Gab Dissenter styles
        var button = document.createElement("a");
        button.textContent = "Dissent This";
        button.style.setProperty("display", 'inline-block', "important");
        button.style.setProperty("width", '100%', "important");
        button.style.setProperty("height", '100%', "important");
        button.style.setProperty("padding", '10px', "important");
        button.style.setProperty("background-color", COLOR_GAB_GREEN, "important");
        button.style.setProperty("color", '#fff', "important");
        button.style.setProperty("border-radius", '2px', "important");
        button.style.setProperty("text-align", 'center', "important");
        button.style.setProperty("font-size", '14px', "important");
        button.style.setProperty("box-sizing", 'border-box', "important");
        button.style.setProperty("cursor", 'pointer', "important");

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
        var gdy = new GDYoutube();
        gdy.init();
    }, 250);
});
