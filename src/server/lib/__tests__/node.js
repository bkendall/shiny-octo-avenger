import { assert } from 'chai';
import Node from '../node';
let n;

describe('Node creation', () => {
  afterEach(() => n.delete(() => {}));

  it('should accept a name and label and have them as props', () => {
    n = new Node('test-node', 42);
    assert.ok(n);
    assert.equal(n.label, 'test-node');
    assert.equal(n.value, 42);
  });
});

describe('Node methods', () => {
  beforeEach(() => n = new Node('another-test-node', 47));

  describe('Node update', () => {
    afterEach(() => n.delete(() => {}));

    it('should update a node', () => {
      n.update({ value: 'value' }, (err, node) => {
        assert.notOk(err);
        assert.equal(node.value, 'value');
        Node.findOne({ id: n.id }, (fetchErr, fetchedNode) => {
          assert.notOk(fetchErr);
          assert.ok(fetchedNode);
          assert.equal(fetchedNode.id, n.id);
          assert.equal(fetchedNode.value, 'value');
        });
      });
    });
  });

  describe('Node deletion', () => {
    it('should delete nodes', () => {
      n.delete((err) => {
        assert.notOk(err);
        Node.find({}, (fetchErr, nodes) => {
          assert.notOk(fetchErr);
          assert.isArray(nodes);
          assert.equal(nodes.length, 0);
        });
      });
    });
  });
});

describe('Node static functions', () => {
  beforeEach(() => n = new Node('another-test-node', 47));
  afterEach(() => n.delete(() => {}));

  describe('find', () => {
    it('should find nodes', () => {
      Node.find({}, (err, nodes) => {
        assert.notOk(err);
        assert.isArray(nodes);
        assert.equal(nodes.length, 1);
      });
    });

    it('should find nodes with opts', () => {
      Node.find({ id: n.id }, (err, nodes) => {
        assert.notOk(err);
        assert.isArray(nodes);
        assert.equal(nodes.length, 1);
      });
    });

    it('should return an error if not found', () => {
      Node.find({ id: '' }, (err) => {
        assert.ok(err);
        assert.equal(err.isBoom, true);
        assert.equal(err.output.statusCode, 404);
      });
    });
  });

  describe('findOne', () => {
    it('should error if not found', () => {
      Node.findOne({ id: '' }, (err) => {
        assert.ok(err);
        assert.equal(err.isBoom, true);
        assert.equal(err.output.statusCode, 404);
      });
    });

    it('should find a node', () => {
      Node.findOne({ id: n.id }, (err, node) => {
        assert.notOk(err);
        assert.isObject(node);
        assert.equal(node.id, n.id);
      });
    });
  });
});
