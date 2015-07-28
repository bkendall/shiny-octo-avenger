'use strict';

var find = require('101/find');
var hasProps = require('101/has-properties');

module.exports = function () {
  this.When(/^I add a "([^"]*)" Node "([^"]*)"$/, function (label, value, callback) {
    var self = this;
    this.client.createNode(label, value, function (err, node) {
      if (err) { return callback.fail(err); }
      self.nodeCache.push(node);
      callback(err, node);
    });
  });

  this.When(/^I remove the "([^"]*)" Node "([^"]*)"$/, function (label, value, callback) {
    var n = this.findCachedNode(label, value);
    this.client.newNode({ id: n.id }).delete(callback);
  });

  this.Then(/^I should see the "([^"]*)" "([^"]*)" in the Graph$/, function (label, value, callback) {
    var nodeProps = {
      label: label,
      value: value
    };
    this.client.fetchNodes(nodeProps, function (err, nodes) {
      if (err) { return callback.fail(err); }
      if (nodes.length !== 1) {
        return callback.fail('Did not recieve the right number of nodes from the graph.');
      }
      var n = find(nodes, hasProps(nodeProps));
      if (!n) {
        return callback.fail('Expected to find node "' + label + '" with value "' + value + '".');
      }
      callback();
    });
  });

  this.Then(/^I should not see the "([^"]*)" "([^"]*)" in the Graph$/, function (label, value, callback) {
    var nodeProps = {
      label: label,
      value: value
    };
    this.client.fetchNodes(nodeProps, function (err, nodes) {
      if (err) { return callback.fail(err); }
      if (nodes.length !== 0) {
        return callback.fail('Recieved nodes when none were expected.');
      }
      callback();
    });
  });
};
