'use strict';

var gulp = require('./gulp');
var SubTask = require('gulp-subtask')(gulp);
var gutil = require('gulp-util');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence').use(gulp);
var path = require('path');
var del = require('del');
var wiredep = require('wiredep').stream;
var _ = require('lodash');
var lazypipe = require('lazypipe');

//var browserSync = require('browser-sync');
var browserSync = {
  stream: gutil.noop
};

var conf = require('./conf');
var ctx = require('./ctx');

var scripts = Scripts();

gulp.task('watch', function(done) {
  runSequence(
    [
      'context:watch',
      'clean'
    ], [
      scripts.run.name,
      'html',
      'index'
    ], [
      'watch:inject',
      scripts.watch.name
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
  .concat(scripts.src)
;

gulp.task('clean', function() {
  return del(conf.paths.www);
});

function Scripts() {
  var src = [
    path.join(conf.paths.src, '**/*.js'),
    '!' + path.join(conf.paths.src, '**/*.spec.js')
  ];
  var task = new SubTask()
    .pipe(gulp.dest, conf.paths.www)
    .pipe(browserSync.stream);

  return {
    src: src,
    run: _.extend(gulp.task('scripts', scripts), {
      name: 'scripts'
    }),
    watch: _.extend(gulp.task('watch:scripts', watchScripts), {
      name: 'watch:scripts'
    })
  };

  function scripts() {
    return gulp.src(src).pipe(task.run());
  }

  function watchScripts() {
    $.watch(src, {
      events: ['add', 'change'],
      name: 'scripts-changed',
      verbose: true
    }).pipe(task.run());
  }
}

//gulp.task('scripts', function() {
//  return gulp.src(scriptsSrc)
//    .pipe($.if(ctx.watch, $.watch(scriptsSrc, {
//      events: ['add', 'change'],
//      name: 'scripts-changed',
//      verbose: true
//    })))
//    //.pipe($.debug())
//    .pipe(gulp.dest(conf.paths.www))
//    //.pipe(browserSync.stream())
//  ;
//});

gulp.task('index', function() {
  //var injectScripts = gulp.src([
  //  path.join(conf.paths.src, '/**/*.module.js'),
  //  path.join(conf.paths.src, '/**/*.js'),
  //  '!' + path.join(conf.paths.www, '/vendor.js')
  //], {
  var injectScripts = gulp.src(scripts.src, {
    read: false
  }).pipe($.debug());

  var injectOptions = {
    ignorePath: [conf.paths.src],
    addRootSlash: false
  };

  return gulp.src(indexSrc)
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe($.useref({}, lazypipe().pipe($.sourcemaps.init, { loadMaps: true })))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(path.join(conf.paths.www)))
    //.pipe($.debug())
    .pipe(browserSync.stream());
});

gulp.task('watch:inject', function() {
  $.watch([
    'bower.json',
    indexSrc
  ], {
    name: 'watch:vendor-change'
  }, function(file) {
    gulp.start('index');
  });
  // inject scripts
  $.watch(path.join(conf.paths.src, '**/*.js'), {
    name: 'watch:src/**/*.js',
    read: false,
    verbose: true
  }, function(file) {
    if (file.event === 'change') {
      // content change only -- don't need to be handled here
    } else {
      gulp.start('index');
    }
  });
  $.watch(watchDeletedSrc, {
    events: ['unlink'],
    name: 'watch:deleted',
    read: false
  }, function(file) {
    del(path.join(file.cwd, conf.paths.www, file.relative));
    gulp.start('index');
  });
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
