const gulp = require( 'gulp' );
const concat = require( 'gulp-concat' );
const dirs = require( '../gulp/dirs' );
const debug = require('gulp-debug');
const using = require('gulp-using');
const notify = require('gulp-notify');

// concatenate vendor libraries
function ksVendorCss(){
	return (
		gulp
			.src( dirs.src.ks.vendorCssLibs )
			.pipe( debug() )
			.pipe( using( { color: 'cyan' } ) )
			.pipe( concat( 'ksVendor.css' ) )
    		.pipe( gulp.dest( dirs.dist.css ) )
	);
}

// expose task to cli	
module.exports = ksVendorCss;