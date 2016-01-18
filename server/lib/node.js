'use strict';

var assign = require('101/assign');
var findIndex = require('101/find-index');
var hasProps = require('101/has-properties');
var boom = require('boom');
var uuid = require('uuid');

var nodes = [];

class Node {
  constructor (label, value) {
    assign(this, {
      id: uuid(),
      label: label,
      value: value
    });
    nodes.push(this);
  }

  static find (opts, cb) {
    if (Object.keys(opts).length === 0) {
      return cb(null, nodes);
    }
    var n = nodes.filter(hasProps(opts));
    if (!n.length) {
      cb(boom.notFound('node does not exist'));
    } else {
      cb(null, n);
    }
  }

  static findOne (opts, cb) {
    this.find(opts, function (err, _nodes) {
      cb(err, err ? null : _nodes[0]);
    });
  }

  delete (cb) {
    var i = findIndex(nodes, hasProps({ id: this.id }));
    nodes.splice(i, 1);
    cb(null);
  }

  update (opts, cb) {
    assign(this, opts);
    cb(null, this);
  }
}

module.exports = Node;
