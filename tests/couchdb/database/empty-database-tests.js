var helper = require("../../test_helper");
var db;

with(helper) {
    exports.setup = function() {
        db = recreateDb();
    };

    exports["test has no documents"] = function() {
        var docs = db.allDocs();
        assert.equal(0, docs.length);
    };

    exports["test save document"] = function() {
        db.save({ hello: "world" });
    };

    exports["test bulk saving docs"] = function() {
        var docs = [
            {
                name: "Nathan"
            },
            {
                name: "Martin"
            },
            {
                name: "David"
            }
        ];
        db.bulkSave(docs);

        assert.equal(3, db.allDocs().length, "Should have three documents");
        docs.forEach(function(doc) {
            assert.equal(db.find(doc._id)._rev, doc._rev);
        });
    };

    exports["test bulk save uses uuids when ids are not defined"] = function() {
        var docs = [
            {},
            {}
        ];
        var uuid = "ijasdjasdfj";
        var post = {};
        db.uuid = function() {
            return uuid;
        };
        Object.defineProperty(db, "httpClient", {
            get: function() {
                return {
                    post: function(uri, options) {
                        post.uri = uri;
                        post.options = options;
                    }
                };
           }
        });

        db.bulkSave(docs);

        assert.equal(uuid, JSON.parse(post.options.data).docs[0]._id);
    };
}

