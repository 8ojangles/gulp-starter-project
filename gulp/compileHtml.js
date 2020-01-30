const gulp = require( 'gulp' );
const fs = require( 'file-system' );
const data = require( 'gulp-data' );
const nunjucksRender = require('gulp-nunjucks-render');
const plumbError = require( '../gulp/errorReporting' ).plumbError;
const debug = require('gulp-debug');
const using = require('gulp-using');
const beautify = require('gulp-jsbeautifier');
const dirs = require( '../gulp/dirs' );

// compile templates (nunjucks)
function compileHtml(){
	return (
		gulp
			.src( dirs.src.pages )
			.pipe( plumbError() )
			.pipe( 
				data( 
					function( file ) {
			    		return JSON.parse( fs.readFileSync( './src/data/kitchensink.json' ) );
			 		}
			 	)
			 )
			.pipe( debug() )
			.pipe( using( { color: 'cyan' } ) )
			.pipe(
				nunjucksRender(
					{ 
					 	path: [
					 		'src/templates/',
					 		'srcKitchensink'
					 	]
	    			}
				)
			)
			.pipe( 
				beautify( {
					html: {
						max_preserve_newlines: 1
					}
				} )
			)
		    .pipe( gulp.dest( dirs.dist.html ) )
	);
};

// expose task to cli	
module.exports = compileHtml;