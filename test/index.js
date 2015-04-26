var Lab = require('lab');
var lab = exports.lab = Lab.script();
var expect = require('code').expect;
var async = require('async');
var uuid = require('uuid');

var server = require('../server');
var Client = require('../client');
var port = 3080;
var client = new Client('127.0.0.1:' + port);

var s;
lab.before(function (done) {
  s = server.listen(port, done);
});
lab.after(function (done) {
  s.close(done);
});

lab.describe('createNode', function () {
  lab.it('should create a node', function (done) {
    var v = uuid();
    async.series([
      client.createNode.bind(client, v),
      client.getNodes.bind(client)
    ], function (err, results) {
      if (err) { return done(err); }
      var nodes = results[1][1];
      expect(nodes).to.have.length(1);
      expect(nodes[0]).to.deep.contain({
        value: v
      });
      done();
    });
  });
});

lab.describe('getNode', function () {
  var v;
  lab.before(function (done) {
    v = uuid();
    client.createNode(v, done);
  });

  lab.it('should get a node', function (done) {
    client.getNode(v, function (err, res, body) {
      if (err) { return done(err); }
      expect(body).to.deep.contain({
        value: v
      });
      done();
    });
  });
});
