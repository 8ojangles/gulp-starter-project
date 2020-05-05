let easing = require( '../../utils/easing.js' ).easingEquations;

function updateSequence( opts ){
	let t = opts || this;
	// console.log( 'update this: ', this );
	let cS = t.sequences;
	let cSLen = t.sequences.length;

	for( let i = 0; i < cSLen; i++ ){
		let thisSeq = cS[ i ];
		if ( thisSeq.active === false ) {
			continue;
		}

		let { items, linkedSeq, clock, totalClock, final } = thisSeq;
		let itemLen = items.length;
		for( let i = 0; i < itemLen; i++ ){
			let s = items[ i ];
			t[ s.param ] = easing[ s.easefN ](
				clock, s.start, s.target, totalClock
			);
		}

		if( clock >= totalClock ) {
			thisSeq.active = false
			thisSeq.clock = 0;
			if( linkedSeq !== '' ) {
				t.startSequence( { index: linkedSeq } );
				continue;
			}
			if( !t.isChild && final ) {
				t.isActive = false;
			}

		}
		thisSeq.clock++;
	}
}

module.exports = updateSequence;