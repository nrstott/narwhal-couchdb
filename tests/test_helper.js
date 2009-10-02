var CouchDb = require("couchdb").CouchDb;
var Database = require("couchdb").Database;
var server = new CouchDb("http://localhost:5984/");
var dbName = "serverjs_database_test";

exports.recreateDb = function(){
    server.deleteDb(dbName);
    server.createDb(dbName);

    return new Database(server, dbName);
};

exports.deleteDb = function() {
    server.deleteDb(dbName);
};