/**
 * @description - Helper function to perform xhr request
 * @param  {Object}   options
 * @param  {String}   options.method
 * @param  {String}   options.url
 * @param  {Object}   options.params
 * @param  {Array}    options.headers
 * @param  {Function} callback - {error, data}
 * @return {Function}
 */
function performRequest(options, callback) {
    //Must have options
    if (!options || !isObject(options)) return callback(false, {});

    //Get data
    var method = options.method || '';
    var url = options.url || '';
    var params = options.params;
    var headers = options.headers;

    //Must have method, url
    if (!method || !url) {
        if (callback) return callback(false, {});
        return false;
    }

    //Create new request
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    //Set headers
    xhr.setRequestHeader('Content-type', 'application/json');
    //Check for headers
    if (headers && isArray(headers)) {
        //Cycle
        for (var i = 0; i < headers.length; i++) {
            var header = headers[i];
            //Ensure is object
            if (isObject(header)) {
                //Set
                xhr.setRequestHeader(header.key, header.value);
            }
        };
    }

    //Send params
    if (params && isObject(params)) {
        xhr.send(JSON.stringify(params));
    }
    else {
        xhr.send({});
    }

    //On load handler
    xhr.onload = function() {
        //Attempt to parse response
        var data = {};
        try { data = JSON.parse(xhr.responseText); }
        catch(e) { /**/ };
        //
        if (callback) callback(false, data);
    };

    //On error handler
    xhr.onerror = function() {
        //Attempt to parse response
        var data = {};
        try { data = JSON.parse(xhr.responseText); }
        catch(e) { /**/ };
        //
        if (callback) callback(true, data);
    };
};
