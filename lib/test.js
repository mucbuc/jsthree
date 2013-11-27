var assert = require( 'assert' )
  , EventEmitter = require( 'events' ).EventEmitter
  , util = require( 'util' );

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

  instance.expectNot = function( event ) { 
    instance.on( event, function() {
      console.log( 'event expected not to occur')
      assert( false );
    } );
  };

  instance.expect = function( event, code ) {
    if (!expectations.length) {
      instance.once( event, check );
    }
    expectations.push( { event: event, code: code } );

    function check( code ) {
      var expectation = expectations[0];
      expectations.splice( 0, 1 );
     
      if (expectation.code != undefined) {
        
        if (code instanceof Array) {

          assert( expectation.code instanceof Array );

          code.forEach( function( element, index) {
            code[index] = element.trim();
            if (index == code.length - 1) {
              var expected = expectation.code.toString()
                , received = code.toString();
              assert.deepEqual( received, expected );  
            }
          } );
        }
        else {
          assert.deepEqual( code.trim(), expectation.code.trim() );
        }
      }
      
      if (expectations.length) {
        instance.once( expectations[0].event, check );
      }
    }
  }; 
}  

util.inherits( Emitter, EventEmitter ); 

module.exports.Test = {
  Emitter: Emitter,
  finalLog: function( msg ) {
      process.on( 'exit', function() {
        console.log( msg );
      } );
    }, 
}
