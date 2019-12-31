const gulp = require( 'gulp' );
const mocha = require('gulp-mocha');
const dirs = require( './dirs' );

// testing
function tests() {
	return (
		gulp
			.src( dirs.src.tests, { allowEmpty: true, read: false } )
			.pipe(
				mocha( { reporter: 'nyan' } )
			)
	)
}

// expose task to cli
module.exports = tests;