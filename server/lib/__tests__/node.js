/* global jest describe it expect beforeEach afterEach */
'use strict';

jest.dontMock('../node');
var Node = require('../node');
var n;

describe('Node creation', function () {
  afterEach(function () {
    n.delete(function () {});
  });

  it('should accept a name and label and have them as props', function () {
    n = new Node('test-node', 42);
    expect(n).toBeTruthy();
    expect(n.label).toEqual('test-node');
    expect(n.value).toEqual(42);
  });
});

describe('Node deletion', function () {
  beforeEach(function () {
    n = new Node('another-test-node', 47);
  });

  it('should delete nodes', function () {
    n.delete(function (err) {
      expect(err).toBeFalsy();
      Node.find({}, function (fetchErr, nodes) {
        expect(fetchErr).toBeFalsy();
        expect(nodes).toBeTruthy();
        expect(nodes.length).toEqual(0);
      });
    });
  });
});

describe('Node static functions', function () {
  beforeEach(function () {
    n = new Node('another-test-node', 47);
  });
  afterEach(function () {
    n.delete(function () {});
  });

  describe('find', function () {
    it('should find nodes', function () {
      Node.find({}, function (err, nodes) {
        expect(err).toBeFalsy();
        expect(nodes).toBeTruthy();
        expect(nodes.length).toEqual(1);
      });
    });

    it('should find nodes with opts', function () {
      Node.find({ id: n.id }, function (err, nodes) {
        expect(err).toBeFalsy();
        expect(nodes).toBeTruthy();
        expect(nodes.length).toEqual(1);
      });
    });

    it('should return an error if not found', function () {
      Node.find({ id: '' }, function (err) {
        expect(err).toBeTruthy();
        expect(err.isBoom).toEqual(true);
        expect(err.output.statusCode).toEqual(404);
      });
    });
  });

  describe('findOne', function () {
    it('should error if not found', function () {
      Node.findOne({ id: '' }, function (err) {
        expect(err).toBeTruthy();
        expect(err.isBoom).toEqual(true);
        expect(err.output.statusCode).toEqual(404);
      });
    });

    it('should find a node', function () {
      Node.findOne({ id: n.id }, function (err, node) {
        expect(err).toBeFalsy();
        expect(node).toBeTruthy();
        expect(node.id).toEqual(n.id);
      });
    });
  });
});
