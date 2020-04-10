function setupSequences( sequences ) {
	let sequenceLen = sequences.length;
	let seqArray = [];
	for( let i = 0; i < sequenceLen; i++) {
		let seq = sequences[ i ];
		let tmpSeq = {
			active: false,
			clock: 0,
			totalClock: seq.time,
			linkedSeq: seq.linkedSeq,
			name: seq.name,
			items: []
		};
		for( let i = 0; i < seq.items.length; i++ ){
			let item = seq.items[ i ];
			tmpSeq.items.push(
				{
					param: item.param,
					start: 0,
					target: item.target,
					easefN: item.easefN
				}
			);
		}
		seqArray.push( tmpSeq );
	}
	return seqArray;
}

module.exports = setupSequences; 