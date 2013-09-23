#!/usr/bin/env node

var assert = require( 'assert' )
  , Processor = require( './../lib/processor' ).Processor
  , path = require( 'path' )
  , stream = require( 'stream' )
  , cp = require( 'child_process' );

assert( typeof Processor != 'undefined' );


//checkOut();
checkStdin(); 

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
}