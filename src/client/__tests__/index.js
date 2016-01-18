'use strict';

import { assert } from 'chai';

import Client from '../index';

describe('Client', () => {
  describe('constructor', () => {
    it('with hosts', () => {
      var c = new Client('localhost:3000');
      assert.ok(c);
    });
  });
});

