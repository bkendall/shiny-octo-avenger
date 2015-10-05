/* @flow */
import assign from '101/assign';
import boom from 'boom';
import findIndex from '101/find-index';
import hasProps from '101/has-properties';
import uuid from 'uuid';

export default Node;

let nodes = [];

function Node (label: string, value: any) {
  assign(this, {
    id: uuid(),
    label,
    value
  });
  nodes.push(this);
}

Node.findOne = function (opts: Object, cb: Function) {
  this.find(opts, (err, _nodes) => {
    cb(err, err ? null : _nodes[0]);
  });
};

Node.find = function (opts: Object, cb: Function) {
  if (Object.keys(opts).length === 0) {
    return cb(null, nodes);
  }
  const n = nodes.filter(hasProps(opts));
  if (!n.length) {
    cb(boom.notFound('node does not exist'));
  } else {
    cb(null, n);
  }
};

Node.prototype.update = function (opts: Object, cb: Function) {
  assign(this, opts);
  cb(null, this);
};

Node.prototype.delete = function (cb: Function) {
  const i = findIndex(nodes, hasProps({ id: this.id }));
  nodes.splice(i, 1);
  cb(null);
};

