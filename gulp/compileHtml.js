const gulp = require( 'gulp' );
const nunjucksRender = require('gulp-nunjucks-render');
const plumbError = require( '../gulp/errorReporting' ).plumbError;
const dirs = require( '../gulp/dirs' );

// compile templates (nunjucks)
function compileHtml(){
	return (
		gulp
			.src( dirs.src.templates )
			.pipe( plumbError() )
			.pipe(
				nunjucksRender(
				 { path: 'src/templates/' }
				)
			)
		    .pipe( gulp.dest( dirs.dist.html ) )
	);
};

// expose task to cli	
module.exports = compileHtml;