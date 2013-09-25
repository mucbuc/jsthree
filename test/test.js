#!/usr/bin/env node

var assert = require( 'assert' )
  , Processor = require( './../lib/processor' ).Processor
  , path = require( 'path' )
  , stream = require( 'stream' )
  , cp = require( 'child_process' )
  , events = require( 'events' );

assert( typeof Processor != 'undefined' );

checkError();
checkOut();

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

	function fail() {
		assert( false );
	}
}

function checkError() {
	
	var e = new events.EventEmitter()
	  , p = new Processor( { cmd: 'cat', args: [ 'doesNotExist.txt' ], cwd: __dirname }, e )
	  , pass = false;

	e.on( 'child_error', function( data ) {
		console.log( data.toString() );
		pass = true;
	} );

	e.on( 'read', function( data ) { 
		assert( false );
	} );

	process.on( 'exit', function() {
		assert( pass );
		console.log( 'check error passed' );
	} );

	e.emit( 'execute' );
}


//checkOut();
//checkStdin(); 

function checkStdin() {

	var shell = cp.spawn( 'node | cat' ); //, [], { stdio: 'inherit' } );

	process.stdin.resume();
	process.stdin.pipe( shell.stdin );
	
	shell.stdout.pipe( process.stdout );

	// process.stdin.on( 'data', function( data ) {
	// 	//console.log( '*', data );
	// } );

	// shell.stdout.on( 'data', function( data ) {
	// 	process.stdout.write( data );
	// } );

	// process.stdin.resume();
	// process.stdin.on( 'data', function( data ) {
	// 	console.log( '****', data );
	// 	shell.stdin.write( data );
	// } );

	// shell.stdout.on( 'data', function( data ) { 
	// 	console.log( '%%%%', data );
	// 	process.stdout.write( data );
	// } );
	
	//, {end: false} );
	
	// shell.stdout.pipe( process.stdout );


	// process.stdin.resume();
	// process.stdin.pipe( shell.stdin );

	// shell.stdin.on( 'end', function() {
	// 	process.write( 'stream ended' );
	// } );

	// shell.on( 'exit', function() { process.exit(); } );
}
/*
function checkOut() {

	var p = new Processor()
	  , result = ''
	  , cwd = path.join( __dirname, 'sample' );

    setInterval( p.tick, 100 );

	p.on( 'out', function( data ) {
		result += data; 
		process.stdout.write( data );
	} );

	process.on( 'exit', fail );
	
	p.on( 'exit', function() {
		assert( result.trim() == 'test_dummy.txt' );
		console.log( 'checkOut passed' );
		process.removeListener( 'exit', fail );
		clearInterval( p.tick );
	} );

	p.onTickEmit( 'exec', 'sudo', cwd );

	function fail() {
		assert( false );
	}
}*/