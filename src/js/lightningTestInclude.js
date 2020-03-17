require( './rafPolyfill.js');
require( './canvasApiAugmentation.js');
let ligntningMgr = require( './lightningUtilities.js');

let checkCanvasSupport = require( './checkCanvasSupport.js' );
let easing = require( './easing.js' ).easingEquations;

let easeFn = easing.easeOutSine;

let trig = require( './trigonomicUtils.js' ).trigonomicUtils;
// aliases
let findNewP = trig.findNewPoint;
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

// test Vector path
let testVec = {
	startX: cW / 3,
	startY: 50,
	endX: cW / 1.2,
	endY: cH - 50
}

function drawLine() {
	c.strokeStyle = 'red';
	c.setLineDash( [5, 15] );
	c.line( testVec.startX, testVec.startY, testVec.endX, testVec.endY );
	c.setLineDash( [] );
}

let segArr = [];
let segArrNormals = [];

segArr.push( { x: testVec.startX, y: testVec.startY } );
segArr.push( { x: testVec.endX, y: testVec.endY } );		

segArrNormals.push(
	trig.computeNormals(
		testVec.startX, testVec.startY,
		testVec.endX, testVec.endY
	)
);

// function subdivide( x1, y1, x2, y2, bias ) {
// 	return pointOnPath( x1, y1, x2, y2, bias );
// }

function plotPoints( arr, subdivisions ) {
	let dRange = 200;
	let tRange = 0.5;
	for ( let i = 0; i <= subdivisions - 1; i++ ) {
		let arrLen = arr.length;
		for ( let j = arrLen - 1; j > 0; j-- ) {
			console.log( 'j: ', j );
			if ( j === 0 ) {
				return;
			}
			let p = arr[ j ];
			let prevP = arr[ j - 1 ];
			let newPoint = trig.subdivide( p.x, p.y, prevP.x, prevP.y, tRange );
			let rndRadians = rnd( -2, 2 ) * 180/Math.PI;


			let newPointOffset = trig.radialDistribution( newPoint.x, newPoint.y, rnd( -dRange , dRange), rndRadians )
			arr.splice( j, 0, { x: newPointOffset.x, y: newPointOffset.y } );
		}

		dRange = dRange * 0.5;
		// tRange = tRange * 0.8;
	}
}

plotPoints( segArr, 5 );

let iterations = rndInt( 10, 50 );

function drawPointArr(){

	c.globalCompositeOperation = 'lighter';
	let shadowOffset = -10000;
	let blurWidth = 100;
	let maxLineWidth = 200;

	for ( let j = 0; j <= iterations; j++ ) {
		let colorChange = easeFn( j, 150, 105, iterations );

		c.strokeStyle = 'white';

		if ( j === 0 ) {
			c.lineWidth = 1;
			blurWidth = 0;
		} else {
			blurWidth = 10 * j;
		}
		c.beginPath();
		for ( let i = 0; i <= segArr.length - 1; i++ ) {
			let p = segArr[ i ];
			if ( i === 0 ) {
				c.moveTo( p.x, p.y + ( j === 0 ? 0 : shadowOffset ) );
				continue;
			}
			c.lineTo( p.x, p.y + ( j === 0 ? 0 : shadowOffset ) );
		}
		c.shadowOffsetY = -shadowOffset;
		c.shadowBlur = easeFn( j, maxLineWidth, -maxLineWidth, iterations );
		c.shadowColor = `rgba( ${ colorChange }, ${ colorChange }, 255, 1 )`;
		c.stroke();

	}
	c.globalCompositeOperation = 'source-over';

	// c.fillStyle = 'white';
	// c.fillCircle( testVec.startX, testVec.startY, 7 );
	// c.fillCircle( testVec.endX, testVec.endY, 7 );
	// c.fillStyle = 'blue';
	// for ( let i = 0; i <= segArr.length - 1; i++ ) {
	// 	if ( i === segArr.length / 2 - 1 ) {
	// 		c.fillStyle = 'green';
	// 	}
	// 	c.fillCircle( segArr[ i ].x, segArr[ i ].y, 5 );
	// 	if ( i === segArr.length / 2 - 1 ) {
	// 		c.fillStyle = 'blue';
	// 	}
	// }
}

ligntningMgr.createLightning( {
	startX: testVec.startX,
	startY: testVec.startY,
	endX: testVec.endX,
	endY: testVec.endY,
	subdivisions: mathUtils.randomInteger( 5, 10 )	
} );

function drawTest() {
	ligntningMgr.drawPointArr( c );
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
