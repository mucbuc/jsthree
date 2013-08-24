var fs = require( 'fs' )
  , path = require( 'path' );

var walk = function( dir, onDone, onDir, onFile, onError ) {
	fs.readdir( dir, function( err, list ) {
		
		if (err) {
			handleError( dir, err );
		}
		else if (list.length) {
		
			var counter = list.length  
			  , decCounter = function() {
					if (!--counter)
						onDone();
				}; 
			
			list.forEach( function( file ) {
				var sub = path.join( dir, file );
				fs.stat( sub, function( err, stat ) {
					if (err) {
						handleError( sub, err );
					}
					else if (stat && stat.isDirectory()) {
						onDir( sub, decCounter );
					}
					else {
						if (typeof onFile != 'undefined') {
							onFile( sub ); 
					 	}
					 	decCounter();
					}
				} ); 
			} ); 
		}
		else {
			onDone();
		}

		function handleError( dir, err ) {
			if (typeof onError != 'undefined') {
				onError( dir , err );
			}
			else {
				throw err;
			}
		}
	} ); 
};

exports.walk = walk;