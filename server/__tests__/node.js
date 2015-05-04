/* global jest describe it expect beforeEach afterEach */
'use strict';

jest.dontMock('../lib/node');
var Node = require('../lib/node');
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
  });
});
