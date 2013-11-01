module.exports = function (file, options) {
  var child = require('child_process'),
    args = [],
    rmOptions = [],
    self = this;

  if ( typeof file === 'string' ) {
    file = [file];
  }

  args = file;

  if ( typeof options === 'object' ) {
    if ( options.recursive === true ) {
      rmOptions.push('r');
    }
    if ( options.file === true ) {
      rmOptions.push('f');
    }
  }

  if ( rmOptions.length ) {
    args.unshift('-' + rmOptions.join(''));
  }

  child.execFile('rm', args, function (error, stdout, stderr) {
    if ( error ) {
      return self.emit('error', error);
    }
    self.emit('done');
  });
};