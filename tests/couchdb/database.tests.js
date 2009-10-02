var CouchDb = require("couchdb").CouchDb,
    Database = require("couchdb").Database,
    assert = require("test/assert");

var dbName = "serverjs_database_test";

with(require("../test_helper")) {

    var testsForEmptyDatabase = [
        {
            name: "all documents",
            fn: function(db) {
                var docs = db.allDocs();
                assert.isEqual(0, docs.length);
            }
        }, {
            name: "save document",
            fn: function(db){
                var doc = { hello: "world" };
                db.save(doc);
            }
        }
    ];

    testsForEmptyDatabase.forEach(function(test){
        exports["test " + test.name] = function() {
            var db = recreateDb();
            test.fn(db);
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
}