/* global jest describe it expect beforeEach afterEach */
'use strict';

jest.dontMock('../association');
var Association = require('../association');
var a;

describe('Association creation', function () {
  afterEach(function () {
    a.delete(function () {});
  });

  it('should be able to create an association', function () {
    a = new Association('1', 'test-label', '2');
    expect(a).toBeTruthy();
    expect(a.from).toEqual('1');
    expect(a.label).toEqual('test-label');
    expect(a.to).toEqual('2');
  });
});

describe('Association fetch', function () {
  beforeEach(function () {
    a = new Association('1', 'test-label', '3');
  });
  afterEach(function () {
    a.delete(function () {});
  });

  it('should get an association', function () {
    Association.fetch('1', 'test-label', function (err, associations) {
      expect(err).toBeFalsy();
      expect(associations).toBeTruthy();
      expect(associations.length).toEqual(1);
      expect(associations[0].from).toEqual('1');
      expect(associations[0].label).toEqual('test-label');
      expect(associations[0].to).toEqual('3');
    });
  });
});

describe('Association count', function () {
  beforeEach(function () {
    a = new Association('1', 'test-label', '3');
  });
  afterEach(function () {
    a.delete(function () {});
  });

  it('should return the number of associations (1 - all)', function () {
    Association.count('1', function (err, count) {
      expect(err).toBeFalsy();
      expect(count).toEqual(1);
    });
  });

  it('should return the number of associations (1 - bad node id)', function () {
    Association.count('4', function (err, count) {
      expect(err).toBeFalsy();
      expect(count).toEqual(0);
    });
  });

  it('should return the number of associations (1 - with label)', function () {
    Association.count('1', 'test-label', function (err, count) {
      expect(err).toBeFalsy();
      expect(count).toEqual(1);
    });
  });

  it('should return the number of associations (0 - with label)', function () {
    Association.count('1', 'bad-label', function (err, count) {
      expect(err).toBeFalsy();
      expect(count).toEqual(0);
    });
  });
});
