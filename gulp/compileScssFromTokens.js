const gulp = require('gulp');
const theo = require('gulp-theo');
const concat = require('gulp-concat');

function createColorScssMap() {
	return (
		gulp.src('./src/data/design-tokens/colors.json')
			.pipe(theo({
				transform: { type: 'raw' },
				format: { type: 'map.scss' }
		    }))
		    .pipe(concat('colorMap.scss'))
			.pipe(gulp.dest('./src/scss'))
	);
}

function createScssVars() {
	return (
		gulp.src('./src/data/design-tokens/app.json')
			.pipe(theo({
				transform: { type: 'web' },
				format: { type: 'map.scss' }
		    }))
			.pipe(gulp.dest('./src/scss'))
	);
}

// expose task to cli
module.exports.createColorScssMap = createColorScssMap;
module.exports.createScssVars = createScssVars;
