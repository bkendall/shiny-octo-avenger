'use strict';

var assign = require('object-assign');
var hasProps = require('101/has-properties');
var uuid = require('uuid');

module.exports = Edge;

var edges = [];

function Edge (from, label, to) {
  assign(this, {
    id: uuid(),
    from: from,
    label: label,
    to: to
  });
  edges.push(this);
}

Edge.follow = function (from, label, cb) {
  var _edges = edges.filter(hasProps({
    from: from,
    label: label
  }));
  cb(null, _edges);
};

