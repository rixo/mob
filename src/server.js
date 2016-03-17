'use strict';

var _ = require('lodash');
var path = require('path');

//var gulp = require('./gulp');
var gutil = require('gulp-util');
var $ = require('gulp-load-plugins')();

var cordova = require('cordova-lib').cordova;
var cordovaBrowserSync = require('cordova-browsersync-primitives');
var Patcher = require('cordova-plugin-browsersync/lib/utils/Patcher');

module.exports = Server;

//gulp.task('serve', ['watch'], function() {
//  server.start();
//});

function Server() {
  var bs;
  var projectRoot = process.cwd();
  var platforms = ['android', 'ios'];

  var patcher = new Patcher(projectRoot, platforms);

  return {
    start: start,
    stream: stream
  };

  function start() {
    if (!bs) {
      createBs();
    }
  }

  function stream(opts) {

  }

  function createBs() {
    bs = cordovaBrowserSync.startBrowserSync(projectRoot, platforms, function(defaults) {
      defaults.reloadDebounce = 500;
      console.log(defaults.server)
      defaults.files.push({
        match: ['www/**/*.*'],
        fn: function(event, file) {
          if (event === 'change') {
            gutil.log('cordova prepare...');
            cordova.raw.prepare().then(function() {
              gutil.log('cordova prepare SUCCESS');
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
  }
}
