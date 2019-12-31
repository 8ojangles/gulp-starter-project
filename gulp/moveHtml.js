const gulp = require( 'gulp' );
const log = require( 'fancy-log' );
const dirs = require( '../gulp/dirs' );

// move html
function moveHtml(){
	return (
		gulp
			.src( `${ dirs.srcDir }/*.html` )
			.pipe( gulp.dest( dirs.dist.html ) )
			.on( "end", function() { log.info( 'html moved' ) } )
	);
};

// expose task to cli	
module.exports = moveHtml;