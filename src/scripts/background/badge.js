/**
 * @description - Set extension icon badge with text
 * @param {String} text
 */
function setExtensionIconBadge(text) {
    if (!text) text = '';
    text = String(text);
    text = formatBadgeText(text);

    __BROWSER__.browserAction.setBadgeBackgroundColor({
        color: "#f40e1c"
    });

    __BROWSER__.browserAction.setBadgeText({
        text: text,
        tabId: -1
    });

    if (BROWSER_CONFIG.slug === BROWSER_FIREFOX_SLUG) {
        __BROWSER__.browserAction.setBadgeTextColor({
            color: "#ffffff"
        });
    }
};

/**
 * @description - Helper to format badge text depending on different lengths
 * @param {String} text
 * @returns {String} formattedText
 */
function formatBadgeText(text) {
    //Text must exist
    if (!text) return '';

    //Convert to number
    var num = parseInt(text);
    //If doesn't exist, return nothing
    if (num < 1) return '';

    //Placeholder
    var formattedText = '';

    //Check for lengths
    if (num < 1000) {
        return String(num);
    }
    else if (num >= 1000 && num < 10000) {
        var rounded = truncateNumber(num, 2);
        rounded = rounded / 10;
        formattedText = rounded + 'k';
    }
    else if (num >= 10000 && num < 100000) {
        var rounded = truncateNumber(num, 2);
        formattedText = rounded + 'k';
    }
    else if (num >= 100000 && num < 1000000) {
        var rounded = truncateNumber(num, 3);
        formattedText = rounded + 'k';
    }
    else if (num >= 1000000) {
        formattedText = '1M+';
    }

    //Return now
    return formattedText;
};

/**
 * @description - Helper to truncate number
 * @param {Number} number
 * @param {Number} truncate
 * @param {String}
 */
function truncateNumber(number, truncate) {
    if (!number) return 0;
    return number.toString().substring(0, truncate);
};
