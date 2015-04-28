'use strict';

var assign = require('object-assign');
var find = require('101/find');
var findIndex = require('101/find-index');
var hasProps = require('101/has-properties');
var mw = require('dat-middleware');
var uuid = require('uuid');

module.exports = Node;

var nodes = [];

function Node (value) {
  assign(this, {
    id: uuid(),
    value: value
  });
  nodes.push(this);
}

Node.find = function (opts, cb) {
  if (Object.keys(opts).length === 0) {
    return cb(null, nodes);
  }
  var n = find(nodes, hasProps(opts));
  if (!n) {
    cb(mw.Boom.notFound('node does not exist'));
  } else {
    cb(null, n);
  }
};

Node.findFromEdges = function (_edges, cb) {
  var foundNodes = _edges.reduce(function (memo, e) {
    var n = find(nodes, hasProps({ id: e.to }));
    if (n) { memo.push(n); }
    return memo;
  }, []);
  cb(null, foundNodes);
};

Node.prototype.delete = function (cb) {
  var i = findIndex(nodes, hasProps({ id: this.id }));
  nodes.splice(i, 1);
  cb(null);
};

