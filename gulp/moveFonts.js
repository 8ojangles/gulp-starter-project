const gulp = require( 'gulp' );
const log = require( 'fancy-log' );
const dirs = require( '../gulp/dirs' );

// move html
function moveFonts(){
	return (
		gulp
			.src( `${ dirs.src.fonts }/*` )
			.pipe( gulp.dest( dirs.dist.fonts ) )
			.on( "end", function() { log.info( 'Fonts moved' ) } )
	);
};

// expose task to cli	
module.exports = moveFonts;