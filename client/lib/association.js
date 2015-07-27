'use strict';

var assign = require('101/assign');

module.exports = Association;

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

/**
 * Association delete
 * Delete the Association from the server
 * @param {function} cb callback function
 */
Association.prototype.delete = function (cb) {
  this.graph.delete('associations/' + this.id, function (err, res, body) {
    if (err) {
      return cb(err);
    } else if (res.statusCode !== 204) {
      return cb(new Error('could not delete association: ' + body.message));
    }
    cb(null);
  });
};
