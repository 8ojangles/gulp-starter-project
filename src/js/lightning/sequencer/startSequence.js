function startSequence( opts ) {
	// console.log( `startSequence` );
	let t = this;
	let seqIndex = opts.index || 0;
	// set current values to start sequence with
	let tempSeq = t.sequences[ seqIndex ];
	let seqArray = [];
	for( let i = 0; i < tempSeq.items.length; i++ ){
		let item = tempSeq.items[ i ];
		let currItemVal = t[ item.param ];
		seqArray.push(
			{ param: item.param, start: currItemVal, target: item.target - currItemVal, easefN: item.easefN }
		);
	}
	t.currSequence = {
		name: tempSeq.name,
		time: tempSeq.time,
		items: seqArray,
		linkedSeq: tempSeq.linkedSeq
	};
	t.sequenceClock = 0;
	t.playSequence = true;
}

module.exports = startSequence;