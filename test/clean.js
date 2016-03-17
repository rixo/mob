'use strict';

var fs = require('fs-promise');

describe('clean', function() {
  var gulp;
  var MoB;
  var mob;
  var Clean;
  beforeEach(function() {
    gulp = require('gulp');
    MoB = require('../index');
    Clean = require('../src/clean');
    mob = MoB(gulp).use(Clean);
  });
  after(function() {
    return fs.remove('.tmp');
  });

  it("registers task 'clean'", function() {
    expect(mob.tasks.clean, 'to be defined');
  });

  it("task rimraf the {out} directory", function() {
    mob.paths.out = '.tmp/mob-test';
    return fs.ensureDir('.tmp/mob-test/sub')
      .then(function() {
        return fs.exists('.tmp/mob-test');
      })
      .then(function(exists) {
        expect(exists, 'to be', true);
        return mob.start('clean');
      })
      .then(function() {
        return fs.exists('.tmp/mob-test');
      })
      .then(function(exists) {
        expect(exists, 'to be', false);
      });
  });
});
