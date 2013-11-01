var Import  = require('lib-import')
  .$$setPath(__dirname + '/lib');

exports.set = Import.$$setProperty;

exports.get = function (what) {
  return Import.$$properties[what];
};

exports.libs = ['spawn', 'rm'];

this.libs.forEach(function (mod) {
  exports[mod] = function () {
    var args = [mod];

    for ( var i in arguments ) {
      if ( i.match(/^\d+$/) ) {
        args.push(arguments[i]);
      }
    }

    return Import.apply(null, args);
  };
});