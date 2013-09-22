#!/usr/bin/env node

var assert = require( 'assert' )
  , Processor = require( './../lib/processor' ).Processor
  , path = require( 'path' );

assert( typeof Processor != 'undefined' );

checkOut();

function checkOut() {

	var p = new Processor()
	  , result = ''
	  , cwd = path.join( __dirname, 'sample' );

	p.on( 'out', function( data ) { 
		result += data; 
	} );

	p.on( 'exit', function() {
		console.log( result );
		assert( result.trim() == 'test_dummy.txt' );
		console.log( 'checkOut passed' );
	} );

	p.onTickEmit( 'exec', 'ls', cwd );
	p.tick();
}