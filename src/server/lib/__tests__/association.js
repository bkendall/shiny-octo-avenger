import { assert } from 'chai';
import Association from '../association';
let a;

describe('Association creation', () => {
  afterEach(() => a.delete(() => {}));

  it('should be able to create an association', () => {
    a = new Association('1', 'test-label', '2');
    assert.ok(a);
    assert.equal(a.from, '1');
    assert.equal(a.label, 'test-label');
    assert.equal(a.to, '2');
  });
});

describe('Association fetch', () => {
  beforeEach(() => a = new Association('1', 'test-label', '3'));
  afterEach(() => a.delete(() => {}));

  it('should get an association', () => {
    Association.fetch('1', 'test-label', function (err, associations) {
      assert.notOk(err);
      assert.ok(associations);
      assert.equal(associations.length, 1);
      assert.equal(associations[0].from, '1');
      assert.equal(associations[0].label, 'test-label');
      assert.equal(associations[0].to, '3');
    });
  });
});

describe('Association count', () => {
  beforeEach(() => a = new Association('1', 'test-label', '3'));
  afterEach(() => a.delete(() => {}));

  it('should return the number of associations (1 - all)', () => {
    Association.count({ from: '1' }, function (err, count) {
      assert.notOk(err);
      assert.equal(count, 1);
    });
  });

  it('should return the number of associations (1 - bad node id)', () => {
    Association.count({ from: '4' }, function (err, count) {
      assert.notOk(err);
      assert.equal(count, 0);
    });
  });

  it('should return the number of associations (1 - with label)', () => {
    Association.count({
      from: '1',
      label: 'test-label'
    }, function (err, count) {
      assert.notOk(err);
      assert.equal(count, 1);
    });
  });

  it('should return the number of associations (0 - with label)', () => {
    Association.count({
      from: '1',
      label:'bad-label'
    }, function (err, count) {
      assert.notOk(err);
      assert.equal(count, 0);
    });
  });
});
