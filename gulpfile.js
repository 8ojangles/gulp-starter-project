// Base imports
const gulp = require( 'gulp' );
const notify = require('gulp-notify');
const browserSync = require( 'browser-sync' ).create();
const mocha = require('gulp-mocha');
const bsOpts = require( './gulp/browsersyncOptions.js' );

// Directories
const dirs = require( './gulp/dirs' ).dirs;

// Tasks
const clean = require( './gulp/cleanDirs' ).clean;
const compileJs = require( './gulp/compileJs' ).compileJs;
const compileHtml = require( './gulp/compileHtml' ).compileHtml;
const moveHtml = require( './gulp/moveHtml' ).moveHtml;
const vendorJs = require( './gulp/vendorJs' ).vendorJs;
const sass = require( './gulp/sass' ).sass;
const moveData = require( './gulp/moveData' ).moveData;
const createDocs = require( './gulp/createDocs' ).createDocs;
const tests = require( './gulp/tests' ).tests;

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
    		notify( {message: "Localhost started "} );
    		console.log( "Localhost started" );
    	}
    );

	browserSync.init( bsOpts );
    browserSync.reload();
    watchFiles();
}
    
// expose task to cli
exports.watch = watch;



// // testing
// function tests() {
// 	return (
// 		gulp
// 			.src( './test/tests.js', { read: false } )
// 			.pipe( mocha( {reporter: 'nyan' } ) )
// 	);
// }

// // expose task to cli
// exports.tests = tests;


const build = gulp.series(
	gulp.series( clean ), 
	gulp.parallel( vendorJs, compileJs, compileHtml, moveHtml, moveData, sass ),
    gulp.series( tests, createDocs )
);

// build task
exports.build = build;

// expose task to cli
exports.tests = tests;

gulp.task( 'default', gulp.series( build, watch ) );