// node modules
let nodeModules = './node_modules';

let gulpDir = './gulp';

// vendor libraries
let vendorLibs = [
	`${nodeModules}/jquery/dist/jquery.min.js`,
	`src/js/utils/rafPolyfill.js`
];

let ks = {
	vendorJsLibs: [
		'./vendor/prism/**/*.js'
	],
	vendorCssLibs: [
		'./vendor/prism/**/*.css'
	],
	codeExamples: [
		'./srcKitchensink/codeExamples/*.html'
	]
}


// SOURCE directory top level
let srcDir = 'src';
let templateDir = `${ srcDir }/templates/`;
let ksDir = 'srcKitchensink';


// src files
let src = {
	html: [ './*.html' ],
	// templates: [ 
	// 	`${ templatDir }pages/*.njk`,
	// 	`${ templatDir }pages/*.html`,
	// 	`${ templatDir }layouts/*.njk`,
	// 	`${ templatDir }layouts/*.html`,
	// 	`${ templatDir }partials/*.njk`,
	// 	`${ templatDir }partials/*.html`,
	// 	`${ templatDir }components/*.njk`,
	// 	`${ templatDir }components/*.html`,
	// 	`${ templatDir }templateConfiguration/*.html`,
	// 	`${ templatDir }templateConfiguration/*.njk`
	// ],
	templates: [ 
		`${ templateDir }**/*.njk`,
		`${ templateDir }**/*.html`,
		`${ ksDir }**/*.njk`,
		`${ ksDir }**/*.html`
	],
	pages: [
		`${ templateDir }pages/*.njk`,
		`${ templateDir }pages/*.html`
	],
	jsBundleEntry: [ `${ srcDir }/js/entry.js` ],
	js: [ `${ srcDir }/js/**/*.js` ],
	scssEntry: [ `${ srcDir }/scss/main.scss` ],
	scss: [ `${ srcDir }/scss/**/*.scss` ],
	fonts: [ `${ srcDir }/fonts/**/*` ],
	images: [ `${ srcDir }/images/**/*` ],
	data: [ `${ srcDir }/data/**/*.json` ],
	tests: [ `./tests/**/*.js` ],
	ks: ks
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