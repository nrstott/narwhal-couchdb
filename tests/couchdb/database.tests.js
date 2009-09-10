var CouchDb = require("couchdb").CouchDb,
    Database = require("couchdb").Database,
    assert = require("test/assert");

var dbName = "serverjs_database_test";

var testsForEmptyDatabase = [
    {
        name: "all documents",
        fn: function(server) {
            var db = new Database(server,dbName);
            var docs = db.allDocs();
            assert.isEqual(0, docs.length);
        }
    }, {
        name: "save document",
        fn: function(server){
            var db = new Database(server,dbName);
            var doc = { hello: "world" };
            db.save(doc);
        }
    }
];

testsForEmptyDatabase.forEach(function(test){
    exports["test " + test.name] = function() {
        var server = new CouchDb("http://localhost:5984/");
        server.createDb(dbName);
        test.fn(server);
        server.deleteDb(dbName);
    };
});

var docId = "abc123";

var testsForDatabaseWithOneDocument = [
    {
        name: "find document",
        fn: function(server){
            var db = new Database(dbName);
            var doc = db.find(docId);
            assert.isTrue(doc != null);
            assert.isEqual(docId, doc._id);
        }
    }
];