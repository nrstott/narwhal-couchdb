var XMLHttpRequest = require("browser/xhr").XMLHttpRequest;

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

            var data = opts.data || "";
            if (["delete","get"].some(function(x) { return x === verb.toLowerCase(); })){
                data = undefined;
            }

            var req = new XMLHttpRequest();
            req.open(verb, uri, false);
            req.send(data);

            if (req.status >= 200 && req.status < 300 && opts.success){
                var results = req.responseText;
                if (opts.dataType && opts.dataType.toLowerCase() === "json"){
                    results = JSON.parse(results);
                }
                opts.success(results);
            } else if (opts.error) {
                 opts.error(req, req.responseText, req.status);
            }
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
