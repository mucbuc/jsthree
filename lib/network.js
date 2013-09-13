var os = require( 'os' );

var Network = { 
	getLocalIP: function ( done ) {
		var interfaces = os.networkInterfaces();  
		for( var iface in interfaces) {
			interfaces[ iface ].forEach( function( details ) { 
				if (details.family=='IPv4') {
					var address = details.address;
					if (address != '127.0.0.1') {
						done( address );	
					}
				}
			} );
		}
	}
};