var assert = require("test/assert"),
    CouchDb = require("couchdb").CouchDb;

exports.testConnectingToServer = function(){
    var db = new CouchDb("http://localhost:5984/");

    assert.isTrue(db != null);
};

exports.testCreateAndDeleteDatabase = function(){
    var server = new CouchDb("http://localhost:5984/");
    server.createDb("serverjs_test");

    var databases;
    server.allDbs({ async: false, success: function(data) {
        databases = data;
    }});

    assert.isFalse(databases.indexOf("serverjs_test") == -1);

    server.deleteDb("serverjs_test");

    server.allDbs({ async: false, success: function(data) {
        databases = data;
    }});

    assert.isTrue(databases.indexOf("serverjs_test") == -1);
};