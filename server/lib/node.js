'use strict';

var assign = require('101/assign');
var findIndex = require('101/find-index');
var hasProps = require('101/has-properties');
var boom = require('boom');
var uuid = require('uuid');

module.exports = Node;

var nodes = [];

function Node (label, value) {
  assign(this, {
    id: uuid(),
    label: label,
    value: value
  });
  nodes.push(this);
}

Node.findOne = function (opts, cb) {
  this.find(opts, function (err, _nodes) {
    if (err) { return cb(err); }
    if (!_nodes.length) { return cb(boom.notFound('node does not exist')); }
    cb(null, _nodes[0]);
  });
};

Node.find = function (opts, cb) {
  if (Object.keys(opts).length === 0) { return cb(null, nodes); }
  var n = nodes.filter(hasProps(opts));
  cb(null, n);
};

Node.prototype.update = function (opts, cb) {
  assign(this, opts);
  cb(null, this);
};

Node.prototype.delete = function (cb) {
  var i = findIndex(nodes, hasProps({ id: this.id }));
  nodes.splice(i, 1);
  cb(null);
};
