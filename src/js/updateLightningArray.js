function updateLightningArray( lArray ) {
	let lArrayLen = lCollection.length - 1;
	for( let i = 0; i < lArrayLen; i++ ) {
		let thisL = lArray[ i ];
		let thisClock = thisL.clock;
		let thisTotalClock = thisL.totalClock;
		if ( thisClock < thisTotalClock ) {
			thisClock++;
		}
	}
};

module.exports = updateLightningArray;