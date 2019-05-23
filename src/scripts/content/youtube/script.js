/**
 * @description - Gab Dissenter - Youtube content script
 */
var GDYoutube = function() {
    //Global scope
    var scope = this;

    /**
     * @description - Finds top bar, appends dissent button next to subscribe button
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


    /**
    * @description - Hides limited state element and begins restricted video automatically
    * @function unrestrictIfNeeded
    */
    function unrestrictIfNeeded(timesTried){
        // try three times before concluding it's not restricted
        timesTried = timesTried || 0 ;

        console.log(timesTried);
        if(timesTried == 3){
          return false
        }

        // hide limited state element if it exists
        var limitedStateElem = document.getElementById('limited-state');
        if(limitedStateElem){
          limitedStateElem.style.display = 'none';
        }

        // wait 1s intervals for dom to build
        setTimeout(function(){
          // get all anchor tags to check if this is a restricted video
          var formattedStrings = document.getElementsByTagName("yt-formatted-string");

          // youtube restricted video text used to check against
          var searchText = "I understand and wish to proceed";

          // search text not matched by default
          var matchedFormattedString = false;

          // loop through anchors and see if restricted anchor exists
          for (var i = 0; i < formattedStrings.length; i++) {
            if (formattedStrings[i].textContent == searchText) {
              matchedFormattedString = formattedStrings[i];
              break;
            }
          }

          // if formatted string matched, go two elements up and click the anchor link
          if(matchedFormattedString){
            console.log('Restricted video, unrestricting');
            matchedFormattedString.parentNode.parentNode.click()
            return true
          } else {
            console.log('No need to unrestrict video');

            // increment times tried and try again
            timesTried++;
            unrestrictIfNeeded(timesTried);
            return false
          }
        }, 1000);

    }


    //Global functions


    /**
     * @description - Init script on open
     * @function scope.init
     */
    scope.init = function() {
        // add dissenter button next to subscribe button
        fetchElements();

        // unrestrict videos on initial page load and then for custom youtube navigation events
        unrestrictIfNeeded();
        window.addEventListener("spfdone", unrestrictIfNeeded); // old youtube design
        window.addEventListener("yt-navigate-start", unrestrictIfNeeded); // new youtube design
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
