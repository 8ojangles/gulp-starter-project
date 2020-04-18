require( './rafPolyfill.js');
require( './canvasApiAugmentation.js');
let ligntningMgr = require( './lightningUtilities.js');

let checkCanvasSupport = require( './checkCanvasSupport.js' );
let easing = require( './easing.js' ).easingEquations;

let easeFn = easing.easeOutSine;

let trig = require( './trigonomicUtils.js' ).trigonomicUtils;
// aliases
// let findNewP = trig.findNewPoint;
let pointOnPath = trig.getPointOnPath;
let calcD = trig.dist;
let calcA = trig.angle;

let mathUtils = require( './mathUtils.js' );
// aliases
let rnd = mathUtils.random;
let rndInt = mathUtils.randomInteger;

// hpusekeeping
let canvas = document.querySelector( '#lightningDrawingTest' );
let cW = canvas.width = window.innerWidth;
let cH = canvas.height = window.innerHeight;
let c = canvas.getContext('2d');
c.lineCap = 'round';
let counter = 0;

let showDebugInfo = false;

$( '.js-show-debug-overlay' ).click( function( event ){
	if ( $( this ).hasClass( 'active' ) ) {
		$( this ).removeClass( 'active' );
		showDebugInfo = false;
	} else {
		$( this ).addClass( 'active' );
		showDebugInfo = true;
	}
} );

// test Vector path
let testVec = {
	startX: cW / 2,
	startY: 50,
	endX: (cW / 2),
	endY: cH - 50
}

function drawLine( debug ) {
	if ( debug === true ) {
		c.strokeStyle = 'red';
		c.setLineDash( [5, 15] );
		c.line( testVec.startX, testVec.startY, testVec.endX, testVec.endY );
		c.setLineDash( [] );
	}
}

// let iterations = rndInt( 10, 50 );
let iterations = 1;

let baseTheme = {
	canvasW: cW,
	canvasH: cH,
	startX: testVec.startX,
	startY: testVec.startY,
	endX: testVec.endX,
	endY: testVec.endY,
	subdivisions: mathUtils.randomInteger( 3, 6 )
}

function createTheme( event ) {
	return {
		canvasW: cW,
		canvasH: cH,
		startX: testVec.startX,
		startY: testVec.startY,
		endX: event.clientX,
		endY: event.clientY,
		subdivisions: mathUtils.randomInteger( 3, 6 )
	}
}


ligntningMgr.createLightning( baseTheme );

$( '.js-run' ).click( function( event ){
	ligntningMgr.createLightning( baseTheme );
} );

$( '.js-clear-mgr' ).click( function( event ){
	ligntningMgr.members.length = 0;
} );

$( '.js-clear-mgr-run' ).click( function( event ){
	ligntningMgr.members.length = 0;
	ligntningMgr.createLightning( baseTheme );
} );

$( 'canvas' ).click( function( event ){
	ligntningMgr.createLightning( createTheme( event ) );
} );


function drawTest() {
	ligntningMgr.updateArr( c );
	drawLine( showDebugInfo );
	ligntningMgr.updateRenderCfg();
	// ligntningMgr.drawDebugRadialTest( c );
}

function clearScreen() {
	c.fillStyle = 'black';
	c.fillRect( 0, 0, cW, cH );
}

function rafLoop() {
	// flush screen buffer
	clearScreen();
	// Do whatever
	drawTest();
	//loop
	requestAnimationFrame( rafLoop );
}

function initialise() {
	// setup
		// do setup things here
	//looper
	rafLoop();
}

initialise();
