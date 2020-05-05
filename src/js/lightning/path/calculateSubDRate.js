function calculateSubDRate( length, targetLength, subDRate ) {
	let lDiv = targetLength / length;
	let lDivCalc = subDRate - Math.floor( lDiv );
	if ( lDivCalc <= 1 ) return 1;
	if ( lDiv > 2 ) return lDivCalc;
	return subDRate;
}

module.exports = calculateSubDRate;