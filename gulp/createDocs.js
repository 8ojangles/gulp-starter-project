const gulp = require( 'gulp' );
const docs = require('gulp-documentation');
const dirs = require( './dirs' );

// documentation
function createDocs() {
    return (
        gulp.src( dirs.src.js )
            .pipe( docs( 'html', {}, {
                name: 'gulp-starter-project',
                version: '1.0.0'
            }))
            .pipe( gulp.dest( dirs.dist.docs ) )
    );
}

module.exports = createDocs;