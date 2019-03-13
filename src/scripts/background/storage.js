/**
 * @description - GDEStorage - Gab Dissenter Extension Storage
 */
function GDEStorage() {
    //Global scope
    var scope = this;

    //Functions


    /**
     * @description - Setup method
     * @function setup
     * @return {Boolean} success
     */
    function setup() {
        //Must exist
        if (window.localStorage == null) return false;

        if (!window.localStorage[STORAGE_BASE] && !isObject(window.localStorage[STORAGE_BASE])) {
            window.localStorage[STORAGE_BASE] = JSON.stringify(STORAGE_DEFAULT_PARAMS);
        }

        return true;
    };


    //Global functions


    /**
     * @description - Init
     * @function scope.init
     * @return {Boolean} success
     */
    scope.init = function() {
        //Setup if none
        setup();

        //Success
        return true;
    };

    /**
     * @description - Helper to get value from storage
     * @function scope.getValue
     * @param {String} key
     * @return {*} value
     */
    scope.getValue = function(key) {
        //Setup if none
        setup();

        //Get data, parse
        var params = window.localStorage[STORAGE_BASE];
        params = JSON.parse(params);

        //If all, return all
        if (key === STORAGE_KEY_ALL) return params;

        //Return key value
        return params[key];
    };

    /**
     * @description - Helper to set value to storage
     * @function scope.getValue
     * @param {String} key
     * @param {*} value
     * @return {Boolean} success
     */
    scope.setValue = function(key, value) {
        //Setup if none
        setup();

        //Get data, parse
        var params = window.localStorage[STORAGE_BASE];
        params = JSON.parse(params);

        //Set value
        params[key] = value;

        //Reset
        window.localStorage[STORAGE_BASE] = JSON.stringify(params);

        //Success
        return true;
    };

    /**
     * @description - Helper function to log out, clear keys
     * @returns {Boolean} success
     */
    scope.logout = function() {
        if (window.localStorage == null) return false;

        //Reset
        scope.setValue(STORAGE_KEY_LOGGED_IN, false);

        //Success
        return true;
    };
};


//Set up storage on load and init
var gdes = new GDEStorage();
gdes.init();
