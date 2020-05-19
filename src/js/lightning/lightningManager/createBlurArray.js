let easing = require( '../../utils/easing.js' ).easingEquations;

/**
* @name createBlurArray
* @description Given a count, minimum and maximum blur distances, return an array of numbers intopolating from the minimum to maxaximum biased according to the specified ease function
* @param {number} blurCount - the number of required blurs.
* @param {number} minBlurDist - the minimum blur size distance.
* @param {number} maxBlurDist - the maxaximum blur size distance.
* @param {string} ease - Name of the easing function to intopolate between the minimum and maximum
* @returns {Array<number>} the calculated array of blur distances.
 */

function createBlurArray( blurCount, minBlurDist, maxBlurDist, ease ){
	let tmp = [];
	let easeFn = easing[ ease ];
	let changeDelta = maxBlurDist - minBlurDist;
	for( let i = 0; i < blurCount; i++ ) {
		tmp.push(
			Math.floor( easeFn( i, minBlurDist, changeDelta, blurCount ) )
		);
	}
	return tmp;
};

module.exports = createBlurArray;