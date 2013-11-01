module.exports = function spawn (cmd, args, options) {
  var errorTriggered = false,
    argsIsArray = Object.prototype.toString.call(args) === '[object Array]',
    self = this;

  if ( ! options && typeof args === 'object' && ! argsIsArray ) {
    options = args;
    args = [];
  }

  if ( ! options ) {
    options = {};
  }

  self.emit('message', 'Spawning ' + cmd + ' ' + args.join(' '));

  var spawned = require('child_process').spawn(cmd, args, options);
  
  var spawnedOut = [],
    spawnedErr = [],
    spawnError = false;
  
  spawned.on('error', function (error) {
    if ( ! errorTriggered ) {
      errorTriggered = true;
      spawnError = error;
      self.emit('message', 'Spawning failed ');
      return self.emit('error', error);
    }
  });
  
  if ( spawned.stdout ) {
    spawned.stdout.on('data', function (data) {
      var message = data.toString(), lines = message.split(/\n/);
      lines.forEach(function (line) {
        spawnedOut.push(line);
        self.emit('message', line);
      });
    });
  }
  
  if ( spawned.stderr ) {
    spawned.stderr.on('data', function (data) {
      var message = data.toString(), lines = message.split(/\n/);
      lines.forEach(function (line) {
        spawnedErr.push(line);
        self.emit('message', line);
      });
    });
  }
  
  spawned.on('close', function (code) {
    if ( code ) {
      if ( ! errorTriggered ) {
        errorTriggered = true;
        spawnError = new Error('Spawned failed for command ' + cmd);
        self.emit('message', spawnedErr.join(''));
        return self.emit('error', new Error('you scuk ' + spawnedErr[spawnedErr.length - 2]));
      }
    } else {
      self.emit('done', {
        cmd: cmd,
        args: args,
        options: options,
        out: spawnedOut,
        err: spawnedErr,
        code: code
      });
    }
  });
};