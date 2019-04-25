var DissenterNotifications = function() {

    var scope = this;

    //

    var parentContainer = document.getElementById("dissenter-content__notifications");
    var notificationItemContainer = document.getElementById("dissenter-notifications-container");
    var notificationTabBtn = document.getElementById("dissenter-notification-tab-btn");

    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var newNotiCount = 0;

    //

    function reset() {
        newNotiCount = 0;
        notificationItemContainer.innerText = "";
    };

    function loadData() {
        //Perform request to get notifications
        performRequest({
            method: 'GET',
            url: 'https://dissenter.com/notification?fmt=json'
        }, function(error, data) {
            //Must be object
            if (!data || !isObject(data)) return;

            var blocks = data["notifications"];
            if (!blocks || !isArray(blocks)) return;

            reset();

            for (var i = 0; i < blocks.length; i++) {
                var block = blocks[i];

                var node = getDissenterNotification(block);
                if (!node) continue;

                notificationItemContainer.appendChild(node);
            };

            setBadge();
        });
    };

    function setBadge() {
        if (newNotiCount > 0) {
            notificationTabBtn.setAttribute("data-badge", newNotiCount);
            notificationTabBtn.classList.add("has-badge");
        }
        else {
            notificationTabBtn.removeAttribute("data-badge");
            notificationTabBtn.classList.remove("has-badge");
        }
    };

    function getDissenterNotification(notiBlock) {
        if (!isObject(notiBlock)) return null;

        //Blocks
        var subjectBlock = notiBlock["subject"] || {};
        var actorBlock = notiBlock["actor"] || {};
        var urlBlock = subjectBlock["url"] || {};
        var commentId = subjectBlock["_id"] || "";

        var hostname = (new URL(urlBlock.url)).hostname;

        var action = notiBlock["action"] || "";
        var subjectType = notiBlock["subjectType"] || "";
        subjectType = subjectType.toLowerCase();

        var noti = document.createElement('a');
        noti.className = 'dissenter-noti cs--white-on-black ' + action;
        if (commentId) noti.href = "https://dissenter.com/comment/" + commentId;
        if (notiBlock.status === "new") {
            noti.classList.add("new");
            newNotiCount ++;
        }

        //

        var icons = document.createElement('div');
        icons.className = 'dissenter-noti__icons';

        var urlIcon = document.createElement('img');
        urlIcon.className = 'dissenter-noti__icons__url';
        urlIcon.src = 'https://logo.clearbit.com/' + hostname;

        var actionIcon = document.createElement('img');
        actionIcon.className = 'dissenter-noti__icons__action';
        var actionIconUrl = "../assets/images/icons/" + getIconForAction(action);
        actionIcon.src = actionIconUrl;

        icons.appendChild(urlIcon);
        icons.appendChild(actionIcon);

        //

        var content = document.createElement('div');
        content.className = 'dissenter-noti__page-content';

        var title = document.createElement('span');
        title.className = 'dissenter-noti__page-content__title';
        title.textContent = urlBlock["title"] || "";

        var url = document.createElement('span');
        url.className = 'dissenter-noti__page-content__url';
        url.textContent = urlBlock["url"] || "";

        content.appendChild(title);
        content.appendChild(url);

        //

        var context = document.createElement('div');
        context.className = 'dissenter-noti__context';

        var name = document.createElement('span');
        name.className = 'dissenter-noti__context__name';
        name.textContent = actorBlock["username"] || "";

        var text = document.createElement('span');
        text.className = 'dissenter-noti__context__text';
        text.textContent = getActionInPastTense(action) + " your " + subjectType;

        var elapsed = document.createElement('span');
        elapsed.className = 'dissenter-noti__context__elapsed';
        elapsed.textContent = getElapsedTime(notiBlock["created"] || "");

        var subject = document.createElement('p');
        subject.className = 'dissenter-noti__context__subject';
        subject.textContent = subjectBlock["body"] || "";

        context.appendChild(name);
        context.appendChild(text);
        context.appendChild(elapsed);
        context.appendChild(subject);

        if (notiBlock.action === "reply") {
            var relatedBlock = notiBlock["related"] || {};
            var bodyText = relatedBlock["body"] || "";

            var reply = document.createElement('p');
            reply.className = 'dissenter-noti__context__reply';
            reply.textContent = bodyText;

            context.appendChild(reply);
        }

        //

        var meta = document.createElement('div');
        meta.className = 'dissenter-noti__meta';

        meta.appendChild(content);
        meta.appendChild(context);

        //

        noti.appendChild(icons);
        noti.appendChild(meta);

        return noti;
    };

    function getElapsedTime(startDate) {
        var a = new Date(startDate);

        var b = new Date();

        var difference = (b - a) / 1000;

        var elapsed = "";

        if (difference < 60) elapsed = "just now";
        else if (difference >= 60 && difference < 3600) {
            var min = (difference / 60);
            min = parseInt(min);
            elapsed = min + "m ago";
        }
        else if (difference >= 3600 && difference < 86400) {
            var hr = (difference / 3600);
            hr = parseInt(hr);
            elapsed = hr + "h ago";
        }
        else if (difference >= 3600 && difference < 86400) {
            var hr = (difference / 3600);
            hr = parseInt(hr);
            elapsed = hr + "h ago";
        }
        else {
            var monthName = monthNames[a.getMonth()];
            var day = a.getDate();

            elapsed = monthName + " " + day;
        }

        return elapsed;
    };

    function getActionInPastTense(action) {
        var past = "looked at";

        if (action == "upvote") past = "upvoted";
        else if (action == "downvote") past = "downvoted";
        else if (action == "reply") past = "replied to";

        return past;
    };

    function getIconForAction(action) {
        var iconName = "spinner.svg";

        if (action == "upvote") iconName = "upvote.svg";
        else if (action == "downvote") iconName = "downvote.svg";
        else if (action == "reply") iconName = "comment.svg";

        return iconName;
    };

    //

    scope.show = function() {
        parentContainer.classList.remove("hidden");

        loadData();
    };

    scope.hide = function() {
        parentContainer.classList.add("hidden");
    };
};
