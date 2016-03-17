'use strict';

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
  src: 'src',
  out: '{www}/src', // src (scripts, styles, assets) dest
  dist: 'www', // clean rimraf
  www: '{dist}', // serve root
  lib: '{www}/bower_components',
  tmp: '.tmp',
  e2e: 'e2e'
};

/**
 *  Wiredep is the lib which inject bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
exports.wiredep = {
  directory: 'bower_components'
};
