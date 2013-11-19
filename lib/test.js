var assert = require( 'assert' )
  , EventEmitter = require( 'events' ).EventEmitter;

function Emitter() {
  var expectations = []
    , instance = this;

  EventEmitter.call( instance );
   
  process.on( 'exit', function() {
    if (expectations.length) {
      console.log( 'expected events did not occur: ', expectations );
    }

    assert.equal( expectations.length, 0 );
  } );

  instance.expect = function( event, code ) {
    if (!expectations.length) {
      instance.once( event, check );
    }
    expectations.push( { event: event, code: code } );

    function check( code ) {
      var expectation = expectations[0];
      expectations.splice( 0, 1 );
     
      if (expectation.code != undefined) {
        assert.deepEqual( code.trim(), expectation.code.trim() );
      }
      
      if (expectations.length) {
        instance.once( expectations[0].event, check );
      }
    }
  }; 
}  

Emitter.prototype = new EventEmitter();

module.exports.Test = {
  Emitter: Emitter,
  finalLog: function( msg ) {
    process.on( 'exit', function() {
      console.log( msg );
    } );
  }
}
