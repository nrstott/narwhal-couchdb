var assert = require("test/assert");
var couch = require("couchdb");
var config = require("../test-config");

exports.testConnectingToInvalidServer = function() {
    var server = couch.connect("http://localhost:29999");

    assert.isEqual(null, server, "Should have returned null");
};

exports.testConnectingToServer = function(){
    var server = couch.connect(config.uri);

    assert.isTrue(server != null);
};

