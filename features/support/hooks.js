'use strict';

var Server = require('../../').server;
var Client = require('../../').client;

module.exports = function () {
  this.World = require('../support/world.js').World;

  this.Before(function (callback) {
    this.port = 8080;
    this.client = new Client('localhost:' + this.port);
    this.server = Server.listen(this.port, callback);
  });

  this.After(function (callback) {
    this.server.close(callback);
  });
};
