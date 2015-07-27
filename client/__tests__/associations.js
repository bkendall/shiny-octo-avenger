/* global jest describe it expect beforeEach */
'use strict';

jest.dontMock('../index');
var Client = require('../index');
var c;

var SimpleApiClient = require('simple-api-client');
var noop = jest.genMockFunction();

beforeEach(function () {
  c = new Client('localhost:3000');
});

describe('Associations', function () {
  describe('create', function () {
    it('with ids', function () {
      // valid response
      SimpleApiClient.prototype.post.mockImplementation(function () {
        var cb = Array.prototype.slice.call(arguments).pop();
        cb(null, { statusCode: 201 }, {});
      });
      c.createAssociation(1, 'is', 2, noop);
      expect(SimpleApiClient.prototype.post).toBeCalledWith(
        'associations',
        {
          json: true,
          body: {
            from: 1,
            label: 'is',
            to: 2
          }
        },
        noop);
      expect(noop.mock.calls[0].length).toBe(2);
      expect(noop.mock.calls[0][0]).toBe(null);
      SimpleApiClient.prototype.post.mockClear();
      noop.mockClear();

      // err response
      var e = new Error('some err');
      SimpleApiClient.prototype.post.mockImplementation(function () {
        var cb = Array.prototype.slice.call(arguments).pop();
        cb(e);
      });
      c.createAssociation(1, 'is', 2, noop);
      expect(noop.mock.calls[0].length).toBe(1);
      expect(noop.mock.calls[0][0]).toBe(e);
      SimpleApiClient.prototype.post.mockClear();
      noop.mockClear();

      // valid response, non-200
      SimpleApiClient.prototype.post.mockImplementation(function () {
        var cb = Array.prototype.slice.call(arguments).pop();
        cb(null, { statusCode: 400 }, {});
      });
      c.createAssociation(1, 'is', 2, noop);
      expect(noop.mock.calls[0].length).toBe(1);
      expect(noop.mock.calls[0][0].name).toBe('Error');
      expect(noop.mock.calls[0][0].message)
        .toBe('could not create Association');
      SimpleApiClient.prototype.post.mockClear();
      noop.mockClear();
    });

    it('with objects', function () {
      c.createAssociation({ id: 1 }, 'is', { id: 2 }, noop);
      expect(SimpleApiClient.prototype.post).toBeCalledWith(
        'associations',
        {
          json: true,
          body: {
            from: 1,
            label: 'is',
            to: 2
          }
        },
        noop);
    });
  });

  describe('fetch', function () {
    it('calls the graph to get associations', function () {
      // valid response
      SimpleApiClient.prototype.get.mockImplementation(function () {
        var cb = Array.prototype.slice.call(arguments).pop();
        cb(null, { statusCode: 200 }, []);
      });

      // does it work w/ opts?
      c.fetchAssociations({}, noop);
      expect(SimpleApiClient.prototype.get).toBeCalledWith(
        'associations',
        { qs: {} },
        noop);
      SimpleApiClient.prototype.get.mockClear();
      noop.mockClear();

      // make sure it works without opts
      c.fetchAssociations(noop);
      expect(SimpleApiClient.prototype.get).toBeCalledWith(
        'associations',
        { qs: {} },
        noop);
      SimpleApiClient.prototype.get.mockClear();
      noop.mockClear();

      // err response
      var e = new Error('some err');
      SimpleApiClient.prototype.get.mockImplementation(function () {
        var cb = Array.prototype.slice.call(arguments).pop();
        cb(e);
      });
      c.fetchAssociations(noop);
      expect(noop.mock.calls[0][0]).toBe(e);
      SimpleApiClient.prototype.get.mockClear();
      noop.mockClear();

      // valid response, non-200
      SimpleApiClient.prototype.get.mockImplementation(function () {
        var cb = Array.prototype.slice.call(arguments).pop();
        cb(null, { statusCode: 400 }, { message: 'bad request' });
      });
      c.fetchAssociations(noop);
      expect(noop.mock.calls[0][0].name).toBe('Error');
      expect(noop.mock.calls[0][0].message)
        .toMatch('could not get associations: bad request');
    });
  });
});
