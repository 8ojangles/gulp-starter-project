const gulp = require( 'gulp' );
const log = require( 'fancy-log' );
const dirs = require( '../gulp/dirs' );

// move html
function moveCodeExamples(){
	return (
		gulp
			.src( dirs.src.ks.codeExamples )
			.pipe( gulp.dest( `${dirs.distDir}/codeExamples` ) )
			.on( "end", function() { log.info( 'Code Examples moved' ) } )
	);
};

// expose task to cli	
module.exports = moveCodeExamples;