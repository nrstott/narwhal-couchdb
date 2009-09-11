var HttpClient = require("./couchdb/http_client").HttpClient,
    Database = require("./couchdb/database").Database,
    DesignDocument = require("./couchdb/design_document");

function CouchDb(uri){
    this.uri = uri;
    this.httpClient = new HttpClient();

    return this;
}

CouchDb.prototype = {
    allDbs: function(options){
        var uri = this.uri + "_all_dbs";
        this.httpClient.get(uri, options);
    },
    createDb: function(name, options){
        if (typeof name == undefined || name == null || name == "")
            throw new Error("Argument Expected: name");

        var uri = this.uri + name;

        this.httpClient.put(uri, options);
    },
    deleteDb: function(name, options){
        if (name == undefined || name == null || name == "")
            throw new Error("Argument Expected: name");

        var uri = this.uri + name;

        this.httpClient.del(uri, options);
    },
    /**
     * returns a guranteed unique universal identifier
     * will never return the same identifier twice
     */
    uuid: function(){
        var self = this;

        this.uuidCache = this.uuidCache || [];
        if (this.uuidCache.length > 0) {
            return this.uuidCache.shift();
        }
        else{
            this.httpClient.get(this.uri + "_uuids?count=100", {
                async: false,
                success: function(data, statusText) {
                    self.uuidCache = data.uuids;
                },
                error: function() {
                    // TODO: What do we do?
                }
            });
            return self.uuidCache.shift();
        }
    }
};

/**
 * Exports
 */
exports.CouchDb = CouchDb;
exports.Database = Database;
exports.DesignDocument = DesignDocument;