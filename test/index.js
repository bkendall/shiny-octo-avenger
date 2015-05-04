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

lab.describe('client tests', function () {
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
      // because lab doesn't skip before/after stuff
      if (ctx.node) {
        ctx.node.delete(done);
      } else {
        done();
      }
    });

    lab.it('should create a node', function (done) {
      client.createNode(ctx.l, ctx.v, function (err, node) {
        if (err) { return done(err); }
        ctx.node = node;
        expect(node).to.deep.contain({
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
      ctx.node.delete(done);
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

    lab.describe('when associations are around', function () {
      lab.before(function (done) {
        client.createAssociation(
          ctx.node1,
          'dependsOn',
          ctx.node2,
          done);
      });

      lab.it('should list associations', function (done) {
        var opts = {
          from: ctx.node1.id,
          label: 'dependsOn'
        };
        client.fetchAssociations(opts, function (err, associations) {
          if (err) { return done(err); }
          expect(associations).to.have.length(1);
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

    lab.describe('when associations are around', function () {
      lab.before(function (done) {
        client.createAssociation(ctx.node1, 'dependsOn', ctx.node2, done);
      });

      lab.it('should list empty for no association existing', function (done) {
        var opts = {
          from: ctx.node1.id,
          label: 'friendsWith'
        };
        client.fetchAssociations(opts, function (err, associations) {
          if (err) { return done(err); }
          expect(associations).to.have.length(0);
          done();
        });
      });
    });
  });

  lab.describe('createAssociation error', function () {
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
        client.createAssociation.bind(client,
          ctx.node1, 'dependsOn', node2)
      ], function (err) {
        expect(err).to.exist();
        expect(err.message).to.match(/not create Association/i);
        done();
      });
    });
  });

  lab.describe('createAssociation', function () {
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

    lab.it('should create an association', function (done) {
      client.createAssociation(
        ctx.node1.id,
        'dependsOn',
        ctx.node2.id,
        function (err, association) {
          if (err) { return done(err); }
          expect(association).to.deep.contain({
            from: ctx.node1.id,
            label: 'dependsOn',
            to: ctx.node2.id
          });
          done();
        });
    });
  });
});
