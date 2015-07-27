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
    Association.find({
      from: '1',
      label: 'test-label'
    }, function (err, associations) {
      expect(err).toBeFalsy();
      expect(associations).toBeTruthy();
      expect(associations.length).toEqual(1);
      expect(associations[0].from).toEqual('1');
      expect(associations[0].label).toEqual('test-label');
      expect(associations[0].to).toEqual('3');
    });
  });
});
