function startSequence( opts ) {
	// console.log( `startSequence` );
	let t = this;
	let seqIndex = opts.index || 0;
	// set current values to start sequence with
	let seq = t.sequences[ seqIndex ];
	for( let i = 0; i < seq.items.length; i++ ){
		let item = seq.items[ i ];
		let currItemVal = t[ item.param ];
		item.start = currItemVal;
		item.target -= currItemVal;
	}
	seq.active = true;
}

module.exports = startSequence;