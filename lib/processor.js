var cp = require( 'child_process' )
  , EventStream = require( 'mucbuc-jsbag' ).EventStream
  , stream = require( 'stream' );

function Processor() {
  
  var instance = this;

  EventStream.call( instance );

  instance.on( 'exec', function( cmd, cwd ) {
       
    var sp = cp.spawn( cmd, [], { cwd: cwd, stdio: [ process.stdin, 'pipe', process.stderr ] } );

    sp.on( 'exit', function() { 
       instance.onTickEmit( 'exit' ); 
       instance.tick();
    } );

    sp.stdout.on( 'data', function( data ) { 
        instance.onTickEmit( 'out', data );
    } );

    //sp.stdout.pipe( process.stdout );

  } );

  Processor.prototype = new EventStream();
}

exports.Processor = Processor;