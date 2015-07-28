'use strict';

var async = require('async');

module.exports = function () {
  this.Given(/^I have an empty Graph$/, function (callback) {
    this.nodeCache = [];
    this.associationCache = [];
    this.client.fetchNodes({}, function (err, nodes) {
      if (err) { return callback.fail(err); }
      return async.each(nodes, function (node, cb) {
        node.delete(cb);
      }, callback);
    });
  });
};
