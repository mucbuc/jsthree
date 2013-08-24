var cp = require( 'child_process' );

function exec( cmd, cwd, done ) {
  var p = cp.exec( cmd, { cwd: cwd }, function( err, stdout, stderr ) {
    if (err)
      console.error( stderr ); 
  } ); 
  p.stdout.on( 'data', function( data ) { 
    process.stdout.write( data ); 
  } );
  if (typeof done != 'undefined')
    p.on( 'exit', done ); 
  return p;
}

exports.exec = exec;