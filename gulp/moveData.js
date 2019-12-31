const gulp = require( 'gulp' );
const dirs = require( '../gulp/dirs' );

// move data
function moveData(){
	return (
		gulp
			.src( dirs.src.data )
    		.pipe( gulp.dest( dirs.dist.data ) )
	);
}

// expose task to cli	
module.exports = moveData;