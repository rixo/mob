/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are split in several files in the gulp directory
 *  because putting all here was really too long
 */

'use strict';

var gulp = require('./src/gulp');
var wrench = require('wrench');
var path = require('path');

module.exports = function mob() {
  /**
   *  This will load all js or coffee files in the gulp directory
   *  in order to load  all gulp tasks
   */
  wrench.readdirSyncRecursive(path.join(__dirname, 'src')).filter(function(file) {
    return (/\.(js|coffee)$/i).test(file);
  }).map(function(file) {
    require('./src/' + file);
  });

  /**
   *  Default task clean temporaries directories and launch the
   *  main optimization build task
   */
  gulp.task('default', ['clean'], function () {
    gulp.start('build');
  });
};
