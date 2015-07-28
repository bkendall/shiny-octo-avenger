'use strict';

var find = require('101/find');
var hasProps = require('101/has-properties');

module.exports = function () {
  this.When(/^I add an Association "([^"]*)" from "([^"]*)" "([^"]*)" to "([^"]*)" "([^"]*)"$/, function (label, n1Label, n1Value, n2Label, n2Value, callback) {
    var self = this;
    var node1 = this.findCachedNode(n1Label, n1Value);
    var node2 = this.findCachedNode(n1Label, n1Value);
    this.client.createAssociation(node1, label, node2, function (err, association) {
      if (err) { return callback.fail(err); }
      self.associationCache.push(association);
      callback(err, association);
    });
  });

  this.When(/^I remove an Association "([^"]*)" from "([^"]*)" "([^"]*)" to "([^"]*)" "([^"]*)"$/, function (label, n1Label, n1Value, n2Label, n2Value, callback) {
    var node1 = this.findCachedNode(n1Label, n1Value);
    var node2 = this.findCachedNode(n1Label, n1Value);
    var association = this.findCachedAssociation(node1, label, node2);
    this.client.newAssociation({ id: association.id }).delete(callback);
  });

  this.Then(/^I should see the that "([^"]*)" "([^"]*)" "([^"]*)" "([^"]*)" "([^"]*)"$/, function (n1Label, n1Value, label, n2Label, n2Value, callback) {
    var node1 = this.findCachedNode(n1Label, n1Value);
    var node2 = this.findCachedNode(n1Label, n1Value);
    this.client.fetchAssociations({
      from: node1.id,
      label: label
    }, function (err, associations) {
      if (err) { return callback.fail(err); }
      var a = find(associations, hasProps({
        from: node1.id,
        label: label,
        to: node2.id
      }));
      if (!a) { return callback.fail('Did not have correct assocation.'); }
      callback();
    });
  });

  this.Then(/^I should not see the that "([^"]*)" "([^"]*)" "([^"]*)" "([^"]*)" "([^"]*)"$/, function (n1Label, n1Value, label, n2Label, n2Value, callback) {
    var node1 = this.findCachedNode(n1Label, n1Value);
    this.client.fetchAssociations({
      from: node1.id,
      label: label
    }, function (err, associations) {
      if (err) { return callback.fail(err); }
      if (associations.length !== 0) { return callback.fail('Found associations when none were expected.'); }
      callback();
    });
  });
};
