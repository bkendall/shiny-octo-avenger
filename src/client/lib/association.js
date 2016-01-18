'use strict';

import assign from '101/assign';

export default Association;

/**
 * Graph Association
 * @constructor
 * @param {object} opts options for creating the Node
 * @param {integer} opts.from ID from which to create the Association
 * @param {string} opts.label type of Association to create
 * @param {integer} opts.to ID of the Node to which to associate
 * @param {object} graph graph client for the Association to use
 */
function Association (opts, graph) {
  assign(this, opts, { graph: graph });
}

