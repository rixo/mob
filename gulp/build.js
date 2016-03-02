'use strict';

var gulp = require('gulp');
var SubTask = require('gulp-subtask')(gulp);
var gutil = require('gulp-util');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var path = require('path');
var del = require('del');
var wiredep = require('wiredep').stream;
var _ = require('lodash');
var lazypipe = require('lazypipe');

//var browserSync = require('browser-sync');
var browserSync = {
  stream: function() {
    return gutil.noop();
  }
};

var conf = require('./conf');
var ctx = require('./ctx');

gulp.task('watch', function(done) {
  runSequence(
    'context:watch', [
      'watch-deleted',
      'watch:bower.json',
      'watch:index',
      'build'
    ],
    done
  );
});

gulp.task('build', function(done) {
  runSequence(
    'clean', [
      'scripts',
      'html',
      'index'
    ],
    done
  );
});

var scriptsSrc = path.join(conf.paths.src, '**/*.js');
var indexSrc = path.join(conf.paths.src, '**/*.html');
var htmlSrc = [
  path.join(conf.paths.src, '**/*.html'),
  '!' + indexSrc,
  path.join(conf.paths.src, '**/*.jade')
];
// automatically deleted in www when deleted from src
var watchDeletedSrc = []
  .concat(indexSrc)
  .concat(htmlSrc)
  .concat(scriptsSrc)
;

gulp.task('clean', function() {
  return del(conf.paths.www);
});

gulp.task('scripts', function() {
  return gulp.src(scriptsSrc)
    .pipe($.if(ctx.watch, $.watch(scriptsSrc, {
      events: ['add', 'change'],
      name: 'scripts-changed',
      verbose: true
    })))
    //.pipe($.debug())
    .pipe(gulp.dest(conf.paths.www))
    .pipe(browserSync.stream())
  ;
});

(function() {
  var indexTask = new SubTask()
    .pipe(wiredep, _.extend({}, conf.wiredep))
    .pipe($.useref, {}, lazypipe().pipe($.sourcemaps.init, { loadMaps: true }))
    .pipe($.sourcemaps.write, '.')
    .pipe(gulp.dest, path.join(conf.paths.www))
    .pipe($.debug)
    .pipe(browserSync.stream);

  gulp.task('index', function() {
    return gulp.src(indexSrc).pipe(indexTask.run());
  });

  gulp.task('watch:index', function() {
    return $.watch(indexSrc, {
      events: ['add', 'change'],
      name: 'index',
      verbose: true
    }).pipe(indexTask.run());
  });
}());

gulp.task('watch:bower.json', function() {
  return $.watch([
    'bower.json'
  ], function() {
    gulp.start('index');
  });
});

gulp.task('watch-deleted', function() {
  var watchOptions = {
    events: ['unlink'],
    name: 'watch-deleted',
    read: false
  };
  return $.watch(watchDeletedSrc, watchOptions, function(file) {
      del(path.join(file.cwd, conf.paths.www, file.relative));
    })
    .pipe($.debug())
    .pipe(browserSync.stream())
    ;
});

gulp.task('html', function() {
  return gulp.src(htmlSrc)
    //.pipe($.if(ctx.watch, $.watch(htmlSrc, {
    //  events: ['add', 'change'],
    //  name: 'html',
    //  verbose: true
    //})))
    .pipe($.debug())
    .pipe(gulp.dest(conf.paths.www))
    .pipe(browserSync.stream())
  ;
});
