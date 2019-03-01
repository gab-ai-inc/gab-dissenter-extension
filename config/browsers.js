const Browser = require('./browser');

//

const chrome = new Browser({
    name: 'Google Chrome',
    slug: 'chrome',
    version: '0.1.1',
    scriptVariableMap: {
        BROWSER: 'chrome',
        MESSENGER: 'extension',
    },
    manifestMap: {
        "background.persistent": false,
        "incognito": "not_allowed",
        "offline_enabled": false,
        "version_name": "0.1.1",
        "version": "0.1.1",
    },
});

const opera = new Browser({
    name: 'Opera',
    slug: 'opera',
    version: '0.1.1',
    scriptVariableMap: {
        BROWSER: 'chrome',
        MESSENGER: 'extension',
    },
    manifestMap: {
        "background.persistent": false,
        "incognito": "not_allowed",
        "offline_enabled": false,
        "version_name": "0.1.1",
        "version": "0.1.1",
    },
});

const firefox = new Browser({
    name: 'Mozilla Firefox',
    slug: 'firefox',
    version: '0.1.0',
    scriptVariableMap: {
        BROWSER: 'browser',
        MESSENGER: 'runtime',
    },
    manifestMap: {
        "version": "0.1.0",
    },
});

const edge = new Browser({
    name: 'Microsoft Edge',
    slug: 'edge',
    version: '0.1.1',
    scriptVariableMap: {
        BROWSER: 'browser',
        MESSENGER: 'runtime',
    },
    manifestMap: {
        "background.persistent": false,
        "version": "0.1.1",
    },
});

const safari = new Browser({
    name: 'Apple Safari',
    slug: 'safari',
    version: '0.1.0',
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
    opera,
];

module.exports = Browsers;
