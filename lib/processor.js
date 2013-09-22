var cp = require( 'child_process' )
  , EventStream = require( 'mucbuc-jsbag' ).EventStream;

function Processor() {
  
  var instance = this;

  EventStream.call( instance );

  instance.on( 'exec', function( cmd, cwd ) {
       
    var sp = cp.exec( cmd, {cwd: cwd}, function() { 
      instance.onTickEmit( 'exit' ); 
      instance.tick();
    } );

    sp.stdout.on( 'data', function( data ) { 
      instance.onTickEmit( 'out', data );
    } );
  } );

  Processor.prototype = new EventStream();
}

exports.Processor = Processor;