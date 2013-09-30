/* objective:
	send path list (look ahead info)
	watch for changes
	file/path stats/idle process
*/

var js3 = require( './walk')
	, path = require('path');

var DirScout = {

	getList: function( emitter, dir ) {

		var pathList = [];

		try {
			js3.walk( dir, onDone, onDir, onFile, onError ); 
		} 
		catch( err ) {
			onError( err );
		}

		function onError( error ) {
			console.log( error );
			emitter.emit( 'err', error );
		}

		function onDone() {
			emitter.emit( 'ls', pathList );
		}

		function onDir( dir, next ) {
			pathList.push( path.basename( dir ) );
			next();
		}

		function onFile( dir ) {
			pathList.push( path.basename( dir ) );
		}
	}
};

exports.DirScout = DirScout;