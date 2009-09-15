var util = require("util");

function Database(server, name) {
    var self = this;
    this.name = encodeURIComponent(name);
    this.server = server;
    this.httpClient = this.server.httpClient;
    this.uri = function() { return self.server.uri + self.name + "/"; };

    server.allDbs({
        async: false,
        success: function(data, textStatus) {
            if (data.indexOf(self.name) == -1)
                self.server.createDb(self.name);
        }
    });

    return this;
}

Database.prototype = {
    allDocs: function(options){
        options = options || {};

        var include_docs = options.include_docs || true,
            results = [];

        this.httpClient.get(this.uri() + encodeURIComponent("_all_docs") + encodeOptions({ include_docs: include_docs }), {
            async: false,
            success: function(data, textStatus){
                results = data.rows;
            }
        });

        return results;
    },
    save: function(doc, success, error){
        if (doc._id == undefined)
            doc._id = this.server.uuid();

        var settings = { success: success, error: error };

        this.httpClient.put(this.uri() + encodeURIComponent(doc._id), {
            data: JSON.stringify(doc),
            async: false,
            success: function(data, statusText){
                doc._rev = data._rev;
                if ($.isFunction(settings.success))
                    settings.success(doc);
            },
            error: function(xhr, textStatus, errorThrown) {
                if ($.isFunction(settings.error))
                    settings.error(textStatus, errorThrown);
            }
        });
    },
    bulkSave: function(docs, success, error){
        var self = this;
        
        docs.forEach(function(doc){
            if (doc._id == undefined)
                doc._id = self.server.uuid();
        });

        var settings = { success: success, error: error };

        var err = null;

        this.httpClient.post(this.uri() + "_bulk_docs", {
            async: false,
            data: JSON.stringify({ "docs": docs }),
            success: function(data, textStatus) {
                for (var i=0;i<data.length;++i) {
                    docs[i]._rev = data[i]._rev;
                }
                if (settings.success instanceof Function)
                    settings.success(doc);
            },
            error: function(xhr, textStatus, errorThrown){
                print("BulkSave Failure: " + xhr.status);
                err = { status: xhr.status,
                    textStatus: textStatus,
                    errorThrown: errorThrown
                };
            }
        });

        if (err) {
            throw new Error(err.status + ": " + err.textStatus || "" + err.errorThrown || "");
        }
    },
    find: function(id) {
        var doc = null;
        var err = null;

        this.httpClient.get(this.uri() + encodeURIComponent(id), {
            async: false,
            success: function(data, textStatus) {
                doc = data;
            },
            error: function(xhr, textStatus, errorThrown) {
                err = { status: xhr.status, textStatus: textStatus, error: errorThrown };
            }
        });

        if (err != null)
        {
            if (err.status == 404)
                return null;
            throw err;
        }

        return doc;
    },
    view: function(designDocName, viewName, options) {
        var viewResult = null;

        designDocName = designDocName.replace(/^_design\//g, "");

        var viewPath = this.uri() + "_design/" + designDocName + "/_view/" + viewName + encodeOptions(options);
        print("fetching view at " + viewPath);
        this.httpClient.get(viewPath, {
            async: false,
            success: function(data, textStatus) {
                viewResult = data;
                viewResult.totalRows = viewResult.total_rows;
            },
            error: function(xhr, textStatus, errorThrown) {
                throw new Error(textStatus + ": " + (errorThrown || ""));
            }
        });

        return viewResult;
    },
    list: function(designDocName, listName, viewName, options){
        var listResult = null;

        var listUri = this.uri() + "_design/" + designDocName + "/_list/" + listName + "/" + viewName + encodeOptions(options);
        print("fetching list at " + listUri);

        this.httpClient.get(listUri, {
            async: false,
            dataType: "json",
            success: function(data, textStatus) {
                listResult = data;
            },
            error: function(xhr, textStatus, errorThrown){
                throw new Error(textStatus + ": " + (errorThrown || ""));
            }
        });

        return listResult;
    },
    fullTextSearch: function(designDocName, fullTextViewName, options) {
        options = options || {};
        options = util.deepCopy(options);
        options.limit = options.limit || 5;
        options.include_docs = true;
        if (options.query) {
            options.q = "";

            for (var key in options.query){
                options.q += key + ":" + options.query[key];
            }

            delete options.query;
        }

        var fullTextResult = null;

        var uri = this.uri() + "_fti/" + designDocName + "/" + fullTextViewName + encodeOptions(options);
        this.httpClient.get(uri, {
            async: false,
            dataType: "json",
            success: function(data, textStatus) {
                fullTextResult = data.rows.map(function(row) {
                    return row.doc;
                });
            }
        });

        return fullTextResult;
    }
};

// from couch.js which is included in CouchDB with apache license
// slightly modified
function encodeOptions(options) {
    var buf = [];
    if (typeof(options) == "object" && options !== null) {
        for (var name in options) {
            if (!options.hasOwnProperty(name)) continue;
            var value = options[name];
            if (name == "key" || name == "startkey" || name == "endkey") {
                value = JSON.stringify(value);
            }
            buf.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
        }
    }
    if (!buf.length) {
        return "";
    }
    return "?" + buf.join("&");
}

exports.Database = Database;