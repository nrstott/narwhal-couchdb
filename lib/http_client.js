if (typeof $ == "undefined") {
    var fs = require("file");
    print("Loading jQuery");
		var path = fs.path(module.path).dirname(); 
    load(path + "/env.rhino.js");
    window.location = path + "/test.html";
    load(path + "/jquery-1.3.2.js");
}

var util = require("util");

function HttpClient(){};

HttpClient.prototype = (function() {
    var ajaxOptions = function() {
        return {
            async: true,
            dataType: "json",
            type: "get"
        };
    };
    return {
        _request: function(verb, uri, options) {
            var opts = ajaxOptions();
            util.update(opts, options || {});
            opts.url = uri;
            opts.type = verb;

            $.ajax(opts);
        },
        get: function(uri, options){
            this._request("GET", uri, options);
        },
        put: function(uri, options) {
            this._request("PUT", uri, options);
        },
        post: function(uri, options) {
            this._request("POST", uri, options);
        },
        del: function(uri, options) {
            this._request("DELETE", uri, options);
        }
    };
})();

exports.HttpClient = HttpClient;
