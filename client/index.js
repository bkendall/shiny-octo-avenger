'use strict';

var SimpleApiClient = require('simple-api-client');
var isFunction = require('101/is-function');

var Edge = require('./edge');
var Node = require('./node');

module.exports = Client;

function Client (host) {
  this.graph = new SimpleApiClient('http://' + host);
}

Client.prototype.fetchNodes = function (opts, cb) {
  if (isFunction(opts)) {
    cb = opts;
    opts = {};
  }
  opts = { qs: opts };
  var self = this;
  this.graph.get('nodes', opts, function (err, res, body) {
    if (err) {
      return cb(err);
    } else if (res.statusCode !== 200) {
      return cb(new Error('could not get nodes'));
    }
    cb(null, body.map(function (o) { return new Node(o, self.graph); }));
  });
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
  var self = this;
  this.graph.post('nodes', opts, function (err, res, body) {
    if (err) {
      return cb(err);
    } else if (res.statusCode !== 201) {
      return cb(new Error('could not create node'));
    }
    cb(null, new Node(body, self.graph));
  });
};

Client.prototype.newNode = function (opts) {
  return new Node(opts, this.graph);
};

Client.prototype.createEdge = function (from, label, to, cb) {
  var opts = {
    json: true,
    body: {
      from: from.id,
      label: label,
      to: to.id
    }
  };
  var self = this;
  this.graph.post('edges', opts, function (err, res, body) {
    if (err) {
      return cb(err);
    } else if (res.statusCode !== 201) {
      return cb(new Error('could not create edge'));
    }
    cb(null, new Edge(body, self.graph));
  });
};

