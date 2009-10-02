var assert = require("test/assert");
var FILE = require("file");

with(require("../test_helper")) {
    exports["test add attachment to doc"] = function() {
        var doc = {
            _id: "picture12",
            title: "Tabby Cat"
        };

        var db = recreateDb();
        db.save(doc, function() { print("Saved: " + JSON.stringify(doc) + "\n"); }, function() { print("ERROR!"); });

        var filePath = FILE.join(FILE.Path(require.main).dirname(), "assets", "tabby.jpg");
        db.addAttachmentToDoc(doc, "tabby.jpg", "image/jpeg", FILE.read(filePath, "rb"));

        var fromDb = db.find(doc._id);

        assert.isTrue(fromDb != null, "Should not be null");
        assert.isTrue(fromDb._attachments != undefined, "Should have attachments");
        assert.isTrue(fromDb._attachments["tabby.jpg"] != undefined, "Should have 'tabby.jpg'");
    };
}