/* BROWSERS */
var BROWSER_CHROME_SLUG = 'chrome';
var BROWSER_FIREFOX_SLUG = 'firefox';
var BROWSER_EDGE_SLUG = 'edge';
var BROWSER_SAFARI_SLUG = 'safari';

/* BASE URI FOR DISSENTER EXTENSION */
var DISSENTER_HOME_PAGE_URI = "https://dissenter.com";
var BASE_URI = 'https://dissenter.com/discussion/begin-extension?url=';
var COMMENT_COUNT_URI = "https://dissenter.com/notification/comment-count?url=";

/* ACTIONS */
var BACKGROUND_ACTION_OPEN_POPUP = 'open_popup';
var BACKGROUND_ACTION_GET_KEY = 'get_key';
var BACKGROUND_ACTION_SET_KEY = 'set_key';
var BACKGROUND_ACTION_SET_BADGE = 'set_badge';
var BACKGROUND_ACTION_TAB_UPDATED = 'tab_updated';

/* COLORS */
var COLOR_GAB_GREEN = '#21cf7b';

/* SEARCH ENGINES */
var SEARCH_ENGINES = [
    {
        name: "DuckDuckGo",
        url: "https://duckduckgo.com/?q=",
        icon: "duckduckgo.svg"
    },
    {
        name: "Startpage",
        url: "https://www.startpage.com/do/search?q=",
        icon: "startpage.png"
    },
    {
        name: "Bing",
        url: "https://www.bing.com/search?q=",
        icon: "bing.svg"
    },
    {
        name: "Yahoo!",
        url: "https://search.yahoo.com/search?p=",
        icon: "yahoo.svg"
    },
    {
        name: "Google",
        url: "https://www.google.com/search?q=",
        icon: "google.svg"
    }
];

/* STORAGE */
var STORAGE_BASE = 'gab_dissenter_extension_data';

var TWITTER_BUTTONS_ENABLED = 'twitter_buttons_enabled';
var REDDIT_BUTTONS_ENABLED = 'reddit_buttons_enabled';
var YOUTUBE_BUTTONS_ENABLED = 'youtube_buttons_enabled';
var WINDOW_SIDEBAR_UNAVAILABLE_ENABLED = 'window_sidebar_unavailable_enabled';
var WEBSITE_COMMENT_BADGE_ENABLED = 'website_comment_badge_enabled';
var DISSENT_DISQUS_BUTTONS_ENABLED = 'dissent_disqus_buttons_enabled';
var WIKIPEDIA_BUTTONS_ENABLED = 'wikipedia_buttons_enabled';

/* NEW TAB */
var NT_DEFAULT_SEARCH_ENGINE = 'nt_default_search_engine';

var NT_TOP_SITES_ENABLED = 'nt_top_sites_enabled';
var NT_TOP_SITES_LIMIT = 'nt_top_sites_limit';
var NT_TOP_SITES_SIZE = 'nt_top_sites_size';
var NT_TOP_SITES_SHAPE = 'nt_top_sites_shape';
var NT_TOP_SITES_HIGHLIGHT = 'nt_top_sites_highlight';
var NT_TOP_SITES_SHOW_TITLE = 'nt_top_sites_show_title';

var NT_DATETIME_SHOW_DATE = 'nt_datetime_show_date';
var NT_DATETIME_SHOW_TIME = 'nt_datetime_show_time';

var NT_COLORS_SEARCH = 'nt_colors_search';
var NT_COLORS_TEXT = 'nt_colors_text';

var NT_BACKGROUND_RANDOM = 'nt_background_random';
var NT_BACKGROUND_SOLID_COLOR = 'nt_background_solid_color';
var NT_BACKGROUND_IMAGE = 'nt_background_image';
var NT_BACKGROUND_RANDOM_GRADIENT = 'nt_background_random_gradient';

var NT_DISSENTER_ENABLED = 'nt_dissenter_enabled';
var NT_DISSENTER_DEFAULT_TAB = 'nt_dissenter_default_tab';

/* STORAGE DEFAULTS */
var STORAGE_DEFAULT_PARAMS = {};
STORAGE_DEFAULT_PARAMS[TWITTER_BUTTONS_ENABLED] = true;
STORAGE_DEFAULT_PARAMS[REDDIT_BUTTONS_ENABLED] = true;
STORAGE_DEFAULT_PARAMS[YOUTUBE_BUTTONS_ENABLED] = true;
STORAGE_DEFAULT_PARAMS[WINDOW_SIDEBAR_UNAVAILABLE_ENABLED] = true;
STORAGE_DEFAULT_PARAMS[WEBSITE_COMMENT_BADGE_ENABLED] = false;
STORAGE_DEFAULT_PARAMS[DISSENT_DISQUS_BUTTONS_ENABLED] = false;
STORAGE_DEFAULT_PARAMS[WIKIPEDIA_BUTTONS_ENABLED] = true;
STORAGE_DEFAULT_PARAMS[NT_DEFAULT_SEARCH_ENGINE] = SEARCH_ENGINES[0];
STORAGE_DEFAULT_PARAMS[NT_TOP_SITES_ENABLED] = true;
STORAGE_DEFAULT_PARAMS[NT_TOP_SITES_LIMIT] = 10;
STORAGE_DEFAULT_PARAMS[NT_TOP_SITES_SIZE] = "md";
STORAGE_DEFAULT_PARAMS[NT_TOP_SITES_SHAPE] = "circle";
STORAGE_DEFAULT_PARAMS[NT_TOP_SITES_HIGHLIGHT] = "light";
STORAGE_DEFAULT_PARAMS[NT_TOP_SITES_SHOW_TITLE] = true;
STORAGE_DEFAULT_PARAMS[NT_DATETIME_SHOW_DATE] = true;
STORAGE_DEFAULT_PARAMS[NT_DATETIME_SHOW_TIME] = true;
STORAGE_DEFAULT_PARAMS[NT_COLORS_SEARCH] = "white";
STORAGE_DEFAULT_PARAMS[NT_COLORS_TEXT] = "white";
STORAGE_DEFAULT_PARAMS[NT_BACKGROUND_RANDOM] = false;
STORAGE_DEFAULT_PARAMS[NT_BACKGROUND_SOLID_COLOR] = "";
STORAGE_DEFAULT_PARAMS[NT_BACKGROUND_IMAGE] = "";
STORAGE_DEFAULT_PARAMS[NT_BACKGROUND_RANDOM_GRADIENT] = true;
STORAGE_DEFAULT_PARAMS[NT_DISSENTER_ENABLED] = true;
STORAGE_DEFAULT_PARAMS[NT_DISSENTER_DEFAULT_TAB] = "home";

var STORAGE_KEY_ALL = 'all';
