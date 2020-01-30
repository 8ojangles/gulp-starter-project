const gulp = require( 'gulp' );
const concat = require( 'gulp-concat' );
const dirs = require( '../gulp/dirs' );
const debug = require('gulp-debug');
const using = require('gulp-using');
const notify = require('gulp-notify');

// concatenate vendor libraries
function ksVendorJs(){
	return (
		gulp
			.src( dirs.src.ks.vendorJsLibs )
			.pipe( debug() )
			.pipe( using( { color: 'cyan' } ) )
			.pipe( concat( 'ksVendor.js' ) )
    		.pipe( gulp.dest( dirs.dist.js ) )
	);
}

// expose task to cli	
module.exports = ksVendorJs;