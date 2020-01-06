const gulp = require( 'gulp' );
const scss = require( 'gulp-dart-sass' );
const cssnano = require( 'cssnano' );
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemaps = require( 'gulp-sourcemaps' );
const dirs = require( '../gulp/dirs' );
const plumbError = require( '../gulp/errorReporting' ).plumbError;

// SASS compliation
// - compile
// - postCss
// - - autoprefix
// - - minifiy
// - write sourcemaps
function sass(){
	return (
        gulp
	        .src( dirs.src.scss )
	        .pipe( plumbError() )
	        .pipe( scss() )
	        .on( "error", scss.logError )
            .pipe( postcss( [ autoprefixer(), cssnano() ] ) )
            .pipe( sourcemaps.write() )
	        .pipe( gulp.dest( dirs.dist.css ) )
    );
}

// expose task to cli	
module.exports = sass;