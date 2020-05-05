function updateSequenceClock(){
	let t = this;
	if ( t.playSequence === true ) {
		if ( t.sequenceClock < t.currSequence.time ) {
			t.sequenceClock++;
		};
	}
}

module.exports = updateSequenceClock;