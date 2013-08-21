var app = { 
  execute: function() {
    console.log( 'hello' ); 
  }, 
  cleanup: function() { 
  	console.log( 'see ya' ); 
  },  
  printHelp: function() {
    console.log( 'do what?' ); 
  }, 
  parseArgs: function( args ) { 
    args.forEach( function( arg ) { 
      switch (arg) {
        case '-h': case '--help':
          app.printHelp(); 
          process.exit( 0 ); 
          break;
      }
    } ); 
  }, 
};   

process.on( 'SIGINT', app.cleanup ); 
app.parseArgs( process.argv ); 
app.execute(); 
