#!/usr/bin/env node

var assert = require( 'assert' )
  , Test = require( '../lib/test' ).Test
  , TestEmitter = Test.Emitter
  , Tokenizer = require( './../main' ).Tokenizer;

assert( typeof Tokenizer !== 'undefined' );

checkTokenizer();

function checkTokenizer() {
  var emitter = new TestEmitter();

  test( testDummyCode );
  test( testTwoMatches );

  function testTwoMatches( emitter, tokenizer ) {
    tokenizer.match( ';', 'statement' );
    tokenizer.match( '\\(', 'open' );
    emitter.expect( 'open' );
    emitter.expect( 'statement' );
    tokenizer.process( '(;' );
  }

  function testDummyCode( emitter, tokenizer ) {
    tokenizer.match( ';', 'statement' );
    emitter.expect( 'statement' );
    tokenizer.process( ';' );
  }

  function test( f ) {
    process.on( 'exit', function() {
      console.log( f.name + ' passed' );
    } );

    f( emitter, new Tokenizer( emitter ) );
  }
}
