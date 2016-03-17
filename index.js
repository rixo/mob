'use strict';

var Paths = require('./src/paths');

module.exports = MoB;

function MoB(gulp) {
  var mob = Object.create(gulp);

  mob.use = use;

  // start that returns a promise
  mob.start = start;

  mob.use(Paths);

  mob.paths = {
    out: 'dist' // clean
  };

  return mob;
}

function use(plugin) {
  plugin.call(this);
  return this;
}

function start(task, callback) {
  return new Promise(function(resolve, reject) {
    gulp.start(task, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
      if (callback) {
        callback.apply(this, arguments);
      }
    });
  });
}
