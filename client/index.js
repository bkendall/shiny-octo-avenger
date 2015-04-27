'use strict';

var SimpleApiClient = require('simple-api-client');
var isFunction = require('101/is-function');

module.exports = Client;

function Client (host) {
  this.graph = new SimpleApiClient('http://' + host);
}

Client.prototype.getNodes = function (opts, cb) {
  if (isFunction(opts)) {
    cb = opts;
    opts = {};
  }
  opts = { qs: opts };
  this.graph.get('nodes', opts, cb);
};

Client.prototype.getNode = function (value, cb) {
  this.graph.get('nodes/' + value, cb);
};

Client.prototype.createNode = function (value, cb) {
  if (isFunction(value)) {
    cb = value;
    return cb(new Error('createNode takes a value'));
  }
  var opts = {
    json: true,
    body: { value: value }
  };
  this.graph.post('nodes', opts, cb);
};

Client.prototype.deleteNode = function (value, cb) {
  if (isFunction(value)) {
    cb = value;
    return cb(new Error('deleteNode takes a value'));
  }
  this.graph.delete('nodes/' + value, cb);
};

Client.prototype.createEdge = function (from, label, to, cb) {
  var opts = {
    json: true,
    body: {
      from: from,
      label: label,
      to: to
    }
  };
  this.graph.post('edges', opts, cb);
};

