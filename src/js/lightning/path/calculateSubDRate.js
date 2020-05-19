/**
* @name calculateSubDRate
* @description Given a {length} distance of a path, a maximum allowed distance {targetLength} and a maximum subdivision level {subDRate} return a subdivision level for the distance length of the path.
* @param {number} length - the length of the path.
* @param {number} targetLength - the maximum (clamped) value a path can be.
* @param {number} subDRate - the maximum subdivion levels at the targetLength.
* @returns {number} the calculated subdivision levels for the path.
 */

function calculateSubDRate( length, targetLength, subDRate ) {
	let lDiv = targetLength / length;
	let lDivCalc = subDRate - Math.floor( lDiv );
	if ( lDivCalc <= 1 ) return 1;
	if ( lDiv > 2 ) return lDivCalc;
	return subDRate;
}

module.exports = calculateSubDRate;