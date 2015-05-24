/* global jest describe it expect */
'use strict';

jest.dontMock('../index');
var Client = require('../index');

describe('Client', function () {
  describe('constructor', function () {
    it('with hosts', function () {
      var c = new Client('localhost:3000');
      expect(c).toBeTruthy();
    });
  });
});

