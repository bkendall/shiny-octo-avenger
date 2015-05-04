'use strict';

var assign = require('object-assign');

module.exports = Association;

function Association (opts, graph) {
  assign(this, opts, { graph: graph });
}

