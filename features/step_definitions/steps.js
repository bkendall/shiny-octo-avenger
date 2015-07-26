var find = require('101/find');
var hasProps = require('101/has-properties');

module.exports = function () {
  this.Given(/^I have an empty graph$/, function (callback) {
    this.client.fetchNodes({ label: 'Walrus' }, function (err, nodes) {
      if (err) { return callback.fail(err); }
      if (nodes.length !== 0) {
        return callback.fail('The graph is not empty');
      }
      callback();
    });
  });

  this.When(/^I add a "([^"]*)" Node named "([^"]*)"$/, function (arg1, arg2, callback) {
    this.client.createNode(arg1, arg2, callback);
  });

  this.Then(/^I should be able to see the "([^"]*)" named "([^"]*)" in the graph$/, function (arg1, arg2, callback) {
    var nodeProps = {
      label: arg1,
      value: arg2
    };
    this.client.fetchNodes(nodeProps, function (err, nodes) {
      if (err) { return callback.fail(err); }
      if (nodes.length !== 1) {
        return callback.fail('Did not recieve the right number of nodes from the graph.');
      } else {
        var n = find(nodes, hasProps(nodeProps));
        if (!n) {
          return callback.fail('Expected to find node "' + arg1 + '" with value "' + arg2 + '"');
        }
        return callback();
      }
    });
  });
};
