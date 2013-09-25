var cp = require( 'child_process' )
  , stream = require( 'stream' );

function Processor( args, emitter ) {
  
  emitter.on( 'execute', init ); 

  function init() {

    var child = cp.spawn( args.cmd, args.args, { cwd: args.cwd, stdio: [ 'pipe', 'pipe', 'pipe' ] } );
    
    // error evetn
    child.on( 'error', function() {
      emitter.emit( 'child_error' );
    } );

    // error stream
    child.stderr.on( 'data', function( data ) {
      emitter.emit( 'child_error', data );
    } );

    // output
    child.stdout.on( 'data', function( data ) {
      emitter.emit( 'read', data );
    } );

    // input
    emitter.on( 'write', onWrite );
    
    // exit
    child.on( 'exit', function() { 
      emitter.removeListener( 'write', onWrite );
      emitter.emit( 'exit' );
    } );

    function onWrite( data ) {
      child.stdin.write( data );
    }
  }
}

exports.Processor = Processor;
