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
let templatDir = `${ srcDir }/templates/`;


// src files
let src = {
	html: [ './*.html' ],
	templates: [ 
		`${ templatDir }pages/*.njk`,
		`${ templatDir }pages/*.html`,
		`${ templatDir }templateConfiguration/*.html`,
		`${ templatDir }templateConfiguration/*.njk`
	],
	jsBundleEntry: [ `${ srcDir }/js/entry.js` ],
	js: [ `${ srcDir }/js/**/*.js` ],
	scssEntry: [ `${ srcDir }/scss/main.scss` ],
	scss: [ `${ srcDir }/scss/**/*.scss` ],
	fonts: [ `${ srcDir }/fonts/**/*` ],
	images: [ `${ srcDir }/images/**/*` ],
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
	fonts: [ `${ distDir }fonts/` ],
	images: [ `${ distDir }images/` ],
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