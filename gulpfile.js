/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are split in several files in the gulp directory
 *  because putting all here was really too long
 */

'use strict';

var assert = require('assert');
var RunSequence = require('run-sequence');
var wrench = require('wrench');
var path = require('path');
var PathTemplate = require('./src/path-template');

var conf = require('./src/conf');

var Clean = require('./src/clean');
var Scripts = require('./src/scripts');
//var Build = require('./src/build');
//var Server = require('./src/server');

module.exports = MoB;

MoB.prototype.task = task;

function MoB(gulp) {
  var mob = Object.create(gulp);

  PathTemplate.mixin(mob);

  mob.task = task;
  mob.commit = commit;

  //mob.task('scripts').read = function() {
  //  return this._super()
  //    .pipe($.sort());
  //};
  //mob.task('scripts').transform = function(stream) {
  //  return this._super(stream)
  //    .pipe($.debug());
  //};
  //mob.task('scripts').write = function(stream) {
  //  return this._super(stream)
  //    .pipe(mob.task('cordova:prepare').stream());
  //};

  mob.conf = conf;

  mob.gulp = gulp;
  mob.runSequence = RunSequence.use(gulp);

  //mob.clean = Clean.bind(mob);
  //mob.build = Build(mob);
  //mob.server = Server(mob);

  mob.task('clean', Clean(mob));

  var scripts = Scripts(mob);
  mob.task('scripts', scripts);
  mob.task('scripts:watch', scripts.watch);

  //mob.task.clean = function() {
  //  return del(mob.conf.paths.dist);
  //};
  ////gulp.task('clean', mob.task.clean);
  //
  //mob.task.scripts = Scripts;
  //
  //mob.task.scripts = function() {
  //  return this.read()
  //    .pipe(this.transform())
  //    .pipe(this.write())
  //};
  //mob.task.scripts.read = function() {
  //  return gulp.src([
  //    path.join(this.conf.paths.src, '**/*.js'),
  //    '!' + path.join(this.conf.paths.src, '**/*.spec.js')
  //  ]);
  //};
  //mob.task.scripts.write = function(stream) {
  //  var dest = this.conf.paths.out;
  //  return stream.pipe(gulp.dest(dest));
  //  //return gulp.dest(dest);
  //};
  //mob.task.scripts.transform = function(stream) {
  //  return stream
  //    .pipe($.debug())
  //    .pipe(this.write());
  //};
  ////mob.task('scripts', mob.task.scripts);
  ////
  ////mob.task.build = mob.build();
  ////mob.task.build.write = function() {
  ////  return mob.build.write()
  ////    .pipe(mob.task.server.stream());
  ////};
  ////mob.task.build.read = function() {
  ////  return mob.build.read()
  ////    .pipe(mob.task.server.stream());
  ////};
  ////mob.task.build = function(stream) {
  ////  return
  ////};

  mob.task('default', 'build');

  //mob.task('clean', function() {
  //  return Clean(conf).pipe(mob.server.stream());
  //});

  mob.task('assets', [[
    'scripts',
    'styles',
    'styles:fancybox',
    'images'
  ]]);

  //mob.task('build', [
  //  'clean',
  //  [ 'scripts', 'html', 'index' ],
  //  'cordova:prepare'
  //]);
  //mob.task('build', function(done) {
  //  return runSequence([
  //    this.before,
  //    this.run,
  //    this.after,
  //    done
  //  ]);
  //});
  //mob.task('build').before = ['clean'];
  //mob.task('build').run = ['scripts', 'html', 'index'];
  //mob.task('build').after = ['cordova:prepare'];
  mob.task('build', Build(mob));

  function Build(mob) {

    return task;

    function task(done) {
      return runSequence(task.sequence());
    }
  }

  //gulp.task('watch', ['build'], watch);

  mob.task('serve', [
    'watch'
  ]);

  mob.task('watch', [
    'build',
    [ 'watch:scripts', 'watch:html', 'watch:index' ],
  ]);

  /**
   *  This will load all js or coffee files in the gulp directory
   *  in order to load  all gulp tasks
   */
  wrench.readdirSyncRecursive(path.join(__dirname, 'src')).filter(function(file) {
    return (/\.(js|coffee)$/i).test(file);
  }).map(function(file) {
    require('./src/' + file);
  });
};

function task(name, sequence, fn) {
  assert(typeof name === 'string', "name must be a string");
  if (arguments.length === 1) {
    // as a getter
    return this.task[name];
  } else {
    if (Array.isArray(sequence)) {
      return this.gulp.task(name, function(done) {
        this.runSequence(sequence.concat([done]));
      });
    } else if (typeof sequence === 'string') {
      return this.gulp.task(name, [sequence], fn);
    } else {
      return this.gulp.task(name, sequence, fn);
    }
  }
}

function commit() {
  Object.keys
}
