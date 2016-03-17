'use strict';

describe('MoB', function() {
  var gulp;
  var MoB;
  beforeEach(function() {
    gulp = require('gulp');
    MoB = require('../index');
  });

  it('is a factory', function() {
    expect(MoB, 'to be a', 'function');
  });
  it('returns a MoB object', function() {
    expect(MoB(gulp), 'to be a', 'object');
  });

  describe('instance', function() {
    var mob;
    beforeEach(function() {
      mob = MoB(gulp);
    });

    it('has a path() method', function() {
      expect(mob.path, 'to be a', 'function');
    });

    describe('#use(Plugin)', function() {
      it('is a function', function() {
        expect(mob.use, 'to be a', 'function');
      });
      it('returns the mob object', function() {
        var Plugin = function() {};
        var result = mob.use(Plugin);
        expect(result, 'to be', mob);
      });
      it('calls Plugin in instance scope', function() {
        var scope;
        var Plugin = function(arg) {
          scope = this;
        };
        mob.use(Plugin);
        expect(scope, 'to be', mob);
      });
    });
  });
});
