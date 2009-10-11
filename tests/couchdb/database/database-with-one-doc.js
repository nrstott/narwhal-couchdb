var db;
var doc;

with(require("../../test_helper")){

    exports.setup = function() {
        db = recreateDb();
        doc = {
            _id: "org.whiteboard-it.com/tester_mcgee",
            name: "Tester"
        };
        db.save(doc);
    };

    exports["test get the document"] = function() {
        assert.isTrue(db.find(doc._id).name === "Tester");
    };
}
