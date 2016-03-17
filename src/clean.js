'use strict';

var del = require('del');

module.exports = function() {
  var mob = this;

  this.task('clean', cleanTask);

  function cleanTask() {
    var target = mob.path('{out}');
    return del(target);
  }
};
