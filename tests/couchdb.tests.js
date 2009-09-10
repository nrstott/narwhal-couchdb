version(170);

var fs = require("file");

if (typeof $ == "undefined") {
    var path = fs.path(module.path).dirname();
    print("FIRST REQUEST");
    load(path + "/../lib/env.rhino.js");
    window.location = path + "/../lib/test.html";
    load(path + "/../lib/jquery-1.3.2.js");
}

exports.testCouchDb = require("./couchdb/all-tests");

if (require.main == module.id)
    require('test/runner').run(exports);