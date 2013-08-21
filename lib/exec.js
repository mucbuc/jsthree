var cp = require( 'child_process' );

function exec( cmd, done ) {
  var p = cp.exec( cmd, [], function( err, stdout, stderr ) {
        if (err)
          console.error( stderr ); 
      } ); 
  console.log( ':exec$ ' + cmd ); 
  p.stdout.on( 'data', function( data ) { 
    process.stdout.write( data ); 
  } );
  if (typeof done != 'undefined')
    p.on( 'exit', done ); 
  return p;
}

exports.exec = exec;