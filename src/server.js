'use strict';

var _ = require('lodash');
var path = require('path');

var gulp = require('./gulp');
var gutil = require('gulp-util');
var $ = require('gulp-load-plugins')();

var cordova = require('cordova-lib').cordova;
var cordovaBrowserSync = require('cordova-browsersync-primitives');
var Patcher = require('cordova-plugin-browsersync/lib/utils/Patcher');

gulp.task('serve', function() {

  var projectRoot = path.normalize(__dirname + '/..');
  var platforms = ['android', 'ios'];
  var patcher = new Patcher(projectRoot, platforms);

  var bs = cordovaBrowserSync.startBrowserSync(projectRoot, platforms, function(defaults) {
    defaults.reloadDebounce = 500;
    defaults.files.push({
      match: ['www/**/*.*'],
      fn: function(event, file) {
        if (event === 'change') {
          cordova.raw.prepare().then(function() {
            patcher.addCSP();
            bs.reload();
          });
        }
      }
    });
    return defaults;
  }, function(err, browserSyncValue) {
    if (err) {
      gutil.log("Failed to start browser-sync", err.stack || err);
    } else {
      patcher.patch({
        servers: browserSyncValue.servers
      });
    }
  });
});
