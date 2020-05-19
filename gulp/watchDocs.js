const gulp = require( 'gulp' );
const browserSync = require( 'browser-sync' ).create();
const dirs = require( './dirs' );
const createDocs = require( `./createDocs` );
exports.createDocs = createDocs;

// browsersync reload function
function reload( done ) {
    browserSync.reload();
    done();
}

// documentation
function watchDocs() {
    return (
        gulp.watch(
            dirs.src.js,
            gulp.series(
                createDocs,
                reload
            )
        )
    );
}

module.exports = watchDocs;