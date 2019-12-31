// Base imports
const gulp = require( 'gulp' );
const notify = require('gulp-notify');
const browserSync = require( 'browser-sync' ).create();
const bsOpts = require( './gulp/browsersyncOptions.js' );

// Directories
const dirs = require( './gulp/dirs' );
const dirGulp = dirs.gulp;
// Tasks
const clean = require( `${ dirGulp }/cleanDirs` );
const compileJs = require( `${ dirGulp }/compileJs` );
const compileHtml = require( `${ dirGulp }/compileHtml` );
const moveHtml = require( `${ dirGulp }/moveHtml` );
const vendorJs = require( `${ dirGulp }/vendorJs` );
const sass = require( `${ dirGulp }/sass` );
const moveData = require( `${ dirGulp }/moveData` );
const createDocs = require( `${ dirGulp }/createDocs` );
const tests = require( `${ dirGulp }/tests` );

// browsersync reload function
function reload( done ) {
    browserSync.reload();
    done();
}

function watchFiles() {
	gulp.watch( dirs.src.scss , sass );
    gulp.watch( dirs.src.js, gulp.series( compileJs, reload ) );
    gulp.watch( dirs.src.templates, gulp.series( compileHtml, reload ) );
}

// browsersync file watcher
function watch(){
	browserSync.emitter.on(
    	'init',
    	function(){
    		notify( {message: "Localhost started" } );
    		console.log( "Localhost started" );
    	}
    );

	browserSync.init( bsOpts );
    browserSync.reload();
    watchFiles();
}
    
// expose task to cli
exports.watch = watch;

// build task
const build = gulp.series(
	gulp.series( clean ), 
	gulp.parallel( vendorJs, compileJs, compileHtml, moveHtml, moveData, sass ),
    gulp.series( tests, createDocs )
);

// expose task to cli
exports.build = build;

// test task
exports.tests = tests;

// default task
gulp.task( 'default', gulp.series( build, watch ) );