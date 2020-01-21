// node modules
let nodeModules = './node_modules';

let gulpDir = './gulp';

// vendor libraries
let vendorLibs = [
	`${nodeModules}/jquery/dist/jquery.min.js`,
	`src/js/rafPolyfill.js`
];



// SOURCE directory top level
let srcDir = 'src';

// src files
let src = {
	html: [ './*.html' ],
	templates: [ `${ srcDir }/templates/pages/*.njk`, `${ srcDir }/templates/pages/*.html`, `${ srcDir }/templates/templateConfiguration/*.html`, `${ srcDir }/templates/templateConfiguration/*.njk` ],
	jsBundleEntry: [ `${ srcDir }/js/entry.js` ],
	js: [ `${ srcDir }/js/**/*.js` ],
	scssEntry: [ `${ srcDir }/scss/main.scss` ],
	scss: [ `${ srcDir }/scss/**/*.scss` ],
	data: [ `${ srcDir }/data/**/*.json` ],
	tests: [ `./tests/**/*.js` ]
};


// DISTRIBUTION directory top level
let distDir = './dist/';

// dist folders
let dist = {
	html: [ `${ distDir }/` ],
	js: [ `${ distDir }js/` ],
	css: [ `${ distDir }css/` ],
	data: [ `${ distDir }data/` ],
	docs: [ `${ distDir }docs/` ]
};



// directory collection
let dirs = {
	nodeModules : nodeModules,
	vendorLibs: vendorLibs,
	srcDir: srcDir,
	src: src,
	distDir: distDir,
	dist: dist,
	gulp: gulpDir
}


// export dirs
module.exports = dirs;