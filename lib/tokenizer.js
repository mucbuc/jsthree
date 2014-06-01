
//new Tokenizer( emitter, { 'open': '\\(', 'close': '\\)', 'statement': ';' })

function Tokenizer(emitter, map) {

  var instance = this
    , regex = init( typeof map === 'undefined' ? Tokenizer.prototype.defaultMap() : map );

  if (typeof map === 'undefined')
    map = Tokenizer.prototype.defaultMap();

  this.process = function(code) {
    while (true) {
      var matches = code.match( regex );
      if (!matches)
      {
        emitter.emit( 'end', code );
        return;
      }
      for (property in map) {
        var t = new RegExp( '.*?(' + map[property] + ')', 'g' );
        if (matches[0].match(t)) {
          var t = matches[0].replace( new RegExp( map[property] ), '' );
          emitter.emit( property, t );
          code = code.substr( matches[0].length, code.length );
        }
      }
    }
  };

  function init( map ) {
    var result = [];
    for(property in map) {
      result.push( map[property] );
    }

    return '.*?(' + result.join( '|' ) + ')';
  }
}

Tokenizer.prototype.defaultMap = function() {
  return {
    'statement': ';',
    'open': '{',
    'close': '}',
  };
};


exports.Tokenizer = Tokenizer;
