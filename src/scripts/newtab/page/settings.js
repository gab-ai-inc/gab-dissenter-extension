var Settings = function() {

    var scope = this;

    //

    var settingsItems = document.querySelectorAll(".sidebar-table-item__input");

    var MAX_FILE_SIZE_IN_MB = 1;

    //

    scope.updateSettingsItem = function(key, val, updateInRuntime, updateInput) {
        if (!isString(key)) return false;

        //Set newTab defaults
        newTab.userDefaults[key] = val;

        if (updateInRuntime) {
            //Set config keys from background
            __BROWSER__.runtime.sendMessage({
                action: BACKGROUND_ACTION_SET_KEY,
                key: key,
                value: val
            });
        }

        if (updateInput) {
            var input = document.querySelector(".sidebar-table-item__input[data-storage-key='" + key + "']");
            var itemKey = input.classList.contains("sidebar-table-item__input--checkbox") ? "checked" : "value";
            var isFileInput = item.getAttribute("type") === "file";

            if (!isFileInput) {
                input[itemKey] = val;
            }
        }
        else {
            //Send event
            var customEventName = "WELM_" + key;
            var event = new CustomEvent(customEventName, {
                detail: val
            });
            window.dispatchEvent(event);
        }
    };

    //

    //Set settings inputs
    for (var i = 0; i < settingsItems.length; i++) {
        var item = settingsItems[i];

        var storageKey = item.getAttribute("data-storage-key");
        if (!storageKey) continue;

        var storageValue = newTab.userDefaults[storageKey];

        var isFileInput = item.getAttribute("type") == "file";
        var itemKey = item.classList.contains("sidebar-table-item__input--checkbox") ? "checked" : "value";

        if (!isFileInput) {
            item[itemKey] = storageValue;
        }

        var evtName = item.classList.contains("sidebar-table-item__input--textbox") ? "input" : "change";

        //Set initial value
        scope.updateSettingsItem(storageKey, storageValue, false);

        //
        item.addEventListener(evtName, function(event) {
            var val = this.classList.contains("sidebar-table-item__input--checkbox") ? this.checked : this.value;

            var isFileInput = this.getAttribute("type") == "file";
            if (isFileInput) {
                processFile(this, function(input, fileData) {
                    if (!input || !fileData) return false;

                    scope.updateSettingsItem(input.getAttribute("data-storage-key"), fileData, true);
                });
            }
            else {
                scope.updateSettingsItem(this.getAttribute("data-storage-key"), val, true);
            }
        });
    };

    function processFile(input, callback) {
        var file = input.files[0];

        if (!file) return callback(null, null);

        var reader = new FileReader();
        var fileSizeMB = ((file.size/1024)/1024).toFixed(4); // MB

        if (fileSizeMB > MAX_FILE_SIZE_IN_MB) {
            alert("Error: Image exceeds maximum of 1MB file size.");
            return callback(null, null);
        }

        reader.addEventListener("load", function () {
            return callback(input, reader.result);
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    //

    window.addEventListener("WELM_update_settings_item", function(event) {
        if (!isObject(event)) return false;

        var data = event.detail;

        if (!isObject(data)) return false;

        scope.updateSettingsItem(
            data["key"],
            data["value"],
            data["updateInRuntime"],
            data["updateInput"]
        );
    }, false);

};
