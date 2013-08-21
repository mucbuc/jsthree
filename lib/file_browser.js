var fs = require( 'fs' ); 

var walk = function( dir, action, done ) {
	fs.readdir( dir, function( err, list ) {
		
		if (err) throw err; 
		
		if (!list.length)
			return done(); 
	
		var counter = list.length;
		var dec_counter = function() {
			if (!--counter)
				done();
		}; 
		
		list.forEach( function( file ) {
			var path = dir + "/" + file; 
			fs.stat( path, function( err, stat ) {
				if (stat && stat.isDirectory())
					walk( path, action, dec_counter ); 
				else 
				{
					action( path ); 
				 	dec_counter();
				}
			} ); 
		} ); 
	
	} ); 
};

exports.walk = walk;
				