const gulp = require( 'gulp' );
const concat = require( 'gulp-concat' );
const dirs = require( '../gulp/dirs' );

// concatenate vendor libraries
function vendorJs(){
	return (
		gulp
			.src( dirs.vendorLibs )
			.pipe( concat( 'vendor.js' ) )
    		.pipe( gulp.dest( dirs.dist.js ) )
	);
}

// expose task to cli	
module.exports = vendorJs;