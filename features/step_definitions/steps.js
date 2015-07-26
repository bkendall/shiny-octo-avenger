var async = require('async');
var find = require('101/find');
var hasProps = require('101/has-properties');

module.exports = function () {
  this.Given(/^I have an empty Graph$/, function (callback) {
    this.client.fetchNodes({}, function (err, nodes) {
      if (err) { return callback.fail(err); }
      return async.each(nodes, function (node, cb) {
        node.delete(cb);
      }, callback);
    });
  });

  this.When(/^I add a "([^"]*)" Node named "([^"]*)"$/, function (arg1, arg2, callback) {
    this.client.createNode(arg1, arg2, callback);
  });

  this.When(/^I remove the "([^"]*)" Node named "([^"]*)"$/, function (arg1, arg2, callback) {
    var nodeProps = {
      label: arg1,
      value: arg2
    };
    this.client.fetchNodes(nodeProps, function (err, nodes) {
      if (err) { return callback.fail(err); }
      if (nodes.length !== 1) { return callback.fail('Did not receive any nodes.'); }
      nodes[0].delete(callback);
    });
  });

  this.Then(/^I (should not|should) be able to see the "([^"]*)" named "([^"]*)" in the Graph$/, function (arg0, arg1, arg2, callback) {
    var nodeProps = {
      label: arg1,
      value: arg2
    };
    this.client.fetchNodes(nodeProps, function (err, nodes) {
      if (err) { return callback.fail(err); }
      if (arg0 === 'should') {
        if (nodes.length !== 1) {
          return callback.fail('Did not recieve the right number of nodes from the graph.');
        } else {
          var n = find(nodes, hasProps(nodeProps));
          if (!n) {
            return callback.fail('Expected to find node "' + arg1 + '" with value "' + arg2 + '".');
          }
          return callback();
        }
      } else {
        if (nodes.length !== 0) {
          return callback.fail('Recieved nodes when none were expected.');
        }
        return callback();
      }
    });
  });

  this.When(/^I add an Association "([^"]*)" from "([^"]*)" "([^"]*)" to "([^"]*)" "([^"]*)"$/, function (arg1, arg2, arg3, arg4, arg5, callback) {
    var self = this;
    var node1Props = {
      label: arg2,
      value: arg3
    };
    var node2Props = {
      label: arg4,
      value: arg5
    };
    var label = arg1;
    this.client.fetchNodes({}, function (err, nodes) {
      if (err) { return callback.fail(err); }
      var node1 = find(nodes, hasProps(node1Props));
      var node2 = find(nodes, hasProps(node2Props));
      self.client.createAssociation(node1, label, node2, callback);
    });
  });

  this.Then(/^I should be able to see the that "([^"]*)" "([^"]*)" "([^"]*)" "([^"]*)" "([^"]*)"$/, function (arg1, arg2, arg3, arg4, arg5, callback) {
    var self = this;
    var node1Props = {
      label: arg1,
      value: arg2
    };
    var node2Props = {
      label: arg4,
      value: arg5
    };
    var label = arg3;
    this.client.fetchNodes(node1Props, function (err, nodes) {
      if (err) { return callback.fail(err); }
      if (nodes.length !== 1) { return callback.fail('Did not receive nodes.'); }
      self.client.fetchAssociations({
        from: nodes[0].id,
        label: label
      }, function (err, associations) {
        if (err) { return callback.fail(err); }
        if (associations.length !== 1) { return callback.fail('Did not receive associations.'); }
        var a = find(associations, hasProps({ label: label }));
        if (!a) { return callback.fail('Did not have correct assocation.'); }
        callback();
      });
    });
  });
};
