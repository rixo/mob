'use strict';

var watchStream = require('gulp-watch');
var debug = require('gulp-debug');

module.exports = function(mob) {
  var me = run;

  me.run = run.bind(me);
  me.watch = watch.bind(me);

  me.src = [
    mob.path('{src}/**/*.js'),
    mob.path('!{src}/**/*.spec.js')
  ];
  me.transform = transform;
  me.write = write;
  
  return me;

  function watch() {
    var stream = watchStream(this.src);
    return this.transform();
  }

  function run() {
    var stream = mob.src(this.src);
    stream = this.transform(stream);
    return this.write(stream);
  }

  function transform(stream) {
    return stream.pipe(debug());
  }

  function write(stream) {
    return stream.pipe(
      mob.dest(mob.path('{out}'))
  }
};
