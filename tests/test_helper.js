var couch = require("couchdb");
var Database = require("couchdb").Database;
var assert = require("test/assert");
var dbName = "serverjs_database_test";
var config = require("./test-config");
var server;

exports.recreateDb = function(){
    server = couch.connect(config.uri);
    if (server.hasDb(dbName)) {
        server.deleteDb(dbName);
    }

    return server.database(dbName);
};

exports.deleteDb = function() {
    server.deleteDb(dbName);
};

if (assert.isEqual !== undefined) {
    assert.equal = assert.isEqual;
}

exports.assert = assert;

