const gulp = require( 'gulp' );
const mocha = require('gulp-mocha');
const dirs = require( './dirs' ).dirs;

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
exports.tests = tests;