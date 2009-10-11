version(170);

exports.config = require("./test-config");
exports.testCouchDb = require("./couchdb/all-tests");

if (require.main == module.id) {
    require('test/runner').run(exports);
}

