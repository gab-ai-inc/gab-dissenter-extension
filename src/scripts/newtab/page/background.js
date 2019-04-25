var Background = function() {

    var scope = this;

    //

    var content = document.getElementById("content");
    var mainImage = document.getElementById("main__image");
    var clearUploadedBackgroundBtn = document.getElementById("sidebar-settings-meta-clear-background-image-btn");
    var metaBackgroundImageBox = document.getElementById("sidebar-settings-meta-background-image");

    var colorSchemes = ["cs--black", "cs--white", "cs--light-grey", "cs--dark-grey"];

    var DAILY_RANDOM_WALLPAPER_URL = "url(https://source.unsplash.com/daily?wallpaper)";
    var HEX_VALUES = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e"];


    //

    clearUploadedBackgroundBtn.addEventListener("click", function() {
        newTab.settings.updateSettingsItem(NT_BACKGROUND_IMAGE, null, true);
        resetBackgroundImage();
    });

    function resetBackgroundImage() {
        metaBackgroundImageBox.src = "";

        //If background is random, set it
        if (newTab.userDefaults[NT_BACKGROUND_RANDOM]) {
            mainImage.classList.toggle("hidden", false);
            mainImage.style.setProperty("background-image", DAILY_RANDOM_WALLPAPER_URL, "important");
        }
        else {
            mainImage.classList.toggle("hidden", true);
            mainImage.style.removeProperty("background-image");
        }
    };

    function getRandomHex() {
        var h = "#";
        for (var i = 0; i < 6; i++) {
            var x = Math.round(Math.random() * 14);
            var y = HEX_VALUES[x];
            h += y;
        };
        return h;
    };

    function getRandomLinearGradient() {
        var colorStart = getRandomHex();
        var colorEnd = getRandomHex();
        var angle = Math.round(Math.random() * 360);

        var gradient = "linear-gradient(" + angle + "deg, " + colorStart + ", " + colorEnd + ")";

        return gradient;
    };

    //

    scope.setBackgroundRandom = function(event) {
        if (!isObject(event)) return false;

        var enabled = event.detail;

        mainImage.classList.toggle("hidden", !enabled);

        if (enabled) {
            metaBackgroundImageBox.src = "";
            mainImage.style.setProperty("background-image", DAILY_RANDOM_WALLPAPER_URL, "important");

            //Reset background solid color, image
            var event1 = new CustomEvent("WELM_update_settings_item", {
                detail: {
                    key: NT_BACKGROUND_IMAGE,
                    value: null,
                    updateInRuntime: true,
                    updateInput: true
                }
            });
            window.dispatchEvent(event1);

            var event2 = new CustomEvent("WELM_update_settings_item", {
                detail: {
                    key: NT_BACKGROUND_SOLID_COLOR,
                    value: null,
                    updateInRuntime: true,
                    updateInput: true
                }
            });
            window.dispatchEvent(event2);
        }
    };

    scope.setBackgroundSolidColor = function(event) {
        if (!isObject(event)) return false;

        var color = event.detail;

        if (!color) {
            resetBackgroundImage();
        }
        else {
            mainImage.classList.add("hidden");
            content.style.setProperty("background-color", color, "important");
            content.style.removeProperty("background");
        }
    };

    scope.setBackgroundRandomGradient = function(event) {
        if (!isObject(event)) return false;

        var enabled = event.detail;

        if (enabled) {
            var gradient = getRandomLinearGradient();
            mainImage.classList.add("hidden");
            content.style.setProperty("background", gradient, "important");
        }
        else {
            resetBackgroundImage();
        }
    };

    scope.setBackgroundImage = function(event) {
        if (!isObject(event)) return false;

        var imageData = event.detail;

        if (!imageData) {
            resetBackgroundImage();
        }
        else {
            var bgImg = "url(" + imageData + ")";
            mainImage.style.setProperty("background-image", bgImg, "important");
            metaBackgroundImageBox.src = imageData;

            //Reset background solid color, random daily
            var event1 = new CustomEvent("WELM_update_settings_item", {
                detail: {
                    key: NT_BACKGROUND_RANDOM,
                    value: false,
                    updateInRuntime: true,
                    updateInput: true
                }
            });
            window.dispatchEvent(event1);

            var event2 = new CustomEvent("WELM_update_settings_item", {
                detail: {
                    key: NT_BACKGROUND_SOLID_COLOR,
                    value: null,
                    updateInRuntime: true,
                    updateInput: true
                }
            });
            window.dispatchEvent(event2);
        }

        //Show
        mainImage.classList.remove("hidden");
    };

    scope.setPageColorScheme = function(event) {
        if (!isObject(event)) return false;

        removeManyClasses(content, colorSchemes);

        var color = event.detail;
        var newClass = "cs--" + color;
        content.classList.add(newClass);
    };

    //

    window.addEventListener("WELM_nt_background_random", scope.setBackgroundRandom, false);
    window.addEventListener("WELM_nt_background_solid_color", scope.setBackgroundSolidColor, false);
    window.addEventListener("WELM_nt_background_image", scope.setBackgroundImage, false);
    window.addEventListener("WELM_nt_colors_text", scope.setPageColorScheme, false);
    window.addEventListener("WELM_nt_background_random_gradient", scope.setBackgroundRandomGradient, false);
};
