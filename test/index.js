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
var ctx = {};

lab.describe('createNode error', function () {
  lab.it('if no non-string value provided', function (done) {
    client.createNode('label', true, function (err) {
      expect(err).to.exist();
      expect(err.message).to.match(/could not create node/i);
      done();
    });
  });

  lab.it('if no label or value provided', function (done) {
    client.createNode(function (err) {
      expect(err).to.exist();
      expect(err.message).to.match(/could not create node/i);
      done();
    });
  });

  lab.it('if no value provided', function (done) {
    client.createNode('label', function (err) {
      expect(err).to.exist();
      expect(err.message).to.match(/could not create node/i);
      done();
    });
  });
});

lab.describe('createNode', function () {
  lab.before(function (done) {
    ctx.v = uuid();
    ctx.l = 'node';
    done();
  });
  lab.after(function (done) {
    ctx.node.delete(done);
  });

  lab.it('should create a node', function (done) {
    async.series([
      client.createNode.bind(client, ctx.l, ctx.v),
      client.fetchNodes.bind(client, {
        label: ctx.l,
        value: ctx.v
      })
    ], function (err, results) {
      if (err) { return done(err); }
      ctx.node = results[0];
      var nodes = results[1];
      expect(nodes).to.have.length(1);
      expect(nodes[0]).to.deep.contain({
        label: ctx.l,
        value: ctx.v
      });
      done();
    });
  });
});

lab.describe('deleteNode error', function () {
  lab.it('for a node that does not exist', function (done) {
    client.newNode('label', 'value').delete(function (err) {
      expect(err).to.exist();
      expect(err.message).to.match(/not delete node/i);
      done();
    });
  });
});

lab.describe('deleteNode', function () {
  lab.before(function (done) {
    ctx.v = uuid();
    ctx.l = 'node';
    client.createNode(ctx.l, ctx.v, function (err, node) {
      ctx.node = node;
      done(err);
    });
  });

  lab.it('should delete a node', function (done) {
    async.series([
      ctx.node.delete.bind(ctx.node),
      client.fetchNodes.bind(client, {
        label: ctx.l,
        value: ctx.v
      })
    ], function (err, results) {
      if (err) { return done(err); }
      var nodes = results[1];
      expect(nodes).to.have.length(0);
      done();
    });
  });
});

lab.describe('getNode errors', function () {
  lab.it('should not get a node that does not exist', function (done) {
    client.newNode({ id: uuid() }).fetch(function (err) {
      expect(err).to.exist();
      expect(err.message).to.match(/not fetch node/i);
      done();
    });
  });
});

lab.describe('getNode', function () {
  lab.before(function (done) {
    ctx.v = uuid();
    ctx.l = 'node';
    done();
  });
  lab.before(function (done) {
    client.createNode(ctx.l, ctx.v, function (err, node) {
      ctx.node = node;
      done(err);
    });
  });
  lab.after(function (done) {
    ctx.node.delete(done);
  });

  lab.it('should get a node', function (done) {
    client.newNode({ id: ctx.node.id }).fetch(function (err, node) {
      if (err) { return done(err); }
      expect(node).to.deep.contain({
        value: ctx.v
      });
      done();
    });
  });
});

lab.describe('getNodes', function () {
  lab.before(function (done) {
    ctx.v1 = uuid();
    ctx.l = 'node';
    client.createNode(ctx.l, ctx.v1, function (err, node) {
      ctx.node1 = node;
      done(err);
    });
  });
  lab.before(function (done) {
    ctx.v2 = uuid();
    client.createNode(ctx.l, ctx.v2, function (err, node) {
      ctx.node2 = node;
      done(err);
    });
  });
  lab.after(function (done) {
    ctx.node1.delete(done);
  });
  lab.after(function (done) {
    if (!ctx.node2) { return done(); }
    ctx.node2.delete(done);
  });

  lab.describe('when edges are around', function () {
    lab.before(function (done) {
      client.createEdge(
        ctx.node1,
        'dependsOn',
        ctx.node2,
        done);
    });

    lab.it('should follow edges', function (done) {
      var opts = {
        from: ctx.node1.id,
        follow: 'dependsOn'
      };
      client.fetchNodes(opts, function (err, nodes) {
        if (err) { return done(err); }
        expect(nodes).to.have.length(1);
        done();
      });
    });
  });

  lab.describe('if a node was deleted', function () {
    lab.before(function (done) {
      var node2 = ctx.node2;
      delete ctx.node2;
      node2.delete(done);
    });

    lab.it('should not return any nodes', function (done) {
      var opts = {
        from: ctx.node1.id,
        follow: 'dependsOn'
      };
      client.fetchNodes(opts, function (err, nodes) {
        if (err) { return done(err); }
        expect(nodes).to.have.length(0);
        done();
      });
    });
  });
});

lab.describe('deleteNode', function () {
  lab.before(function (done) {
    ctx.v1 = uuid();
    ctx.l = 'node';
    client.createNode(ctx.l, ctx.v1, function (err, node) {
      ctx.node1 = node;
      done(err);
    });
  });
  lab.before(function (done) {
    ctx.v2 = uuid();
    client.createNode(ctx.l, ctx.v2, function (err, node) {
      ctx.node2 = node;
      done(err);
    });
  });
  lab.after(function (done) {
    ctx.node1.delete(done);
  });
  lab.after(function (done) {
    ctx.node2.delete(done);
  });

  lab.describe('when edges are around', function () {
    lab.before(function (done) {
      client.createEdge(ctx.node1, 'dependsOn', ctx.node2, done);
    });

    lab.it('should list empty for no edge existing', function (done) {
      var opts = {
        from: ctx.node1.id,
        follow: 'friendsWith'
      };
      client.fetchNodes(opts, function (err, nodes) {
        if (err) { return done(err); }
        expect(nodes).to.have.length(0);
        done();
      });
    });
  });
});

lab.describe('createEdge error', function () {
  lab.before(function (done) {
    ctx.v1 = uuid();
    ctx.l = 'node';
    client.createNode(ctx.l, ctx.v1, function (err, node) {
      ctx.node1 = node;
      done(err);
    });
  });
  lab.before(function (done) {
    ctx.v2 = uuid();
    client.createNode(ctx.l, ctx.v2, function (err, node) {
      ctx.node2 = node;
      done(err);
    });
  });
  lab.after(function (done) {
    ctx.node1.delete(done);
  });

  lab.it('when looking for a node that does not exist', function (done) {
    var node2 = ctx.node2;
    async.series([
      ctx.node2.delete.bind(ctx.node2),
      client.createEdge.bind(client,
        ctx.node1, 'dependsOn', node2)
    ], function (err) {
      expect(err).to.exist();
      expect(err.message).to.match(/not create edge/i);
      done();
    });
  });
});

lab.describe('createEdge', function () {
  lab.before(function (done) {
    ctx.v1 = uuid();
    ctx.l = 'node';
    client.createNode(ctx.l, ctx.v1, function (err, node) {
      ctx.node1 = node;
      done(err);
    });
  });
  lab.before(function (done) {
    ctx.v2 = uuid();
    client.createNode(ctx.l, ctx.v2, function (err, node) {
      ctx.node2 = node;
      done(err);
    });
  });
  lab.after(function (done) {
    ctx.node1.delete(done);
  });
  lab.after(function (done) {
    ctx.node2.delete(done);
  });

  lab.it('should create an edge', function (done) {
    async.series([
      client.createEdge.bind(client,
        ctx.node1, 'dependsOn', ctx.node2),
      client.fetchNodes.bind(client,
        { from: ctx.node1.id, follow: 'dependsOn' })
    ], function (err, results) {
      if (err) { return done(err); }
      var nodes = results[1];
      expect(nodes).to.have.length(1);
      expect(nodes[0]).to.deep.contain({
        value: ctx.v2
      });
      done();
    });
  });
});

