require( './rafPolyfill.js');
require( './canvasApiAugmentation.js');

let checkCanvasSupport = require( './checkCanvasSupport.js' );

let trig = require( './trigonomicUtils.js' ).trigonomicUtils;
// aliases
let findNewP = trig.findNewPoint;
let calcD = trig.dist;
let calcA = trig.angle;

let mathUtils = require( './mathUtils.js' );
// aliases
let rnd = mathUtils.random;
let rndint = mathUtils.randonInteger;

let easing = require( './easing.js' ).easingEquations;


let counter = 0;

let canvas = document.querySelector( '#lightningDrawingTest' );
let cW = canvas.width = window.innerWidth;
let cH = canvas.height = window.innerHeight;
let c = canvas.getContext('2d');
c.lineCap = 'round';


let testVec = {
	startX: cW / 2,
	startY: 50,
	endX: cW / 2,
	endY: cH - 50
}

function drawLine() {
	c.strokeStyle = 'red';
	c.setLineDash( [5, 15] );
	c.line( testVec.startX, testVec.startY, testVec.endX, testVec.endY );
	c.setLineDash( [] );
}

let segArr = [];

segArr.push( {
	x: testVec.startX, y: testVec.startY
} );

segArr.push( {
	x: testVec.endX, y: testVec.endY
} );		

// calsulate normals
// https://stackoverflow.com/questions/1243614/how-do-i-calculate-the-normal-vector-of-a-line-segment
// if we define dx=x2-x1 and dy=y2-y1
// then the normals are (-dy, dx) and (dy, -dx).
function subdivide( x1, y1, x2, y2, dVar, tVar ) {
	let d = trig.dist( x1, y1, x2, y2 );
	let t = trig.angle( x1, y1, x2, y2 );
	let dx = x2 - x1;
	let dy = y2 - y1;
	let plotMidP = findNewP( x1, y1, t, d / 2 );
	let tmp = findNewP(
		plotMidP.x, plotMidP.y,
		t,
		rnd( -dVar, dVar ) 
	);
	return { x: tmp.x, y: tmp.y };
}

function plotPoints( arr, subdivisions ) {
	let dRange = 400;
	let tRange = 0.1;
	for ( let i = 0; i <= subdivisions - 1; i++ ) {
		let arrLen = arr.length;
		for ( let j = arrLen - 1; j > 0; j-- ) {
			console.log( 'j: ', j );
			if ( j === 0 ) {
				return;
			}
			let p = arr[ j ];
			console.log( 'p: ', p );
			let prevP = arr[ j - 1 ];
			console.log( 'prevP: ', prevP );
			let newPoint = subdivide( p.x, p.y, prevP.x, prevP.y, dRange, tRange )
			arr.splice( j, 0, { x: newPoint.x, y: newPoint.y } );
		}

		dRange = dRange * 0.5;
		tRange = tRange * 0.8;
	}
}

plotPoints( segArr, 1 );

function drawPointArr(){

	c.strokeStyle = 'grey';
	c.beginPath();
	for ( let i = 0; i <= segArr.length - 1; i++ ) {
		let p = segArr[ i ];
		if ( i === 0 ) {
			c.moveTo( p.x, p.y );
			continue;
		}
		c.lineTo( p.x, p.y );
	}
	c.stroke();


	c.fillStyle = 'white';
	c.fillCircle( testVec.startX, testVec.startY, 7 );
	c.fillCircle( testVec.endX, testVec.endY, 7 );
	c.fillStyle = 'blue';
	for ( let i = 0; i <= segArr.length - 1; i++ ) {
		if ( i === segArr.length / 2 - 1 ) {
			c.fillStyle = 'green';
		}
		c.fillCircle( segArr[ i ].x, segArr[ i ].y, 5 );
		if ( i === segArr.length / 2 - 1 ) {
			c.fillStyle = 'blue';
		}
	}
}


function drawTest() {
	drawPointArr();
	drawLine();
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
