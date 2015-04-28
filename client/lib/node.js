'use strict';

var assign = require('object-assign');

module.exports = Node;

function Node (opts, graph) {
  assign(this, opts, { graph: graph });
}

Node.prototype.fetch = function (cb) {
  var self = this;
  this.graph.get('nodes/' + this.id, function (err, res, body) {
    if (err) {
      return cb(err);
    } else if (res.statusCode !== 200) {
      return cb(new Error('could not fetch node'));
    }
    cb(null, new Node(body, self.graph));
  });
};

Node.prototype.delete = function (cb) {
  this.graph.delete('nodes/' + this.id, function (err, res) {
    if (err) {
      return cb(err);
    } else if (res.statusCode !== 204) {
      return cb(new Error('could not delete node'));
    }
    cb(null);
  });
};

