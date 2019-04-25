var TopSites = function() {

    //

    var scope = this;

    //

    var topSiteList = document.getElementById('top-site-list');
    var topSitesEnabledCheckbox = document.querySelector('.sidebar-table-item__input.sidebar-table-item__input--checkbox[data-storage-key="nt_top_sites_enabled"]');

    var optionalPermissions = {
        permissions: ["topSites"]
    };

    var topSiteItems = [];

    var sizes = ["sm", "md", "lg"];
    var highlights = ["light", "dark"];
    var shapes = ["square", "circle"];

    var allStyleClasses = [].concat.apply([], [sizes, highlights, shapes]);

    //

    topSitesEnabledCheckbox.addEventListener("change", function() {
        if (!this.checked) return false;

        __BROWSER__.permissions.request(optionalPermissions, function(granted) {
            if (granted) createTopWithDefaults();
        });
    });

    function createTopWithDefaults() {
        createTop(
            newTab.userDefaults[NT_TOP_SITES_ENABLED],
            newTab.userDefaults[NT_TOP_SITES_LIMIT],
            newTab.userDefaults[NT_TOP_SITES_SIZE],
            newTab.userDefaults[NT_TOP_SITES_SHAPE]
        );
    };

    function createTop(enabled, limit, size, shape) {
        if (!size) size = newTab.newuserDefaults[NT_TOP_SITES_SIZE];
        if (!shape) shape = newTab.userDefaults[NT_TOP_SITES_SHAPE];
        if (limit === undefined) limit = newTab.userDefaults[NT_TOP_SITES_LIMIT];

        if (!enabled) {
            return false;
        }

        __BROWSER__.topSites.get(function(topSites) {
            reset();

            var max = Math.min(topSites.length, limit);

            for (var i = 0; i < max; i++) {
                var site = topSites[i];

                var topSiteItem = getTopSiteItem(site);
                if (!topSiteItem) continue;

                topSiteItems.push(topSiteItem);

                topSiteList.appendChild(topSiteItem);
            }
        });
    };

    function reset() {
        topSiteItems = [];

        while (topSiteList.firstChild) {
            topSiteList.removeChild(topSiteList.firstChild);
        };
    };

    function getTopSiteItem(site, size, shape, highlight) {
        if (!isObject(site)) return false;

        if (!size) size = newTab.userDefaults[NT_TOP_SITES_SIZE];
        if (!shape) shape = newTab.userDefaults[NT_TOP_SITES_SHAPE];
        if (!highlight) highlight = newTab.userDefaults[NT_TOP_SITES_HIGHLIGHT];

        var hostname = (new URL(site.url)).hostname;
        var titleText = hostname;
        titleText = titleText.replace('www.', '');
        titleText = titleText.replace('.com', '');

        var button = document.createElement('a');
        button.className = 'top-site-item';
        button.href = site.url;
        button.classList.add(size);
        button.classList.add(shape);
        button.classList.add(highlight);

        var title = document.createElement('span');
        title.className = 'top-site-item__title';
        title.textContent = titleText;

        var image = document.createElement('img')
        image.className = 'top-site-item__img';;
        image.title = site.title;
        image.src = 'https://logo.clearbit.com/' + hostname;

        button.appendChild(image);
        button.appendChild(title);

        return button;
    };

    //

    scope.setTopSitesEnabled = function(event) {
        if (!isObject(event)) return false;

        var enabled = event.detail;

        topSiteList.classList.toggle("hidden", !enabled);

        if (!enabled) return false;

        createTopWithDefaults();
    };

    scope.updateTopSites = function(event) {
        if (!isObject(event)) return false;

        createTopWithDefaults();
    };

    scope.updateTopSiteStyle = function(event) {
        if (!isObject(event)) return false;

        for (var i = 0; i < topSiteItems.length; i++) {
            var item = topSiteItems[i];

            removeManyClasses(item, allStyleClasses);

            var size = newTab.userDefaults[NT_TOP_SITES_SIZE];
            var shape = newTab.userDefaults[NT_TOP_SITES_SHAPE];
            var highlight = newTab.userDefaults[NT_TOP_SITES_HIGHLIGHT];

            item.classList.add(size);
            item.classList.add(shape);
            item.classList.add(highlight);
        };
    };

    scope.setTopSitesTitlesEnabled = function(event) {
        if (!isObject(event)) return false;

        var enabled = event.detail;

        topSiteList.classList.toggle("show-titles", enabled);
    };

    //

    window.addEventListener("WELM_nt_top_sites_enabled", scope.setTopSitesEnabled, false);
    window.addEventListener("WELM_nt_top_sites_limit", scope.updateTopSites, false);
    window.addEventListener("WELM_nt_top_sites_size", scope.updateTopSiteStyle, false);
    window.addEventListener("WELM_nt_top_sites_shape", scope.updateTopSiteStyle, false);
    window.addEventListener("WELM_nt_top_sites_highlight", scope.updateTopSiteStyle, false);
    window.addEventListener("WELM_nt_top_sites_show_title", scope.setTopSitesTitlesEnabled, false);
};
