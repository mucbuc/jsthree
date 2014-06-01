
function Tokenizer(emitter) {

  var instance = this
    , rules = []
    , regex;

  this.process = function(code) {
    if (typeof regex === 'undefined') {
      makeRegex( function( result ) {
        regex = result;
        findMatches(code);
      });
    }
    else {
      findMatches(code);
    }

    function findMatches(code) {
      var matches = code.match( regex );
      rules.forEach( function(element, index) {
        var m = code.match( element.regex, index );
        if (m && m[0] == matches[0]) {
          emitter.emit( rules[ index ].token, matches[0] );
          code = code.replace( element, '' );
        }
      } );
    }

    function makeRegex(done) {
      var result = [];
      rules.forEach( function( element, index ) {
        result.push( element.regex );
        if (index == rules.length - 1) {
          var str = '(' + result.join( '|' ) + ')';
          done( new RegExp( str, 'g' ) );
        }
      } );
    }

  };

  this.match = function( reg, token ) {
    rules.push( { regex: reg, token: token } );
    delete regex;
  }
}

exports.Tokenizer = Tokenizer;
