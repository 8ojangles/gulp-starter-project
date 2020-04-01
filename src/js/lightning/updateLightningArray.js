// lets work out the logic

// if instance clock (iClock) < currClockSwitch
// - iClock++

// if instance clock (iClock) >= currClockSwitch
// - if status.renderPhase < renderPhaseMax
// - - status.renderPhase++
// - - currClockSwitch += sequence[ status.renderPhase ].time
// - if status.renderPhase >= renderPhaseMax
// - - clock = 0
// - - isActive = false

// update lightning instance logic

function updateLightningArray( lArray ) {
	let lArrayLen = lArray.length - 1;
	for( let i = 0; i < lArrayLen; i++ ) {
		let thisL = lArray[ i ];
		let thisClock = thisL.clock;
		let thisTotalClock = thisL.totalClock;

		if ( thisClock < thisTotalClock ) {
			thisClock++;
		} else {
			thisClock = 0;
			thisL.isActive = false;
		}
	}
};

module.exports = updateLightningArray;