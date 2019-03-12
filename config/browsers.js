const Browser = require('./browser');

//

const chrome = new Browser({
    name: 'Google Chrome',
    slug: 'chrome',
    version: '0.1.3',
    scriptVariableMap: {
        BROWSER: 'chrome',
        MESSENGER: 'extension',
    },
    manifestMap: {
        "background.persistent": false,
        "offline_enabled": false,
        "version_name": "0.1.3",
        "version": "0.1.3",
    },
});

const firefox = new Browser({
    name: 'Mozilla Firefox',
    slug: 'firefox',
    version: '0.1.2',
    scriptVariableMap: {
        BROWSER: 'browser',
        MESSENGER: 'runtime',
    },
    manifestMap: {
        "version": "0.1.2",
        "sidebar_action": {
            "default_title": "Dissenter",
            "default_panel": "sidebar/sidebar.html",
            "default_icon": "assets/images/logo/icon-128.png"
        },
    },
});

const edge = new Browser({
    name: 'Microsoft Edge',
    slug: 'edge',
    version: '0.1.3',
    scriptVariableMap: {
        BROWSER: 'browser',
        MESSENGER: 'runtime',
    },
    manifestMap: {
        "background.persistent": false,
        "version": "0.1.3",
        "author": "Gab.com",
    },
});

const safari = new Browser({
    name: 'Apple Safari',
    slug: 'safari',
    version: '0.1.2',
    scriptVariableMap: {
        BROWSER: 'browser',
        CONTEXT_MENUS: 'menu',
    },
    manifestMap: {
    },
});

//

const Browsers = [
    chrome,
    firefox,
    edge,
    safari,
];

module.exports = Browsers;
