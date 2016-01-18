'use strict';

import assign from '101/assign';
import findIndex from '101/find-index';
import hasProps from '101/has-properties';
import uuid from 'uuid';

export default Association;

let associations = [];

function Association (from, label, to) {
  assign(this, {
    id: uuid(),
    from,
    label,
    to
  });
  associations.push(this);
}

Association.fetch = function (from, label, cb) {
  const _associations = associations
    .filter(hasProps({
      from,
      label
    }));
  cb(null, _associations);
};

Association.count = function (opts, cb) {
  if (!opts.label) {
    delete opts.label;
  }
  const _associations = associations.filter(hasProps(opts));
  cb(null, _associations.length);
};

Association.prototype.delete = function (cb) {
  const i = findIndex(associations, hasProps({ id: this.id }));
  associations.splice(i, 1);
  cb(null);
};
