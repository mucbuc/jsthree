#!/usr/bin/env node

var assert = require( 'assert' )
  , events = require( 'events' )
  , DirScout = require( './../lib/dirscout' ).DirScout;

assert( DirScout );

testGetList();

function testGetList() {
	var emitter = new events.EventEmitter()
	  , passed = false;
	
	emitter.on( 'ls', function( data ) {
	
		if (data.toString() === [ 'test_dummy.txt' ].toString() ) {
			passed = true;
			console.log( 'dirscout test passed' );
		}
	} );

	process.on( 'exit', function() { 
		assert( passed );
	} );

	DirScout.getList( emitter, 'sample' );
}

