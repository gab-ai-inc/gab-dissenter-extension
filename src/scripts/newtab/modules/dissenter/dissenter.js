var Dissenter = function() {

    var scope = this;

    //

    var dissenterSection = document.getElementById('dissenter-section');
    var recentComments = document.getElementById('dissenter-recent-comments');

    var DISSENTER_TAB_HOME = "home";
    var DISSENTER_TAB_DISCOVER = "discover";
    var DISSENTER_TAB_NOTIFICATIONS = "notifications";

    //

    function updateActiveTab(tab) {
        if (!tab || !isString(tab)) return false;

        var activeTab = document.querySelector(".dissenter-section-header__meta-tabs__btn.active");
        if (activeTab) activeTab.classList.remove("active");

        var btn = document.querySelector(".dissenter-section-header__meta-tabs__btn[data-tab='" + tab + "']");
        if (btn) btn.classList.add("active");

        if (tab !== DISSENTER_TAB_HOME) newTab.classes.modules.dissenter.home.hide();
        else newTab.classes.modules.dissenter.home.show();

        if (tab !== DISSENTER_TAB_DISCOVER) newTab.classes.modules.dissenter.discover.hide();
        else newTab.classes.modules.dissenter.discover.show();

        if (tab !== DISSENTER_TAB_NOTIFICATIONS) newTab.classes.modules.dissenter.notifications.hide();
        else newTab.classes.modules.dissenter.notifications.show();
    };

    var tabs = document.querySelectorAll(".dissenter-section-header__meta-tabs__btn");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('click', function(event) {
            updateActiveTab(this.getAttribute('data-tab'));
        });
    };

    function getDissenterCardBtn(type, title, link) {
        if (!type || !link) return null;

        var btn = document.createElement('a');
        btn.className = "dissenter-item__card-btn-block__item";
        btn.href = "https://dissenter.com/discussion/begin?url=" + link;

        var btnIcon = document.createElement('img');
        btnIcon.className = "dissenter-item__card-btn-block__item__img";
        btnIcon.src = "../assets/images/icons/" + type + ".svg"

        var btnTitle = document.createElement('span');
        btnTitle.className = "dissenter-item__card-btn-block__item__title";
        btnTitle.textContent = title || "0";

        btn.appendChild(btnIcon);
        btn.appendChild(btnTitle);

        return btn;
    };

    function getDissenterCard(commentBlock) {
        if (!commentBlock || !isObject(commentBlock)) return null;

        var statsBlock = commentBlock["stats"] || {};
        var pagePreviewBlock = commentBlock["pagePreview"] || {};
        var urlText = pagePreviewBlock["url"] || "";

        var card = document.createElement('div');
        card.className = "dissenter-item__card";

        var title = document.createElement('span');
        title.className = "dissenter-item__card__title";
        title.textContent = pagePreviewBlock["title"] || "";

        var subtitle = document.createElement('span');
        subtitle.className = "dissenter-item__card__subtitle";
        subtitle.textContent = urlText;

        var media = document.createElement('img');
        media.className = "dissenter-item__card__media";

        var images = pagePreviewBlock["images"] || "";
        if (isArray(images)) {
            var image = images[0];
            media.src = image;
        }

        var btnBlock = document.createElement('div');

        btnBlock.className = "dissenter-item__card-btn-block";

        var likeBtn = getDissenterCardBtn("upvote", statsBlock["upvoteCount"], urlText);
        var dislikeBtn = getDissenterCardBtn("downvote", statsBlock["downCount"], urlText);
        var commentBtn = getDissenterCardBtn("comment", statsBlock["commentCount"], urlText);

        card.appendChild(title);
        card.appendChild(subtitle);
        card.appendChild(media);

        if (likeBtn) btnBlock.appendChild(likeBtn);
        if (dislikeBtn) btnBlock.appendChild(dislikeBtn);
        if (commentBtn) btnBlock.appendChild(commentBtn);

        card.appendChild(btnBlock);

        return card;
    };

    //

    scope.getDissenterItem = function(commentBlock) {
        if (!commentBlock || !isObject(commentBlock)) return null;

        var pagePreviewBlock = commentBlock["pagePreview"] || {};
        var url = pagePreviewBlock["url"] || "";
        var titleText = pagePreviewBlock["title"] || "";

        var hostname = (new URL(url)).hostname;

        var item = document.createElement('div');
        item.className = "dissenter-item";
        item.onclick = function() {
            var link = "https://dissenter.com/discussion/begin?url=" + url;
            window.location.href = link;
        };

        var inner = document.createElement('div');
        inner.className = "dissenter-item__inner";

        var icon = document.createElement('img');
        icon.className = "dissenter-item__icon";
        icon.title = titleText;
        icon.src = 'https://logo.clearbit.com/' + hostname;

        var card = getDissenterCard(commentBlock);

        inner.appendChild(icon);
        if (card) inner.appendChild(card);

        item.appendChild(inner);

        return item;
    };

    scope.setDissenterEnabled = function(event) {
        if (!isObject(event)) return false;

        var enabled = event.detail;

        dissenterSection.classList.toggle("hidden", !enabled);
    };

    scope.setDissenterDefaultTab = function(event) {
        if (!isObject(event)) return false;

        var tab = event.detail;

        updateActiveTab(tab);
    };

    //

    window.addEventListener("WELM_nt_dissenter_enabled", scope.setDissenterEnabled, false);
    window.addEventListener("WELM_nt_dissenter_default_tab", scope.setDissenterDefaultTab, false);
};
