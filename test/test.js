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

	process.on( 'exit', fail );
	p.on( 'exit', function() {
		assert( result.trim() == 'test_dummy.txt' );
		console.log( 'checkOut passed' );
		process.removeListener( 'exit', fail );
	} );

	p.onTickEmit( 'exec', 'ls', cwd );
	p.tick();

	function fail() {
		assert( false );
	}
}