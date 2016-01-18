'use strict';

var assign = require('101/assign');
var findIndex = require('101/find-index');
var hasProps = require('101/has-properties');
var isFunction = require('101/is-function');
var uuid = require('uuid');

var associations = [];

class Association {
  constructor (fromID, label, toID) {
    assign(this, {
      id: uuid(),
      from: fromID,
      label: label,
      to: toID
    });
    associations.push(this);
  }

  static count (fromID, label, cb) {
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
  }

  static fetch (fromID, label, cb) {
    var _associations = associations
      .filter(hasProps({
        from: fromID,
        label: label
      }));
    cb(null, _associations);
  }

  delete (cb) {
    var i = findIndex(associations, hasProps({ id: this.id }));
    associations.splice(i, 1);
    cb(null);
  }
}

module.exports = Association;
