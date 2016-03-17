'use strict';

var gulp = require('./gulp');
var cordova = require('cordova-lib').cordova;

var platforms = Platforms();

gulp.task('cordova:prepare', function() {
  return cordova.raw.prepare();
});

function Platforms() {

}
