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
const compileTestJs = require( `${ dirGulp }/compileJs` ).compileTestJs;
const compileHtml = require( `${ dirGulp }/compileHtml` );
const moveHtml = require( `${ dirGulp }/moveHtml` );
const vendorJs = require( `${ dirGulp }/vendorJs` );
const sass = require( `${ dirGulp }/sass` );
const moveFonts = require( `${ dirGulp }/moveFonts` );
const moveImages = require( `${ dirGulp }/moveImages` );
const createScssVars = require( `${ dirGulp }/compileScssFromTokens` ).createScssVars;
const createColorScssMap = require( `${ dirGulp }/compileScssFromTokens` ).createColorScssMap;
const moveData = require( `${ dirGulp }/moveData` );
const createDocs = require( `${ dirGulp }/createDocs` );
const tests = require( `${ dirGulp }/tests` );

// Kitchensink specific
const ksVendorJs = require( `${ dirGulp }/ksVendorJs` );
const ksVendorCss = require( `${ dirGulp }/ksVendorCss` );
const moveCodeExamples = require( `${ dirGulp }/moveCodeExamples` );

exports.createColorScssMap = createColorScssMap;
exports.createScssVars = createScssVars;

// browsersync reload function
function reload( done ) {
    browserSync.reload();
    done();
}

function watchFiles() {

	gulp.watch( dirs.src.scss , sass );
    gulp.watch( dirs.dist.css ).on('change', function ( e ) {
        return gulp.src( dirs.dist.css )
            .pipe( browserSync.stream() );
    });
    gulp.watch( dirs.src.ks.codeExamples, gulp.series( compileHtml, moveCodeExamples, reload ) );
    gulp.watch( dirs.src.images, gulp.series( moveImages, reload ) );
    gulp.watch( dirs.src.images, gulp.series( moveImages, reload ) );
    gulp.watch( dirs.src.js, gulp.series( compileJs, compileTestJs, createDocs, reload ) );
    gulp.watch( dirs.src.templates, gulp.series( compileHtml, moveHtml, reload ) );
    gulp.watch( dirs.src.data, gulp.series( compileHtml, moveHtml, reload ) );
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

// kitchenSink
const ksVendor = gulp.parallel( ksVendorCss, ksVendorJs );
exports.ksVendor = ksVendor;

// build task
const build = gulp.series(
	gulp.series( clean ), 
	gulp.parallel(
        ksVendor,
        moveCodeExamples,
        vendorJs,
        compileTestJs,
        compileJs,
        gulp.series( compileHtml, moveHtml ),
        moveFonts,
        moveImages,
        moveData,
        sass
    ),
    gulp.series( tests, createDocs )
);

// expose task to cli
exports.build = build;

// test task
exports.tests = tests;

// default task
gulp.task( 'default', gulp.series( build, watch ) );