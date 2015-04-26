var Lab = require('lab');
var lab = exports.lab = Lab.script();
var expect = require('code').expect;
var async = require('async');
var uuid = require('uuid');

var graph = require('../index');
var server = graph.server;
var Client = graph.client;
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
  var v = uuid();
  lab.after(client.deleteNode.bind(client, v));

  lab.it('should create a node', function (done) {
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

lab.describe('deleteNode', function () {
  var v = uuid();
  lab.before(client.createNode.bind(client, v));

  lab.it('should delete a node', function (done) {
    async.series([
      client.deleteNode.bind(client, v),
      client.getNodes.bind(client)
    ], function (err, results) {
      if (err) { return done(err); }
      var nodes = results[1][1];
      expect(nodes).to.have.length(0);
      done();
    });
  });
});

lab.describe('getNode', function () {
  var v = uuid();
  lab.before(client.createNode.bind(client, v));
  lab.after(client.deleteNode.bind(client, v));

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

lab.describe('createEdge', function () {
  var v1 = uuid();
  var v2 = uuid();
  lab.before(client.createNode.bind(client, v1));
  lab.before(client.createNode.bind(client, v2));
  lab.after(client.createNode.bind(client, v1));
  lab.after(client.createNode.bind(client, v2));

  lab.it('should create an edge', function (done) {
    async.series([
      client.createEdge.bind(client, v1, 'dependsOn', v2),
      client.getNodes.bind(client, { from: v1, follow: 'dependsOn' })
    ], function (err, results) {
      if (err) { return done(err); }
      var nodes = results[1][1];
      expect(nodes).to.have.length(1);
      expect(nodes[0]).to.deep.contain({
        value: v2
      });
      done();
    });
  });
});
