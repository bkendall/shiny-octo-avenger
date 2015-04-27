'use strict';

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

lab.describe('createNode error', function () {
  lab.it('should return an error', function (done) {
    client.createNode(function (err) {
      expect(err).to.exist();
      expect(err.message).to.match(/createNode takes a value/);
      done();
    });
  });
});

lab.describe('createNode', function () {
  var v = uuid();
  lab.after(client.deleteNode.bind(client, v));

  lab.it('should create a node', function (done) {
    async.series([
      client.createNode.bind(client, v),
      client.getNodes.bind(client)
    ], function (err, results) {
      expect(err).to.not.exist();
      var nodes = results[1][1];
      expect(nodes).to.have.length(1);
      expect(nodes[0]).to.deep.contain({
        value: v
      });
      done();
    });
  });
});

lab.describe('deleteNode error', function () {
  lab.it('should return an error', function (done) {
    client.deleteNode(function (err) {
      expect(err).to.exist();
      expect(err.message).to.match(/deleteNode takes a value/);
      done();
    });
  });

  lab.it('should send 404 for a node that does not exist', function (done) {
    client.deleteNode('value', function (err, res) {
      expect(err).to.not.exist();
      expect(res.statusCode).to.equal(404);
      expect(res.body).to.match(/not found/i);
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
      expect(err).to.not.exist();
      var nodes = results[1][1];
      expect(nodes).to.have.length(0);
      done();
    });
  });
});

lab.describe('getNode errors', function () {
  var v = uuid();

  lab.it('should not get a node that does not exist', function (done) {
    client.getNode(v, function (err, res, body) {
      expect(err).to.not.exist();
      expect(res.statusCode).to.equal(404);
      expect(body).to.match(/not found/i);
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
      expect(err).to.not.exist();
      expect(body).to.deep.contain({
        value: v
      });
      done();
    });
  });
});

lab.describe('getNodes', function () {
  var v1 = uuid();
  var v2 = uuid();
  lab.before(client.createNode.bind(client, v1));
  lab.after(client.deleteNode.bind(client, v1));

  lab.describe('when edges are around', function () {
    lab.before(client.createEdge.bind(client, v1, 'dependsOn', v2));

    lab.it('should list empty for no end node existing', function (done) {
      var opts = {
        from: v1,
        follow: 'dependsOn'
      };
      client.getNodes(opts, function (err, res, body) {
        expect(err).to.not.exist();
        expect(body).to.have.length(0);
        done();
      });
    });
  });
});

lab.describe('deleteNode', function () {
  var v1 = uuid();
  var v2 = uuid();
  lab.before(client.createNode.bind(client, v1));
  lab.after(client.deleteNode.bind(client, v1));

  lab.describe('when edges are around', function () {
    lab.before(client.createEdge.bind(client, v1, 'dependsOn', v2));

    lab.it('should list empty for no edge existing', function (done) {
      var opts = {
        from: v1,
        follow: 'dependsOn'
      };
      client.getNodes(opts, function (err, res, body) {
        expect(err).to.not.exist();
        expect(body).to.have.length(0);
        done();
      });
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
      expect(err).to.not.exist();
      var nodes = results[1][1];
      expect(nodes).to.have.length(1);
      expect(nodes[0]).to.deep.contain({
        value: v2
      });
      done();
    });
  });
});
