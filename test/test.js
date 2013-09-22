#!/usr/bin/env node

var assert = require( 'assert' )
  , Processor = require( './../lib/processor' ).Processor;

assert( typeof Processor != 'undefined' );

checkOut();

function checkOut() {

	var p = new Processor()
	  , result = '';

	p.on( 'out', function( data ) { 
		result += data; 
	} );

	p.on( 'exit', function() {
		assert( result.trim() == 'test.js' );
		console.log( 'checkOut passed' );
	} );

	p.onTickEmit( 'exec', 'ls', __dirname );
	p.tick();
}