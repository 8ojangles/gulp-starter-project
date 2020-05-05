let checkCanvasSupport = require( './checkCanvasSupport.js' );
require( './utils/rafPolyfill.js');
require( './utils/canvasApiAugmentation.js');

let easing = require( './utils/easing.js' ).easingEquations;
let easeFn = easing.easeOutSine;

let trig = require( './utils/trigonomicUtils.js' ).trigonomicUtils;
let pointOnPath = trig.getPointOnPath;
let calcD = trig.dist;
let calcA = trig.angle;

let mathUtils = require( './utils/mathUtils.js' );
let rnd = mathUtils.random;
let rndInt = mathUtils.randomInteger;

let ligntningMgr = require( './lightning/lightningManager/lightningUtilities.js');


// housekeeping
let canvas = document.querySelector( '#lightningDrawingTest' );
let cW = canvas.width = window.innerWidth;
let cH = canvas.height = window.innerHeight;
let c = canvas.getContext('2d');

ligntningMgr.setCanvasCfg( '#lightningDrawingTest' );

c.lineCap = 'round';
let counter = 0;

let showDebugInfo = false;

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
	subdivisions: mathUtils.randomInteger( 3, 6 ),
	speedModRate: 0.9,
	willConnect: true
}

function createTheme( event ) {
	return {
		canvasW: cW,
		canvasH: cH,
		startX: event.clientX,
		startY: event.clientY,
		endX: testVec.endX,
		endY: testVec.endY,
		subdivisions: mathUtils.randomInteger( 3, 6 )
	}
}


ligntningMgr.createLightning( baseTheme );

////////////////////////////////////////////////////////////////////////////////////////
// Button handlers
////////////////////////////////////////////////////////////////////////////////////////

$( '.js-run' ).click( function( event ){
	ligntningMgr.createLightning( baseTheme );
} );

$( '.js-clear-mgr' ).click( function( event ){
	ligntningMgr.clearMemberArray();
} );

$( '.js-clear-mgr-run' ).click( function( event ){
	ligntningMgr.clearMemberArray();
	ligntningMgr.createLightning( baseTheme );
} );

$( 'canvas' ).click( function( event ){
	ligntningMgr.createLightning( createTheme( event ) );
} );

$( '.js-button-toggle' ).click( function( event ) {
	let thisItem = $( this );
	if ( thisItem.hasClass( 'js-isActive') ) {
		thisItem.removeClass( 'js-isActive');
	} else {
		thisItem.addClass( 'js-isActive');
	}

	if ( typeof $( this ).attr( 'data-linked-toggle' ) !== "undefined" ) {
		$( this ).parent().find( '.'+$( this ).attr( 'data-linked-toggle' ) ).removeClass( 'js-isActive' );
	}

} );

$( '.js-show-debug-overlay' ).click( function( event ){
	if ( $( this ).hasClass( 'active' ) ) {
		$( this ).removeClass( 'active' );
		showDebugInfo = false;
	} else {
		$( this ).addClass( 'active' );
		showDebugInfo = true;
	}
} );

/////////////////////////////////////////////////////////////////////////////////////
// App start
////////////////////////////////////////////////////////////////////////////////////////

function drawTest() {
	ligntningMgr.update( c );
	drawLine( showDebugInfo );
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
