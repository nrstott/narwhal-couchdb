var couchdb = require("couchdb");
var config = require("../../test-config");
var assert = require("test/assert");
var db;
var server;

exports.setup = function() {
    server = couchdb.connect(config.uri);
    db = server.database("with/slash");
};

exports["test escapes databasename in uri"] = function() {
    assert.isEqual("with%2Fslash/", db.name);
};

exports.teardown = function() {
    server.deleteDb(db.name);
};
