var fs = require( 'fs' ); 

var walk = function( path, onDone, onDir, onFile ) {
	fs.readdir( path, function( err, list ) {
		
		if (err) throw err;

		if (list.length) {
		
			var counter = list.length  
			  , decCounter = function() {
						if (!--counter)
							onDone();
					}; 
			
			list.forEach( function( file ) {
				var sub = path + "/" + file; 
				fs.stat( sub, function( err, stat ) {
					if (err) throw err;
					if (stat && stat.isDirectory()) {
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
	} ); 
};

exports.walk = walk;
				