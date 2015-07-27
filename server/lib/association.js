'use strict';

var assign = require('101/assign');
var boom = require('boom');
var findIndex = require('101/find-index');
var hasProps = require('101/has-properties');
var pick = require('101/pick');
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

Association.findOne = function (opts, cb) {
  opts = filterOpts(opts);
  this.find(opts, function (err, _associations) {
    if (err) { return cb(err); }
    if (!_associations.length) {
      return cb(boom.notFound('association does not exist'));
    }
    cb(null, _associations[0]);
  });
};

Association.find = function (opts, cb) {
  opts = filterOpts(opts);
  cb(null, associations.filter(hasProps(opts)));
};

Association.prototype.delete = function (cb) {
  var i = findIndex(associations, hasProps({ id: this.id }));
  associations.splice(i, 1);
  cb(null);
};

function filterOpts (opts) {
  return pick(opts, [ 'id', 'from', 'label', 'to' ]);
}
