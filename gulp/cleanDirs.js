const del = require( 'del' );
const dirs = require( '../gulp/dirs' );
const notify = require('gulp-notify');

// clean dist folders
function clean(){
	return (
		del( [ dirs.distDir ] )
		.then( ()=> notify({ message: "Distribution folders cleaned" }) )
	);
};

// expose task to cli	
module.exports = clean;