'use strict';

var variableRe = /{(\w+)}/g;

module.exports = Path;

function Path() {
  if (!this.paths) {
    this.paths = {};
  }
  this.path = path;
}

function path(template) {
  var paths = this.paths;
  var rendered = template.replace(variableRe, function(match, key) {
    return paths[key];
  });
  if (rendered === template) {
    return rendered;
  } else {
    return this.path(rendered);
  }
}
