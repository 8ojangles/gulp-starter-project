function updateSequenceClock(){
	let t = this;
	if ( t.playSequence === true ) {
		// console.log( 't.currSequence.time: ', t.currSequence.time );
		if ( t.sequenceClock < t.currSequence.time ) {
			t.sequenceClock++;
			// console.log( 't.currSequence.time: ', t.currSequence.time );
			// console.log( 't.sequenceClock: ', t.sequenceClock );
		};
	}
}

module.exports = updateSequenceClock;