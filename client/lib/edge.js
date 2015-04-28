'use strict';

var assign = require('object-assign');

module.exports = Edge;

function Edge (opts, graph) {
  assign(this, opts, { graph: graph });
}

