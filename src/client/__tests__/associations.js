'use strict';

import { assert } from 'chai';

import Client from '../index';
let c;

import SimpleApiClient from 'simple-api-client';
import sinon from 'sinon';
var noop = sinon.stub().yieldsAsync();

beforeEach(() => { c = new Client('localhost:3000'); });

describe('Associations', () => {
  describe('create', () => {
    it('with ids', () => {
      sinon.stub(SimpleApiClient.prototype, 'post');
      // valid response
      SimpleApiClient.prototype.post.yieldsAsync(null, { statusCode: 201 }, {});
      c.createAssociation(1, 'is', 2, noop);
      let postCall = SimpleApiClient.prototype.post.lastCall;
      assert.equal(postCall.args[0], 'associations');
      assert.deepEqual(postCall.args[1], {
        json: true,
        body: {
          from: 1,
          label: 'is',
          to: 2
        }
      });

      // err response
      var e = new Error('some err');
      SimpleApiClient.prototype.post.yieldsAsync(e);
      c.createAssociation(1, 'is', 2, noop);
      // assert.equal(noop.lastCall.args[0], e);

      // valid response, non-200
      SimpleApiClient.prototype.post.yieldsAsync(null, { statusCode: 400 }, {});
      c.createAssociation(1, 'is', 2, noop);
      // assert.equal(noop.lastCall.args[0].name);
      // assert.equal(noop.lastCall.args[0].message,
      //   'could not create Association');

      SimpleApiClient.prototype.post.restore();
    });

    it('with objects', () => {
      sinon.stub(SimpleApiClient.prototype, 'post')
        .yieldsAsync(null, { statusCode: 201 }, {});
      c.createAssociation({ id: 1 }, 'is', { id: 2 }, noop);
      let postCall = SimpleApiClient.prototype.post.lastCall;
      assert.equal(postCall[0], 'associations');
      assert.deepEqual(postCall[1], {
        json: true,
        body: {
          from: 1,
          label: 'is',
          to: 2
        }
      });
      SimpleApiClient.prototype.post.restore();
    });
  });

  // describe('fetch', () => {
  //   it('calls the graph to get associations', () => {
  //     // valid response
  //     SimpleApiClient.prototype.get.mockImplementation(() => {
  //       var cb = Array.prototype.slice.call(arguments).pop();
  //       cb(null, { statusCode: 200 }, {});
  //     });

  //     // does it work w/ opts?
  //     c.fetchAssociations({}, noop);
  //     expect(SimpleApiClient.prototype.get).toBeCalledWith(
  //       'associations',
  //       { qs: {} },
  //       noop);
  //     SimpleApiClient.prototype.get.mockClear();
  //     noop.mockClear();

  //     // make sure it works without opts
  //     c.fetchAssociations(noop);
  //     expect(SimpleApiClient.prototype.get).toBeCalledWith(
  //       'associations',
  //       { qs: {} },
  //       noop);
  //     SimpleApiClient.prototype.get.mockClear();
  //     noop.mockClear();

  //     // err response
  //     var e = new Error('some err');
  //     SimpleApiClient.prototype.get.mockImplementation(() => {
  //       var cb = Array.prototype.slice.call(arguments).pop();
  //       cb(e);
  //     });
  //     c.fetchAssociations(noop);
  //     expect(noop.mock.calls[0][0]).toBe(e);
  //     SimpleApiClient.prototype.get.mockClear();
  //     noop.mockClear();

  //     // valid response, non-200
  //     SimpleApiClient.prototype.get.mockImplementation(() => {
  //       var cb = Array.prototype.slice.call(arguments).pop();
  //       cb(null, { statusCode: 400 }, { message: 'bad request' });
  //     });
  //     c.fetchAssociations(noop);
  //     expect(noop.mock.calls[0][0].name).toBe('Error');
  //     expect(noop.mock.calls[0][0].message)
  //       .toMatch('could not get associations: bad request');
  //   });
  // });
});

