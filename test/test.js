var request = require("request"),
    assert = require('assert'),
    app = require("../server.js"),
    base_url = "http://localhost:3000/";

describe("Basic Server Functionality", function() {
  describe("GET / and api/photos", function() {
    it("returns status code 200", function(done) {
      request.get(base_url, function(error, response, body) {
        assert.equal(200, response.statusCode);
        done();
      });
    });

    it("flickr api returns status code 200 and at least 1 photo", function(done) {
      request.get(base_url + 'api/photos?pageNum=1', function(error, response, body) {
        //check response
        assert.equal(200, response.statusCode);
        //ensure first item has a title as a quick test
        assert.notEqual(JSON.parse(body).photos.photo[0], null);
        app.closeServer();
        done();
      });
    });
  });
});
