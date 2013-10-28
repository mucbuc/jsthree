#!/usr/bin/env node

var assert = require( 'assert' )
  , Processor = require( './../lib/processor' ).Processor
  , path = require( 'path' )
  , stream = require( 'stream' )
  , cp = require( 'child_process' )
  , events = require( 'events' );

assert( typeof Processor != 'undefined' );

function fail() {
	assert( false );
}

checkError();
checkOut();
checkIn();
checkKill();

function checkKill() {
	var e = getDummy();

	e.on( 'exit', function() { 
		console.log( 'check kill passed' );
	} );

	e.emit( 'execute' );
	e.emit( 'kill' );	
}

function checkIn() {
	var e = getDummy();

  e.emit( 'execute' );
  e.emit( 'write', 'a\n' );
  e.on( 'exit', function() { 
  	console.log( 'check in passed' );
  } );
}

function getDummy() {
	var e = new events.EventEmitter()
		, wd = path.join( __dirname, 'bin' )
	  , p = new Processor( { cmd: "./dummy_read", cwd: wd }, e );

	return e;
}

function checkOut() {

	var e = new events.EventEmitter()
	  , wd = path.join( __dirname, 'sample' )
		, p = new Processor( { cmd: 'ls', cwd: wd }, e );

	e.on( 'read', function( data ) {
		assert( data.toString().trim() == 'test_dummy.txt' );
		process.removeListener( 'exit', fail );
		console.log( 'check out passed' );
	} );

	process.on( 'exit', fail );

	e.emit( 'execute' );
}

function checkError() {
	
	var e = new events.EventEmitter()
	  , p = new Processor( { cmd: 'cat', args: [ 'doesNotExist.txt' ], cwd: __dirname }, e )
	  , pass = false;

	e.on( 'child_error', function( data ) {
		assert( typeof data !== 'undefined' && data.length );
		pass = true;
	} );

	e.on( 'read', function( data ) { 
		assert( false );
	} );

	process.on( 'exit', function(code, signal) {
		assert( code === 0 );	
		assert( typeof signal === 'undefined' ); 
		assert( pass );
		console.log( 'check error passed' );
	} );

	e.emit( 'execute' );
}
