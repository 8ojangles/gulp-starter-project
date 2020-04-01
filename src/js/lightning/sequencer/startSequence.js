function startSequence( opts ) {
	// console.log( `startSequence` );
	let t = this;
	let seqIndex = opts.index || 0;
	// set current values to start sequence with
	let tempSeq = t.sequences[ seqIndex ];
	for( let i = 0; i < tempSeq.items.length; i++ ){
		let item = tempSeq.items[ i ];
		let currItemVal = t[ item.param ];
		let delta = item.target - currItemVal;
		tempSeq.start = currItemVal;
		tempSeq.target = delta;
	}
	t.currSequence = tempSeq;
	t.sequenceClock = 0;
	t.playSequence = true;
}

module.exports = startSequence;