var Server = require('../../').server;
var Client = require('../../').client;

module.exports = function () {
  this.Before(function (callback) {
    this.priorNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
    this.port = 8080;
    this.client = new Client('localhost:' + this.port);
    this.server = Server.listen(this.port, callback);
  });

  this.After(function (callback) {
    process.env.NODE_ENV = this.priorNodeEnv;
    this.server.close(callback);
  });
};
