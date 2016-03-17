'use strict';

var gulp = require('./gulp');
var path = require('path');
var SubTask = require('gulp-subtask')(gulp);
var $ = require('gulp-load-plugins')();
var conf = require('./conf');

var src = [
  path.join(conf.paths.src, '**/*.css')
];

var task = new SubTask()
  .pipe(gulp.dest, conf.paths.www);

gulp.task('styles', styles);
gulp.task('watch:styles', watchStyles);

return {
  src: src
};

function styles() {
  return gulp.src(src)
    .pipe(gulp.dest(conf.paths.www))
    .pipe($.debug())
  //.pipe(task.run());
}

function watchStyles() {
  $.watch(src, {
    events: ['add', 'change'],
    name: 'styles-changed',
    verbose: true
  }).pipe(task.run());
}
