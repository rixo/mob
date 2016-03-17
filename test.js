'use strict';

var RunSequence = require('run-sequence');
var gulp = require('gulp');

var mob = Object.create(gulp);

mob.tasks = {};

mob.conf = {
  paths: {
    src: 'src',
    out: 'www/src', // src (scripts, styles, assets) dest
    dist: 'www', // clean rimraf
    www: '{dist}', // serve root
    lib: 'www/bower_components',
    tmp: '.tmp',
    e2e: 'e2e'
  }
};

mob.task('mr.clean', function() {
  console.log(this === mob);
  //return new Promise(function(resolve) {
  //  resolve();
  //});
});

mob.task('mr.clean', function() {
  console.log('I am the Mister.');
  //return new Promise(function(resolve) {
  //  resolve();
  //});
});

console.log(gulp.tasks)

mob.start('mr.clean');

function Build(mob) {

  task.before = ['clean'];
  task.run = ['scripts', 'html', 'index'];
  task.after = ['cordova:prepare'];

  task.sequence = function() {
    return [
      this.before,
      this.run,
      this.after
    ];
  };

  return task;

  function task(done) {
    var sequence = task.sequence().concat([done]);
    return runSequence(sequence);
  }
}

function Cordova(mob) {
  var cordova = require('cordova-lib').cordova;

  this.task.build.after.push('cordova:prepare');

  this.prepare = function(done) {
    return cordova.raw.prepare();
  };
}

console.log(
  //gulp.tasks
)
