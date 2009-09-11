version(170);

var fs = require("file");

exports.testCouchDb = require("./couchdb/all-tests");

if (require.main == module.id)
    require('test/runner').run(exports);