'use strict';

describe('Paths plugin', function() {
  var Paths;
  var paths;
  beforeEach(function() {
    Paths = require('../src/paths');
    paths = {};
    Paths.call(paths);
  });

  describe('factory', function() {
    it('creates a default paths property', function() {
      expect(paths.paths, 'to be a', 'object');
    });
    it('does not replace existing paths property', function() {
      var probe = {
        probe: true
      };
      var paths = {
        paths: probe
      };
      Paths.call(paths);
      expect(paths.paths, 'to be', probe);
    });
  });

  describe("#path('template')", function() {
    beforeEach(function() {
      paths.paths = {
        src: 'source',
        out: '{dist}/{src}',
        dist: '{www}',
        www: 'public'
      };
    });
    it('returns the input when no variables', function() {
      expect(paths.path('src'), 'to be', 'src');
    });
    it('replaces variables with their mapped value', function() {
      expect(paths.path('{src}'), 'to be', 'source');
    });
    it('keeps fixed parts when replacing', function() {
      expect(paths.path('pre/{src}/post'), 'to be', 'pre/source/post');
    });
    it('replaces variables in dictionary values', function() {
      expect(paths.path('{dist}'), 'to be', 'public');
    });
    it('replaces variables in dictionary values recursively', function() {
      expect(paths.path('{out}'), 'to be', 'public/source');
    });
  });
});
