let easing = require( '../../easing.js' ).easingEquations;

function updateSequence(){
	let t = this;
	console.log( 'update this: ', this );
	let cS = t.sequences;
	let cSLen = t.sequences.length;

	for( let i = 0; i < cSLen; i++ ){
		let thisSeq = cS[ i ];
		if ( thisSeq.active === false ) {
			continue;
		}

		let thisSeqItems = thisSeq.items;
		let thisSeqItemLen = thisSeqItems.length;
		let seqClock = thisSeq.clock;
		let tClock = thisSeq.totalClock;

		for( let i = 0; i < thisSeqItemLen; i++ ){
			let s = thisSeqItems[ i ];
			t[ s.param ] = easing[ s.easefN ]( seqClock, s.start, s.target, tClock );
		}

		if( seqClock >= tClock ) {
			thisSeq.active = false;
			thisSeq.clock = 0;
			if( seqClock.linkedSeq !== '' ) {
				t.startSequence( { index: thisSeq.linkedSeq } );
				continue;
			}
		}
		thisSeq.clock++;
	}
}

module.exports = updateSequence;