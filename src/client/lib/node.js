import assign from '101/assign';

export default Node;

/**
 * Graph Node
 * @constructor
 * @param {object} opts options for creating the Node
 * @param {string} opts.id ID of the Node to represent
 * @param {string} opts.label type of Node
 * @param {string} opts.value value of the Node
 * @param {object} graph graph client for the Node to use
 */
function Node (opts, graph) {
  assign(this, opts, { graph });
}

/**
 * Node fetch
 * Get all the information about the Node with this ID from the server
 * @param {function} cb callback function
 */
Node.prototype.fetch = function (cb) {
  this.graph.get('nodes/' + this.id, (err, res, body) => {
    if (err) {
      return cb(err);
    } else if (res.statusCode !== 200) {
      return cb(new Error('could not fetch node'));
    }
    cb(null, new Node(body, this.graph));
  });
};

Node.prototype.update = function (update, cb) {
  const opts = {
    json: true,
    body: update
  };
  this.graph.patch('nodes/' + this.id, opts, (err, res, body) => {
    if (err) {
      return cb(err);
    } else if (res.statusCode !== 200) {
      return cb(new Error('could not update node: ' + body.message));
    }
    cb(null, new Node(body, this.graph));
  });
};

/**
 * Node delete
 * Delete the Node from the server
 * @param {function} cb callback function
 */
Node.prototype.delete = function (cb) {
  this.graph.delete('nodes/' + this.id, (err, res, body) => {
    if (err) {
      return cb(err);
    } else if (res.statusCode !== 204) {
      return cb(new Error('could not delete node: ' + body.message));
    }
    cb(null);
  });
};

