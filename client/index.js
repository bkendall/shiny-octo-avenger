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
  this.graph.get('nodes', cb);
};

Client.prototype.getNode = function (value, cb) {
  this.graph.get('nodes/' + value, cb);
};

Client.prototype.createNode = function (value, cb) {
  if (isFunction(value)) {
    cb = value;
    return cb(new Error('createNode takes a value'));
  }
  this.graph.post('nodes', { json: true, body: { value: value } }, cb);
};
