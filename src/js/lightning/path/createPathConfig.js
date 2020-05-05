let mathUtils = require( '../../utils/mathUtils.js' );
let easing = require( '../../utils/easing.js' ).easingEquations;
let trig = require( '../../utils/trigonomicUtils.js' ).trigonomicUtils;

function checkPointIndex( i, len ) {
	return i === 0 ? 1 : i === len - 1 ? len - 2 : i;
}

function createPathConfig( thisPath, options ) {
	let thisPathCfg = thisPath;
	let p = thisPathCfg.path;
	let pLen = p.length;

	let opts = options;
	let pathIndex = opts.pathIndex;
	let pathAngleSpread = opts.pathAngleSpread || 0.2;
	let branchDepth = opts.branchDepth || 0;

	// setup some vars to play with
	let pIndex, p1, p2, p3, p4, theta, rOffset;
	// angle variation randomiser
	let v = ( 2 * Math.PI ) * pathAngleSpread;

	// if path is only start/end points
	if ( pLen === 2 ) {
		console.log( `pLen === 2` );
		p1 = p[ 0 ];
		p3 = p[ 1 ];
		p2 = trig.subdivide(p1.x, p1.y, p3.x, p3.y, 0.5);
		rOffset = thisPathCfg.renderOffset + 1;
	}
	if ( pLen > 2 ) {
		pIndex = checkPointIndex( mathUtils.randomInteger( 0, pLen - 1 ), pLen );
		p1 = p[ pIndex - 1 ];
		p2 = p[ pIndex ];
		p3 = p[ pIndex + 1 ];
		rOffset = thisPathCfg.renderOffset + pIndex;
	}

	theta = thisPathCfg.baseAngle + mathUtils.random( -v, v );
	let maxD = trig.dist( p2.x, p2.y, p[ pLen - 1].x, p[ pLen - 1 ].y);
	
	let dVar = mathUtils.random( 0, maxD );
	// console.log( 'randTheta: ', randTheta );
	let branchEndpoint = trig.radialDistribution( p2.x, p2.y, dVar, theta );

	return {
		branchDepth: branchDepth,
		renderOffset: rOffset,
		startX: p2.x,
		startY: p2.y,
		endX: branchEndpoint.x,
		endY: branchEndpoint.y,
		dRange: dVar
	};
}

module.exports = createPathConfig;