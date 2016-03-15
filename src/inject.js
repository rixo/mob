'use strict';

var gulp = require('./gulp');
var $ = require('gulp-load-plugins')();
var _ = require('lodash');
var path = require('path');
var wiredep = require('wiredep').stream;

var browserSync = require('browser-sync');

var conf = require('./conf');
var ctx = require('./ctx');

gulp.task('wiredep', function() {
  var src = path.join(conf.paths.src, 'index.html');
  return gulp.src(src)
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.www)))
    .pipe($.debug())
    .pipe(browserSync.stream());
});
