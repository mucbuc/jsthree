/*
objective:
  - split code
  - map split code to events
  - pass split code to event chain

design:
  to be used as 'constant' object. properties are attached from the map (see init function),
  so to change the deliminators on the fly one would have to manage the properties. from a
  higher perspective, changing the deliminators doesn't seem like a clean solution.
*/

function Parser( emitter, map ) {

  var instance = this
    , deliminators = init( typeof map === 'undefined' ? Parser.prototype.defaultMap() : map );

  this.process = function( code ) {
    var pos = this.step( code );
    while (pos != -1) {
      code = code.substr( pos + 1, code.length );
      pos = this.step( code );
    }
    emitter.emit( 'end', code );
  };

  this.step = function( code ) {
    var pos = code.search( deliminators );
    if (pos != -1) {
      emitter.emit( instance[ code[ pos ] ], code.substr( 0, pos ) );
    }
    return pos;
  };

  function init( map ) {
    var chars = '['
      , regExs = [];

    for (property in map) {
      if (property.length > 1) {  // does this make sense? couldn't find a test case. TODO should probably remove
        regExs.push( { property: map[property] } );
      }
      else {
        chars = chars.concat( property );
      }
      instance[property] = map[property];
    }
    return new RegExp( chars + ']' );
  }
};

Parser.prototype.defaultMap = function() {
  return {
      ';': 'statement',
      '{': 'open',
      '}': 'close'
  };
};

module.exports.Parser = Parser;
