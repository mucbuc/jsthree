#!/usr/bin/env node

var cp = require( 'child_process' );

cp.fork( 'test_processor' );
cp.fork( 'test_dirscout' );
cp.fork( 'parser' );