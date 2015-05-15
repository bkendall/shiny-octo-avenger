/* global jest describe it expect */
'use strict';

jest.dontMock('../association');
var Association = require('../association');

describe('Association', function () {
  describe('constructor', function () {
    it('should set opts provided', function () {
      var association = new Association({ id: 1, party: true }, 'graph');
      var expected = {
        id: 1,
        party: true,
        graph: 'graph'
      };
      Object.keys(expected).forEach(function (key) {
        expect(association[key]).toBe(expected[key]);
      });
    });
  });
});
