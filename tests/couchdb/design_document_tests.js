var DesignDocument = require("../../packages/models/design_document");
var assert = require("test/assert");

exports["test create without id raises error"] = function(){
    var errorRaised = false;
    try {
        DesignDocument.create();
    } catch (err){
        errorRaised = true;
    }

    assert.isTrue(errorRaised);
};

exports["test toDocument returns a document with id modified with _design/"] = function(){
    var dd = DesignDocument.create("mydd");
    assert.isEqual("_design/mydd", dd.toDocument()._id);
};

exports["test viewBy with one member"] = function(){
    var dd = DesignDocument.create("mydd", function(){
        this.viewBy("name");
    });

    var doc = dd.toDocument();
    assert.isTrue(doc.views["by_name"] != undefined);
    assert.isEqual("function(doc){if(doc['name']){emit(doc['name'],doc);}}",doc.views["by_name"]["map"]);
};

exports["test viewBy with two members"] = function(){
    var dd = DesignDocument.create("mydd", function(){
        this.viewBy("name_and_docType");
    });

    var doc = dd.toDocument();
    assert.isTrue(doc.views["by_name_and_docType"] != undefined);
    assert.isEqual("function(doc){if(doc['name'] && doc['docType']){emit([doc['name'],doc['docType']],doc);}}", doc.views.by_name_and_docType.map);

    var db = require("../test_helper").recreateDb();
    db.save(doc);

    var viewResult = db.view("mydd", "by_name_and_docType");

    assert.isTrue(viewResult != undefined && viewResult != null);
    assert.isEqual(viewResult.rows.length, 0);
};