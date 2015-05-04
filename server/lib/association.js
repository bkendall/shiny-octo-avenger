'use strict';

var assign = require('object-assign');
var findIndex = require('101/find-index');
var hasProps = require('101/has-properties');
var isFunction = require('101/is-function');
var uuid = require('uuid');

module.exports = Association;

var associations = [];

function Association (fromID, label, toID) {
  assign(this, {
    id: uuid(),
    from: fromID,
    label: label,
    to: toID
  });
  associations.push(this);
}

Association.fetch = function (fromID, label, cb) {
  var _associations = associations
    .filter(hasProps({
      from: fromID,
      label: label
    }));
  cb(null, _associations);
};

Association.count = function (fromID, label, cb) {
  if (isFunction(label)) {
    cb = label;
    label = undefined;
  }
  var opts = {
    from: fromID
  };
  if (label) {
    opts.label = label;
  }
  var _associations = associations.filter(hasProps(opts));
  cb(null, _associations.length);
};

Association.prototype.delete = function (cb) {
  var i = findIndex(associations, hasProps({ id: this.id }));
  associations.splice(i, 1);
  cb(null);
};
