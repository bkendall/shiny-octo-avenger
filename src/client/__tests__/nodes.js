'use strict';

import { assert } from 'chai';
import sinon from 'sinon';

import Client from '../index';
let c;

import SimpleApiClient from 'simple-api-client';
let noop = sinon.stub().yieldsAsync();

beforeEach(() => c = new Client('localhost:3000') );

describe('Node', () => {
  describe('create', () => {
    it('requires label and value', () => {
      assert.throw(() => c.createNode(), /label.+value.+required/i);
    });

    it('calls the graph to create nodes', () => {
      sinon.stub(SimpleApiClient.prototype, 'post').yieldsAsync();
      c.createNode('label', 'value', noop);
      let postCall = SimpleApiClient.prototype.post.lastCall;
      assert.equal(postCall.args[0], 'nodes');
      assert.deepEqual(postCall.args[1], {
        json: true,
        body: {
          label: 'label',
          value: 'value'
        }
      });
      SimpleApiClient.prototype.post.restore();
    });
  });

  describe('new', () => {
    it('creates a new node with opts', () => {
      // TODO I have no idea how to make sure a _Node_ was created
      var n = c.newNode({
        label: 'newLabel',
        value: 'newValue'
      });
      assert.ok(n);
    });
  });
});
