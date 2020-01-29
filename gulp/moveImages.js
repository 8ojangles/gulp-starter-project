const gulp = require( 'gulp' );
const log = require( 'fancy-log' );
const dirs = require( '../gulp/dirs' );

// move html
function moveImages(){
	return (
		gulp
			.src( `${ dirs.src.images }` )
			.pipe( gulp.dest( dirs.dist.images ) )
			.on( "end", function() { log.info( 'Images moved' ) } )
	);
};

// expose task to cli	
module.exports = moveImages;