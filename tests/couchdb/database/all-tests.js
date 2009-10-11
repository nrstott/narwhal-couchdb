
exports["test database with slash in name"] = require("./database-with-slash-in-name");
exports["test empty database"] = require("./empty-database-tests");
exports["test database with one doc"] = require("./database-with-one-doc");

if (require.main === module.id) {
    require("test/runner").run(exports);
}

