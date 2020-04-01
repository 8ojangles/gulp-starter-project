let easing = require( '../../easing.js' ).easingEquations;

function updateSequence(){
	let t = this;
	let cClock = t.sequenceClock;

	// let cS = t.currSequence;
	// let tClock = cS.time;
	// for( let i = 0; i < cS.items.length; i++ ){
	// 	let s = cS.items[ i ];
	// 	t[ s.param ] = easing[ s.easefN ]( cClock, s.start, s.target, tClock );
	// }

	// if( cClock >= tClock ) {
	// 	if( cS.linkedSeq !== '' ) {
	// 		t.startSequence( { index: cS.linkedSeq } );
	// 	} else {
	// 		t.playSequence = false;
	// 	}
	// }
	// t.updateSequenceClock();
}

module.exports = updateSequence;