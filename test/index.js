'use strict';

var Lab = require('lab');
var lab = exports.lab = Lab.script();
var expect = require('code').expect;
var assign = require('101/assign');
var async = require('async');

var Server = require('../').server;
var Client = require('../').client;

var ctx = {};
lab.beforeEach(function (done) {
  ctx.server = Server.listen(8080, done);
  ctx.client = new Client('localhost:8080');
});
lab.afterEach(function (done) {
  ctx.server.close(done);
});

lab.describe('Nodes', function () {
  lab.beforeEach(function (done) {
    ctx.client.createNode('TestNode', 'TestValue', function (err, node) {
      ctx.initNode = node;
      done(err);
    });
  });

  lab.it('should create Nodes', function (done) {
    ctx.client.createNode('label', 'value', function (err, node) {
      if (err) { return done(err); }
      expect(node).to.deep.contain({
        label: 'label',
        value: 'value'
      });
      done();
    });
  });

  lab.it('should retrieve nodes', function (done) {
    ctx.initNode.fetch(function (err, node) {
      if (err) { return done(err); }
      expect(node).to.deep.contain({
        label: 'TestNode',
        value: 'TestValue'
      });
      done();
    });
  });

  lab.it('should update nodes', function (done) {
    ctx.initNode.update({ value: 'NewTestValue' }, function (updateErr, node) {
      if (updateErr) { return done(updateErr); }
      expect(node.value).to.equal('NewTestValue');
      ctx.initNode.fetch(function (fetchErr, fetchedNode) {
        if (fetchErr) { return done(fetchErr); }
        expect(fetchedNode).to.deep.contain({
          id: ctx.initNode.id,
          label: ctx.initNode.label,
          value: 'NewTestValue'
        });
        done();
      });
    });
  });

  lab.it('should delete nodes', function (done) {
    ctx.initNode.delete(function (deleteErr) {
      if (deleteErr) { return done(deleteErr); }
      ctx.initNode.fetch(function (err) {
        expect(err).to.exist();
        expect(err.message).to.match(/could not fetch node/);
        done();
      });
    });
  });
});

lab.describe('Associations', function () {
  lab.beforeEach(function (done) {
    async.parallel({
      nodeOne: ctx.client.createNode.bind(ctx.client, 'TestNode', 'TestValue1'),
      nodeTwo: ctx.client.createNode.bind(ctx.client, 'TestNode', 'TestValue2'),
      nodeThree:
        ctx.client.createNode.bind(ctx.client, 'TestNode', 'TestValue3')
    }, function (parallelErr, nodes) {
      if (parallelErr) { return done(parallelErr); }
      assign(ctx, nodes);
      ctx.client.createAssociation(
        ctx.nodeOne,
        'associatesWith',
        ctx.nodeTwo,
        function (err, association) {
          ctx.initAssociation = association;
          done(err);
        }
      );
    });
  });

  lab.it('should create associations', function (done) {
    ctx.client.createAssociation(
      ctx.nodeTwo,
      'associatesWith',
      ctx.nodeThree,
      function (err, association) {
        if (err) { return done(err); }
        expect(association).to.deep.contain({
          from: ctx.nodeTwo.id,
          label: 'associatesWith',
          to: ctx.nodeThree.id
        });
        done();
      }
    );
  });
});
