var DissenterDiscover = function() {

    var scope = this;

    //

    var parentContainer = document.getElementById("dissenter-content__discover");
    var urlItemContainer = document.getElementById("dissenter-discover-url-container");

    //

    function reset() {
        urlItemContainer.innerText = "";
    };

    function loadData() {
        //Perform request to get comment count
        performRequest({
            method: 'GET',
            url: 'https://dissenter.com/url?fmt=json'
        }, function(error, data) {
            //Must be object
            if (!isObject(data)) return;

            var blocks = data.commentUrls;
            if (!blocks || !isArray(blocks)) return;

            reset();

            for (var i = 0; i < blocks.length; i++) {
                var block = blocks[i];
                var node = newTab.classes.modules.dissenter.index.getDissenterItem(block);
                if (!node) continue;
                urlItemContainer.appendChild(node);
            };
        });
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
