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

// function drawPointArr(){

// 	c.globalCompositeOperation = 'lighter';
// 	let shadowOffset = -10000;
// 	let blurWidth = 100;
// 	let maxLineWidth = 200;

// 	for ( let j = 0; j <= iterations; j++ ) {
// 		let colorChange = easeFn( j, 150, 105, iterations );

// 		c.strokeStyle = 'white';

// 		if ( j === 0 ) {
// 			c.lineWidth = 1;
// 			blurWidth = 0;
// 		} else {
// 			blurWidth = 10 * j;
// 		}
// 		c.beginPath();
// 		for ( let i = 0; i <= segArr.length - 1; i++ ) {
// 			let p = segArr[ i ];
// 			if ( i === 0 ) {
// 				c.moveTo( p.x, p.y + ( j === 0 ? 0 : shadowOffset ) );
// 				continue;
// 			}
// 			c.lineTo( p.x, p.y + ( j === 0 ? 0 : shadowOffset ) );
// 		}
// 		c.shadowOffsetY = -shadowOffset;
// 		c.shadowBlur = easeFn( j, maxLineWidth, -maxLineWidth, iterations );
// 		c.shadowColor = `rgba( ${ colorChange }, ${ colorChange }, 255, 1 )`;
// 		c.stroke();

// 	}
// 	c.globalCompositeOperation = 'source-over';

// 	// c.fillStyle = 'white';
// 	// c.fillCircle( testVec.startX, testVec.startY, 7 );
// 	// c.fillCircle( testVec.endX, testVec.endY, 7 );
// 	// c.fillStyle = 'blue';
// 	// for ( let i = 0; i <= segArr.length - 1; i++ ) {
// 	// 	if ( i === segArr.length / 2 - 1 ) {
// 	// 		c.fillStyle = 'green';
// 	// 	}
// 	// 	c.fillCircle( segArr[ i ].x, segArr[ i ].y, 5 );
// 	// 	if ( i === segArr.length / 2 - 1 ) {
// 	// 		c.fillStyle = 'blue';
// 	// 	}
// 	// }
// }

ligntningMgr.createLightning( {
	canvasW: cW,
	canvasH: cH,
	startX: testVec.startX,
	startY: testVec.startY,
	endX: testVec.endX,
	endY: testVec.endY,
	subdivisions: mathUtils.randomInteger( 3, 6 )	
} );

$( '.js-run' ).click( function( event ){
	ligntningMgr.createLightning( {
		canvasW: cW,
		canvasH: cH,
		startX: testVec.startX,
		startY: testVec.startY,
		endX: testVec.endX,
		endY: testVec.endY,
		subdivisions: mathUtils.randomInteger( 3, 6 )	
	} );

} );

$( '.js-clear-mgr' ).click( function( event ){
	ligntningMgr.members.length = 0;
} );

$( '.js-clear-mgr-run' ).click( function( event ){
	ligntningMgr.members.length = 0;
	ligntningMgr.createLightning( {
		canvasW: cW,
		canvasH: cH,
		startX: testVec.startX,
		startY: testVec.startY,
		endX: testVec.endX,
		endY: testVec.endY,
		subdivisions: mathUtils.randomInteger( 3, 6 )	
	} );
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
