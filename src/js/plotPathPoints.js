let mathUtils = require( './mathUtils.js' );
let easing = require( './easing.js' ).easingEquations;
let trig = require( './trigonomicUtils.js' ).trigonomicUtils;

// lightning path constructor

function plotPathPoints( options ) {
		
	let opts = options;
	let subD = opts.subdivisions;
	let temp = [];

	temp.push( { x: opts.startX, y: opts.startY } );
	temp.push( { x: opts.endX, y: opts.endY } );

	let tRange = opts.tRange || 0.35;
	let isChild = opts.isChild || true;
	let vChild = isChild ? 8 : 2;

	// set up some vars to play with
	let minD, maxD, calcD;

	for ( let i = 0; i <= subD - 1; i++ ) {
		let arrLen = temp.length;
		let damper = i === 0 ? 1 : i;
		for ( let j = arrLen - 1; j > 0; j-- ) {
			if ( j === 0 ) {
				return;
			}
			let p = temp[ j ];
			let prevP = temp[ j - 1 ];
			// set up some numbers for making the path
			// distance between the 2 points
			let vD = trig.dist( p.x, p.y, prevP.x, prevP.y ) / 2;
			// random positive/negative multiplier
			let vFlip =  mathUtils.randomInteger( 1, 10 ) <= 5 ? 1 : -1;
			// get the mid point beween the two points (p & prevP)
			let nP = trig.subdivide( prevP.x, prevP.y, p.x, p.y, 0.5 );

			// calculate some numbers for random distance
			if ( isChild === false ) {
				// minD = vD / ( i === 0 ? 2 : 2 + (i * 2) );
				// maxD = ( vD * 0.8 ) / 4;
				minD = easing.easeInQuint( i, vD / 2, -( vD / 2 ), subD );
				maxD = easing.easeInQuint( i, vD, -vD, subD );
			} else {
				minD = vD / 2;
				maxD = vD / vChild;
			}

			calcD = mathUtils.random( minD, maxD ) * vFlip;

			// using the 2 points (p & prevP), and the generated midpoint as a pseudo curve point
			let offsetPoint = trig.projectNormalAtDistance(
				// - project a new point at the normal of the path created by p/nP/prevP
				prevP, nP, p,
				// at a random point along the curve (between 0.25/0.75)
				mathUtils.random( 0.25, 0.75 ),
				// - - projected at a proportion of the distance (vD)
				// - - - calculated through the vChild variable (damped through a switch generated through the isChild flag) 
				calcD
			);
			// splice in the new point to the point array
			temp.splice( j, 0, { x: offsetPoint.x, y: offsetPoint.y } );
			// recurse the loop by the number given by "subD", to subdivinde and randomise the line
		}
	};
	return temp;
};

module.exports = plotPathPoints;