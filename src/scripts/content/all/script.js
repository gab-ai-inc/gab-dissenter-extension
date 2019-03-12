/**
 * @description - Gab Dissenter - All websites content script
 */
var GDAll = function() {
    //Global scope
    var scope = this;

    var GDDisqus = function() {

        //Global scope
        var scope = this;

        /**
         * @description - Attempts to find disqus thread on any site and appends dissenter button before it
         * @function fetchElements
         * @return {Boolean} success
         */
        function fetchElements() {
            //Find disqus section
            var disqusSection = document.getElementById('disqus_thread');

            //Make sure it exists, if no, return
            if (!disqusSection) return false;

            //Create new btn, append and add action
            var dissentBtn = createDissentBtn();

            //Get parent of disqus thread
            var parentElement = disqusSection.parentElement;
            //Insert button before the thread within the thread's parent
            parentElement.insertBefore(dissentBtn, disqusSection);

            //Set onclick event
            dissentBtn.onclick = dissentThisPage;

            //Success
            return true;
        };

        /**
         * @description - Helper to create "View Comments on Dissenter" button with styles
         * @function createDissentBtn
         * @return {Node}
         */
        function createDissentBtn() {
            //Create container
            var container = document.createElement("div");
            container.style.setProperty("display", 'block', "important");
            container.style.setProperty("width", '100%', "important");
            container.style.setProperty("height", '80px', "important");
            container.style.setProperty("padding", '20px 0', "important");
            container.style.setProperty("overflow", 'hidden', "important");
            container.style.setProperty("box-sizing", 'border-box', "important");

            //Create button with same general style as "Subscribe" button but with new Gab Dissenter styles
            var button = document.createElement("a");
            button.textContent = "View Comments on Dissenter";
            button.style.setProperty("display", 'block', "important");
            button.style.setProperty("width", '100%', "important");
            button.style.setProperty("height", '40px', "important");
            button.style.setProperty("background-color", COLOR_GAB_GREEN, "important");
            button.style.setProperty("color", '#fff', "important");
            button.style.setProperty("border-radius", '4px', "important");
            button.style.setProperty("text-align", 'center', "important");
            button.style.setProperty("margin", '0 auto', "important");
            button.style.setProperty("line-height", '40px', "important");
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
         * @function dissentThisPage
         */
        function dissentThisPage() {
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
         * @description - Init script on open
         * @function scope.init
         */
        scope.init = function() {
            fetchElements();
        };
    };


    //Global functions


    /**
     * @description - Init script on open
     * @function scope.init
     */
    scope.init = function() {
        //Init Disqus
        var gdd = new GDDisqus();
        gdd.init();
    };
};

//Wait for page to be ready and loaded
ready(function() {
    //Delay a bit
    setTimeout(function () {
        //Init new script
        var gda = new GDAll();
        gda.init();
    }, 5000);
});
