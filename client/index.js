'use strict';

var SimpleApiClient = require('simple-api-client');
var isFunction = require('101/is-function');
var isObject = require('101/is-object');

var Association = require('./lib/association');
var Node = require('./lib/node');

module.exports = Client;

function Client (host) {
  this.graph = new SimpleApiClient('http://' + host);
}

Client.prototype.fetchAssociations = function (opts, cb) {
  if (isFunction(opts)) {
    cb = opts;
    opts = {};
  }
  opts = { qs: opts };
  this.graph.get('associations', opts, function (err, res, body) {
    if (err) {
      return cb(err);
    } else if (res.statusCode !== 200) {
      return cb(new Error('could not get associations: ' + body.message));
    }
    cb(null, body);
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

Client.prototype.createAssociation = function (from, label, to, cb) {
  if (isObject(from) && from.id) {
    from = from.id;
  }
  if (isObject(to) && to.id) {
    to = to.id;
  }
  var opts = {
    json: true,
    body: {
      from: from,
      label: label,
      to: to
    }
  };
  this.graph.post('associations', opts,
    handleCreate(Association, this.graph, cb));
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

