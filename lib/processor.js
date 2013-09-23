var cp = require( 'child_process' )
  , EventStream = require( 'mucbuc-jsbag' ).EventStream
  , stream = require( 'stream' );

function Processor() {
  
  var instance = this;

  EventStream.call( instance );

  instance.on( 'exec', function( cmd, cwd ) {
       
    var p = cp.spawn( cmd, [], { cwd: cwd, stdio: [ 'pipe', 'pipe', process.stderr ] } );
    
    process.stdin.pipe( p.stdin, { end: false } );

    p.on( 'exit', function() { 
      instance.onTickEmit( 'exit' ); 
    } );

    p.stdout.on( 'data', function( data ) { 
      instance.onTickEmit( 'out', data );
    } );

  } );

  Processor.prototype = new EventStream();
}

exports.Processor = Processor;


/*

    p.stdin.on( 'data', function( data ) {}    

    process.stdin.on( 'data', function( data ) {
      var r = p.stdin.write( data );
      if (!r) {
        p.stdin.pause();
        process.stdin.once( 'drain', function() {
          p.stdin.resume();    
        } );
      }
    } );

    process.stdin.on( 'end', function() {
      p.stdin.end();
    } );
    instance.on( 'in', function( data ) {
      p.stdin.write( data );
    } );
*/
    
    //p.stdout.pipe( process.stdout );