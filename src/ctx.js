'use strict';

var gulp = require('./gulp');

var ctx = {
  watch: false
};

module.exports = ctx;

gulp.task('context:build', function() {
  ctx.watch = false;
});

gulp.task('context:watch', function() {
  ctx.watch = true;
});
