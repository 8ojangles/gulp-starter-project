const gulp = require( 'gulp' );
const del = require( 'del' );
const log = require( 'fancy-log' );
const dirs = require( '../gulp/dirs' );

// move html
function createGHPages(){
	return (
		gulp
			.src( `./dist/**/*` )
			.pipe( gulp.dest( './gh-pages' ) )
			.on( "end", function() { log.info( 'GH Pages created' ) } )
	);
};

// expose task to cli	
module.exports = createGHPages;