let mathUtils = require( '../../utils/mathUtils.js' );
let easing = require( '../../utils/easing.js' ).easingEquations;
let trig = require( '../../utils/trigonomicUtils.js' ).trigonomicUtils;

function updatePathColors() {
	let p = this;

	let sq = this.sequences[ this.sequenceIndex ];
	let t = sq.time;
	let cT = this.sequenceClock;
	
}

module.exports = updatePathColors;