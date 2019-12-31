////////////////////////////////////////////////////
// ToDo
////////////////////////////////////////////////////
// - compileJs
// - - buffer
// - - uglify
// - - sourcemaps
// - - linting
// - - es6?
////////////////////////////////////////////////////

const gulp = require( 'gulp' );
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const babelify = require( 'babelify' );
const browserify = require( 'browserify' );
const browserSync = require( 'browser-sync' ).create();
const log = require( 'fancy-log' );
const nunjucksRender = require('gulp-nunjucks-render');
const concat = require( 'gulp-concat' );
const scss = require( 'gulp-dart-sass' );
const sourcemaps = require( 'gulp-sourcemaps' );
const cssnano = require( 'cssnano' );
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const uglify = require( 'gulp-uglify' );
const buffer = require( 'vinyl-buffer' );
const source = require( 'vinyl-source-stream' );
const del = require( 'del' );
const mocha = require('gulp-mocha');

const bsOpts = require( './gulp/browsersyncOptions.js' );
// directories
const dirs = require( './gulp/dirs' ).dirs;

// TASKS
const clean = require( './gulp/cleanDirs' ).clean;
const compileJs = require( './gulp/compileJs' ).compileJs;
const compileHtml = require( './gulp/compileHtml' ).compileHtml;
const moveHtml = require( './gulp/moveHtml' ).moveHtml;
const vendorJs = require( './gulp/vendorJs' ).vendorJs;
const sass = require( './gulp/sass' ).sass;
const moveData = require( './gulp/moveData' ).moveData;


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



// testing
function tests() {
	return (
		gulp
			.src( './test/tests.js', { read: false } )
			.pipe( mocha( {reporter: 'nyan' } ) )
	);
}

// expose task to cli
exports.tests = tests;

const build = gulp.series(
	gulp.series( clean ), 
	gulp.parallel( vendorJs, compileJs, compileHtml, moveHtml, moveData, sass )
);

// build task
exports.build = build;

gulp.task( 'default', gulp.series( build, watch ) );