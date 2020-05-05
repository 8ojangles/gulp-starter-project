let trig = require( '../../utils/trigonomicUtils.js' ).trigonomicUtils;

function drawDebugRadialTest( c ) {
	let PI = Math.PI;
	PISQ = PI * 2;
	let cX = 150, cY = 150, cR = 100;
	let zeroRotPoint = trig.radialDistribution( cX, cY, cR, PISQ );
	let qRotPoint = trig.radialDistribution( cX, cY, cR, PISQ * 0.25 );
	let halfRotPoint = trig.radialDistribution( cX, cY, cR, PISQ * 0.5 );
	let threeQRotPoint = trig.radialDistribution( cX, cY, cR, PISQ * 0.75 );

	// start point
	let testP1Point = trig.radialDistribution( cX, cY, cR, PISQ * 0.125 );
	// end point
	let testP2Point = trig.radialDistribution( cX, cY, cR, PISQ * 0.625 );
	// curvePoint
	let testP3Point = trig.radialDistribution( cX, cY, cR, PISQ * 0.875 );
	let testNormalPoint = trig.projectNormalAtDistance(
		testP1Point, testP3Point, testP2Point, 0.5, cR * 1.1
	);
	// reference points render
	c.strokeStyle = '#880000';
	c.fillStyle = 'red';
	c.lineWidth = 2;
	c.strokeCircle( cX, cY, cR );
	c.fillCircle( cX, cY, 5 );
	c.fillCircle( zeroRotPoint.x, zeroRotPoint.y, 5 );
	c.fillCircle( qRotPoint.x, qRotPoint.y, 5 );
	c.fillCircle( halfRotPoint.x, halfRotPoint.y, 5 );
	c.fillCircle( threeQRotPoint.x, threeQRotPoint.y, 5 );

	// refence shape triangle points render
	c.fillStyle = '#0088ee';
	c.fillCircle( testP1Point.x, testP1Point.y, 5 );
	c.fillCircle( testP2Point.x, testP2Point.y, 5 );
	c.fillCircle( testP3Point.x, testP3Point.y, 5 );

	// refence shape edge render
	c.strokeStyle = '#002266';
	c.setLineDash( [3, 6] );
	c.line( testP1Point.x, testP1Point.y, testP2Point.x, testP2Point.y );
	c.line( testP1Point.x, testP1Point.y, testP3Point.x, testP3Point.y );
	c.line( testP2Point.x, testP2Point.y, testP3Point.x, testP3Point.y );

	// projected NORMAL reference point
	c.fillStyle = '#00aaff';
	c.fillCircle( testNormalPoint.x, testNormalPoint.y, 5 );

	// normal line render
	// inner
	c.setLineDash( [3, 6] );
	c.strokeStyle = '#005500';
	c.line( cX, cY, testP3Point.x, testP3Point.y );
	// outer
	c.strokeStyle = '#00ff00';
	c.line( testP3Point.x, testP3Point.y, testNormalPoint.x, testNormalPoint.y );
	c.setLineDash([]);

	// calculate normal angle back from test shape for testing
	let testAngle = trig.getAngleOfNormal( testP1Point, testP3Point, testP2Point,0.5);
	// project nomal point from calculation
	let testAnglePoint = trig.radialDistribution(
		cX, cY + 200, 100,
		Math.atan2(testNormalPoint.y - cY, testNormalPoint.x - cX)
		);

	// draw line for test reference
	c.strokeStyle = '#000099';
	c.fillStyle = '#0066dd';
	c.strokeCircle( cX, cY + 200, 75 );
	c.line( cX, cY + 200, testAnglePoint.x, testAnglePoint.y );
	c.fillCircle( cX, cY + 200, 5 );
	c.fillCircle( testAnglePoint.x, testAnglePoint.y, 5 );
}

module.exports = drawDebugRadialTest;