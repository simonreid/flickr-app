var request = require("request"),
    assert = require('assert'),
    app = require("../server.js"),
    base_url = "http://localhost:3000/";

describe("Basic Server Functionality", function() {
  describe("GET /", function() {
    it("returns status code 200", function(done) {
      request.get(base_url, function(error, response, body) {
        assert.equal(200, response.statusCode);
        done();
      });
    });
  });
});

describe("Flickr API Functionality", function() {
  describe("GET /api/photos?pageNum=1", function() {
    it("returns status code 200", function(done) {
      request.get(base_url + '/api/photos?pageNum=1', function(error, response, body) {
        assert.equal(200, response.statusCode);
        done();
      });
    });
  });
});
