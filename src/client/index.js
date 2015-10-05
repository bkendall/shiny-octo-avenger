/* @flow */
import SimpleApiClient from 'simple-api-client';
import isFunction from '101/is-function';
import isObject from '101/is-object';

import Association from './lib/association';
import Node from './lib/node';

export default Client;

/**
 * Graph Client
 * @constructor
 * @param {string} host host (w/ optional port) of graph server
 */
function Client (host: string) {
  this.graph = new SimpleApiClient('http://' + host);
}

/**
 * Get associations from the graph.
 * @param {object} opts options to pass in the query
 * @param {integer} opts.from Node ID from which to look for associations
 * @param {string} [opts.label] label (type) of association to follow
 * @param {boolean} [opts.count] get the count of associations with given opts
 * @param {function} cb callback function
 */
Client.prototype.fetchAssociations = function (opts: Object, cb: Function) {
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

/**
 * Create a Node
 * @param {string} label type of Node to create
 * @param {string} value a string to set as the value on the Node
 * @param {function} cb callback function
 */
Client.prototype.createNode =
function (label: string, value: string, cb: Function) {
  var opts = {
    json: true,
    body: {
      label,
      value
    }
  };
  this.graph.post('nodes', opts, handleCreate(Node, this.graph, cb));
};

/**
 * Create a Node object
 * @param {object} opts options for creating the Node
 * @param {string} opts.id ID of the Node to represent
 * @param {string} opts.label type of Node
 * @param {string} opts.value value of the Node
 * @return {Node} a new Node
 */
Client.prototype.newNode = function (opts) {
  return new Node(opts, this.graph);
};

/**
 * Create an Association
 * @param {integer|Node} from ID or Node from which to create the Association
 * @param {string} label type of Association to create
 * @param {integer|Node} to ID or Node to which to associate
 * @param {function} cb callback function
 */
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

// Nodes and Associations have similar create handlers; this is the helper
// function to consolidate those handlers.
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

