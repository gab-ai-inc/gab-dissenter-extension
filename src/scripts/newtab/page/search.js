var Search = function() {

    var scope = this;

    //

    var searchInput = document.getElementById("search-input");
    var searchInputIcon = document.getElementById("search-input-icon");
    var searchForm = document.getElementById("search-form");
    var searchEngineList = document.getElementById('search-engine-list');

    //

    function getSearchEngineListItem(searchEngineBlock, defaultSearchEngine) {
        if (!isObject(searchEngineBlock) || !isObject(defaultSearchEngine)) return null;

        var button = document.createElement('a');
        button.className = 'search-engine-dropdown__list-item';
        button.setAttribute("data-value", searchEngineBlock.name);
        button.addEventListener("click", function() {
            updateSearchEngine(this, searchEngineBlock);
        });

        if (defaultSearchEngine.name === searchEngineBlock.name) {
            button.classList.add("active");
            updateSearchEngine(button, searchEngineBlock);
        }

        var icon = document.createElement('img');
        icon.className = "search-engine-dropdown__list-item__img";
        icon.alt = searchEngineBlock.name;
        icon.src = "../assets/images/icons/" + searchEngineBlock.icon;

        var title = document.createElement('span');
        title.className = "search-engine-dropdown__list-item__title";
        title.textContent = searchEngineBlock.name;

        button.appendChild(icon);
        button.appendChild(title);

        return button;
    };

    var defaultSearchEngine = newTab.userDefaults[NT_DEFAULT_SEARCH_ENGINE];

    for (var i = 0; i < SEARCH_ENGINES.length; i++) {
        var searchEngineItem = getSearchEngineListItem(SEARCH_ENGINES[i], defaultSearchEngine);
        if (!searchEngineItem) continue;
        searchEngineList.appendChild(searchEngineItem);
    };

    function updateSearchEngine(btn, searchEngineBlock) {
        if (!btn || !isObject(searchEngineBlock)) return false;

        var activeBtn = document.querySelector('.search-engine-dropdown__list-item.active');
        if (activeBtn) activeBtn.classList.remove("active");

        btn.classList.add('active');

        var placeholder = "Search " + searchEngineBlock.name + " or type a URL";
        searchInput.setAttribute("placeholder", placeholder);

        searchInputIcon.src = "../assets/images/icons/" + searchEngineBlock.icon;

        searchForm.setAttribute("action", searchEngineBlock.url);

        //Set config keys from background
        __BROWSER__.runtime.sendMessage({
            action: BACKGROUND_ACTION_SET_KEY,
            key: NT_DEFAULT_SEARCH_ENGINE,
            value: searchEngineBlock
        });
    };

    //

    scope.setSearchColorScheme = function(event) {
        if (!isObject(event)) return false;

        var color = event.detail;

        searchForm.classList.remove("white", "black", "dark-grey", "light-grey");
        searchForm.classList.add(color);
    };

    //

    window.addEventListener("WELM_nt_colors_search", scope.setSearchColorScheme, false);

};
