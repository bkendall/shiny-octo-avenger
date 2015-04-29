'use strict';

var SimpleApiClient = require('simple-api-client');
var isFunction = require('101/is-function');

var Edge = require('./lib/edge');
var Node = require('./lib/node');

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
      return cb(new Error('could not get nodes: ' + body.message));
    }
    cb(null, body.map(function (o) { return new Node(o, self.graph); }));
  });
};

Client.prototype.createNode = function (label, value, cb) {
  if (isFunction(label)) {
    value = label;
    label = null;
  }
  if (isFunction(value)) {
    cb = value;
    value = null;
  }
  var opts = {
    json: true,
    body: {
      label: label,
      value: value
    }
  };
  this.graph.post('nodes', opts, handleCreate(Node, this.graph, cb));
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
  this.graph.post('edges', opts, handleCreate(Edge, this.graph, cb));
};

function handleCreate (Entity, graph, cb) {
  return function (err, res, body) {
    if (err) {
      return cb(err);
    } else if (res.statusCode !== 201) {
      return cb(new Error('could not create ' + Entity.name));
    }
    cb(null, new Entity(body, graph));
  };
}

