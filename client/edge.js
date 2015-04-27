'use strict';

module.exports = Edge;

function Edge (opts, graph) {
  this.from = opts.from;
  this.label = opts.label;
  this.to = opts.to;
  this.graph = graph;
}

