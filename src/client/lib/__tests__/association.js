import { assert } from 'chai';
import Association from '../association';

describe('Association', () => {
  describe('constructor', () => {
    it('should set opts provided', () => {
      var association = new Association({ id: 1, party: true }, 'graph');
      var expected = {
        id: 1,
        party: true,
        graph: 'graph'
      };
      assert.deepEqual(association, expected);
    });
  });
});
