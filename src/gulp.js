'use strict';

// expose app gulp (
var prequire = require('require-linked-peer');

console.log(require.resolve('gulp'))

module.exports = prequire('gulp');
