const gulp = require( 'gulp' );
const log = require( 'fancy-log' );
const browserify = require( 'browserify' );
const source = require( 'vinyl-source-stream' );
const plumbError = require( '../gulp/errorReporting' ).plumbError;
const notify = require('gulp-notify');
const dirs = require( '../gulp/dirs' );

// helper task
// converst es6 imports to commonJs


// browserify js

function compileJs(){
	return (
		browserify({
    		entries: dirs.src.jsBundleEntry,
    		debug: true,
    		transform: ['babelify']
  		})
		.bundle()
		.pipe( plumbError() )
		// .on( 'error', err => {
		// 	log.error( "Browserify js compile error:" + err.message )
		// })
		.pipe( source( 'scripts.js' ) )
		// .pipe( buffer() )
		// .pipe( uglify() )
		// .pipe( sourcemaps.init( { loadMaps: true } ) )
		// .pipe( sourcemaps.write( './maps') )
		.pipe( gulp.dest( dirs.dist.js ) )
	);
};

// expose task to cli	
module.exports = compileJs;

function compileTestJs(){
	return (
		browserify({
    		entries: `${dirs.srcDir}/js/lightningTest.js`,
    		debug: true,
    		transform: ['babelify']
  		})
		.bundle()
		.pipe( plumbError() )
		// .on( 'error', err => {
		// 	log.error( "Browserify js compile error:" + err.message )
		// })
		.pipe( source( 'lightningTest.js' ) )
		// .pipe( buffer() )
		// .pipe( uglify() )
		// .pipe( sourcemaps.init( { loadMaps: true } ) )
		// .pipe( sourcemaps.write( './maps') )
		.pipe( gulp.dest( dirs.dist.js ) )
	);
};

// expose task to cli	
module.exports = compileJs;
module.exports.compileTestJs = compileTestJs;