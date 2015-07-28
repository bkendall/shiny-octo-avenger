'use strict';

var find = require('101/find');
var hasProps = require('101/has-properties');

module.exports.World = function (callback) {
  var self = this;
  this.nodeCache = [];
  this.associationCache = [];

  this.findCachedNode = function (label, value) {
    return find(self.nodeCache, hasProps({
      label: label,
      value: value
    }));
  };

  this.findCachedAssociation = function (n1, label, n2) {
    return find(self.associationCache, hasProps({
      from: n1.id,
      label: label,
      to: n2.id
    }));
  };

  callback();
};
