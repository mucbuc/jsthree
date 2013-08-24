var fs = require( 'fs' ); 

var walk = function( path, onDone, onDir, onFile, onError ) {
	fs.readdir( path, function( err, list ) {
		
		if (err) {
			handleError( path, err );
		}
		else if (list.length) {
		
			var counter = list.length  
			  , decCounter = function() {
					if (!--counter)
						onDone();
				}; 
			
			list.forEach( function( file ) {
				var sub = path + "/" + file; 
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

		function handleError( path, err ) {
			if (typeof onError != 'undefined') {
				onError( path, err );
			}
			else {
				throw err;
			}
		}
	} ); 
};

exports.walk = walk;
				